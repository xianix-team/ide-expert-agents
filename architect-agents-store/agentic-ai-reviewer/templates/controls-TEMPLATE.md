## Checklist: <Type Name>

- **Module ID:** <kebab-case-id>
- **Applies when:** <one sentence describing the codebase signal that makes this type applicable — the agent uses this to decide whether to include the module>
- **Applies in addition to:** Generic Baseline
- **Controls:** <n> (<a> Automatable, <p> Partial, <m> Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | <Dimension> | <Control question — what good looks like> | <Critical/High/Medium/Low> | <Automatable/Partial/Manual> | <For Automatable/Partial: what artifact to inspect. For Manual: why a human is needed> |
| 2 | ... | ... | ... | ... | ... |

<!--
Authoring notes (delete before shipping, or keep as an HTML comment — it will not affect the agent):

- Automation values:
  - Automatable — decidable from repo artifacts (code/config/prompts/IaC/CI/tests).
  - Partial     — mechanism is inspectable but behaviour needs a runtime signal, a
                  labelled dataset, or human judgment. State that in "How to check".
  - Manual      — organisational / process / live-runtime; not verifiable from the repo.
- Severity drives weighting: Critical×3, High×2, Medium×1.5, Low×1.
- Keep control questions outcome-focused ("X is done"), not implementation-prescriptive.
- Never use a raw "|" inside a cell; write "/" instead (it breaks the Markdown table).
-->
