# Adding a new agent-type control set

The `agentic-ai-reviewer` agent assesses a codebase against **control modules**. Each
module is a single Markdown file named `controls-NN-<id>.md` in the agent folder. The
agent auto-discovers every module and decides which to apply from each module's
**Applies when** line — so introducing a new agent type (beyond RAG, Conversational,
Autopilots, etc.) needs **no change to `agent.md`**.

## How discovery works

- The MCP server concatenates every `*.md` file in the agent folder (except `agent.md`
  and `README.md`) into the agent prompt, in **alphabetical order**.
- Files in this `templates/` subfolder are **not** concatenated (discovery is
  non-recursive), so this guide and the template never reach the prompt.
- Each module begins with `## Checklist: <name>` and a metadata block
  (`Module ID`, `Applies when`, `Applies in addition to`, `Controls`).

## Steps to add a type

1. **Copy the template.** `cp templates/controls-TEMPLATE.md controls-70-<your-id>.md`
   (pick the next free `NN` prefix to control ordering — `00` is Generic Baseline).
2. **Fill the header.** Set `Module ID`, a clear **Applies when** trigger (this is what
   the agent keys on), and `Applies in addition to: Generic Baseline`.
3. **Write the controls.** One row each: `# | Dimension | Control | Severity |
   Automation | How to check`. Follow the authoring notes in the template.
4. **(Optional) List it** in `../README.md` if you want it visible in the store index.
5. **Rebuild** the MCP server (`npm run build` in `mcp-server/`) and restart. The new
   module is now part of the review automatically.

## Conventions

- **Numeric prefix** orders modules in the prompt: `00` core first, then `10, 20, …`.
- **Module ID** is kebab-case and unique.
- Keep **Generic Baseline** as the always-on core; every type module is additive.
- Reuse the same **Automation** vocabulary (Automatable / Partial / Manual) so the
  agent's assessment and scoring rules apply unchanged.
- Source of truth for the current modules is
  `Agentic_AI_Review_Checklists.xlsx`; regenerate modules from it if the sheet changes.
