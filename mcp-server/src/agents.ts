import { glob } from "glob";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolution order:
// 1. MCP_AGENTS_ROOT — explicit override (team clone, Docker image root, custom agent set).
// 2. A real repo checkout two directories above dist/ (local clone / Option A / Option C).
// 3. dist/agents-bundle/ — a copy of every *-agents-store/ baked in at publish time
//    (see scripts/postbuild.mjs), making `npx @99x-ai-dlc/ide-expert-agents-mcp` self-contained
//    with no local clone required (Option B).
export function getAgentsRoot(): string {
  if (process.env.MCP_AGENTS_ROOT) return process.env.MCP_AGENTS_ROOT;

  const repoRoot = path.resolve(__dirname, "../..");
  if (glob.sync("*-agents-store", { cwd: repoRoot }).length > 0) {
    return repoRoot;
  }

  const bundledRoot = path.resolve(__dirname, "agents-bundle");
  if (fs.existsSync(bundledRoot)) {
    return bundledRoot;
  }

  return repoRoot;
}

export interface Agent {
  name: string;
  description: string;
  content: string;
}

const ENTRY_FILENAMES = ["agent.md", "SKILL.md"];

export function loadAgents(): Agent[] {
  const root = getAgentsRoot();
  const agents: Agent[] = [];

  const storeDirs = glob.sync("*-agents-store/*/", { cwd: root });

  for (const relDir of storeDirs) {
    const agentDir = path.join(root, relDir);

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
      fullContent += `\n\n---\n\n${fs.readFileSync(sf, "utf-8").trim()}`;
    }

    agents.push({ name, description, content: fullContent });
  }

  return agents;
}
