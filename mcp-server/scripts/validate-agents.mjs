// Validates every agent under *-agents-store/, every runbook under runbooks/,
// and catalog.json. README tables are generated from catalog.json, so they are
// checked separately by `generate-docs.mjs --check`.
//
// Errors (exit 1):
//   Agents
//   - an agent folder with no agent.md / SKILL.md, or with both
//   - missing `name` or `description` frontmatter (the MCP server silently skips these)
//   - a `name` that is not lowercase-with-hyphens (install-skills.sh skips these)
//   - a `name` that differs from its folder name
//   - missing or invalid `autonomy` / `human-judgement` frontmatter (each must be low | medium | high)
//   - a leftover `<!-- GUIDE: … -->` comment from templates/AGENT_TEMPLATE.md
//   Runbooks
//   - missing `name`, `title`, `description`, or `agents` frontmatter
//   - an `agents` entry that is not a real agent, or that the body never mentions
//   Both
//   - the same `name` used twice across agents and runbooks (only one would be served)
//   catalog.json
//   - a store or agent on disk that is missing from catalog.json, or the reverse
//   - a store without a `description`, or an agent without `title` / `whenToUse`
//
// Usage: node scripts/validate-agents.mjs   (from mcp-server/, or via `npm run validate`)
// Set MCP_AGENTS_ROOT to validate a different checkout.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.MCP_AGENTS_ROOT || path.resolve(__dirname, "../..");

const ENTRY_FILENAMES = ["agent.md", "SKILL.md"];
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LEVELS = ["low", "medium", "high"];
const RANK_FIELDS = ["autonomy", "human-judgement"];

const errors = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);

function readFrontmatter(rel) {
  try {
    return matter(fs.readFileSync(path.join(root, rel), "utf-8"));
  } catch (e) {
    err(rel, `frontmatter does not parse: ${e.message}`);
    return undefined;
  }
}

const stores = glob.sync("*-agents-store", { cwd: root }).sort();
if (stores.length === 0) {
  console.error(`No *-agents-store/ folders found under ${root}`);
  process.exit(1);
}

const seenNames = new Map(); // name -> where it is defined
const claim = (name, where) => {
  if (seenNames.has(name)) {
    err(where, `name '${name}' is already used by ${seenNames.get(name)}; only one would be served`);
  } else {
    seenNames.set(name, where);
  }
};

// ── Agents ──────────────────────────────────────────────────────────────────
const storeAgents = new Map(); // store -> [names]
for (const store of stores) {
  const names = [];
  storeAgents.set(store, names);

  for (const dir of glob.sync("*/", { cwd: path.join(root, store) }).sort()) {
    const folder = dir.replace(/\/$/, "");
    const rel = `${store}/${folder}`;
    const entries = ENTRY_FILENAMES.filter(f => fs.existsSync(path.join(root, rel, f)));

    if (entries.length === 0) {
      err(rel, `no ${ENTRY_FILENAMES.join(" or ")} found`);
      continue;
    }
    if (entries.length > 1) {
      err(rel, `has both ${entries.join(" and ")}; the server reads only ${entries[0]}, so keep one`);
    }

    const entryRel = `${rel}/${entries[0]}`;
    const parsed = readFrontmatter(entryRel);
    if (!parsed) continue;
    const { data } = parsed;

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description = String(data.description ?? "").trim();

    if (!name) err(entryRel, "missing `name` in frontmatter (the MCP server skips this agent)");
    if (!description) err(entryRel, "missing `description` in frontmatter (the MCP server skips this agent)");
    if (!name) continue;

    if (!KEBAB.test(name)) err(entryRel, `name '${name}' is not lowercase-with-hyphens`);
    if (name !== folder) err(entryRel, `name '${name}' differs from folder name '${folder}'`);
    for (const field of RANK_FIELDS) {
      if (!LEVELS.includes(data[field])) {
        err(entryRel, `\`${field}\` must be one of ${LEVELS.join(" | ")} (got ${JSON.stringify(data[field] ?? null)}); see "Autonomy and human judgement" in CONTRIBUTING.md`);
      }
    }
    claim(name, rel);

    // Leftover guidance from templates/AGENT_TEMPLATE.md would be served as part of the prompt.
    for (const md of glob.sync("*.md", { cwd: path.join(root, rel) })) {
      if (fs.readFileSync(path.join(root, rel, md), "utf-8").includes("<!-- GUIDE:")) {
        err(`${rel}/${md}`, "still contains a <!-- GUIDE: … --> comment from the agent template; delete it");
      }
    }
    names.push(name);
  }
}
const allAgents = new Set([...storeAgents.values()].flat());

// ── Runbooks ────────────────────────────────────────────────────────────────
const runbookFiles = glob.sync("runbooks/*.md", { cwd: root }).filter(f => path.basename(f) !== "README.md").sort();
for (const rel of runbookFiles) {
  const parsed = readFrontmatter(rel);
  if (!parsed) continue;
  const { data, content } = parsed;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  for (const field of ["name", "title", "description"]) {
    if (!String(data[field] ?? "").trim()) err(rel, `missing \`${field}\` in frontmatter`);
  }
  if (name) {
    if (!KEBAB.test(name)) err(rel, `name '${name}' is not lowercase-with-hyphens`);
    if (`${name}.md` !== path.basename(rel)) err(rel, `name '${name}' differs from file name '${path.basename(rel)}'`);
    claim(name, rel);
  }

  if (!Array.isArray(data.agents) || data.agents.length === 0) {
    err(rel, "`agents` must list the agents this runbook coordinates");
    continue;
  }
  for (const agent of data.agents) {
    if (!allAgents.has(agent)) err(rel, `agents lists '${agent}', which is not an agent in any store`);
    else if (!content.includes(`\`${agent}\``)) err(rel, `agents lists '${agent}', but the body never mentions \`${agent}\``);
  }
}

// ── catalog.json ────────────────────────────────────────────────────────────
let catalog;
try {
  catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf-8"));
} catch (e) {
  err("catalog.json", `cannot be read: ${e.message}`);
}
if (catalog) {
  const cStores = catalog.stores ?? {};
  for (const store of stores) if (!cStores[store]) err("catalog.json", `missing store ${store}`);
  for (const [store, entry] of Object.entries(cStores)) {
    if (!storeAgents.has(store)) {
      err("catalog.json", `lists store ${store}, which does not exist`);
      continue;
    }
    if (!String(entry.description ?? "").trim()) err("catalog.json", `${store} has no description`);

    const cAgents = entry.agents ?? {};
    const onDisk = new Set(storeAgents.get(store));
    for (const n of onDisk) if (!cAgents[n]) err("catalog.json", `${store} is missing agent '${n}'`);
    for (const [n, a] of Object.entries(cAgents)) {
      if (!onDisk.has(n)) err("catalog.json", `${store} lists '${n}', but no agent in ${store}/ has that name`);
      if (!String(a.title ?? "").trim()) err("catalog.json", `${store}.${n} has no title`);
      if (!String(a.whenToUse ?? "").trim()) err("catalog.json", `${store}.${n} has no whenToUse`);
    }
  }
}

for (const e of errors) console.error(`error    ${e}`);
console.log(
  `\nChecked ${allAgents.size} agents in ${stores.length} stores and ${runbookFiles.length} runbook(s): ${errors.length} error(s).`
);
process.exit(errors.length > 0 ? 1 : 0);
