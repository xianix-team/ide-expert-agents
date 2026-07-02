# Pre-Sales Agents Store

Agents for the pre-sales pipeline — discovery, scope elaboration, effort estimation, and proposal assembly. Ported from `agent-platform`'s pre-sales pipeline agents, adapted to be standalone: no external database, no ticket refs — each agent asks for what it needs and writes its output as a file in your own project.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Discovery Interview** | `discovery-interview` | Starting a new engagement or opportunity — a Socratic, one-question-at-a-time interview that resolves ambiguity before any scoping happens |
| **Elaborate** | `elaborate` | Turning a loose request into a clear, codebase-grounded requirement and scope spec before any implementation plan is written |
| **Estimate** | `estimate` | Building a 3-point (PERT) effort estimate from a requirement spec, with a client-ready estimation sheet |
| **Proposal** | `proposal` | Assembling a client-facing proposal from whatever discovery, spec, and estimate material exists |

This store forms a full pipeline: `discovery-interview` → `elaborate` → `estimate` → `proposal`.

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
4. Add a row to the table above so this README stays accurate.

These agents are fully standalone — no external database, no ticket refs, no engagement slugs. Each one asks for the inputs it needs and writes its output as a plain file in your own repo.
