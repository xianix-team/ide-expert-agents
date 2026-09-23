# Architect Agents Store

Agents for architecture review, system design, and deployment inspection.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Deployment Architect** | `deployment-architect` | When you want to inspect a live cloud deployment on Azure, AWS, or GCP — authenticates via the local CLI, discovers all resources, produces an as-deployed architecture document, and runs a structured fitness assessment across performance, security, reliability, robustness, observability, and cost efficiency. Read-only, never modifies resources |
| **Agentic AI Reviewer** | `agentic-ai-reviewer` | When you want to review an agentic-AI codebase (RAG, tool-calling, conversational/support, multi-agent, ML-backed, or autopilot) against the Agentic AI Review Checklists — ISO/IEC 42001-aligned reliability, security, and best-practice controls. Reads code, config, prompts, IaC, CI, and tests, assesses every control verifiable from the repo, flags the rest for human review, and writes a single Markdown fitness report. Read-only, never modifies code |
| **Product Engineering Essentials** | `product-engineering-essentials` | When you want a shared, evidence-based picture of a repository's product-engineering foundations — assesses ten pillars (vision, domain, requirements, UX, architecture, engineering practices, DevOps, QE, security/compliance, delivery feedback loop) and produces a checklist report of what's in place, partial, or missing. Never blocks work, standalone on any repository |
| **Release Readiness Checklist** | `release-readiness-checklist` | When you want to walk through a UAT or Production release checklist item by item before a release ships — records a self-attested status and blocker/N/A note per item and produces a report. A self-attestation record, not an evidence audit; never blocks the release decision. Standalone on any repository |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
