# Delivery Agents Store

Agents for delivery management — measuring and reporting on how well a team is delivering, independent of whether they run Scrum sprints, Kanban flow, or AI-DLC bolts.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Delivery Commitment Health Report** | `delivery-commitment-health-report` | At a sprint/bolt boundary, or whenever a delivery manager or customer wants a data-backed delivery snapshot — produces a DORA-inspired report (deployment/merge frequency, decomposed lead time, change failure rate, MTTR, commitment reliability) adapted for AI-led development, where AI-generation time and human-review time are tracked separately. Read-only |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
