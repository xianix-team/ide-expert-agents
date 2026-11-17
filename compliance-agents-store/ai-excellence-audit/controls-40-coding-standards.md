## Framework module: Coding standards

- **Module ID:** coding-standards
- **Pillar group:** Build
- **Applies when:** Always.
- **Intent:** If a standard matters, a machine should check it. Documented, machine-readable conventions.
- **Controls:** 8 (5 Automatable, 3 Partial, 0 Manual); 5 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Written standards in the repository** - A CODING_STANDARDS.md (or docs/standards/) covering naming, structure, error handling, logging, testing and security conventions, referenced from AGENTS.md. | Baseline | A.6.2.3 | Medium | Automatable | Look for `CODING_STANDARDS.md` or `docs/standards/` covering naming, structure, errors, logging, testing, security, and a reference to it from the rules file. |
| 2 | **Machine-enforced formatting & linting** - Formatter and linter configuration committed (.editorconfig, ESLint, Prettier, Roslyn analyzers, Ruff, Checkstyle...) and enforced in CI - not only in IDEs. | Baseline | A.6.2.4 | High | Automatable | Config committed (`.editorconfig`, ESLint, Prettier, Ruff, Roslyn analyzers, Checkstyle...) AND run in a CI workflow, not only in the IDE. Config without a CI step is `Partial`. |
| 3 | **Secure-coding rules** - Language-appropriate secure-coding rules (input validation, output encoding, parameterised queries, secret handling) enforced by SAST rules. | Baseline | A.6.2.4 · SSDF PW.5 | High | Automatable | Look for SAST in CI (CodeQL, Semgrep, Sonar, Bandit...) and secure-coding conventions in the standards. Check the scan is not `continue-on-error`. |
| 4 | **Testing standards** - Required test types and coverage expectations. AI-generated tests must assert real behaviour - no tests that only mirror the implementation or are edited to pass. | Baseline | A.6.2.4 · SSDF PW.8 | Medium | Partial | Tests exist and run in CI, coverage threshold or test-type expectations are written, and rules forbid editing tests to pass or mirroring the implementation. Look for security and regression tests around sensitive areas (auth, payments, personal data), and CODEOWNERS or a CI check on test files so edited or deleted assertions need reviewer approval. Test quality itself is judgement. |
| 5 | **Dependency standards** - Approved registries, licence allow-list, and the rule that every new dependency is verified to exist, maintained and approved before use. | Baseline | A.10.2 · A.10.4 · SSDF PW.4 | High | Partial | Look for lockfiles committed, registry config, SCA/licence scanning (Dependabot, Renovate, licence checker), and a rule to verify new dependencies. Offline: flag manifest entries missing from the lockfile. Registry lookups (to catch hallucinated or slopsquatted packages) only in interactive mode with the user's consent; otherwise list unverified new dependencies under *Still required*. |
| 6 | **Architecture as tests** - Encode boundaries (layering, module dependencies, forbidden imports) as automated architecture tests so agents can't quietly erode the design. | Advanced | A.6.2.3 · A.6.2.7 | Low | Automatable | Look for architecture tests/rules (ArchUnit, NetArchTest, dependency-cruiser, import-linter, ESLint boundaries) running in CI. |
| 7 | **Examples over descriptions** - Point agents to exemplary files ("follow the pattern in OrderService.cs") - a concrete example is followed more reliably than prose. | Advanced | A.6.2.3 | Low | Automatable | Rules/standards point to concrete exemplar files. Verify the referenced paths exist. |
| 8 | **Logging & privacy conventions** - Standard logging helpers that redact personal data by default; rules forbidding PII in logs, exceptions and telemetry. | Advanced | A.7.2 · GDPR Art. 5(1)(c) | Medium | Partial | Look for a shared logging helper with redaction and a rule forbidding PII in logs/exceptions/telemetry. A grep for log calls printing user fields yields leads only; open and confirm before citing. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Inconsistent, hard-to-maintain code** (med) - Each agent session produces a different style and structure; maintenance cost and onboarding time rise.
- **Insecure patterns at scale** (high) - Generated code reproduces injection, weak crypto or missing authorisation across many files.
- **Hallucinated or malicious dependencies (slopsquatting)** (high) - Agent installs a package that doesn't exist - or one an attacker registered under that name.
- **Licence contamination** (high) - Copyleft or unlicensed code enters a customer's proprietary product, creating IP and legal exposure.
- **PII written to logs** (high) - Personal data leaks into logs and monitoring tools, breaching data protection obligations.
- **Tests that don't test** (med) - Green pipelines that give false confidence; regressions reach customers.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Are the coding standards written down and referenced from the rules file?
- Which standards are enforced in CI, and which only by convention?
- How does the team verify a new dependency suggested by an agent?
- Is there a rule and tooling that keeps personal data out of logs?
