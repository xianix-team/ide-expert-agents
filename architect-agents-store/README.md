# Architect Agents Store

Agents for architecture review, system design, and deployment inspection.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Deployment Architect** | `deployment-architect` | When you want to inspect a live cloud deployment on Azure or AWS — authenticates via the local CLI, discovers all resources, produces an as-deployed architecture document, and runs a structured fitness assessment across performance, security, reliability, robustness, observability, and cost efficiency. Read-only, never modifies resources |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
