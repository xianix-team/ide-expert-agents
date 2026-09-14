#!/usr/bin/env node
// Layer 1 guardrail: deterministic, non-LLM checks over every *-agents-store/
// folder. Complements the agent-quality-review skill (which judges prompt
// *quality*) by catching schema/shape/doc-sync regressions a human reviewer
// or a lazy re-read could miss. Run via `npm run lint:agents` in mcp-server/,
// or from CI on any PR touching *-agents-store/**.

import { glob } from "glob";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

const ENTRY_FILENAMES = ["agent.md", "SKILL.md"];

// Tool names actually used across this repo's agents today, plus a small set
// of other well-known Claude Code / MCP-host tool names. Extend this list
// when an agent legitimately needs a tool not yet declared anywhere else —
// it exists to catch typos (e.g. "Fetch" instead of "WebFetch"), not to
// gatekeep which tools an agent may use.
const CORE_TOOLS = new Set([
  "Read", "Write", "Edit", "Bash", "Grep", "Glob",
  "WebSearch", "WebFetch", "NotebookEdit", "TodoWrite",
  "Task", "Agent", "ExitPlanMode", "AskUserQuestion",
]);

const errors = [];
function fail(scope, message) {
  errors.push({ scope, message });
}

function readSection(markdown, heading) {
  const re = new RegExp(`## ${heading}\\s*\\n([\\s\\S]*?)(\\n##\\s|\\n---\\s|$)`);
  const m = markdown.match(re);
  return m ? m[1] : "";
}

const storeDirs = glob
  .sync("*-agents-store/", { cwd: repoRoot })
  .map(d => d.replace(/\/$/, ""))
  .sort();

const agentsByStore = new Map();
const allNames = new Map(); // name -> [scope, ...]

for (const store of storeDirs) {
  const agentFolders = glob
    .sync("*/", { cwd: path.join(repoRoot, store) })
    .map(d => d.replace(/\/$/, ""))
    .sort();

  const agents = [];

  for (const folder of agentFolders) {
    const dir = path.join(repoRoot, store, folder);
    const scope = `${store}/${folder}`;

    const entryCandidates = ENTRY_FILENAMES.filter(f => fs.existsSync(path.join(dir, f)));

    if (entryCandidates.length === 0) {
      fail(scope, "no agent.md or SKILL.md entry file — this folder is invisible to the MCP server");
      continue;
    }
    if (entryCandidates.length > 1) {
      fail(
        scope,
        `both agent.md and SKILL.md present — the server only serves the first match (${ENTRY_FILENAMES[0]}); the other is silently ignored`
      );
    }

    const entryFile = path.join(dir, entryCandidates[0]);
    const raw = fs.readFileSync(entryFile, "utf-8");

    let data;
    try {
      ({ data } = matter(raw));
    } catch (e) {
      fail(scope, `frontmatter failed to parse as YAML: ${e.message}`);
      continue;
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";

    if (!name) fail(scope, "missing or empty `name` in frontmatter");
    if (!description) fail(scope, "missing or empty `description` in frontmatter");
    if (name && name !== folder) {
      fail(scope, `frontmatter \`name: ${name}\` does not match folder name \`${folder}\` — the served prompt name will not match where it lives`);
    }

    if (data.tools !== undefined) {
      if (!Array.isArray(data.tools)) {
        fail(scope, "`tools` must be a YAML list of strings");
      } else {
        for (const t of data.tools) {
          const ok = typeof t === "string" && (CORE_TOOLS.has(t) || t.startsWith("mcp__"));
          if (!ok) {
            fail(scope, `unrecognized tool \`${t}\` in \`tools\` — not a known core tool and not an \`mcp__*\` namespaced tool (check for a typo, or add it to CORE_TOOLS in lint-agents.mjs if it's legitimately new)`);
          }
        }
      }
    }

    if (name) {
      if (!allNames.has(name)) allNames.set(name, []);
      allNames.get(name).push(scope);
    }

    agents.push({ folder, name, description });
  }

  agentsByStore.set(store, agents);
}

// Duplicate names would make MCP prompt registration ambiguous.
for (const [name, scopes] of allNames) {
  if (scopes.length > 1) {
    fail("repo", `agent name \`${name}\` is declared by multiple folders (${scopes.join(", ")}) — only one can be served under that prompt name`);
  }
}

// Every store's own README "Available Agents" table must exactly match its
// folders' served names — required by the root CLAUDE.md doc-sync rule.
for (const store of storeDirs) {
  const readmePath = path.join(repoRoot, store, "README.md");
  const scope = `${store}/README.md`;

  if (!fs.existsSync(readmePath)) {
    fail(scope, "store has no README.md");
    continue;
  }

  const readme = fs.readFileSync(readmePath, "utf-8");
  const tableSection = readSection(readme, "Available Agents");
  const documented = new Set([...tableSection.matchAll(/`([a-z0-9][a-z0-9-]*)`/g)].map(m => m[1]));
  const actual = new Set((agentsByStore.get(store) || []).map(a => a.name).filter(Boolean));

  for (const name of actual) {
    if (!documented.has(name)) {
      fail(scope, `agent \`${name}\` is missing from the Available Agents table`);
    }
  }
  for (const name of documented) {
    if (!actual.has(name)) {
      fail(scope, `Available Agents table documents \`${name}\`, but no agent folder serves that name`);
    }
  }
}

// The root README's "Agent stores" table must match actual per-store counts.
const rootReadmePath = path.join(repoRoot, "README.md");
const rootReadme = fs.readFileSync(rootReadmePath, "utf-8");
const rootTableSection = readSection(rootReadme, "Agent stores");

const rootRows = new Map();
for (const m of rootTableSection.matchAll(/\[([a-z0-9-]+-agents-store)\]\([^)]*\)\s*\|\s*(\d+)\s*\|/g)) {
  rootRows.set(m[1], parseInt(m[2], 10));
}

for (const store of storeDirs) {
  const actualCount = (agentsByStore.get(store) || []).length;

  if (!rootRows.has(store)) {
    fail("README.md", `store \`${store}\` has no row in the Agent stores table`);
    continue;
  }

  const statedCount = rootRows.get(store);
  if (statedCount !== actualCount) {
    fail("README.md", `Agent stores table says \`${store}\` has ${statedCount} agent(s), but it actually has ${actualCount}`);
  }
}

for (const store of rootRows.keys()) {
  if (!storeDirs.includes(store)) {
    fail("README.md", `Agent stores table references \`${store}\`, which doesn't exist`);
  }
}

// Report
if (errors.length === 0) {
  console.log(`lint-agents: OK — checked ${storeDirs.length} store(s), ${[...allNames.keys()].length} agent(s)`);
  process.exit(0);
}

console.error(`lint-agents: ${errors.length} issue(s) found\n`);
for (const e of errors) {
  console.error(`  [${e.scope}] ${e.message}`);
}
process.exit(1);
