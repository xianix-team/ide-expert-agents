import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { glob } from "glob";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

// Entry-point filenames, in precedence order (first match wins per folder)
const ENTRY_FILENAMES = ["agent.md", "SKILL.md"];

interface Agent {
  name: string;
  description: string;
  content: string;
}

function loadAgents(): Agent[] {
  const agents: Agent[] = [];

  const storeDirs = glob.sync("*-agents-store/*/", { cwd: REPO_ROOT });

  for (const relDir of storeDirs) {
    const agentDir = path.join(REPO_ROOT, relDir);

    // Pick the first recognised entry filename that exists
    const entryFile = ENTRY_FILENAMES
      .map(f => path.join(agentDir, f))
      .find(f => fs.existsSync(f));

    if (!entryFile) continue;

    const raw = fs.readFileSync(entryFile, "utf-8");
    const { data, content } = matter(raw);

    const name: string = data.name;
    const description: string =
      typeof data.description === "string"
        ? data.description.trim()
        : String(data.description ?? "").trim();

    if (!name || !description) continue;

    // Concatenate supporting markdown files so the full context travels with the prompt
    const supportingFiles = fs
      .readdirSync(agentDir)
      .filter(
        f =>
          f.endsWith(".md") &&
          f !== path.basename(entryFile) &&
          f !== "README.md"
      )
      .sort()
      .map(f => path.join(agentDir, f));

    let fullContent = content.trim();
    for (const sf of supportingFiles) {
      const sfContent = fs.readFileSync(sf, "utf-8");
      fullContent += `\n\n---\n\n${sfContent.trim()}`;
    }

    agents.push({ name, description, content: fullContent });
  }

  return agents;
}

const agents = loadAgents();

const server = new Server(
  { name: "ide-expert-agents", version: "1.0.0" },
  { capabilities: { prompts: {} } }
);

server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: agents.map(({ name, description }) => ({ name, description })),
}));

server.setRequestHandler(GetPromptRequestSchema, async request => {
  const agent = agents.find(a => a.name === request.params.name);
  if (!agent) {
    throw new Error(`Agent '${request.params.name}' not found`);
  }
  return {
    description: agent.description,
    messages: [
      {
        role: "user" as const,
        content: { type: "text" as const, text: agent.content },
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
