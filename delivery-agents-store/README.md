# Delivery Agents Store

Agents for delivery management — measuring and reporting on how well a team is delivering, independent of whether they run Scrum sprints, Kanban flow, or AI-DLC bolts.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | When to use |
|---|---|---|
| **Delivery Commitment Health Report** | `delivery-commitment-health-report` | At a sprint/bolt boundary, or whenever a delivery manager or customer wants a data-backed delivery snapshot — produces a DORA-inspired report (deployment/merge frequency, decomposed lead time, change failure rate, MTTR, commitment reliability) adapted for AI-led development, where AI-generation time and human-review time are tracked separately. Read-only |
| **Planning Helper** | `planning-helper-agent` | When an engineer wants to parallelize work — either DECOMPOSE one task/epic into the smallest independently-executable subtasks, or SCHEDULE a set of existing tasks — by mapping inter-dependencies and grouping the work into parallel execution waves. Produces a dependency graph, wave-by-wave plan, and the critical path. Read-only for source |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
