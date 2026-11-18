# Adding or changing a framework module

The `ai-excellence-audit` agent assesses a repo against **framework modules**. Each module is
one Markdown file named `controls-NN-<id>.md` in the agent folder, and it mirrors one pillar of
the 99x AI Engineering Excellence Framework. The agent auto-discovers every module, so adding
a practice or a pillar needs **no change to `agent.md`**.

## How discovery works

- The MCP server concatenates every `*.md` file in the agent folder (except `agent.md` and
  `README.md`) into the agent prompt, in **alphabetical order**: `agent.md`, then
  `controls-*.md`, then `framework-reference.md`.
- Files in this `templates/` subfolder are **not** concatenated (discovery is non-recursive),
  so this guide and the template never reach the prompt. `README.md` is also excluded.
- Each module starts with `## Framework module: <name>` and a metadata block
  (`Module ID`, `Pillar group`, `Applies when`, `Intent`, `Controls`).

## Keeping the modules in sync with the framework

The modules are derived from the framework's practice list. When the framework changes:

1. **New or changed practice** - add or edit its row in the matching module. Keep the practice
   name identical to the framework's so a diff against the framework is easy.
2. **New pillar** - copy `controls-TEMPLATE.md` to `controls-NN-<id>.md` (pick the next free
   `NN`), and add the pillar to the module order in `agent.md` (A2) and the report summary.
3. **Version bump** - update the framework version and date in `agent.md` (header and report
   template) and in `framework-reference.md`. The report stamps this version.
4. **Counts** - update the `Controls:` line of the module, and the totals in `../README.md`
   if they changed (the pillar and practice counts quoted in the agent description and docs).
5. **Docs** - if the agent's description or "when to use" changed, update `catalog.json` and run
   `npm run docs` then `npm run check` in `mcp-server/`.

## Writing a good control row

- **Practice** - the framework's practice name in bold, then its description in one sentence.
- **Level** - `Baseline` or `Advanced`, exactly as the framework labels it.
- **ISO/IEC 42001 and other refs** - Annex A control IDs the framework uses for the pillar
  (for example `A.9.4`), plus OWASP, NIST SSDF or GDPR references where the framework cites them.
- **Severity** - impact if missing: `Critical` / `High` / `Medium` / `Low`. Reserve `Critical`
  for controls whose failure leaks customer data or removes the human from the loop.
- **Automation** - be honest about what a repository can show:
  - `Automatable` - decidable from repo artifacts (files, config, CI, history).
  - `Partial` - a mechanism is visible, but behaviour, live settings or organisational context are not.
  - `Manual` - organisational or procedural; list it for a human, never score it.
- **How to check** - name the files to inspect and what `Pass`, `Partial` and `Fail` look like.
  For checks that could surface secrets or personal data, say "never print the value".
- Never use a raw `|` inside a cell (write "/" or reword); it breaks the table.

## Conventions

- Keep content generic. No customer names, internal URLs, credentials or proprietary specifics
  (see the Customer IP notice in `CONTRIBUTING.md`).
- Keep the severity and Automation vocabulary unchanged so the scoring rules in `agent.md` apply.
- Rebuild and check: `npm run check` in `mcp-server/`.
