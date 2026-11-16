// Validates every agent under *-agents-store/ and the README tables that list them.
//
// Errors (exit 1) are problems that break an agent or leave the docs wrong:
//   - an agent folder with no agent.md / SKILL.md, or with both
//   - missing `name` or `description` frontmatter (the MCP server silently skips these)
//   - a `name` that is not lowercase-with-hyphens (install-skills.sh skips these)
//   - a `name` that differs from its folder name
//   - the same `name` used by two agents (only one would be served)
//   - a store README whose "Available Agents" table doesn't match the agents on disk
//   - a root README "Agent stores" row that is missing, extra, or has the wrong count
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

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

// Rows of the first markdown table after `heading`. Header and separator rows are dropped.
function tableRows(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  let i = lines.findIndex(l => l.trim().toLowerCase() === heading.toLowerCase());
  if (i < 0) return undefined;
  while (i < lines.length && !lines[i].trim().startsWith("|")) i++;
  if (i >= lines.length) return undefined;

  const rows = [];
  for (; i < lines.length && lines[i].trim().startsWith("|"); i++) {
    rows.push(lines[i].trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim()));
  }
  // rows[0] is the header, rows[1] the |---| separator
  return rows.slice(2);
}

const stores = glob.sync("*-agents-store", { cwd: root }).sort();
if (stores.length === 0) {
  console.error(`No *-agents-store/ folders found under ${root}`);
  process.exit(1);
}

const seenNames = new Map(); // name -> relative agent dir
const storeAgents = new Map(); // store -> [names]

for (const store of stores) {
  const names = [];
  storeAgents.set(store, names);

  const agentDirs = glob.sync("*/", { cwd: path.join(root, store) }).sort();
  for (const dir of agentDirs) {
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
    let data;
    try {
      ({ data } = matter(fs.readFileSync(path.join(root, entryRel), "utf-8")));
    } catch (e) {
      err(entryRel, `frontmatter does not parse: ${e.message}`);
      continue;
    }

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description = String(data.description ?? "").trim();

    if (!name) err(entryRel, "missing `name` in frontmatter (the MCP server skips this agent)");
    if (!description) err(entryRel, "missing `description` in frontmatter (the MCP server skips this agent)");
    if (!name) continue;

    if (!KEBAB.test(name)) err(entryRel, `name '${name}' is not lowercase-with-hyphens`);
    if (name !== folder) err(entryRel, `name '${name}' differs from folder name '${folder}'`);

    if (seenNames.has(name)) {
      err(entryRel, `name '${name}' is already used by ${seenNames.get(name)}; only one would be served`);
    } else {
      seenNames.set(name, rel);
    }
    names.push(name);
  }
}

// Store READMEs: the "Available Agents" table must list exactly the agents on disk.
for (const [store, names] of storeAgents) {
  const readmeRel = `${store}/README.md`;
  const readmePath = path.join(root, readmeRel);
  if (!fs.existsSync(readmePath)) {
    err(store, "missing README.md");
    continue;
  }
  const rows = tableRows(fs.readFileSync(readmePath, "utf-8"), "## Available Agents");
  if (!rows) {
    err(readmeRel, "no '## Available Agents' table found");
    continue;
  }

  const listed = rows.map(cells => (cells[1] ?? "").replace(/`/g, "").trim()).filter(Boolean);
  const onDisk = new Set(names);
  const inTable = new Set(listed);

  for (const n of names) if (!inTable.has(n)) err(readmeRel, `agent '${n}' is not in the Available Agents table`);
  for (const n of listed) if (!onDisk.has(n)) err(readmeRel, `table lists '${n}', but no agent in ${store}/ has that name`);
  if (listed.length !== inTable.size) err(readmeRel, "Available Agents table lists the same prompt name more than once");
}

// Root README: the "Agent stores" table must have one row per store with the right count.
const rootRows = tableRows(fs.readFileSync(path.join(root, "README.md"), "utf-8"), "## Agent stores");
if (!rootRows) {
  err("README.md", "no '## Agent stores' table found");
} else {
  const counts = new Map();
  for (const cells of rootRows) {
    const store = (cells[0] ?? "").match(/\[([^\]]+)\]/)?.[1];
    if (store) counts.set(store, (cells[1] ?? "").trim());
  }
  for (const [store, names] of storeAgents) {
    if (!counts.has(store)) {
      err("README.md", `Agent stores table has no row for ${store}`);
    } else if (counts.get(store) !== String(names.length)) {
      err("README.md", `Agent stores table says ${store} has ${counts.get(store)} agents; it has ${names.length}`);
    }
  }
  for (const store of counts.keys()) {
    if (!storeAgents.has(store)) err("README.md", `Agent stores table lists ${store}, which does not exist`);
  }
}

const total = [...storeAgents.values()].reduce((n, a) => n + a.length, 0);
for (const w of warnings) console.warn(`warning  ${w}`);
for (const e of errors) console.error(`error    ${e}`);
console.log(
  `\nChecked ${total} agents in ${stores.length} stores: ${errors.length} error(s), ${warnings.length} warning(s).`
);
process.exit(errors.length > 0 ? 1 : 0);
