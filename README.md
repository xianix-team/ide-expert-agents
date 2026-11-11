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

## Architecture

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

### Key design decisions

| Decision | Rationale |
|---|---|
| **MCP Prompts, not Tools** | Prompts are the right MCP primitive for instruction sets — they inject directly into the conversation as slash commands, with no extra input schema required |
| **Two transports, one codebase** | `index.ts` (stdio) and `http.ts` (HTTP Streamable) share the same agent loader and server factory — adding a new agent updates both delivery paths automatically |
| **HTTP Streamable, not SSE** | `StreamableHTTPServerTransport` is the current MCP spec; the older `SSEServerTransport` is deprecated as of SDK 1.x |
| **Frontmatter as the agent contract** | `name` and `description` in YAML are the only required fields — everything else is plain markdown, keeping agents easy to write and diff |
| **Supporting docs concatenated at serve time** | Multi-file agents (e.g. `iac-generator`) keep their docs split for readability but arrive at the tool as a single coherent prompt |
| **Glob discovery, no registry** | Adding a new agent folder is enough — no config file, no import, no server restart beyond a rebuild |
| **`MCP_AGENTS_ROOT` env var** | Decouples the server binary from the agent files, enabling the npm package to run against any local clone of this repo |
| **Usage metrics in the server, not in each agent** | Every invocation passes through `GetPrompt`, so AI Hub events cover all agents on every transport with no agent changes. An env file kept outside Git maps each agent to its team's node. See [AI Hub usage metrics](mcp-server/README.md#ai-hub-usage-metrics) |

---

## Quickstart

Three deployment options are available — choose what fits your team:

