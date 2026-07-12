# QA Agents Store

Agents for testing and quality assurance.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **OWASP Security Scanner** | `owasp-security-scanner` | When you want a static code scan against OWASP Top 10 (2025) and/or OWASP Top 25 Parameters, with the latest standards fetched live from owasp.org. You choose which scan(s) to run; the agent reports severity-ranked findings with evidence — it does not edit code |
| **Test Case Generator** | `test-case-generator` | When you want structured functional, edge, negative, and regression test cases generated from a feature spec, a git diff/PR, or both. Cases are grounded in the actual codebase and priority-ranked — it does not write or scaffold test code |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
