## Framework module: Automated review

- **Module ID:** automated-review
- **Pillar group:** Verify
- **Applies when:** Always.
- **Intent:** Faster code needs stronger, more consistent verification. Centralised AI code review in the CI pipeline.
- **Controls:** 8 (4 Automatable, 3 Partial, 1 Manual); 5 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Deterministic gates first** - Build, unit/integration tests, lint, type-check, SAST, secret scanning, dependency (SCA) and licence scanning run on every PR and must pass. | Baseline | A.6.2.4 · A.6.2.5 · SSDF PW.7 | High | Automatable | CI on every PR runs build, tests, lint, type-check, SAST, secret scan, SCA and licence checks. Flag gates with `continue-on-error`, an always-true fallback (`or true`), or path filters that skip them. Whether they are *required* checks is a branch-protection setting. |
| 2 | **Central AI review configuration** - AI review is configured once (organisation or repo level) with an approved tool, shared prompts/rules and the repository's standards - not ad-hoc per developer. | Baseline | A.6.1.3 | Medium | Automatable | Look for repo/org-level AI review config (`.github/copilot-instructions.md`, `coderabbit.yaml`, a claude/review workflow, shared prompts) rather than per-developer setup. |
| 3 | **Human approval remains mandatory** - At least one qualified human (CODEOWNERS) approves every PR. AI review comments are advisory; the AI reviewer has no approve/merge rights. | Baseline | A.9.4 · OWASP ASI09 | Critical | Partial | CODEOWNERS plus required-review rulesets. `Fail` if any AI review workflow can approve or merge (`event: APPROVE`, `--approve`, auto-merge enabling). Live required-reviewer settings are not in the repo. |
| 4 | **Approved, data-compliant reviewer** - The AI review service is on the approved tool register for this engagement, with retention and training terms that meet the customer's requirements. | Baseline | A.10.3 · A.4.4 · GDPR Art. 28 | High | Partial | The AI reviewer appears on the tool register. Retention and training terms are contractual, so ask. |
| 5 | **Findings are triaged** - Authors respond to or resolve AI findings; false positives are fed back into the review configuration. | Baseline | A.6.2.4 · 9.1 | Medium | Partial | Look for a resolve-conversations requirement and review-config history showing false-positive tuning. Mostly organisational. |
| 6 | **Security-focused review pass** - A dedicated security review prompt/skill for changes touching authentication, authorisation, cryptography, payments or personal data. | Advanced | A.6.2.4 · SSDF PW.7 | Medium | Automatable | Look for a security review prompt/skill or workflow triggered by path filters on auth, crypto, payments or personal-data code. |
| 7 | **Review the AI reviewer** - Periodically sample AI review results for precision and missed issues; tune rules and track the trend. | Advanced | 9.1 · A.6.2.6 | Low | Manual | Sampling precision and missed issues is a process. Ask for evidence. |
| 8 | **Provenance on release** - Signed commits / build attestations and SBOMs so the path from AI-assisted PR to deployed artefact is verifiable. | Advanced | A.6.2.5 · A.6.2.8 | Medium | Automatable | Look for signed-commit requirement, build attestations/SLSA (`attest-build-provenance`, cosign/sigstore) and SBOM generation (syft, CycloneDX). |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Review bottleneck or rubber-stamping** (high) - Humans can't keep up with AI-generated volume and approve without understanding.
- **Security defects reach production** (high) - Injection, broken access control or secret leakage in generated code goes unnoticed.
- **Inconsistent review quality** (med) - Review depth depends on who reviews and when; standards are applied unevenly.
- **Over-trust in AI review** (med) - Teams treat a clean AI review as approval; subtle logic errors are missed.
- **Unapproved review service receives customer code** (high) - Breach of confidentiality through a CI integration nobody assessed.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Which deterministic checks block a merge today?
- Is AI review centrally configured and on the approved tool list?
- Can AI review approve or merge? (It should not.)
- How are AI review false positives fed back?
