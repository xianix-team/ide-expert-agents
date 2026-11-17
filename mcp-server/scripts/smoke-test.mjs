// Starts the built servers — stdio (dist/index.js) and HTTP (dist/http.js) —
// and checks each over real MCP:
//   - ListPrompts returns exactly the agents and runbooks that have a name + description on disk
//   - GetPrompt returns non-empty text for every one of them
//   - ListTools offers list_agents and get_agent; list_agents names every agent,
//     and get_agent returns the same text as GetPrompt (and an error for an unknown name)
// HTTP only: a request with an unknown session id gets 404, so clients re-initialize
// after a server restart instead of getting stuck with an empty list.
//
// AI Hub telemetry is forced off, so running this on a machine with an AI Hub
// .env never sends usage events.
//
// Usage: npm run build && node scripts/smoke-test.mjs   (or `npm run smoke`)

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import matter from "gray-matter";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { spawn } from "child_process";
import net from "net";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "..");
const root = process.env.MCP_AGENTS_ROOT || path.resolve(serverDir, "..");
const stdioEntry = path.join(serverDir, "dist", "index.js");
const httpEntry = path.join(serverDir, "dist", "http.js");

for (const entry of [stdioEntry, httpEntry]) {
  if (!fs.existsSync(entry)) {
    console.error(`${entry} not found; run \`npm run build\` first.`);
    process.exit(1);
  }
}

// What the server should serve, read independently of its own loader.
const expected = new Set();
for (const dir of glob.sync("*-agents-store/*/", { cwd: root })) {
  const file = ["agent.md", "SKILL.md"].map(f => path.join(root, dir, f)).find(f => fs.existsSync(f));
  if (!file) continue;
  const { data } = matter(fs.readFileSync(file, "utf-8"));
  if (typeof data.name === "string" && data.name.trim() && String(data.description ?? "").trim()) {
    expected.add(data.name.trim());
  }
}
for (const file of glob.sync("runbooks/*.md", { cwd: root })) {
  if (path.basename(file) === "README.md") continue;
  const { data } = matter(fs.readFileSync(path.join(root, file), "utf-8"));
  if (typeof data.name === "string" && data.name.trim() && String(data.description ?? "").trim()) {
    expected.add(data.name.trim());
  }
}

const env = {
  PATH: process.env.PATH ?? "",
  MCP_AGENTS_ROOT: root,
  IDE_AGENTS_AI_HUB_ENABLED: "false",
};

const failures = [];

async function check(label, client) {
  const fail = msg => failures.push(`[${label}] ${msg}`);

  const { prompts } = await client.listPrompts();
  const served = new Set(prompts.map(p => p.name));
  for (const n of expected) if (!served.has(n)) fail(`'${n}' is on disk but not served by ListPrompts`);
  for (const n of served) if (!expected.has(n)) fail(`'${n}' is served but not found on disk`);
  if (served.size !== prompts.length) fail("ListPrompts returned the same name more than once");

  const { tools } = await client.listTools();
  const toolNames = tools.map(t => t.name).sort().join(",");
  if (toolNames !== "get_agent,list_agents") fail(`ListTools returned [${toolNames}], expected [get_agent,list_agents]`);

  const listed = (await client.callTool({ name: "list_agents", arguments: {} })).content?.[0]?.text ?? "";
  for (const n of expected) if (!listed.includes(`**${n}**`)) fail(`list_agents does not name '${n}'`);

  for (const { name } of prompts) {
    const promptText = (await client.getPrompt({ name })).messages?.[0]?.content?.text ?? "";
    if (!promptText.trim()) fail(`GetPrompt '${name}' returned no text`);
    const tool = await client.callTool({ name: "get_agent", arguments: { name } });
    if (tool.isError || tool.content?.[0]?.text !== promptText) fail(`get_agent '${name}' does not match GetPrompt`);
  }

  const missing = await client.callTool({ name: "get_agent", arguments: { name: "no-such-agent" } });
  if (!missing.isError) fail("get_agent with an unknown name did not return an error");

  return prompts.length;
}

// ── stdio ───────────────────────────────────────────────────────────────────
const stdioClient = new Client({ name: "smoke-test", version: "0.0.0" });
await stdioClient.connect(new StdioClientTransport({ command: process.execPath, args: [stdioEntry], env }));
let stdioCount = 0;
try {
  stdioCount = await check("stdio", stdioClient);
} finally {
  await stdioClient.close();
}

// ── HTTP ────────────────────────────────────────────────────────────────────
const port = await new Promise(resolve => {
  const s = net.createServer().listen(0, "127.0.0.1", () => {
    const { port } = s.address();
    s.close(() => resolve(port));
  });
});
const httpServer = spawn(process.execPath, [httpEntry], { env: { ...env, PORT: String(port) }, stdio: ["ignore", "ignore", "pipe"] });
let httpCount = 0;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("HTTP server did not start within 10s")), 10000);
    httpServer.stderr.on("data", d => { if (String(d).includes("listening")) { clearTimeout(timer); resolve(); } });
    httpServer.on("exit", code => { clearTimeout(timer); reject(new Error(`HTTP server exited with code ${code}`)); });
  });
  const url = new URL(`http://127.0.0.1:${port}/mcp`);

  const httpClient = new Client({ name: "smoke-test", version: "0.0.0" });
  await httpClient.connect(new StreamableHTTPClientTransport(url));
  try {
    httpCount = await check("http", httpClient);
  } finally {
    await httpClient.close();
  }

  const stale = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-session-id": "stale-session" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "prompts/list" }),
  });
  if (stale.status !== 404) failures.push(`[http] unknown session id returned ${stale.status}, expected 404`);
} catch (e) {
  failures.push(`[http] ${e.message}`);
} finally {
  httpServer.removeAllListeners("exit");
  httpServer.kill();
}

for (const f of failures) console.error(`error    ${f}`);
console.log(
  `\nSmoke test: ${stdioCount} prompts over stdio, ${httpCount} over HTTP, ${expected.size} expected; ` +
    `tools checked on both; ${failures.length} failure(s).`
);
process.exit(failures.length > 0 ? 1 : 0);
