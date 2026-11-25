# Delivery Playbooks

Starting points for S3, not prescriptions. Combine playbooks when the intent spans several, then cut with the S3 rules. Arrows show a typical order. Skills in brackets apply only when the condition is met.

## Playbooks by delivery intent

| Intent | Typical sequence | Watch for |
|---|---|---|
| **New product** | `discovery-interview` → `requirement-analyzer` → `persona-builder` → `journey-mapper` → `prototype-builder` → `product-backend-architect` and `product-frontend-architect` → [policies or agreements needed: `policy-and-agreement-advisor`] → `planning-helper-agent` → `auth-implementer`, `observability-implementer` → `test-case-generator` → `iac-generator` → `release-readiness-checklist` | Too many skills for one iteration. Start with requirements and one architecture skill. Identify and draft the policies and agreements early, because the customer's lawyers need time |
| **Feature in an existing product** | `requirement-analyzer` → `elaborate` → [UI is open: `design-concept-lab`] → [architecture changes: `product-backend-architect` or `product-frontend-architect`] → `planning-helper-agent` → `test-case-generator` → `smoke-sanity-testing` | `elaborate` reads the codebase, so an engineer should run it together with the product owner |
| **Taking over an unfamiliar codebase** | `codebase-archaeology` → `product-engineering-essentials` → [no specs or tests: `test-cases-from-code`] → `owasp-security-scanner` → [live cloud deployment: `deployment-architect`] | Findings are a starting picture. Agree which ones matter before fixing anything |
| **Stabilising or cleaning up** | `runtime-debugger` (known bugs) → `error-handling-audit` → `code-cleanup` → `white-box-testing` → `observability-implementer` | Get a test safety net in place before `code-cleanup` changes risky areas |
| **Migration or modernisation** | `codebase-archaeology` → `test-cases-from-code` (record current behaviour) → `product-backend-architect` or `product-frontend-architect` → `planning-helper-agent` → `white-box-testing` → `smoke-sanity-testing` → [new environments: `iac-generator`] → `release-readiness-checklist` | No skill carries out the migration itself. Name that as a gap. Recorded behaviour is what the old system does, not necessarily what it should do |
| **Raising test quality** | `test-case-generator` (or `test-cases-from-code` with no spec) → `black-box-testing` → `exploratory-testing` → `explore-and-build` → `white-box-testing` → `bug-report` | Choose by what is missing: cases, execution, automation, or coverage |
| **UX improvement** | `ixd-review` → `persona-builder` → `journey-mapper` → [operations matter: `service-blueprint`] → `design-concept-lab` → `design-consistency-audit` → `design-rationale`; `ui-ux-accessibility-testing` before release | Personas built without research are assumptions. Say so in the plan |
| **AI or agentic product** | [existing product: `explore-agentic-ai-usecases`; new product: `ai-readiness-assessment`, then the **New product** playbook] → [in-app intent matching: `user-intent-extractor`] → `agentic-ai-reviewer` → `eu-ai-act-controls-reviewer` → [personal data: `gdpr-controls-reviewer`] | The reviewers read code, so they need something built. Run them early enough to change the design |
| **Security or compliance before go-live** | `owasp-security-scanner` → [auth gaps: `auth-implementer`] → [personal data: `gdpr-controls-reviewer`] → [AI features: `eu-ai-act-controls-reviewer`] → [policies or agreements to identify, draft, or review: `policy-and-agreement-advisor`] → `release-readiness-checklist` | These skills inform a qualified approver. They are not legal advice, a penetration test, or certification |
| **Cloud environments and release** | `iac-generator` → `deployment-architect` → `smoke-sanity-testing` → `release-readiness-checklist` | `iac-generator` previews, and a person approves every apply. `deployment-architect` needs something deployed |
| **Data platform** | The `data-platform-cycle` runbook, or `repo-analyst` → `due-diligence` → `architecture-advisor` → `opportunity-scout` → `data-platform-developer` → `data-platform-validator` → `regression-monitor` → `context-keeper` | The developer and the validator should be run by different people |
| **Shaping or selling work** | The `presales-pipeline` runbook, or `discovery-interview` → `elaborate` → `estimate` → `proposal`; [client is asking about AI: `ai-readiness-assessment`]; [market picture: `competitive-analysis`]; [delivered work: `casestudy-drafter`] | Commercial sign-off stays human |
| **Delivery rhythm** (add to any intent) | `planning-helper-agent` at planning → `delivery-commitment-health-report` at the iteration boundary; [AI limits or cost: `token-efficiency-coach`] | Take a baseline before the team changes how it works |
| **AI-DLC teams** (add to any intent) | `new-engineer-induction` → `design-session` → `bolt-risk-assessment` → `progress-digest` → `uat` → `process-health`; `root-cause-analysis` and `dependency-audit` as needed | Only for projects with the AI-DLC framework installed |

