## Framework module: Rules

- **Module ID:** rules
- **Pillar group:** Govern
- **Applies when:** Always.
- **Intent:** Tell agents how this codebase works - in the repository, under review, like any other code. Version-controlled agent instruction files.
- **Controls:** 9 (4 Automatable, 5 Partial, 0 Manual); 6 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Rules file in every active repository** - Each repository has an AGENTS.md at the root (tool-specific files may import or point to it to avoid duplication). | Baseline | A.6.2.3 · 7.5 | High | Automatable | Check for `AGENTS.md` at the root. `Pass`: present (tool-specific files may import it). `Partial`: only tool-specific files (`CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules/`). `Fail`: none. |
| 2 | **Version-controlled & reviewed** - Rule changes go through pull requests with CODEOWNERS review. No unreviewed personal rule files influence shared work. | Baseline | 7.5.3 · A.6.2.8 | Medium | Automatable | Confirm rules files are tracked (`git ls-files`), not gitignored, and covered by CODEOWNERS. Personal/local variants (`CLAUDE.local.md`, `settings.local.json`) must be gitignored, and shared work must not depend on them. Also scan rules files for invisible or bidirectional Unicode (zero-width, bidi overrides) that can hide instructions from reviewers; any hit is a `Fail` (see A2). |
| 3 | **Customer constraints first** - The top of the rules file states engagement constraints: approved tools, data that must never be read or sent, protected directories, licence restrictions. | Baseline | A.10.4 · A.7.2 | High | Partial | Read the top of the rules file: customer, approved tools, data never to be read or sent, protected directories, licence limits. Presence and position are checkable; correctness of the constraints is not. |
| 4 | **Concrete, testable instructions** - Exact commands for build, test, lint and run; architecture boundaries; naming conventions. Prefer "run npm test -- --watch=false" over "make sure tests pass". | Baseline | A.6.2.3 | Medium | Automatable | Rules give exact build/test/lint/run commands. Verify each command resolves (script exists in `package.json`/`Makefile`/etc.); a command that does not exist is a stale-rules gap. |
| 5 | **Explicit prohibitions** - List what agents must not do: edit migrations already applied, touch infra/prod, commit secrets, add dependencies without approval, disable tests or linters. | Baseline | A.9.2 · A.9.4 | High | Automatable | Look for a "do not" section covering applied migrations, production infra, secrets, new dependencies without approval, and disabling tests or linters. Missing categories make it `Partial`. |
| 6 | **Layered scope** - 99x baseline → customer → repository → module. Lower layers may add detail but never weaken security or data-handling rules from above. | Baseline | A.2.4 · A.6.1.3 | Medium | Partial | Look for a reference to a 99x/org baseline and customer layer, and nested per-module rules files. Check lower layers do not weaken higher-layer security or data rules. |
| 7 | **Keep rules short and current** - Rules are reviewed at least quarterly and whenever the architecture changes. Stale or contradictory rules are removed - long files dilute the instructions that matter. | Advanced | A.2.4 · 10.1 | Low | Partial | Flag very long rules files (over about 400 lines), references to paths/commands that no longer exist, and a last-modified date far behind recent architectural change (`git log -1 -- AGENTS.md`). |
| 8 | **Learn from mistakes** - When an agent repeatedly gets something wrong, fix it once in the rules (or a skill) rather than correcting it in every session. | Advanced | 10.1 | Low | Partial | Look in the history of rules files for corrective commits (`git log -- AGENTS.md`). Absence is weak evidence either way. |
| 9 | **Shared 99x baseline** - Maintain a 99x baseline rules template (security, data handling, PR conventions) that teams copy and extend. | Advanced | A.2.4 | Low | Partial | Look for the rules file importing, linking or being generated from a shared baseline template. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Agents work without project context** (med) - Code that ignores architecture and conventions; more rework; reviewers fix the same issues repeatedly.
- **Rules kept in personal, unversioned settings** (med) - Inconsistent behaviour between developers; no review of what agents are told; changes cannot be audited.
- **Customer constraints not encoded** (high) - Agents read or transmit restricted files, or operate in areas the customer has excluded from AI use.
- **Rules tampering / injected instructions** (high) - A malicious or careless change to a rules file silently redirects agent behaviour (e.g. exfiltrate data, weaken tests).
- **Stale or contradictory rules** (low) - Agents follow outdated build steps or deprecated patterns; trust in the rules erodes.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Does every active repository have an AGENTS.md (or equivalent) under version control?
- Are customer constraints and prohibited areas stated explicitly at the top?
- Do changes to rules files require code-owner review?
- When was the rules file last reviewed against the current architecture?
