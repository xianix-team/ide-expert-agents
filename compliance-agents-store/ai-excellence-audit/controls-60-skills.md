## Framework module: Skills

- **Module ID:** skills
- **Pillar group:** Build
- **Applies when:** Always. If the repository contains no skills (no `SKILL.md` / skill folders), mark controls 1-6 `N/A` ("no skills in repo") and list "confirm skills are not kept in personal folders" under Outstanding.
- **Intent:** Encode your best workflow once - reuse it everywhere. Reusable, versioned agent workflows.
- **Controls:** 7 (4 Automatable, 2 Partial, 1 Manual); 4 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Skills under version control** - Team and project skills live in a repository (project .agents/skills / .claude/skills or a shared 99x skills repo), with owners and a changelog. | Baseline | A.6.1.3 · 7.5 | Medium | Automatable | Skills live in tracked folders (`.claude/skills`, `.github/skills`, `.cursor/skills`, `.agents/skills`) with an owner (CODEOWNERS or header) and a changelog or git history. |
| 2 | **Reviewed like code** - New and changed skills go through pull-request review, including any scripts they run. | Baseline | A.6.2.4 | Medium | Partial | CODEOWNERS covers skill folders; history shows skills changed through reviewed merges. Review quality is not visible. |
| 3 | **Trusted sources only** - Third-party or community skills are reviewed before adoption and pinned to a version. Never install skills that fetch and execute remote content at runtime. | Baseline | A.10.3 · A.4.4 · OWASP ASI04 | High | Automatable | Flag skills that fetch and execute remote content at runtime (curl-piped-to-shell, `eval`, unpinned downloads) and third-party skills with no recorded source/version. Read skill scripts, not just `SKILL.md`. |
| 4 | **No sensitive data in skills** - Examples and templates use synthetic data. No credentials, customer names or real records. | Baseline | A.10.2 · A.10.4 | High | Automatable | Scan skills for credentials, real personal data, and customer names or internal URLs. Never print the values. Ask the user for customer names to search for if not obvious. |
| 5 | **Deterministic helpers** - Push fragile steps into scripts the skill calls (generators, validators) rather than relying on the model to follow long prose. | Advanced | A.6.2.4 | Low | Automatable | Look for skills that call scripts/validators for fragile steps rather than long prose only. |
| 6 | **Evaluate skills** - Keep a few test cases per skill and re-run them when the skill, model or tool version changes. | Advanced | A.6.2.6 | Low | Partial | Look for test cases/eval prompts per skill and evidence they are re-run on change. |
| 7 | **Shared 99x skill catalogue** - Promote proven skills to a shared catalogue so other teams benefit; retire skills nobody uses. | Advanced | A.10.2 | Low | Manual | Promotion to a shared catalogue is organisational. Ask for evidence. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Inconsistent execution of common tasks** (med) - Each developer prompts differently; quality and security vary; good patterns don't spread.
- **Malicious or unreviewed skills** (high) - A third-party skill runs hidden commands or contains injected instructions that exfiltrate data.
- **Skill drift after tool / model changes** (med) - A skill silently stops producing correct output after an upgrade.
- **Customer IP leaking across engagements** (high) - Customer-specific logic embedded in a skill is reused for another customer.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Which repeated tasks has the team turned into skills?
- Who owns each skill, and when was it last reviewed?
- Were any third-party skills reviewed before installation?
- Do skills contain any customer-specific or sensitive content?
