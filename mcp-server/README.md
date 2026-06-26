# IDE Expert Agents — MCP Server

An MCP server that exposes every agent in this repository as an MCP **prompt**. Connect it once to Claude Code, Cursor, or GitHub Copilot and all agents become available as slash commands — no per-project file copying required.

## How it works

On startup the server scans all `*-agents-store/*/` folders, reads each agent's entry file (`agent.md` or `SKILL.md`), and registers it as a named MCP prompt. Supporting docs in the same folder (e.g. `workflow.md`, `templates.md`) are concatenated into the prompt so the full context is always available.

## Build

```bash
cd mcp-server
npm install
npm run build        # outputs to dist/index.js
```

## Connect to your tool

### Claude Code

Add to `~/.claude/settings.json` (global) or `.claude/settings.json` (project):

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "node",
      "args": ["/absolute/path/to/repo/mcp-server/dist/index.js"]
    }
  }
}
```

Agents are then available as `/mcp__ide-expert-agents__<agent-name>` in any Claude Code session.

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "node",
      "args": ["/absolute/path/to/repo/mcp-server/dist/index.js"]
    }
  }
}
```

Agents appear as slash commands under the `ide-expert-agents` namespace in Cursor's agent mode.

### GitHub Copilot (VS Code)

Add to `.vscode/mcp.json` in any project:

```json
{
  "servers": {
    "ide-expert-agents": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/repo/mcp-server/dist/index.js"]
    }
  }
}
```

Enable in VS Code via **GitHub Copilot Chat → Agent mode → select the MCP server**.

## Available agents

Once connected, the following prompts are served:

| Prompt name | Description |
|---|---|
| `uat` | Generates a plain-language demo script and records stakeholder validation outcome |
| `design-session` | Establishes API contracts, data models, and architectural patterns as binding constraints |
| `bolt-risk-assessment` | Assesses blast radius, sequencing risks, rollback, and feature flag requirements |
| `root-cause-analysis` | Surfaces root causes across solution design, technology, and process |
| `progress-digest` | Generates a plain-language stakeholder update with no engineering jargon |
| `new-engineer-induction` | Explains the framework using the project's actual files and produces a personalised quick-reference card |
| `process-health` | Produces a quantitative health report across four delivery metrics |
| `dependency-audit` | Audits dependencies and converts findings into remediation backlog items |
| `codebase-archaeology` | Maps architecture, extracts coding patterns, audits for defects, and classifies all identified work |
| `ipa` | Scans a codebase, asks targeted questions, and generates Infrastructure-as-Code with a step-by-step approval flow |

## Adding a new agent

1. Create a folder in the appropriate `*-agents-store/` directory.
2. Add an `agent.md` (Claude Code style) or `SKILL.md` (Cursor style) with YAML frontmatter containing at minimum `name` and `description`.
3. Rebuild: `npm run build` in this folder.
4. Restart your tool's MCP server connection — the new agent appears automatically.
