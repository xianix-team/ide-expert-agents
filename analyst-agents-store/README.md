# Analyst Agents Store

Agents for business/systems analysis — critically evaluating and strengthening requirements.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | When to use |
|---|---|---|
| **Requirement Analyzer** | `requirement-analyzer` | When a requirement or stated intent needs to be critically evaluated before it's scoped or built. Applies the Paul-Elder Critical Thinking Framework — deconstructs the requirement into its Elements of Reasoning, stress-tests each against the nine Essential Intellectual Standards, then uses the seven Intellectual Traits as a reflective pass to catch blind spots — surfacing hidden assumptions, missing viewpoints, logical gaps, and clarifying questions for the requirement's owner |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