| Option | Best for | How it works |
|---|---|---|
| **A — Docker** | Shared team server (recommended) | Build once, run centrally; every developer connects via URL |
| **B — npx** | Personal use, no clone required | Public npm package [`@99x-ai-dlc/ide-expert-agents-mcp`](https://www.npmjs.com/package/@99x-ai-dlc/ide-expert-agents-mcp) (in the [`99x-ai-dlc`](https://www.npmjs.com/org/99x-ai-dlc) npm org) runs locally via `npx` |
| **C — Local clone** | Contributors or personal use with full control | Clone the repo, build once, point your tool at the local binary |

Full setup instructions, per-tool config snippets, Docker development tips, and environment variables are in [mcp-server/README.md](mcp-server/README.md).

### Using an agent

In Claude Code: `/mcp__ide-expert-agents__codebase-archaeology`

In Cursor: type `/` and search for the agent name in agent mode.

---

## Track usage in AI Hub (optional)

The MCP server can report every agent invocation to [99x AI Hub](https://ai-hub.99x.io), so your team can see which agents are used, by whom, and how often. Each event carries the agent name, the user, and an id. No conversation or code is sent. Nothing is reported until you configure it.

Each agent can report to a different AI Hub node. Node ids differ from team to team, so they are kept in a private env file on your machine, never in this repo.

### 1. Get the values from your team

Your team's AI Hub admin gives you:

- the API host: `https://ai-hub-api.99x.io`
- a team API key (`ah_tm_…`)
- the node id (`nd_…`) for each agent, or one default node for all of them

Never paste the key into a chat, a ticket, or a committed file. If it is exposed, revoke it in AI Hub and create a new one.

### 2. Create the env file

Create `~/.config/ide-expert-agents/.env`, using [mcp-server/.env.example](mcp-server/.env.example) as the template:

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

Use each agent's name exactly as it appears in the [agent stores](#agent-stores). An agent that is not listed goes to the default node, or is not reported if there is none. The file is reread on every call, so edits apply without a restart.

If you run from a local clone (Option C), you can save the file as `mcp-server/.env` instead. The server finds it there, so you can skip step 3. Git ignores that file.

### 3. Tell your IDE or CLI where the file is

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

**Team server (Option A):** you need no env file. The admin mounts it into the container (see [the Docker command](mcp-server/README.md#point-the-server-at-the-file)). Add your identity as a header instead. In Claude Code:

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

### 4. Add token and model data (Claude Code only, optional)

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

### 5. Check that it works

Run any agent, then open your workflow's event list in AI Hub. The agent's name appears as the activity, on the node you mapped it to. If nothing arrives:

- Look in the MCP server log for `AI Hub push skipped` or `AI Hub env file not read`.
- Check that the agent's name in the file matches exactly. A misspelt name goes to the default node.
- Check that your shell doesn't export an older `IDE_AGENTS_AI_HUB_*` value. Values set in the environment override the file.

More detail, including Docker setup and every setting, is in [AI Hub usage metrics](mcp-server/README.md#ai-hub-usage-metrics).

---

## Agent stores

| Store | Agents | Description |
|---|---|---|
| [idf-agents-store](idf-agents-store/README.md) | 9 | Structured software delivery — design, risk, UAT, RCA, process health, and more |
| [devops-agents-store](devops-agents-store/README.md) | 1 | Infrastructure provisioning and IaC generation |
| [architect-agents-store](architect-agents-store/README.md) | 4 | Architecture review and cloud deployment inspection — deployment fitness assessment, agentic AI review, product-engineering foundations checklist, and release readiness checklist |
| [coding-agents-store](coding-agents-store/README.md) | 5 | Code quality and targeted improvements — error handling audit, runtime debugging from logs/crashes/requirements, observability implementation (logging/metrics/tracing) with cost guardrails, authentication/authorization implementation mapped to OWASP ASVS / NIST guidance, and behavior-preserving code cleanup for vibe-coded / overgrown codebases |
| [qa-agents-store](qa-agents-store/README.md) | 2 | Testing and quality assurance — OWASP Top 10 / Top 25 Parameters static security scanning, and structured test case generation from specs/diffs |
| [ux-agents-store](ux-agents-store/README.md) | 9 | UX design and research — persona/journey/service-blueprint/competitive-analysis/prototype generation, design-consistency auditing, design-concept generation, interaction-design review, and design-rationale documentation |
| [pre-sales-agents-store](pre-sales-agents-store/README.md) | 6 | Pre-sales pipeline — agentic AI opportunity mining, discovery interview, requirement elaboration, effort estimation, proposal assembly, and case-study drafting from delivered codebases |
| [data-platform-agents-store](data-platform-agents-store/README.md) | 8 | Data-platform analysis and evolution — repo analysis, due diligence, architecture advisory, opportunity scouting, implementation, validation, regression monitoring, and cycle close-out |
| [compliance-agents-store](compliance-agents-store/README.md) | 1 | AI compliance and governance — EU AI Act controls review with ISO 42001 and NIST AI RMF mapping |
| [delivery-agents-store](delivery-agents-store/README.md) | 2 | Delivery management — DORA-inspired commitment health reporting, and parallel-execution planning (dependency mapping + wave scheduling), adapted for AI-led development |
| [feature-agents-store](feature-agents-store/README.md) | 1 | Feature implementation — skills for building specific product features end-to-end, e.g. an AI "digital salesperson" that maps user intent (chat + generated action buttons) to the product's real features/services, with per-user preference memory and a cross-user plot library |
| [analyst-agents-store](analyst-agents-store/README.md) | 1 | Business/systems analysis — critically evaluating requirements against the Paul-Elder Critical Thinking Framework before they're scoped or built |

---

## Adding a new agent

> **⚠️ Customer IP notice:** Agents and skills in this repository are shared publicly across teams. Contributors must ensure content is **generic and reusable** — do not include any customer-specific data, proprietary business logic, confidential architecture details, credentials, or other protected intellectual property belonging to a 99x customer. If an agent was inspired by client work, generalize it (naming, examples, domain specifics) before contributing it here. When in doubt, leave it out and check with your engagement lead.

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
