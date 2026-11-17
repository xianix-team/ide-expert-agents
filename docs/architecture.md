# Architecture

How the agent stores, the MCP server, and the IDE clients fit together. For a short overview, see [How it works](../README.md#how-it-works) in the root README.

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent Stores                         │
│                                                             │
│  idf-agents-store/        devops-agents-store/    ...       │
│  ├── design-session/      ├── iac-generator/                │
│  │   └── agent.md         │   ├── SKILL.md                  │
│  ├── codebase-archaeology/│   ├── workflow.md               │
│  │   └── agent.md         │   ├── templates.md              │
│  └── ...                  │   └── examples.md               │
└─────────────────┬───────────────────────┬───────────────────┘
                  │  glob discovery       │ frontmatter parse
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                       MCP Server                            │
│                                                             │
│  dist/index.js  ← stdio transport  (local / npx)           │
│  dist/http.js   ← HTTP Streamable  (central team server)    │
│                                                             │
│  • Scans all *-agents-store/*/ on startup                   │
│  • Reads agent.md or SKILL.md (first match wins)            │
│  • Concatenates supporting *.md into the prompt body        │
│  • Exposes each agent as a named MCP Prompt                 │
└──────────┬────────────────────────┬────────────────────────┘
           │ stdio                  │ HTTP (url config)
           │ (command config)       │
           ▼                        ▼
  ┌─────────────────────┐   ┌──────────────────────┐
  │  Local / npx use    │   │  Central team server  │
  │  (Option B)         │   │  (Option A)           │
  └──────────┬──────────┘   └──────────┬───────────┘
             │                          │
             └────────────┬─────────────┘
                          │ MCP protocol
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    Claude Code         Cursor     GitHub Copilot
    (VS Code / CLI)  (agent mode)  (VS Code agent mode)
```

## Key design decisions

| Decision | Rationale |
|---|---|
| **MCP Prompts, not Tools** | Prompts are the right MCP primitive for instruction sets — they inject directly into the conversation as slash commands, with no extra input schema required |
| **Two transports, one codebase** | `index.ts` (stdio) and `http.ts` (HTTP Streamable) share the same agent loader and server factory — adding a new agent updates both delivery paths automatically |
| **HTTP Streamable, not SSE** | `StreamableHTTPServerTransport` is the current MCP spec; the older `SSEServerTransport` is deprecated as of SDK 1.x |
| **Frontmatter as the agent contract** | `name` and `description` in YAML are the only required fields — everything else is plain markdown, keeping agents easy to write and diff |
| **Supporting docs concatenated at serve time** | Multi-file agents (e.g. `iac-generator`) keep their docs split for readability but arrive at the tool as a single coherent prompt |
| **Glob discovery, no registry** | Adding a new agent folder is enough — no config file, no import, no server restart beyond a rebuild |
| **`MCP_AGENTS_ROOT` env var** | Decouples the server binary from the agent files, enabling the npm package to run against any local clone of this repo |
| **Usage metrics in the server, not in each agent** | Every invocation passes through `GetPrompt`, so AI Hub events cover all agents on every transport with no agent changes. An env file kept outside Git maps each agent to its team's node. See [AI Hub usage metrics](../mcp-server/README.md#ai-hub-usage-metrics) |