## What each skill needs and produces

Taken from each skill's own instructions. If a skill's opening questions differ, they win. Paths are defaults the user can change. "Codebase" means a checked-out repository the person running it can read. `{FRAMEWORK}` is the AI-DLC framework folder. "Optional" needs improve the result but don't block it.

| Skill | Needs | Produces | If a need isn't met |
|---|---|---|---|
| `discovery-interview` | A topic and the stakeholder, live | `docs/discovery/<topic>-discovery.md` | |
| `requirement-analyzer` | The requirement or intent. Optional: source context, codebase | `docs/analysis/<slug>-critical-analysis.md` | |
| `elaborate` | A request and a codebase | `docs/specs/<slug>-spec.md` | No codebase: `discovery-interview` and `requirement-analyzer` |
| `estimate` | A spec, or scope described inline if it's detailed enough to decompose | `estimates/<slug>-estimate.md` | Scope too thin: `elaborate` |
| `proposal` | Whatever exists: discovery record, spec, estimate, UX material | `docs/proposals/<client>-proposal.md` | |
| `casestudy-drafter` | A delivered codebase, a short description, and a decision to name or anonymise the customer | Files in `docs/case-studies/` | |
| `ai-readiness-assessment` | What the organisation does and its AI ambition. Optional: data and document samples | `docs/ai-readiness/ai-readiness-assessment.md` | |
| `explore-agentic-ai-usecases` | An existing product's codebase and a short description | `docs/agentic-usecases/<project>-agentic-usecases.md` | New product: `ai-readiness-assessment` |
| `persona-builder` | A product name. Optional: research inputs | `docs/personas/<name>-personas.md` | No research: results are proto-personas |
| `journey-mapper` | One scenario, and a persona or a description of one | `docs/journeys/<persona>-journey.md` | |
| `service-blueprint` | A journey map or a described scenario | `docs/service-blueprints/<scenario>-blueprint.md` | |
| `competitive-analysis` | The product context and competitors, or ask it to propose them | `docs/competitive-analysis/<product>-competitive-analysis.md` | |
| `prototype-builder` | A project name and an empty folder outside any product repository. Optional: UX material | A clickable demo in that folder | |
| `design-concept-lab` | A clear requirement and the project's design tokens | Mockups, a gallery, and `approved-direction.md` in the lab folder | No tokens: ask the designer, or start with `ixd-review` |
| `ixd-review` | Screenshots, files, or a live URL, and one flow | `docs/ixd-reviews/<target>-ixd-review.md` | |
| `design-consistency-audit` | UI code and the project's design tokens | `design-reports/<scope>-design-review.md`; fixes only for accepted findings | No tokens: ask the designer, or start with `ixd-review` |
| `design-rationale` | A `design-consistency-audit` report with findings marked fixed or wontfix | `docs/design-decisions/<scope>-design-decision-record.md` | Resolve the audit first |
| `product-backend-architect` | A brief or spec, known targets, and compliance requirements. Existing backend: its codebase | `docs/architecture/<slug>-backend-architecture.md` | |
| `product-frontend-architect` | A brief or spec, known targets, and compliance requirements. Existing frontend: its codebase | `docs/architecture/<slug>-frontend-architecture.md` | |
| `product-engineering-essentials` | Codebase | `docs/reports/product-engineering-essentials-<date>.md` | |
| `release-readiness-checklist` | A release (version) and someone who can answer each item. UAT or Production | `docs/reports/release-checklist-<uat or prod>-<date>-<version>.md` | |
| `deployment-architect` | A live deployment and an authenticated cloud CLI with read access. Optional: NFR spec | As-deployed architecture documents and a fitness report | Nothing deployed: wait |
| `agentic-ai-reviewer` | An agentic-AI codebase | `agentic-ai-audit-report.md` | No code yet: later phase |
| `eu-ai-act-controls-reviewer` | An AI codebase, and whether you are provider, deployer, or both | `eu-ai-act-fitness-report.md` | No code yet: later phase |
| `gdpr-controls-reviewer` | A codebase that handles personal data, whether you are controller or processor, and whether it's live | `gdpr-fitness-report.md` | No code yet: later phase |
| `policy-and-agreement-advisor` | A product description, a private folder for the internal files, and a folder that isn't published for the files to share. To draft: who approves each document, and any template. To review: the submitted documents as PDF, Markdown, text, or HTML. Optional: codebase, infrastructure code, contracts, `gdpr-controls-reviewer` and `eu-ai-act-controls-reviewer` reports | In the shareable folder: `document-requirements.md`, `<document>-draft-v<n>.md`, and optional review comments to send. `product-facts.md`, draft notes, reviews, and drafts our commercial owner hasn't released are internal and go to a private folder | No lawyers on the customer side: name the gap. Drafts can't be published without a qualified approver |
| `iac-generator` | A codebase to scan and answers on cloud and environments | Infrastructure code and `infra-docs/` | No code yet: later phase |
| `user-intent-extractor` | A codebase with real features or services to match. Optional: login, LLM provider | A design document, and code once approved | |
| `auth-implementer` | Codebase, stack, auth and authorization model. Optional: compliance framework | A design document, and code once approved | |
| `observability-implementer` | Codebase, platform, pillars, environments. Optional: cost ceiling | A design document, and code once approved | |
| `error-handling-audit` | Codebase scope and language | A findings report, and fixes once approved | |
| `runtime-debugger` | Evidence of a real bug (logs, crash output, spec, or observation) and the codebase | A root cause, and a fix once approved | |
| `code-cleanup` | Codebase | One approved cleanup at a time | |
| `token-efficiency-coach` | A project folder and the AI tools in use | `docs/ai/token-efficiency-report.md`, rule files, approved config fixes | |
| `planning-helper-agent` | One task to decompose or a list to schedule. Optional: number of people or agents, codebase | `docs/plans/parallel-plan.md` | |
| `delivery-commitment-health-report` | Git history and a reporting window. Optional: board export, failure signal, AI-authorship signal | `docs/delivery/commitment-health-report.md` | Metrics without a signal are "not measured". Start recording it |
| `test-case-generator` | A spec or ticket description, or a diff or PR, and enough scope to find the relevant code | `test-cases/<slug>-test-cases.md` | Neither exists: write the requirement down first |
| `test-cases-from-code` | The app's source with the feature branch checked out | A cited behavioural spec, test cases, and a risk handoff | Add a setup step |
| `white-box-testing` | Permission and ability to run the code and its tests | Tests and a coverage report | Add a setup step |
| `black-box-testing` | A running web app in a safe test environment, test data and accounts, Playwright | A test report and Playwright specs | Set up the environment, or start with `test-case-generator` |
| `smoke-sanity-testing` | A running build and Playwright | A go/no-go result | Set up the environment |
| `exploratory-testing` | A running web app in a safe test environment and Playwright | A session report | Set up the environment |
| `explore-and-build` | A running web app, and the app URL and any credentials in project config. Guided mode needs a browser MCP | A test instruction file and a Playwright spec | Set up the environment |
| `ui-ux-accessibility-testing` | A page URL and browser automation. Parity track: a design spec. Credentials only if the page needs login | A self-contained HTML report | No design spec: run the accessibility track only |
| `bug-report` | Screenshots. Optional: Jira connection | Structured bug reports; files to Jira only after approval | |
| `owasp-security-scanner` | Codebase, language or framework, and web access to owasp.org | `owasp-scan-report.md` | |
| `codebase-archaeology` | Codebase, split into agreed segments | `archaeology/<date>-archaeology-report.md` | |
| `design-session` | The AI-DLC framework and an intent file | A design in `{FRAMEWORK}/ops/inception/designs/` | No framework: name the gap |
| `bolt-risk-assessment` | The AI-DLC framework and a planned bolt with its units | Risk section in the bolt file | No framework: name the gap |
| `uat` | The AI-DLC framework and an intent whose units are all done | Sign-off in the intent file | No framework: name the gap |
| `root-cause-analysis` | The AI-DLC framework and resolved incident or improvement files | A report, then intent or improvement files | No framework: name the gap |
| `progress-digest` | The AI-DLC framework and an intent file | A digest beside the intent file | No framework: name the gap |
| `new-engineer-induction` | The AI-DLC framework and 30–45 minutes | A personal quick-reference card | No framework: name the gap |
| `process-health` | The AI-DLC framework with retro, improvement, bolt, and intent files | `{FRAMEWORK}/ops/operate/process-health-<date>.md` | No framework: name the gap |
| `dependency-audit` | The AI-DLC framework and dependency manifests. Optional: scanner output | Findings and backlog units | No framework: name the gap |
| `repo-analyst` | Data-platform docs or schema files. Optional: read-only CLI | `docs/knowledge-graph.md` | |
| `due-diligence` | A data-platform repository. Optional: knowledge graph | `docs/due-diligence-report.md` | |
| `architecture-advisor` | A `due-diligence` report. Optional: knowledge graph, prior decisions | `docs/architecture-decisions.md` | Run `due-diligence` first |
| `opportunity-scout` | Documented business or reporting needs. Optional: knowledge graph | `docs/opportunity-backlog.md` | Document the needs first |
| `data-platform-developer` | One approved opportunity or ADR, and the schema or pipeline code | Schema and pipeline changes, gated | Get approval first |
| `data-platform-validator` | The approved item and the diff to review | `docs/data-platform-validation.md` | Get approval first |
| `regression-monitor` | An established baseline (file, snapshot, or report) and a read-only way to inspect current state | `docs/regression-report.md` | It won't create one. A data engineer records and agrees a baseline first |
| `context-keeper` | What the cycle completed and the outputs to read | `docs/data-platform-cycle-summary.md` | |

