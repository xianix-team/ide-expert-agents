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

To report usage to AI Hub, keep the env file on the host, outside the repo, and mount it read-only. It is never baked into the image (see [AI Hub usage metrics](#ai-hub-usage-metrics)):

```bash
docker run -d -p 3000:3000 --name ide-expert-agents \
  -v /srv/ide-expert-agents/ai-hub.env:/app/mcp-server/.env:ro \
  ide-expert-agents-mcp
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

**Claude Code** (CLI and VS Code extension):
```bash
claude mcp add --transport http -s user ide-expert-agents http://your-server:3000/mcp
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

In Claude Code, `-s user` adds the server for all your projects (it is stored in `~/.claude.json`). Claude Code does not read MCP servers from `~/.claude/settings.json`. To share a server with everyone in a project instead, use `-s project`, which writes `.mcp.json` in the project root. Keep keys and tokens out of that file.

**Claude Code** (CLI and VS Code extension):
```bash
claude mcp add -s user ide-expert-agents -- npx -y @99x-ai-dlc/ide-expert-agents-mcp
```

**Cursor** — `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x-ai-dlc/ide-expert-agents-mcp"]
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
      "args": ["-y", "@99x-ai-dlc/ide-expert-agents-mcp"]
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

Then point your tool at the local build. In Claude Code:

```bash
claude mcp add -s user ide-expert-agents -- node /absolute/path/to/ide-expert-agents/mcp-server/dist/index.js
```

In Cursor (`~/.cursor/mcp.json`) and GitHub Copilot (`.vscode/mcp.json`, under `servers` with `"type": "stdio"`):

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
| `IDE_AGENTS_AI_HUB_ENV_FILE` | `mcp-server/.env` | Path to the AI Hub env file, which holds the settings below and the agent-to-node map. See [AI Hub usage metrics](#ai-hub-usage-metrics) |
| `IDE_AGENTS_AI_HUB_BASE_URL` | *(unset)* | AI Hub API host |
| `IDE_AGENTS_AI_HUB_API_KEY` | *(unset)* | Team API key (`ah_tm_…`) or personal access token (`ah_pat_…`). Never commit it |
| `IDE_AGENTS_AI_HUB_NODE_ID` | *(unset)* | Public id of the default workflow node (`nd_…`). Receives events from every agent not in the node map |
| `IDE_AGENTS_AI_HUB_ACTOR` | *(unset)* | Who to attribute invocations to, usually your email. Options B and C only — Option A uses the `X-AI-Hub-Actor` header |
| `IDE_AGENTS_AI_HUB_ENABLED` | *(unset)* | Set to `false` to stop sending without removing the other settings |

The `IDE_AGENTS_AI_HUB_*` settings can go in the env file instead of the environment. When both set one, the environment wins.

---

## AI Hub usage metrics

The server pushes one event to [99x AI Hub](https://ai-hub.99x.io) each time an agent is invoked, covering every agent on all three deployment options. No agent needs any change, and new agents are reported automatically.

Each event contains only the agent name (as the activity), the actors, and a new `correlationId`. Conversation and repository data are never sent. Metrics are off unless the base URL, the API key, and at least one node are set, and a failed push never affects the prompt: the server logs one line to stderr and continues.

### Set up AI Hub once

1. In AI Hub, create or pick the team and create a team API key.
2. Create a workflow with a node for each group of agents you want to track, and copy each node's public id (`nd_…`).
3. Use the API host, `https://ai-hub-api.99x.io`, as the base URL. The web app at `https://ai-hub.99x.io` rejects these requests with HTTP 405.

### Create the env file

Copy [`.env.example`](.env.example) and fill it in. It holds the AI Hub settings and maps each agent to its node:

```bash
IDE_AGENTS_AI_HUB_BASE_URL=https://ai-hub-api.99x.io
IDE_AGENTS_AI_HUB_API_KEY=ah_tm_...
IDE_AGENTS_AI_HUB_ACTOR=you@99x.io

# Optional: receives events from every agent not listed below
IDE_AGENTS_AI_HUB_NODE_ID=nd_default

# Agent name = AI Hub node id
delivery-commitment-health-report=nd_abc123
parallel-execution-planner=nd_abc123
owasp-security-scanner=nd_def456
```

Keys starting with `IDE_AGENTS_` are settings. Every other key is an agent name, exactly as it appears in the agent's `name` frontmatter. Node ids change from team to team, so they live only in this file, never in an agent.

On each invocation, the server looks up the agent's name and posts to that node. An agent that is not listed goes to `IDE_AGENTS_AI_HUB_NODE_ID`, or is not sent when that is unset. The file is read on every call, so edits apply without a restart. The API key must be allowed to post to every node in the file.

`mcp-server/.env` is gitignored, and is never part of the npm package or the Docker image. Never commit the filled-in file.

### Point the server at the file

**Option C (local clone):** save it as `mcp-server/.env`. The server finds it there, so no tool config changes are needed.

**Option B (npx):** save it anywhere outside the repo, for example `~/.config/ide-expert-agents/.env`, and pass the path. In Claude Code:

```bash
claude mcp add -s user ide-expert-agents \
  -e IDE_AGENTS_AI_HUB_ENV_FILE=/Users/you/.config/ide-expert-agents/.env \
  -- npx -y @99x-ai-dlc/ide-expert-agents-mcp
```

In Cursor (`~/.cursor/mcp.json`), and in GitHub Copilot (`.vscode/mcp.json`, under `servers` with `"type": "stdio"`):

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x-ai-dlc/ide-expert-agents-mcp"],
      "env": {
        "IDE_AGENTS_AI_HUB_ENV_FILE": "/Users/you/.config/ide-expert-agents/.env"
      }
    }
  }
}
```

**Option A (Docker):** keep the file on the host, outside the repo, and mount it read-only at `/app/mcp-server/.env`:

```bash
docker run -d -p 3000:3000 --name ide-expert-agents \
  -v /srv/ide-expert-agents/ai-hub.env:/app/mcp-server/.env:ro \
  ide-expert-agents-mcp
