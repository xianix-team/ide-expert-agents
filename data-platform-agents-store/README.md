# Data Platform Agents Store

Agents for analyzing and evolving a data platform — repository/warehouse discovery, health auditing, architecture advisory, opportunity scouting, implementation, independent validation, regression monitoring, and cycle close-out. Ported from `agent-platform`'s data-platform pipeline agents (originally built for a Microsoft Fabric/Medallion-architecture project), adapted to be standalone and platform-agnostic: no external database, no `agents/context/` tree — each agent asks which platform/warehouse you're using and writes its output as a file in your own project.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **Repo Analyst** | `repo-analyst` | High | Low | Onboarding into an unfamiliar data platform, or starting any analysis pipeline — builds a structured knowledge graph of schema, pipelines, and lineage, cross-referenced against documentation |
| **Due Diligence** | `due-diligence` | High | Medium | Periodic health audit, or onboarding into an unfamiliar data platform — audits security & access, data quality & integrity, GDPR & compliance, pipeline reliability, and architecture consistency, producing evidence-backed findings with severity. Read-only |
| **Architecture Advisor** | `architecture-advisor` | High | High | After a due-diligence audit surfaces architectural or structural problems — proposes formal Architecture Decision Records (ADRs) applying data-engineering best practices. Read-only, never implements |
| **Opportunity Scout** | `opportunity-scout` | High | Medium | Scoping what to build next on a data platform, after due-diligence/architecture work — compares business/BI requirements against the current schema to identify missing views, fact tables, and dimensions, and turns gaps into a prioritised backlog. Read-only |
| **Data Platform Developer** | `data-platform-developer` | Medium | Medium | Implementing one approved opportunity or ADR end to end — creates or changes schema and pipeline code with human checkpoints and mandatory idempotency |
| **Data Platform Validator** | `data-platform-validator` | High | Medium | Independently reviewing a completed data-platform change against its approved opportunity or ADR before merge, with evidence-backed approve/reject findings |
| **Regression Monitor** | `regression-monitor` | High | Low | Periodically comparing current platform state against an established baseline to report schema drift, undocumented pipeline changes, and data-quality degradation |
| **Context Keeper** | `context-keeper` | High | Low | Closing out a completed data-platform work cycle with a plain-language summary of what changed, current state, open follow-ups, and recommended next steps |
<!-- generated:agents:end -->

This store now covers the full analyze → audit → advise → scout → build → validate → monitor → close-out pipeline.

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.

These agents are fully standalone — no external database, no ticket refs, no `agents/context/` tree. Each one asks which data platform/warehouse you're using and writes its output as a plain file in your own repo.
