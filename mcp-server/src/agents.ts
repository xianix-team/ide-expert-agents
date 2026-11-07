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
//    (see scripts/postbuild.mjs), making `npx @99x/ide-expert-agents-mcp` self-contained
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

export interface AgentResource {
  /** MCP resource URI, e.g. agent://ipa/references/workflow.md */
  uri: string;
  /** Short display name (relative path within the agent folder) */
  name: string;
  description: string;
  mimeType: string;
  absPath: string;
}

export interface Agent {
  name: string;
  description: string;
  /** Lean prompt body: entry file + optional always_include — no eager sibling concat */
  content: string;
  dir: string;
  entryFile: string;
  resources: AgentResource[];
}

const ENTRY_FILENAMES = ["agent.md", "SKILL.md"];

function parseAlwaysInclude(data: Record<string, unknown>): string[] {
  const raw = data.always_include;
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

function listReferenceFiles(agentDir: string): string[] {
  const refsDir = path.join(agentDir, "references");
  if (!fs.existsSync(refsDir) || !fs.statSync(refsDir).isDirectory()) {
    return [];
  }
  return glob
    .sync("**/*", { cwd: refsDir, nodir: true, dot: false })
    .filter(f => !f.endsWith(".DS_Store"))
    .sort()
    .map(f => path.join(refsDir, f));
}

function listTopLevelSupportingMarkdown(
  agentDir: string,
  entryBasename: string,
  alwaysInclude: Set<string>
): string[] {
  return fs
    .readdirSync(agentDir)
    .filter(
      f =>
        f.endsWith(".md") &&
        f !== entryBasename &&
        f !== "README.md" &&
        !alwaysInclude.has(f)
    )
    .sort()
    .map(f => path.join(agentDir, f));
}

function mimeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".md") return "text/markdown";
  if (ext === ".json") return "application/json";
  if (ext === ".yaml" || ext === ".yml") return "text/yaml";
  if (ext === ".sh") return "text/x-shellscript";
  if (ext === ".ts" || ext === ".js" || ext === ".mjs") return "text/plain";
  return "text/plain";
}

function toResource(agentName: string, agentDir: string, absPath: string): AgentResource {
  const rel = path.relative(agentDir, absPath).split(path.sep).join("/");
  return {
    uri: `agent://${agentName}/${rel}`,
    name: rel,
    description: `Reference for ${agentName}: ${rel}`,
    mimeType: mimeFor(absPath),
    absPath,
  };
}

function resourceIndexMarkdown(resources: AgentResource[]): string {
  if (resources.length === 0) return "";
  const lines = [
    "",
    "---",
    "",
    "## Available references (fetch on demand)",
    "",
    "Do not assume these files are on the user's disk. Fetch them as MCP Resources when the task needs them:",
    "",
  ];
  for (const r of resources) {
    lines.push(`- \`${r.uri}\` — ${r.name}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function loadAgents(): Agent[] {
  const root = getAgentsRoot();
  const agents: Agent[] = [];

  const storeDirs = glob.sync("*-agents-store/*/", { cwd: root });

  for (const relDir of storeDirs) {
    const agentDir = path.join(root, relDir);

    const entryFile = ENTRY_FILENAMES.map(f => path.join(agentDir, f)).find(f =>
      fs.existsSync(f)
    );

    if (!entryFile) continue;

    const raw = fs.readFileSync(entryFile, "utf-8");
    const { data, content } = matter(raw);

    const name: string = data.name;
    const description: string =
      typeof data.description === "string"
        ? data.description.trim()
        : String(data.description ?? "").trim();

    if (!name || !description) continue;

    const alwaysInclude = parseAlwaysInclude(data as Record<string, unknown>);
    const alwaysIncludeSet = new Set(alwaysInclude);

    let fullContent = content.trim();
    for (const rel of alwaysInclude) {
      const abs = path.join(agentDir, rel);
      if (!fs.existsSync(abs)) {
        console.warn(
          `[ide-expert-agents] always_include missing for ${name}: ${rel}`
        );
        continue;
      }
      fullContent += `\n\n---\n\n${fs.readFileSync(abs, "utf-8").trim()}`;
    }

    const resourcePaths = [
      ...listReferenceFiles(agentDir),
      ...listTopLevelSupportingMarkdown(
        agentDir,
        path.basename(entryFile),
        alwaysIncludeSet
      ),
    ];

    // Deduplicate by abs path
    const seen = new Set<string>();
    const resources: AgentResource[] = [];
    for (const abs of resourcePaths) {
      if (seen.has(abs)) continue;
      seen.add(abs);
      resources.push(toResource(name, agentDir, abs));
    }

    fullContent += resourceIndexMarkdown(resources);

    agents.push({
      name,
      description,
      content: fullContent,
      dir: agentDir,
      entryFile,
      resources,
    });
  }

  return agents;
}

export function listAllResources(agents: Agent[]): AgentResource[] {
  return agents.flatMap(a => a.resources);
}

export function findResource(
  agents: Agent[],
  uri: string
): AgentResource | undefined {
  return listAllResources(agents).find(r => r.uri === uri);
}

export function readResourceText(resource: AgentResource): string {
  return fs.readFileSync(resource.absPath, "utf-8");
}
