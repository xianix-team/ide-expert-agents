# Coding Agents Store

Agents for code quality, review, and targeted code improvements.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Error Handling Audit** | `error-handling-audit` | When you want to inspect code for incorrect, missing, or poorly structured error handling — covers empty catch blocks, swallowed exceptions, missing async guards, lost error context, and unsafe cleanup patterns. Finds issues and applies fixes after approval |
| **Runtime Debugger** | `runtime-debugger` | When you have a real bug in hand — debug logs, crash logs/stack traces, requirement docs, and/or your own observation of expected vs. actual behavior — and want help going from symptom to root cause to an approved fix |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
