# Architect Agents Store

Agents for architecture review, system design, and deployment inspection.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | When to use |
|---|---|---|
| **Product Backend Architect** | `product-backend-architect` | When you need to design, or evolve, the backend for a product or major feature — confirms architecture drivers (scenarios, quality-attribute targets, constraints) first, then produces a backend architecture spec covering architecture style, decomposition, data architecture and migration safety, API contracts, integration/events, reliability, scalability, security and privacy, compliance, responsible usage of AI, and observability, with each decision traced to a driver. Greenfield or existing backend; read-only on code, writes only the spec |
| **Product Frontend Architect** | `product-frontend-architect` | When you need to design, or evolve, the frontend for a product or major feature — confirms architecture drivers (user scenarios, performance and accessibility targets, browser/device support, compliance requirements, constraints) first, then produces a frontend architecture spec covering rendering approach, business-logic placement (client vs BFF vs backend), module structure, state and API integration, security, privacy, compliance, performance budgets, UX-supporting architecture (accessibility, i18n, resilience states), responsible usage of AI, observability, and build/delivery, with each decision traced to a driver. Leaves UX design to the UX agents; greenfield or existing frontend; read-only on code, writes only the spec |
| **Deployment Architect** | `deployment-architect` | When you want to inspect a live cloud deployment on Azure, AWS, or GCP — authenticates via the local CLI, discovers all resources, produces an as-deployed architecture document, and runs a structured fitness assessment across performance, security, reliability, robustness, observability, and cost efficiency. Read-only, never modifies resources |
| **Agentic AI Reviewer** | `agentic-ai-reviewer` | When you want to review an agentic-AI codebase (RAG, tool-calling, conversational/support, multi-agent, ML-backed, or autopilot) against the Agentic AI Review Checklists — ISO/IEC 42001-aligned reliability, security, and best-practice controls. Reads code, config, prompts, IaC, CI, and tests, assesses every control verifiable from the repo, flags the rest for human review, and writes a single Markdown fitness report. Read-only, never modifies code |
| **Product Engineering Essentials** | `product-engineering-essentials` | When you want a shared, evidence-based picture of a repository's product-engineering foundations — assesses ten pillars (vision, domain, requirements, UX, architecture, engineering practices, DevOps, QE, security/compliance, delivery feedback loop) and produces a checklist report of what's in place, partial, or missing. Never blocks work, standalone on any repository |
| **Release Readiness Checklist** | `release-readiness-checklist` | When you want to walk through a UAT or Production release checklist item by item before a release ships — records a self-attested status and blocker/N/A note per item and produces a report. A self-attestation record, not an evidence audit; never blocks the release decision. Standalone on any repository |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
