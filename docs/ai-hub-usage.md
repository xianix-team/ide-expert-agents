# Track usage in AI Hub (optional)

The MCP server can report every agent invocation to [99x AI Hub](https://ai-hub.99x.io), so your team can see which agents are used, by whom, and how often. Each event carries the agent name, the user, and an id. No conversation or code is sent. Nothing is reported until you configure it.

Each agent can report to a different AI Hub node. Node ids differ from team to team, so they are kept in a private env file on your machine, never in this repo.

## 1. Get the values from your team

Your team's AI Hub admin gives you:

- the API host: `https://ai-hub-api.99x.io`
- a team API key (`ah_tm_…`)
- the node id (`nd_…`) for each agent, or one default node for all of them

Never paste the key into a chat, a ticket, or a committed file. If it is exposed, revoke it in AI Hub and create a new one.

## 2. Create the env file

Create `~/.config/ide-expert-agents/.env`, using [mcp-server/.env.example](../mcp-server/.env.example) as the template:

```bash
IDE_AGENTS_AI_HUB_BASE_URL=https://ai-hub-api.99x.io
IDE_AGENTS_AI_HUB_API_KEY=ah_tm_...
IDE_AGENTS_AI_HUB_ACTOR=you@99x.io

# Optional: receives events from any agent not listed below
IDE_AGENTS_AI_HUB_NODE_ID=nd_...

# Agent name = AI Hub node id
delivery-commitment-health-report=nd_...
owasp-security-scanner=nd_...
```

Use each agent's name exactly as it appears in the [agent stores](../README.md#agent-stores). An agent that is not listed goes to the default node, or is not reported if there is none. The file is reread on every call, so edits apply without a restart.

If you run from a local clone (Option C), you can save the file as `mcp-server/.env` instead. The server finds it there, so you can skip step 3. Git ignores that file.

## 3. Tell your IDE or CLI where the file is

Your tool starts the MCP server, so the server only sees the settings your tool gives it. Add the file's absolute path as `IDE_AGENTS_AI_HUB_ENV_FILE`; the key and the node ids stay in the file.

**Claude Code (CLI and VS Code extension):**

```bash
claude mcp add ide-expert-agents -s user \
  -e IDE_AGENTS_AI_HUB_ENV_FILE=/Users/you/.config/ide-expert-agents/.env \
  -- npx -y @99x-ai-dlc/ide-expert-agents-mcp
```

**Cursor** (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ide-expert-agents": {
      "command": "npx",
      "args": ["-y", "@99x-ai-dlc/ide-expert-agents-mcp"],
      "env": { "IDE_AGENTS_AI_HUB_ENV_FILE": "/Users/you/.config/ide-expert-agents/.env" }
    }
  }
}
```

**GitHub Copilot in VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "ide-expert-agents": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@99x-ai-dlc/ide-expert-agents-mcp"],
      "env": { "IDE_AGENTS_AI_HUB_ENV_FILE": "/Users/you/.config/ide-expert-agents/.env" }
    }
  }
}
```

Use the `env` setting as shown, not the `envFile` option that some tools offer. `envFile` loads the file as plain environment variables, and the agent-to-node lines would then be ignored.

**Team server (Option A):** you need no env file. The admin mounts it into the container (see [the Docker command](../mcp-server/README.md#point-the-server-at-the-file)). Add your identity as a header instead. In Claude Code:

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

Restart the MCP connection, or the tool, after any change.

## 4. Add token and model data (Claude Code only, optional)

A Claude Code hook can add the tokens used and the model to each event. Add this to `~/.claude/settings.json`:

```json
{
  "env": { "IDE_AGENTS_AI_HUB_ENV_FILE": "/Users/you/.config/ide-expert-agents/.env" },
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

The hook needs its own `env` entry, because the MCP server's settings don't reach hooks. Cursor and Copilot report invocations without token data.

## 5. Check that it works

Run any agent, then open your workflow's event list in AI Hub. The agent's name appears as the activity, on the node you mapped it to. If nothing arrives:

- Look in the MCP server log for `AI Hub push skipped` or `AI Hub env file not read`.
- Check that the agent's name in the file matches exactly. A misspelt name goes to the default node.
- Check that your shell doesn't export an older `IDE_AGENTS_AI_HUB_*` value. Values set in the environment override the file.

More detail, including Docker setup and every setting, is in [AI Hub usage metrics](../mcp-server/README.md#ai-hub-usage-metrics).
