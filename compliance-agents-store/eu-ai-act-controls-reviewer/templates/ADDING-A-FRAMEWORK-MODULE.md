# Adding a framework / obligation module

The `eu-ai-act-controls-reviewer` agent assesses a repo against **framework modules**.
Each module is a single Markdown file named `controls-NN-<id>.md` in the agent folder. The
agent auto-discovers every module and decides which to apply from each module's **Applies
when** line — so adding a new EU AI Act obligation area (or a different regime) needs **no
change to `agent.md`**.

## How discovery works

- The MCP server concatenates every `*.md` file in the agent folder (except `agent.md` and
  `README.md`) into the agent prompt, in **alphabetical order**.
- Files in this `templates/` subfolder are **not** concatenated (discovery is
  non-recursive), so this guide and the template never reach the prompt.
- Each module starts with `## Framework module: <name>` and a metadata block
  (`Module ID`, `Applies when`, `Primary regime`, `Controls`).

## Steps

1. **Copy the template.** `cp templates/controls-TEMPLATE.md controls-A0-<your-id>.md`
   (pick the next free `NN` prefix — `00` is risk classification and must stay first).
2. **Fill the header.** Set `Module ID`, a clear **Applies when** trigger, and the regime.
3. **Write the controls.** One row each: `# | Requirement | EU AI Act | Applies from |
   ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check`. Set **Applies from**
   from `enforcement-timeline.md` (the agent turns it into an urgency band). Follow the notes.
4. **(Optional) List it** in `../README.md`.
5. **Rebuild** the MCP server (`npm run build` in `mcp-server/`) and restart.

## Conventions

- **Numeric prefix** orders modules; keep `00` (risk classification) first.
- Reuse the **Automation** vocabulary (Automatable / Partial / Manual) and the severity
  scale so the agent's scoring rules apply unchanged.
- Keep the EU AI Act article references precise, and map each requirement to ISO/IEC 42001
  Annex A (A.2–A.10) and a NIST AI RMF function.
- **Adding a different regime** (e.g. a national AI law, a sector rule): keep the same
  column shape so the mapping and scoring stay consistent; rename the "EU AI Act" column in
  that module if the primary regime differs, and still map to ISO 42001 + NIST for continuity.
- Verify regulatory content against a current primary source before shipping — timelines and
  article scope change (e.g. the 2026 Digital Omnibus adjustments).
