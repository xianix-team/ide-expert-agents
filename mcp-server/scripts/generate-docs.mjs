// Regenerates the agent and runbook tables in the READMEs, and the skill list that
// team-planner-and-trainer is served with, from catalog.json and runbook frontmatter.
// Only the text between generated-region markers is rewritten; everything else in
// each file stays hand-written.
//
//   <store>/README.md   "## Available Agents" table   <- catalog.json stores.<store>.agents
//                                                        + autonomy / human-judgement from agent frontmatter
//   README.md           "## Agent stores" table       <- catalog.json stores (count from disk)
//   README.md           "## Runbooks" table           <- runbooks/*.md frontmatter
//   runbooks/README.md  "## Available runbooks" table <- runbooks/*.md frontmatter
//   delivery-agents-store/team-planner-and-trainer/skill-catalog.md
//                       "## Skills by store" list     <- all of the above
//
// A README without markers yet gets them wrapped around the first table under
// its heading on the first run.
//
// Usage: node scripts/generate-docs.mjs           write the READMEs (`npm run docs`)
//        node scripts/generate-docs.mjs --check   exit 1 if any file is out of date
// Set MCP_AGENTS_ROOT to run against a different checkout.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = process.env.MCP_AGENTS_ROOT || path.resolve(__dirname, "../..");
const check = process.argv.includes("--check");

const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf-8"));
const cell = text => String(text ?? "").replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|").trim();
const table = (header, rows) =>
  [`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map(r => `| ${r.join(" | ")} |`)].join("\n");

const countAgents = store =>
  glob.sync("*/", { cwd: path.join(root, store) }).filter(d =>
    ["agent.md", "SKILL.md"].some(f => fs.existsSync(path.join(root, store, d, f)))
  ).length;

const runbooks = glob
  .sync("runbooks/*.md", { cwd: root })
  .filter(f => path.basename(f) !== "README.md")
  .sort()
  .map(f => ({ file: path.basename(f), ...matter(fs.readFileSync(path.join(root, f), "utf-8")).data }));

const runbookTable = linkPrefix =>
  table(
    ["Runbook", "Prompt name", "Coordinates", "When to use"],
    runbooks.map(r => [
      `[**${cell(r.title)}**](${linkPrefix}${r.file})`,
      `\`${r.name}\``,
      (r.agents ?? []).map(a => `\`${a}\``).join(", "),
      cell(r.description),
    ])
  );

// Replace the generated region `id` in `md`; add markers around the first table
// under `heading` if the region doesn't exist yet.
function render(md, id, heading, body, file) {
  const start = `<!-- generated:${id}:start — edit catalog.json or runbooks/*.md, then run \`npm run docs\` in mcp-server/ -->`;
  const end = `<!-- generated:${id}:end -->`;
  const block = `${start}\n${body}\n${end}`;

  const re = new RegExp(`<!-- generated:${id}:start[^\\n]*-->[\\s\\S]*?<!-- generated:${id}:end -->`);
  if (re.test(md)) return md.replace(re, () => block);

  const lines = md.split("\n");
  let i = lines.findIndex(l => l.trim() === heading);
  if (i < 0) throw new Error(`${file}: no '${heading}' heading to put the ${id} table under`);
  let j = i + 1;
  while (j < lines.length && !lines[j].trim().startsWith("|") && !lines[j].startsWith("#")) j++;
  if (j < lines.length && lines[j].trim().startsWith("|")) {
    let k = j;
    while (k < lines.length && lines[k].trim().startsWith("|")) k++;
    lines.splice(j, k - j, block);
  } else {
    lines.splice(i + 1, 0, "", block);
  }
  return lines.join("\n");
}

const outputs = new Map(); // file -> new content
const update = (rel, fn) => {
  const file = path.join(root, rel);
  const before = outputs.get(rel) ?? fs.readFileSync(file, "utf-8");
  outputs.set(rel, fn(before));
};

// Autonomy / human-judgement levels live in each agent's own frontmatter.
const agentFrontmatter = (store, name) => {
  const file = ["agent.md", "SKILL.md"].map(f => path.join(root, store, name, f)).find(f => fs.existsSync(f));
  return file ? matter(fs.readFileSync(file, "utf-8")).data : {};
};
const level = v => (typeof v === "string" && v ? v[0].toUpperCase() + v.slice(1).toLowerCase() : "—");

for (const [store, { agents }] of Object.entries(catalog.stores)) {
  const body = table(
    ["Agent", "Prompt name", "Autonomy", "Human judgement", "When to use"],
    Object.entries(agents).map(([name, a]) => {
      const fm = agentFrontmatter(store, name);
      return [
        `**${cell(a.title)}**`,
        `\`${name}\``,
        level(fm.autonomy),
        level(fm["human-judgement"]),
        cell(a.whenToUse),
      ];
    })
  );
  update(`${store}/README.md`, md => render(md, "agents", "## Available Agents", body, `${store}/README.md`));
}

const storesBody = table(
  ["Store", "Agents", "Description"],
  Object.entries(catalog.stores).map(([store, s]) => [
    `[${store}](${store}/README.md)`,
    String(countAgents(store)),
    cell(s.description),
  ])
);
update("README.md", md => render(md, "stores", "## Agent stores", storesBody, "README.md"));
update("README.md", md => render(md, "runbooks", "## Runbooks", runbookTable("runbooks/"), "README.md"));
if (fs.existsSync(path.join(root, "runbooks/README.md"))) {
  update("runbooks/README.md", md => render(md, "runbooks", "## Available runbooks", runbookTable(""), "runbooks/README.md"));
}

// The trainer recommends other skills, so it is served with the full list. It is
// part of a prompt, so one compact line per skill instead of a table. The trainer
// leaves itself out.
const TRAINER = "team-planner-and-trainer";
const trainerCatalog = `delivery-agents-store/${TRAINER}/skill-catalog.md`;
if (fs.existsSync(path.join(root, trainerCatalog))) {
  const oneLine = text => String(text ?? "").replace(/\s*\n\s*/g, " ").trim();
  const sections = Object.entries(catalog.stores).map(([store, { agents }]) => {
    const lines = Object.entries(agents)
      .filter(([name]) => name !== TRAINER)
      .map(([name, a]) => {
        const fm = agentFrontmatter(store, name);
        return `- \`${name}\` (A: ${level(fm.autonomy)}, HJ: ${level(fm["human-judgement"])}) — ${oneLine(a.whenToUse)}`;
      });
    return `### ${store.replace(/-agents-store$/, "")}\n\n${lines.join("\n")}`;
  });
  const runbookLines = runbooks.map(r => `- \`${r.name}\` — ${oneLine(r.description)}`);
  sections.push(`### runbooks (MCP only)\n\n${runbookLines.join("\n")}`);
  update(trainerCatalog, md => render(md, "skills", "## Skills by store", sections.join("\n\n"), trainerCatalog));
}

const stale = [];
for (const [rel, content] of outputs) {
  const current = fs.readFileSync(path.join(root, rel), "utf-8");
  if (current === content) continue;
  stale.push(rel);
  if (!check) fs.writeFileSync(path.join(root, rel), content);
}

if (check) {
  for (const rel of stale) console.error(`error    ${rel} is out of date — run \`npm run docs\` in mcp-server/`);
  console.log(`\nDocs check: ${outputs.size} file(s) checked, ${stale.length} out of date.`);
  process.exit(stale.length > 0 ? 1 : 0);
}
console.log(stale.length ? `Updated ${stale.join(", ")}` : "All generated docs already up to date.");
