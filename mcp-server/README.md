# IDE Expert Agents — MCP Server

An MCP server that exposes every agent in this repository as an MCP **prompt**. Connect it to Claude Code, Cursor, or GitHub Copilot and all agents become available as slash commands.

## How it works

On startup the server scans all `*-agents-store/*/` folders, reads each agent's entry file (`agent.md` or `SKILL.md`), and registers it as a named MCP prompt. Supporting docs in the same folder (e.g. `workflow.md`, `templates.md`) are concatenated into the prompt so the full context is always available.

The server exposes two entry points:

| Entry point | Transport | Use when |
|---|---|---|
| `dist/index.js` | stdio | Local use or `npx` (Option B) |
| `dist/http.js` | HTTP Streamable | Central shared server (Option A) |

---

## Option A — Docker (central team server, recommended)

Run once on a shared host; every team member connects via URL — no local install or build step per developer.

### Build and run

From the **repository root**:

```bash
docker build -t ide-expert-agents-mcp .
docker run -d -p 3000:3000 --name ide-expert-agents ide-expert-agents-mcp
```

> **After adding new agents:** agent files are baked into the image at build time — rebuild and replace the container.
> ```bash
> docker build --no-cache -t ide-expert-agents-mcp .
> docker rm -f ide-expert-agents
> docker run -d -p 3000:3000 --name ide-expert-agents ide-expert-agents-mcp
> ```
>
> **During local development** (skip rebuilds): mount the repo as a read-only volume so the server picks up agent file changes live:
> ```bash
> docker run -d -p 3000:3000 --name ide-expert-agents \
>   -e MCP_AGENTS_ROOT=/repo \
>   -v $(pwd):/repo:ro \
>   ide-expert-agents-mcp
> ```

### Without Docker (run directly)

```bash
cd mcp-server
npm install
npm run build
npm run start:http        # default port 3000
PORT=8080 npm run start:http
```

### Team member config

Once deployed, each developer adds the server URL to their tool config — no `node` or local path needed.

**Claude Code** — `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "url": "http://your-server:3000/mcp"
    }
  }
}
```

**Cursor** — `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "url": "http://your-server:3000/mcp"
    }
  }
}
```

**GitHub Copilot (VS Code)** — `.vscode/mcp.json`:
```json
{
  "servers": {
    "ide-expert-agents": {
      "type": "http",
      "url": "http://your-server:3000/mcp"
    }
  }
}
```

---

## Option B — npx / npm package (per-developer, no server required)

Publish once to npm (private registry or GitHub Packages). Each developer runs the server locally via `npx` — **no clone, no build step, no Docker, and no local agent files needed.** `npm run build` bakes a copy of every `*-agents-store/` into `dist/agents-bundle/` (see `scripts/postbuild.mjs`), so the published package is fully self-contained.

### Publish

```bash
cd mcp-server
npm run build     # also bundles the agent stores into dist/agents-bundle/
npm publish --access restricted   # private registry
```

### Developer config

No `MCP_AGENTS_ROOT` needed — the package ships its own copy of the agents.

**Claude Code** — `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x/ide-expert-agents-mcp"]
    }
  }
}
```

**Cursor** — `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x/ide-expert-agents-mcp"]
    }
  }
}
```

**GitHub Copilot (VS Code)** — `.vscode/mcp.json`:
```json
{
  "servers": {
    "ide-expert-agents": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@99x/ide-expert-agents-mcp"]
    }
  }
}
```

> **Using a fork or private agent set instead of the bundled agents?** Set `MCP_AGENTS_ROOT` to a local clone's path in the `env` block above — it always takes priority over the bundled copy. This is also how to pick up agent changes without waiting for a new npm publish.
>
> **Keeping the published package in sync:** the bundle is a snapshot taken at `npm run build` time — republish (`npm version` + `npm publish`) whenever agents change, the same as any other npm package.

---

## Option C — Local clone (contributors / full control)

If you have the repo cloned and want to connect directly without Docker or npm publish:

```bash
cd mcp-server
npm install
npm run build
```

Then use the local path in your tool config:

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

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `MCP_AGENTS_ROOT` | *(unset)* | Explicit override pointing at a directory containing `*-agents-store/` folders. If unset, the server looks for a real repo checkout two directories above `dist/`, then falls back to the bundled `dist/agents-bundle/` shipped in the npm package |
| `PORT` | `3000` | HTTP port (Option A only) |
| `IDE_AGENTS_AI_HUB_BASE_URL` | *(unset)* | AI Hub API host. See [AI Hub usage metrics](#ai-hub-usage-metrics) |
| `IDE_AGENTS_AI_HUB_API_KEY` | *(unset)* | Team API key (`ah_tm_…`) or personal access token (`ah_pat_…`). Never commit it |
| `IDE_AGENTS_AI_HUB_NODE_ID` | *(unset)* | Public id of the workflow node that receives events (`nd_…`) |
| `IDE_AGENTS_AI_HUB_ACTOR` | *(unset)* | Who to attribute invocations to, usually your email. Options B and C only — Option A uses the `X-AI-Hub-Actor` header |
| `IDE_AGENTS_AI_HUB_ENABLED` | *(unset)* | Set to `false` to stop sending without removing the other variables |

---

## AI Hub usage metrics

The server pushes one event to [99x AI Hub](https://ai-hub.99x.io) each time an agent is invoked, covering every agent on all three deployment options. No agent needs any change, and new agents are reported automatically.

Each event contains only the agent name (as the activity), the actors, and a new `correlationId`. Conversation and repository data are never sent. Metrics are off unless the base URL, API key, and node id are all set, and a failed push never affects the prompt: the server logs one line to stderr and continues.

### Set up AI Hub once

1. In AI Hub, create or pick the team and create a team API key.
2. Create a workflow with one node for expert agents, and copy its public id (`nd_…`).
3. Use the API host, `https://ai-hub-api.99x.io`, as the base URL. The web app at `https://ai-hub.99x.io` rejects these requests with HTTP 405.

### Configure the server

**Option A:** set the base URL, API key, and node id on the container. Each developer adds a header to their tool config, for example in Claude Code:

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "url": "http://your-server:3000/mcp",
      "headers": { "X-AI-Hub-Actor": "you@99x.io" }
    }
  }
}
```

**Options B and C:** each developer needs the four variables in the environment of the server process, not just their terminal:

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x/ide-expert-agents-mcp"],
      "env": {
        "IDE_AGENTS_AI_HUB_BASE_URL": "${IDE_AGENTS_AI_HUB_BASE_URL:-}",
        "IDE_AGENTS_AI_HUB_API_KEY": "${IDE_AGENTS_AI_HUB_API_KEY:-}",
        "IDE_AGENTS_AI_HUB_NODE_ID": "${IDE_AGENTS_AI_HUB_NODE_ID:-}",
        "IDE_AGENTS_AI_HUB_ACTOR": "${IDE_AGENTS_AI_HUB_ACTOR:-}"
      }
    }
  }
}
```

