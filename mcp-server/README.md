# IDE Expert Agents — MCP Server

An MCP server that exposes every agent in this repository as an MCP **prompt**. Connect it to Claude Code, Cursor, or GitHub Copilot and all agents become available as slash commands.

## How it works

On startup the server scans all `*-agents-store/*/` folders, reads each agent's entry file (`agent.md` or `SKILL.md`), and registers it as a named MCP prompt. Only the entry file is served by default (plus optional frontmatter `always_include: […]`). Supporting docs under `references/` and other top-level `*.md` siblings are exposed as **MCP Resources** (`agent://<prompt-name>/<path>`) so hosts can fetch them on demand — they are not eagerly concatenated into the prompt.

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
