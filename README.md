# IDE Expert Agents

A collection of expert AI agents for software engineering — covering delivery process, architecture, DevOps, coding, QA, UX, and compliance. Agents are tool-agnostic and delivered via a single MCP server that works with **Claude Code**, **Cursor**, and **GitHub Copilot**.

---

## How it works

Each agent lives as a markdown file with a YAML frontmatter header (`name`, `description`) followed by its full instruction set. An MCP server in `mcp-server/` discovers all agents at startup and exposes them as **MCP prompts** — the standard primitive that maps to slash commands in Claude Code and Cursor.

```
*-agents-store/
  <agent-name>/
    agent.md   ← instruction set + frontmatter (Claude Code style)
    SKILL.md   ← instruction set + frontmatter (Cursor style)
    *.md       ← supporting docs (auto-concatenated into the prompt)

mcp-server/    ← reads all stores, serves agents as MCP prompts
```

---

## Quickstart

**1. Build the MCP server**

```bash
cd mcp-server
npm install
npm run build
```

**2. Connect to your tool**

| Tool | Config file | Server key |
|---|---|---|
| Claude Code | `~/.claude/settings.json` | `mcpServers` |
| Cursor | `~/.cursor/mcp.json` | `mcpServers` |
| GitHub Copilot (VS Code) | `.vscode/mcp.json` | `servers` |

Add the server entry:

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "node",
      "args": ["/absolute/path/to/ide-expert-agents/mcp-server/dist/index.js"]
    }
  }
}
```

See [mcp-server/README.md](mcp-server/README.md) for tool-specific config snippets.

**3. Use an agent**

In Claude Code: `/mcp__ide-expert-agents__codebase-archaeology`

In Cursor: type `/` and search for the agent name in agent mode.

---

## Agent stores

| Store | Agents | Description |
|---|---|---|
| [idf-agents-store](idf-agents-store/README.md) | 9 | Structured software delivery — design, risk, UAT, RCA, process health, and more |
| [devops-agents-store](devops-agents-store/README.md) | 1 | Infrastructure provisioning and IaC generation |
| [architect-agents-store](architect-agents-store/README.md) | — | Architecture and system design *(coming soon)* |
| [coding-agents-store](coding-agents-store/README.md) | — | Code generation and review *(coming soon)* |
| [qa-agents-store](qa-agents-store/README.md) | — | Testing and quality assurance *(coming soon)* |
| [ux-agents-store](ux-agents-store/README.md) | — | UX design and research *(coming soon)* |
| [compliance-agents-store](compliance-agents-store/README.md) | — | Security and compliance *(coming soon)* |
| [delivery-agents-store](delivery-agents-store/README.md) | — | Delivery management *(coming soon)* |

---

## Adding a new agent

1. Create a folder in the appropriate `*-agents-store/`.
2. Add an `agent.md` (or `SKILL.md`) with at minimum:

   ```yaml
   ---
   name: my-agent
   description: One sentence describing when to invoke this agent.
   ---

   # Agent instructions here...
   ```

3. Rebuild: `npm run build` in `mcp-server/`.
4. Restart the MCP server connection in your tool — the agent appears automatically.

No changes to the MCP server code are needed.
