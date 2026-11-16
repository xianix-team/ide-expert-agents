# QA Agents Store

Agents for testing and quality assurance.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **OWASP Security Scanner** | `owasp-security-scanner` | When you want a static code scan against OWASP Top 10 (2025) and/or OWASP Top 25 Parameters, with the latest standards fetched live from owasp.org. You choose which scan(s) to run; the agent reports severity-ranked findings with evidence — it does not edit code |
| **Test Case Generator** | `test-case-generator` | When you want structured functional, edge, negative, and regression test cases generated from a feature spec, a git diff/PR, or both. Cases are grounded in the actual codebase and priority-ranked — it does not write or scaffold test code |
| **Epic Test Plan** | `epic-test-plan` | When you have an epic (Jira link, document, pasted text, or meeting transcript) and need its full QA documentation set — a spec-quality gate, a risk-based QA level recommendation, a test plan, an hours estimate with a scope mindmap, test cases with happy-path automation candidates, an impact analysis, and an HTML review summary. Works from the requirement only, no codebase tracing; on request it also writes a client-facing estimate justification

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
