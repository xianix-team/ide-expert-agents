# Delivery Playbooks

Starting points for S3, not prescriptions. Combine playbooks when the intent spans several, then cut with the S3 rules. Arrows show a typical order. Skills in brackets apply only when the condition is met.

## Playbooks by delivery intent

| Intent | Typical sequence | Watch for |
|---|---|---|
| **New product** | `discovery-interview` → `requirement-analyzer` → `persona-builder` → `journey-mapper` → `prototype-builder` → `product-backend-architect` and `product-frontend-architect` → `planning-helper-agent` → `auth-implementer`, `observability-implementer` → `test-case-generator` → `iac-generator` → `release-readiness-checklist` | Too many skills for one iteration. Start with requirements and one architecture skill |
| **Feature in an existing product** | `requirement-analyzer` → `elaborate` → [UI is open: `design-concept-lab`] → [architecture changes: `product-backend-architect` or `product-frontend-architect`] → `planning-helper-agent` → `test-case-generator` → `smoke-sanity-testing` | `elaborate` reads the codebase, so an engineer should run it together with the product owner |
| **Taking over an unfamiliar codebase** | `codebase-archaeology` → `product-engineering-essentials` → [no specs or tests: `test-cases-from-code`] → `owasp-security-scanner` → [live cloud deployment: `deployment-architect`] | Findings are a starting picture. Agree which ones matter before fixing anything |
| **Stabilising or cleaning up** | `runtime-debugger` (known bugs) → `error-handling-audit` → `code-cleanup` → `white-box-testing` → `observability-implementer` | Get a test safety net in place before `code-cleanup` changes risky areas |
| **Raising test quality** | `test-case-generator` (or `test-cases-from-code` with no spec) → `black-box-testing` → `exploratory-testing` → `explore-and-build` → `white-box-testing` → `bug-report` | Choose by what is missing: cases, execution, automation, or coverage |
| **UX improvement** | `ixd-review` → `persona-builder` → `journey-mapper` → [operations matter: `service-blueprint`] → `design-concept-lab` → `design-consistency-audit` → `design-rationale`; `ui-ux-accessibility-testing` before release | Personas built without research are assumptions. Say so in the plan |
| **AI or agentic product** | `explore-agentic-ai-usecases` → [in-app intent matching: `user-intent-extractor`] → `agentic-ai-reviewer` → `eu-ai-act-controls-reviewer` → [personal data: `gdpr-controls-reviewer`] | Run the compliance reviews early enough to change the design |
| **Security or compliance before go-live** | `owasp-security-scanner` → [auth gaps: `auth-implementer`] → [personal data: `gdpr-controls-reviewer`] → [AI features: `eu-ai-act-controls-reviewer`] → `release-readiness-checklist` | These skills inform a qualified approver. They are not legal advice, a penetration test, or certification |
| **Cloud environments and release** | `iac-generator` → `deployment-architect` → `smoke-sanity-testing` → `release-readiness-checklist` | `iac-generator` previews, and a person approves every apply. `deployment-architect` needs something deployed |
| **Data platform** | The `data-platform-cycle` runbook, or `repo-analyst` → `due-diligence` → `architecture-advisor` → `opportunity-scout` → `data-platform-developer` → `data-platform-validator` → `regression-monitor` → `context-keeper` | The developer and the validator should be run by different people |
| **Shaping or selling work** | The `presales-pipeline` runbook, or `discovery-interview` → `elaborate` → `estimate` → `proposal`; [client is asking about AI: `ai-readiness-assessment`]; [market picture: `competitive-analysis`]; [delivered work: `casestudy-drafter`] | Commercial sign-off stays human |
| **Delivery rhythm** (add to any intent) | `planning-helper-agent` at planning → `delivery-commitment-health-report` at the iteration boundary; [AI limits or cost: `token-efficiency-coach`] | Take a baseline before the team changes how it works |
| **AI-DLC teams** (add to any intent) | `new-engineer-induction` → `design-session` → `bolt-risk-assessment` → `progress-digest` → `uat` → `process-health`; `root-cause-analysis` and `dependency-audit` as needed | Only for projects with the AI-DLC framework installed |

