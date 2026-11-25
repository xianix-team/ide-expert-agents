# IDE Expert Agents

A collection of expert AI agents for software engineering — covering delivery process, architecture, DevOps, coding, QA, UX, and compliance. Agents are tool-agnostic and delivered via a single MCP server that works with **Claude Code**, **Cursor**, and **GitHub Copilot**.

---

## How it works

Each agent lives as a markdown file with a YAML frontmatter header (`name`, `description`, `autonomy`, `human-judgement`) followed by its full instruction set. The two ratings, each **High**, **Medium**, or **Low**, show how much of the task the agent does on its own and how much human judgement its output needs before you act on it. Each store's README lists them, and [CONTRIBUTING.md](CONTRIBUTING.md#autonomy-and-human-judgement) defines the levels. An MCP server in `mcp-server/` discovers all agents at startup and exposes them as **MCP prompts** — the standard primitive that maps to slash commands in Claude Code and Cursor.

```
*-agents-store/
  <agent-name>/
    agent.md   ← instruction set + frontmatter (Claude Code style)
    SKILL.md   ← instruction set + frontmatter (Cursor style)
    *.md       ← supporting docs (auto-concatenated into the prompt)

mcp-server/    ← reads all stores, serves agents as MCP prompts
```

For the full architecture diagram and the key design decisions, see [docs/architecture.md](docs/architecture.md).

---

## Quickstart

Three deployment options are available — choose what fits your team:

