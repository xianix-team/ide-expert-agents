// Starts the built stdio server (dist/index.js) and checks, over real MCP:
//   - ListPrompts returns exactly the agents and runbooks that have a name + description on disk
//   - GetPrompt returns non-empty text for every one of them
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, "..");
const root = process.env.MCP_AGENTS_ROOT || path.resolve(serverDir, "..");
const entry = path.join(serverDir, "dist", "index.js");

if (!fs.existsSync(entry)) {
  console.error(`${entry} not found; run \`npm run build\` first.`);
  process.exit(1);
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

const client = new Client({ name: "smoke-test", version: "0.0.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [entry], env }));

const failures = [];
try {
  const { prompts } = await client.listPrompts();
  const served = new Set(prompts.map(p => p.name));

  for (const n of expected) if (!served.has(n)) failures.push(`'${n}' is on disk but not served by ListPrompts`);
  for (const n of served) if (!expected.has(n)) failures.push(`'${n}' is served but not found on disk`);
  if (served.size !== prompts.length) failures.push("ListPrompts returned the same name more than once");

  for (const { name } of prompts) {
    const result = await client.getPrompt({ name });
    const text = result.messages?.[0]?.content?.text ?? "";
    if (!text.trim()) failures.push(`GetPrompt '${name}' returned no text`);
  }

  for (const f of failures) console.error(`error    ${f}`);
  console.log(
    `\nSmoke test: ${prompts.length} prompts served, ${expected.size} expected, ${failures.length} failure(s).`
  );
} finally {
  await client.close();
}
process.exit(failures.length > 0 ? 1 : 0);
