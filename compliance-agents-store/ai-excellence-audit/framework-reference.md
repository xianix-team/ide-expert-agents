## Framework reference: levels, ratings, where evidence lives

Use this to (a) read each control's **Level**, (b) compute ratings, and (c) know where each AI tool keeps its configuration. Source: the 99x AI Engineering Excellence Framework, **version 1.0 (October 2026)**. Stamp this version in every report. If the repository's own rules reference a newer framework version, note that in *Assumptions*.

### The framework in one paragraph

Eight pillars describe what a 99x team should have in place when engineering software with AI coding assistants and agents. **Govern:** Process, Rules. **Protect:** Guardrails. **Build:** Coding standards, Documentation, Skills. **Verify:** Automated review. **Foundation:** Data protection (customer IP and personal data). Each pillar has **Baseline** practices (every team, every engagement) and **Advanced** practices (excellence). The framework ties each pillar to risks and to ISO/IEC 42001:2023 clauses and Annex A controls.

### Levels

| Level | Meaning | Effect on rating |
|---|---|---|
| **Baseline** | Expected of every team and engagement. | Drives the Baseline score and the **Baseline met** gate. |
| **Advanced** | Marks excellence beyond the baseline. | Drives the Advanced score. Never lowers a Baseline result. |

### Severity weights

`Critical=3, High=2, Medium=1.5, Low=1`. Severity is the impact if the control is missing. It is not the same as the framework's Baseline/Advanced level.

### Ratings

Compute the scores from the A2 formulas, then apply the first matching rating, top to bottom:

| Rating | Condition |
|---|---|
| **Excellence** | **Baseline met** AND Advanced score ≥ 60% over at least 3 reviewed Advanced controls. |
| **Baseline met** | Baseline score ≥ 80% AND no Baseline `Fail` on a Critical or High control. |
| **Developing** | Baseline score 50-79.9%, OR Baseline score ≥ 80% but a Baseline `Fail` on a Critical or High control exists. |
| **Foundational** | Baseline score < 50%. |

**Cap:** any Baseline `Fail` on a **Critical** control caps the rating at **Developing**, whatever the score. Say so next to the rating.

### Priority ranking

For every Partial or Fail: `priority = severity weight × gapFactor × levelFactor`. `gapFactor`: `Fail=2, Partial=1`. `levelFactor`: `Baseline=2, Advanced=1`. Sort descending. Break ties by pillar order (Process first), then control number.

### Where evidence lives (by tool)

Look in the locations for every tool the repository shows signs of using. Do not assume one tool.

| Evidence | Locations |
|---|---|
| Rules files | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/*.md`, `.cursor/rules/*`, `.cursorrules`, `.windsurfrules`, `.windsurf/rules/`, `.clinerules`, `.amazonq/rules/`, `.junie/guidelines.md`, `CONVENTIONS.md` (Aider) |
| Content exclusion (deny-read for the tool that reads it) | `.cursorignore`, `.aiexclude`, `.aiderignore`, `.codeiumignore` |
| AI agents in CI | workflows using `claude-code-action`, Codex or Aider actions, `.github/workflows/copilot-setup-steps.yml` |
| Agent artefacts (must not be tracked) | `.specstory/`, `.aider.chat.history.md`, `.aider.input.history`, exported `*.jsonl` transcripts, `.claude/projects/` |
| Local, personal rules (must be gitignored) | `CLAUDE.local.md`, `.claude/settings.local.json` |
| Agent permissions and hooks | `.claude/settings.json`, `.claude/hooks/`, `.cursor/cli.json`, `.vscode/settings.json` (chat/tool-approval keys), `.codex/`, `.gemini/settings.json` |
| MCP servers and plugins | `.mcp.json`, `.cursor/mcp.json`, `.vscode/mcp.json`, plugin/marketplace keys in agent settings |
| Skills | `.claude/skills/`, `.github/skills/`, `.cursor/skills/`, `.agents/skills/`, `skills/` |
| CI and gates | `.github/workflows/`, `.gitlab-ci.yml`, `azure-pipelines.yml`, `Jenkinsfile`, `.circleci/` |
| Review and ownership | `CODEOWNERS` (root, `.github/`, `docs/`), `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/`, `.github/rulesets/`, branch-protection IaC |
| AI review tools | `.coderabbit.yaml`, `.github/copilot-instructions.md`, review workflows using an agent action |
| Standards and quality | `.editorconfig`, linter/formatter configs, `CODING_STANDARDS.md`, `docs/standards/`, SAST config (`.semgrep*`, `codeql*`, `sonar-project.properties`) |
| Architecture docs | `docs/architecture/`, `docs/adr/`, `doc/adr/`, `adr/`, `GLOSSARY.md`, `docs/domain/` |
| Secrets and data hygiene | `.gitignore`, `.gitleaks.toml`, `.pre-commit-config.yaml`, `.husky/`, `.github/secret_scanning.yml` |
| Dev environment and sandbox | `.devcontainer/`, `docker-compose*.yml` |
| Supply chain | lockfiles, `.npmrc`, `renovate.json`, `.github/dependabot.yml`, SBOM and attestation steps in CI |
| Incident and policy | `SECURITY.md`, `docs/security/`, `docs/ai/`, `AI-TOOLS.md` |

### Framework examples to point to in recommended actions

The framework publishes a starter example on each of these pillar pages. Point to it in a recommended action rather than writing a new one.

| Gap | Framework example |
|---|---|
| No PR-template AI section (Process: traceability) | Process page: "Pull request template - AI section" |
| No or thin `AGENTS.md` (Rules) | Rules page: "AGENTS.md - skeleton" |
| No permission policy (Guardrails: least privilege) | Guardrails page: "agent permission policy (illustrative)" |
| No written standards (Coding standards) | Coding standards page: "CODING_STANDARDS.md - excerpt" |

### Evidence handling rules

- **Never print a secret value or a personal-data value.** Cite `path:line` and the kind of finding only (for example "AWS access key pattern at `path:12`").
- **A pattern hit is a lead, not evidence.** Open the file and confirm before citing it.
- **Repository evidence has a ceiling.** Organisational controls (training, contracts, tool terms, live branch protection) are not visible in a repo. Mark them `Partial` with *Still required*, or leave them to the Outstanding list. Never infer a `Pass` from silence.

### Related agents (hand off, do not duplicate)

| If the repository... | Point the team to |
|---|---|
| ships AI features to end users (agents, LLM calls, RAG) | `eu-ai-act-controls-reviewer` for EU AI Act obligations (mapped to ISO 42001 and NIST AI RMF) |
| ships agentic features and needs reliability and security checks on that code (RAG, tool-calling, multi-agent, autopilots) | `agentic-ai-reviewer` for the product's runtime design, controls and evidence (ISO/IEC 42001-aligned) |
| processes personal data | `gdpr-controls-reviewer` for GDPR obligations (mapped to ISO 27701 and NIST Privacy Framework) |

This agent assesses how the team **uses** AI to build software. Those agents assess the AI product the team **ships**. Where themes overlap (secrets, prompt injection, least privilege), this agent looks at the team's development process and tooling, and they look at the product's runtime behaviour. The ISO/IEC 42001-referencing agents use the same numbering, so findings line up.