## Usual owners

A default when the product owner has no preference. Use the named skill if it's listed, otherwise its store. If the role isn't on the team, assign the closest one and record that as an assumption.

| Role | Usually owns | Usually approves |
|---|---|---|
| Product owner | `discovery-interview`, `requirement-analyzer`, `uat`, `progress-digest` | Requirements, scope, UAT, release |
| Delivery lead or Scrum master | The delivery store, `release-readiness-checklist`, `process-health` | Delivery plan |
| Architect or tech lead | The architect store, `elaborate`, `codebase-archaeology`, `design-session`, `bolt-risk-assessment`, `root-cause-analysis`, `explore-agentic-ai-usecases` | Architecture, security risk |
| Engineer | The coding and feature stores, `test-case-generator`, `white-box-testing`, `dependency-audit`, `new-engineer-induction`, `policy-and-agreement-advisor` | Code changes, through normal review |
| QA engineer | The rest of the QA store | Go/no-go evidence |
| UX designer | The UX store | Design direction |
| DevOps engineer | The DevOps store, `deployment-architect` | Infrastructure changes |
| Data engineer | The data-platform store. `data-platform-validator` goes to someone other than the developer | Schema and pipeline changes |
| Security, privacy, or compliance owner | The rest of the compliance store, `owasp-security-scanner` | Risk acceptance. Policies are approved by the customer's lawyers. Agreements our company is party to (SLA, support, DPA) also need our commercial and legal owners |
| Pre-sales or engagement lead | `estimate`, `proposal`, `casestudy-drafter`, `ai-readiness-assessment` | Commercial commitments, what goes to a client |

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
