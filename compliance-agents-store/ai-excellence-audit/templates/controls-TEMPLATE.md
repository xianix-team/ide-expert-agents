## Framework module: <Pillar name>

- **Module ID:** <kebab-case-id>
- **Pillar group:** <Govern / Protect / Build / Verify / Foundation>
- **Applies when:** Always.
- **Intent:** <the framework's tagline and one-line summary for this pillar>
- **Controls:** <n> (<a> Automatable, <p> Partial, <m> Manual); <b> Baseline, <v> Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **<Practice name>** - <the framework's one-sentence description> | <Baseline/Advanced> | <A.n.n · other refs> | <Critical/High/Medium/Low> | <Automatable/Partial/Manual> | <For Automatable/Partial: files to inspect and what Pass / Partial / Fail look like. For Manual: why a human is needed> |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **<Risk>** (<high/med/low>) - <consequence>

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- <Question from the framework's self-check list>

<!--
Authoring notes (keep as an HTML comment or delete):

- Automation:
  - Automatable - decidable from repo artifacts (code/config/CI/history).
  - Partial     - mechanism is inspectable but live settings / behaviour / organisational context are not.
  - Manual      - organisational / procedural; not verifiable from the repo.
- Severity weights: Critical x3, High x2, Medium x1.5, Low x1.
- Never use a raw "|" in a cell; write "/" instead.
- Any check that could surface a secret or personal data must say: never print the value.
-->
