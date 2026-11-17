## Framework module: <Obligation Area>

- **Module ID:** <kebab-case-id>
- **Applies when:** <the signal that makes this module applicable: kind of personal data, system trait, third-party flow, or controller/processor role. The agent keys on this line>
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** <n> (<a> Automatable, <p> Partial, <m> Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | <Requirement: what good looks like> | <Art n> | <Upper (83(5)) / Lower (83(4))> | <Controller / Processor / Both> | <n.n.n> | <CAT-P> | <Critical/High/Medium/Low> | <Automatable/Partial/Manual> | <For Automatable/Partial: artifact to inspect. For Manual: why a human is needed> |

<!--
Authoring notes (keep as an HTML comment or delete):

- Automation:
  - Automatable: decidable from repo artifacts (code, config, prompts, IaC, CI, tests).
  - Partial: the mechanism can be inspected, but behaviour, legal basis, or organisational
    context cannot.
  - Manual: organisational, procedural, or legal; not verifiable from the repo.
- Severity drives weighting: Critical×3, High×2, Medium×1.5, Low×1.
- Fine tier: take it from the Art 83 table in `gdpr-reference.md`. If the row spans tiers, name
  the higher tier and the article that drives it. The agent combines the tier with the gap
  and live status to get the exposure band.
- Role: the agent marks a row N/A when it doesn't match the system's controller/processor role.
- Keep GDPR article references precise. Map to ISO/IEC 27701:2019 clause numbers
  (6.x security extensions, 7.x controller, 8.x processor) and a NIST Privacy Framework
  category (e.g. ID.IM-P, GV.PO-P, CT.DM-P, CM.AW-P, PR.DS-P).
- To add a *different* privacy regime (e.g. UK GDPR, a national law, a sector rule), keep the same
  columns, put that regime's clause in the "GDPR" column position (or rename the column in
  the module), and still map to ISO/IEC 27701 and the NIST PF for continuity.
- Never use a raw "|" inside a cell; write "/" instead.
-->
