## Framework module: <Obligation Area>

- **Module ID:** <kebab-case-id>
- **Applies when:** <the signal that makes this module applicable — risk tier, system trait, or provider role. The agent keys on this line>
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** <n> (<a> Automatable, <p> Partial, <m> Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | <Requirement — what good looks like> | <Art n> | <date, e.g. 2 Aug 2026, or "In force (…)"> | <A.n> | <FUNCTION n> | <Critical/High/Medium/Low> | <Automatable/Partial/Manual> | <For Automatable/Partial: artifact to inspect. For Manual: why a human is needed> |

<!--
Authoring notes (keep as an HTML comment or delete):

- Automation:
  - Automatable — decidable from repo artifacts (code/config/prompts/IaC/CI/tests).
  - Partial     — mechanism is inspectable but behaviour/organisational/legal context is not.
  - Manual      — organisational / procedural / legal; not verifiable from the repo.
- Severity drives weighting: Critical×3, High×2, Medium×1.5, Low×1.
- **Applies from** = the date the obligation becomes enforceable ("In force (date)" if already so).
  Use the canonical dates in `enforcement-timeline.md`; the agent turns this into an urgency band.
- Keep the EU AI Act article precise; map to ISO/IEC 42001 Annex A (A.2–A.10) and a NIST AI
  RMF function (GOVERN / MAP / MEASURE / MANAGE), with a category/subcategory where confident.
- To add a *different* regime (e.g. a national AI law), keep the same columns and put that
  regime's clause in the "EU AI Act" column position, or rename the column in the module.
- Never use a raw "|" inside a cell; write "/" instead.
-->