```

To mount it somewhere else, point the server at it with `IDE_AGENTS_AI_HUB_ENV_FILE`:

```bash
docker run -d -p 3000:3000 --name ide-expert-agents \
  -v /srv/ide-expert-agents:/config:ro \
  -e IDE_AGENTS_AI_HUB_ENV_FILE=/config/ai-hub.env \
  ide-expert-agents-mcp
```

The file is read on every call, so edits on the host apply without restarting the container. If you edit it with a tool that replaces the file (most editors do), a single-file mount keeps showing the old copy. Mount the directory, as in the second command, or restart the container.

Leave out `IDE_AGENTS_AI_HUB_ACTOR`; each developer adds a header to their tool config instead. In Claude Code:

```bash
claude mcp add --transport http -s user ide-expert-agents http://your-server:3000/mcp \
  --header "X-AI-Hub-Actor: you@99x.io"
```

In Cursor (`~/.cursor/mcp.json`), and in GitHub Copilot (`.vscode/mcp.json`, under `servers` with `"type": "http"`):

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

If you named a file with `IDE_AGENTS_AI_HUB_ENV_FILE` and it can't be read, the server logs an `AI Hub env file not read` line and sends nothing unless the environment holds the settings.

### Verify

Invoke any agent, then open the workflow's event list in AI Hub. The agent name appears as the activity. If nothing arrives, check the MCP server log for an `AI Hub push skipped` line. No line at all usually means the server did not find the env file, or the agent is not in it and no default node is set.

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
            "command": "npx -y -p @99x-ai-dlc/ide-expert-agents-mcp ide-expert-agents-usage-hook",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

For a local clone, use `node /absolute/path/to/mcp-server/dist/usage-hook.js` as the command; it reads `mcp-server/.env` like the server does. With npx, add the same path to the `env` block of `settings.json`, because an `env` block in the MCP server config does not reach hooks:

```json
{ "env": { "IDE_AGENTS_AI_HUB_ENV_FILE": "/Users/you/.config/ide-expert-agents/.env" } }
```

On Option A, the agents run on the server but the hook runs on your machine, so you also need a copy of the env file locally.

When metrics are on, the server adds a short HTML comment with a run id to each prompt. After each Claude Code turn, the hook finds the latest run id in the local session log, adds up the usage since its last check, and sends it under the same `correlationId` as the invocation, to the same node. It sends only the totals, not the log contents, and keeps its position in `~/.cache/ide-expert-agents/`.

| Dimension | Value | Accuracy |
|---|---|---|
| `tokens` | Input, output, and cache-write tokens. Cache reads are left out because they would dwarf the real work in long sessions | Exact per message |
| `model` | The model that used the most tokens in that push | Exact |

A run stays open until the next agent is invoked, so other work later in the same session counts towards it. Each turn sends its own usage, so one run can produce several events with the same `correlationId`. `costUsd` is not sent.

---

## Adding a new agent

1. Create a folder in the appropriate `*-agents-store/` directory.
2. Add an `agent.md` (or `SKILL.md`) with YAML frontmatter containing `name` and `description`. To send its events to a specific AI Hub node, add it to your [node map](#create-the-env-file).
3. Rebuild: `npm run build`.
4. For Option A: redeploy (rebuild the image — new stores are picked up automatically, no Dockerfile edit needed). For Option B: publish a new version. For local clone: restart the MCP connection.

---

## Companion MCP servers

Several agents in this repository are designed to push their output to Jira and Confluence. This is enabled by connecting the **Atlassian MCP server** alongside this one — no changes to this repo are required.

### Atlassian MCP server

Atlassian publishes an official MCP server that exposes Jira and Confluence as callable tools. Once connected, agents will automatically offer to create tickets, update pages, and sync findings.

**Prerequisites:** An Atlassian API token — generate one at your Atlassian account security settings.

Add the server alongside this one in your tool config:

**Claude Code** (CLI and VS Code extension):
```bash
claude mcp add -s user atlassian \
  -e ATLASSIAN_URL=https://your-org.atlassian.net \
  -e ATLASSIAN_USERNAME=your@email.com \
  -e ATLASSIAN_API_TOKEN=your-api-token \
  -- npx -y @atlassian/mcp-atlassian
```

**Cursor** — `~/.cursor/mcp.json`:
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

**GitHub Copilot** — `.vscode/mcp.json`: the same `atlassian` block, added under `servers` alongside the existing `ide-expert-agents` entry. Don't commit a `.vscode/mcp.json` that contains your token.

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
