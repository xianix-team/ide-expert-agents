# Adding a framework / obligation module

The `gdpr-controls-reviewer` agent assesses a repo against **framework modules**. Each module is
a single Markdown file named `controls-NN-<id>.md` in the agent folder. The agent finds every
module automatically and decides which to apply from each module's **Applies when** line. Adding
a new GDPR obligation area, or a different privacy regime, needs **no change to `agent.md`**.

## How discovery works

- The MCP server concatenates every `*.md` file in the agent folder (except `agent.md` and
  `README.md`) into the agent prompt, in **alphabetical order**. That puts the `controls-*`
  modules first, followed by `gdpr-reference.md`.
- Files in this `templates/` subfolder are **not** concatenated (discovery is not recursive), so
  this guide and the template never reach the prompt.
- Each module starts with `## Framework module: <name>` and a metadata block
  (`Module ID`, `Applies when`, `Primary regime`, `Controls`).

## Steps

1. **Copy the template.** `cp templates/controls-TEMPLATE.md controls-A0-<your-id>.md`
   (pick the next free `NN` prefix; `00` is scope and roles and must stay first).
2. **Fill in the header.** Set `Module ID`, a clear **Applies when** trigger, and the regime.
3. **Write the controls.** One row each: `# | Requirement | GDPR | Fine tier | Role |
   ISO/IEC 27701 | NIST PF | Severity | Automation | How to check`. Take the **Fine tier** from
   `gdpr-reference.md`. Follow the template notes.
4. **Keep the `Controls:` count accurate.** It must match the rows and their Automation values.
5. **Update the READMEs** if the agent's scope or "when to use" changes (see the repo's
   `CLAUDE.md`).
6. **Rebuild** the MCP server (`npm run build` in `mcp-server/`) and restart it.

## Conventions

- The **numeric prefix** sets module order. Keep `00` (scope and roles) first.
- Reuse the **Automation** vocabulary (Automatable / Partial / Manual), the severity scale, and
  the fine-tier labels, so the agent's scoring and exposure rules apply unchanged.
- Keep GDPR article references precise. Map each requirement to ISO/IEC 27701 (2019 numbering)
  and a NIST Privacy Framework category.
- **Adding a different regime** (e.g. UK GDPR, a national data-protection law, a sector rule):
  keep the same column shape so the mapping and scoring stay consistent. Rename the "GDPR"
  column in that module, and still map to ISO/IEC 27701 and the NIST PF.
- Check regulatory content against a current primary source (the GDPR text, EDPB guidelines,
  national DPA guidance) before shipping.