Export the values from your shell profile. The `${VAR:-}` syntax above is for Claude Code, and the empty default keeps the config valid for anyone who has not set the variable. In `.vscode/mcp.json`, use `${env:VAR}`. Never put the key itself in a config file that is committed.

> Tools started from the Dock or Start menu may not see variables from your shell profile. If no events arrive, restart the tool from a terminal to check.

Restart the MCP connection after changing any of these values.

### Verify

Invoke any agent, then open the workflow's event list in AI Hub. The agent name appears as the activity. If nothing arrives, check the MCP server log for an `AI Hub push skipped` line. No line at all usually means the variables did not reach the server process.

### Add token and model data (Claude Code only)

The server never sees token usage, so invocation events carry no dimensions. In Claude Code, an optional hook adds them. Cursor and Copilot keep sending invocation events without dimensions.

Add this to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx -y -p @99x/ide-expert-agents-mcp ide-expert-agents-usage-hook",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

For a local clone, use `node /absolute/path/to/mcp-server/dist/usage-hook.js` as the command. On Option A, the agents run on the server but the hook runs on your machine, so you also need the variables locally.

The hook needs the variables in Claude Code's own environment, so set them in your shell profile or in the `env` block of `settings.json`. An `env` block in the MCP server config does not reach hooks.

When metrics are on, the server adds a short HTML comment with a run id to each prompt. After each Claude Code turn, the hook finds the latest run id in the local session log, adds up the usage since its last check, and sends it under the same `correlationId` as the invocation. It sends only the totals, not the log contents, and keeps its position in `~/.cache/ide-expert-agents/`.

| Dimension | Value | Accuracy |
|---|---|---|
| `tokens` | Input, output, and cache-write tokens. Cache reads are left out because they would dwarf the real work in long sessions | Exact per message |
| `model` | The model that used the most tokens in that push | Exact |

A run stays open until the next agent is invoked, so other work later in the same session counts towards it. Each turn sends its own usage, so one run can produce several events with the same `correlationId`. `costUsd` is not sent.

---

## Adding a new agent

1. Create a folder in the appropriate `*-agents-store/` directory.
2. Add an `agent.md` (or `SKILL.md`) with YAML frontmatter containing `name` and `description`.
3. Rebuild: `npm run build`.
4. For Option A: redeploy (rebuild the image — new stores are picked up automatically, no Dockerfile edit needed). For Option B: publish a new version. For local clone: restart the MCP connection.

---

## Companion MCP servers

Several agents in this repository are designed to push their output to Jira and Confluence. This is enabled by connecting the **Atlassian MCP server** alongside this one — no changes to this repo are required.

### Atlassian MCP server

Atlassian publishes an official MCP server that exposes Jira and Confluence as callable tools. Once connected, agents will automatically offer to create tickets, update pages, and sync findings.

**Prerequisites:** An Atlassian API token — generate one at your Atlassian account security settings.

Add the server alongside this one in your tool config:

**Claude Code** — `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": { "...": "..." },
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@atlassian/mcp-atlassian"],
      "env": {
        "ATLASSIAN_URL": "https://your-org.atlassian.net",
        "ATLASSIAN_USERNAME": "your@email.com",
        "ATLASSIAN_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

**Cursor** — `~/.cursor/mcp.json` and **GitHub Copilot** — `.vscode/mcp.json`: same `atlassian` block added alongside the existing `ide-expert-agents` entry.

> Verify the exact package name and tool names from Atlassian's official MCP documentation — the server is actively maintained and details may change.

**Agents that use Atlassian tools when the server is connected:**

| Agent | Jira | Confluence |
|---|---|---|
| `bolt-risk-assessment` | Creates a risk ticket per bolt | — |
| `design-session` | — | Publishes design decisions as a page |
| `uat` | Updates the intent issue with UAT outcome | Publishes UAT report |
| `root-cause-analysis` | Creates improvement/incident tickets | Publishes RCA page |
| `dependency-audit` | Creates a remediation ticket per finding | — |
| `progress-digest` | — | Updates the intent's progress page |