| Option | Best for | How it works |
|---|---|---|
| **A — Docker** | Shared team server (recommended) | Build once, run centrally; every developer connects via URL |
| **B — npx** | Personal use, no clone required | Public npm package [`@99x-ai-dlc/ide-expert-agents-mcp`](https://www.npmjs.com/package/@99x-ai-dlc/ide-expert-agents-mcp) (in the [`99x-ai-dlc`](https://www.npmjs.com/org/99x-ai-dlc) npm org) runs locally via `npx` |
| **C — Local clone** | Contributors or personal use with full control | Clone the repo, build once, point your tool at the local binary |

Full setup instructions, per-tool config snippets, Docker development tips, and environment variables are in [mcp-server/README.md](mcp-server/README.md).

### Using an agent

In Claude Code: `/mcp__ide-expert-agents__codebase-archaeology`

In Cursor: type `/` and search for the agent name in agent mode.

In GitHub Copilot Chat (VS Code): `/mcp.ide-expert-agents.codebase-archaeology`, or ask in agent mode ("use the codebase-archaeology agent") — the server also exposes `list_agents` and `get_agent` tools for clients that work through tools.

### Install agents as native skills (no MCP server)

To copy selected agents straight into a project as native skills, download the installer and run it. You don't need a clone of this repo:

```bash
curl -fsSL https://raw.githubusercontent.com/xianix-team/ide-expert-agents/main/scripts/install-skills.sh -o install-skills.sh
bash install-skills.sh

# or in one step
curl -fsSL https://raw.githubusercontent.com/xianix-team/ide-expert-agents/main/scripts/install-skills.sh | bash
```

The script clones the latest `main` of this repo into a temp folder, which it deletes when it finishes. Then it asks for your project folder, your tool, and the skills you want. It writes each skill to the folder your tool reads:

| Tool | Installed to | Run with |
|---|---|---|
| Claude Code | `<project>/.claude/skills/<name>/SKILL.md` | `/<name>` |
| GitHub Copilot (VS Code) | `<project>/.github/skills/<name>/SKILL.md` | `/<name>` in Copilot Chat (agent mode) |
| Cursor | `<project>/.cursor/skills/<name>/SKILL.md` | `/<name>` in Agent chat |

Each `SKILL.md` holds the same content the MCP server serves: the agent's other `*.md` files are added to the end, and subfolders such as `templates/` are copied along with it. To update skills you installed earlier, run the script again.

---

## Track usage in AI Hub (optional)

The MCP server can report every agent invocation to [99x AI Hub](https://ai-hub.99x.io), so your team can see which agents are used, by whom, and how often. No conversation or code is sent, and nothing is reported until you configure it.

Setup steps for Claude Code, Cursor, GitHub Copilot, and the team server are in [docs/ai-hub-usage.md](docs/ai-hub-usage.md).

---

## Agent stores

<!-- generated:stores:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Store | Agents | Description |
|---|---|---|
| [idf-agents-store](idf-agents-store/README.md) | 9 | Structured software delivery — design, risk, UAT, RCA, process health, and more |
| [devops-agents-store](devops-agents-store/README.md) | 1 | Infrastructure provisioning and IaC generation |
| [architect-agents-store](architect-agents-store/README.md) | 6 | Architecture design, review, and cloud deployment inspection — product backend and frontend architecture design, deployment fitness assessment, agentic AI review, product-engineering foundations checklist, and release readiness checklist |
| [coding-agents-store](coding-agents-store/README.md) | 6 | Code quality and targeted improvements — error handling audit, runtime debugging from logs/crashes/requirements, observability implementation (logging/metrics/tracing) with cost guardrails, authentication/authorization implementation mapped to OWASP ASVS / NIST guidance, behavior-preserving code cleanup for vibe-coded / overgrown codebases, and token-efficiency coaching for AI-assisted development (context audit plus an always-on rule for Claude Code, Cursor, and Copilot) |
| [qa-agents-store](qa-agents-store/README.md) | 10 | Testing and quality assurance — OWASP static security scanning, black-box / white-box / smoke & sanity / exploratory testing, UI/UX & WCAG accessibility audits, Playwright test authoring from explored sessions, test case generation from specs, diffs, or code alone, and bug reports from annotated screenshots |
| [ux-agents-store](ux-agents-store/README.md) | 9 | UX design and research — persona/journey/service-blueprint/competitive-analysis/prototype generation, design-consistency auditing, design-concept generation, interaction-design review, and design-rationale documentation |
| [pre-sales-agents-store](pre-sales-agents-store/README.md) | 7 | Pre-sales pipeline — agentic AI opportunity mining, AI readiness assessment, discovery interview, requirement elaboration, effort estimation, proposal assembly, and case-study drafting from delivered codebases |
| [data-platform-agents-store](data-platform-agents-store/README.md) | 8 | Data-platform analysis and evolution — repo analysis, due diligence, architecture advisory, opportunity scouting, implementation, validation, regression monitoring, and cycle close-out |
| [compliance-agents-store](compliance-agents-store/README.md) | 3 | AI compliance, data protection, governance, and product policy documents — EU AI Act controls review with ISO 42001 and NIST AI RMF mapping, GDPR controls review (personal-data inventory, data-subject rights, LLM data flows, transfers) with ISO 27701 and NIST Privacy Framework mapping, and identifying which policies and agreements a product needs and reviewing submitted ones (privacy policy, EULA, SLA, support agreement, DPA) against the product, for Norway, the EU, and the EEA |
| [delivery-agents-store](delivery-agents-store/README.md) | 3 | Delivery management — DORA-inspired commitment health reporting, parallel-execution planning (dependency mapping + wave scheduling), and team skill planning and training (which skills in this library to use for a delivery intent, and how), adapted for AI-led development |
| [feature-agents-store](feature-agents-store/README.md) | 1 | Feature implementation — skills for building specific product features end-to-end, e.g. an AI "digital salesperson" that maps user intent (chat + generated action buttons) to the product's real features/services, with per-user preference memory and a cross-user plot library |
| [analyst-agents-store](analyst-agents-store/README.md) | 1 | Business/systems analysis — critically evaluating requirements against the Paul-Elder Critical Thinking Framework before they're scoped or built |
<!-- generated:stores:end -->

---

## Runbooks

Runbooks coordinate several agents through a multi-stage workflow. Each one is served as a prompt like an agent. It checks which stage outputs already exist in your project, then tells you which agent to run next and what to answer that agent's opening questions with. A runbook never runs the other agents itself, and it is read-only. See [runbooks/README.md](runbooks/README.md).

In Claude Code: `/mcp__ide-expert-agents__presales-pipeline`

<!-- generated:runbooks:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Runbook | Prompt name | Coordinates | When to use |
|---|---|---|---|
| [**Data Platform Cycle**](runbooks/data-platform-cycle.md) | `data-platform-cycle` | `repo-analyst`, `due-diligence`, `architecture-advisor`, `opportunity-scout`, `data-platform-developer`, `data-platform-validator`, `regression-monitor`, `context-keeper` | Coordinates one data-platform work cycle across the data-platform agents — repo-analyst → due-diligence → architecture-advisor → opportunity-scout → data-platform-developer ⇄ data-platform-validator → regression-monitor → context-keeper. Checks which reports exist and which ADR/OPP items are built and validated, then tells you which agent to run next and exactly what to answer its opening questions with. Read-only. Use when starting or resuming data-platform work, or when asked "what's next on the data platform" or "run the data-platform cycle". |
| [**Pre-Sales Pipeline**](runbooks/presales-pipeline.md) | `presales-pipeline` | `discovery-interview`, `explore-agentic-ai-usecases`, `elaborate`, `estimate`, `proposal`, `casestudy-drafter` | Coordinates the pre-sales agents from first conversation to client proposal — discovery-interview → elaborate → estimate → proposal, with an optional agentic-AI entry point (explore-agentic-ai-usecases) and post-delivery case studies (casestudy-drafter). Checks which stage outputs already exist, then tells you which agent to run next and exactly what to answer its opening questions with. Read-only. Use when starting or resuming a pre-sales engagement, or when asked "what's next in pre-sales" or "run the pre-sales pipeline". |
<!-- generated:runbooks:end -->

For a worked example, see the [pre-sales pipeline walkthrough](examples/presales-pipeline-walkthrough.md) in [examples/](examples/README.md).

---

## Adding a new agent

See [Adding a new agent](CONTRIBUTING.md#adding-a-new-agent) in [CONTRIBUTING.md](CONTRIBUTING.md). No changes to the MCP server code are needed.

## Security

Please report vulnerabilities privately — see [SECURITY.md](SECURITY.md).

## License

Copyright 99x. All rights reserved; contact [sachithp@99x.io](mailto:sachithp@99x.io) for permission to use.