## What skills need first

| Skills | Need | If it's missing |
|---|---|---|
| `design-session`, `bolt-risk-assessment`, `uat`, `progress-digest`, `process-health`, `new-engineer-induction`, `root-cause-analysis`, `dependency-audit` | The AI-DLC framework in the repository (a master rule file that points to it) | Choose a non-AI-DLC skill or name the gap |
| `black-box-testing`, `exploratory-testing`, `explore-and-build`, `smoke-sanity-testing`, `ui-ux-accessibility-testing` | A running web app in a safe test environment, test accounts, and browser automation (Playwright) | Add an environment setup step, or start with `test-case-generator` |
| `white-box-testing` | Permission and ability to run the code and its tests | Add a setup step |
| `test-cases-from-code` | The feature branch checked out | Add a setup step |
| `test-case-generator` | A spec or a diff | Write the spec first with `elaborate` |
| `design-consistency-audit`, `design-concept-lab` | The project's design tokens | Ask the designer where they live, or start with `ixd-review` |
| `design-rationale` | A resolved `design-consistency-audit` report | Run that first |
| `deployment-architect` | A live deployment and an authenticated cloud CLI with read access | Wait until something is deployed |
| `iac-generator` | A codebase to scan and a cloud choice | Wait until there is code to run |
| `estimate` | A requirement spec | Run `elaborate` first |
| `architecture-advisor` | A `due-diligence` report | Run that first |
| `data-platform-developer`, `data-platform-validator` | An approved opportunity or ADR | Get approval first |
| `regression-monitor` | An established baseline | Create the baseline first |
| `delivery-commitment-health-report` | Git history. A board export and a failure signal are optional, and metrics without their signal are reported as not measured | Plan which signals to start recording |

## Usual owners

A default when the product owner has no preference. If the role isn't on the team, assign the closest one and record that as an assumption.

| Role | Usually owns | Usually approves |
|---|---|---|
| Product owner | `discovery-interview`, `requirement-analyzer` | Requirements, scope, UAT, release |
| Delivery lead or Scrum master | `planning-helper-agent`, `delivery-commitment-health-report`, `release-readiness-checklist` | Delivery plan |
| Architect or tech lead | `elaborate`, the architecture skills, `codebase-archaeology`, `agentic-ai-reviewer` | Architecture, security risk |
| Engineer | The coding skills, `test-case-generator`, `white-box-testing` | Code changes, through normal review |
| QA engineer | The testing skills, `bug-report` | Go/no-go evidence |
| UX designer | The UX skills | Design direction |
| DevOps engineer | `iac-generator`, `deployment-architect` | Infrastructure changes |
| Data engineer | The data-platform skills | Schema and pipeline changes |
| Security, privacy, or compliance owner | `owasp-security-scanner`, the compliance skills | Risk acceptance |

## Working Agreements

The shared training module. Adapt the wording to the team.

1. **Start from the outcome.** Say what you need and why before choosing a skill. If no skill fits, don't force one.
2. **Answer the opening questions properly.** Most poor results come from vague scope. Give paths, boundaries, and what "done" means.
3. **Use the checkpoints.** When a skill stops and asks, read what it shows and correct it. Confirming without reading defeats the purpose.
4. **Check against evidence.** Open a few of the cited files or sources. Treat anything marked assumed, unknown, or to verify as unfinished.
5. **Match the review to the rating.** Low human judgement: a quick sanity check. Medium: a practitioner reviews it. High: a qualified person evaluates it and owns the decision.
6. **You own what you ship.** Skill output goes through the same review, tests, and approvals as any other work.
7. **Pass files along, not chat.** Save the output where the next skill or person expects it, and start a new session for the next task.
8. **Protect data.** No credentials, personal data, or confidential client material in prompts unless your policy and tool allow it.
9. **Feed back.** At the iteration review, note what helped, what misled, and what to drop. Report a weak skill to the library's maintainers.
