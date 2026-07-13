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

---

## Quickstart

Three deployment options are available — choose what fits your team:

| Option | Best for | How it works |
|---|---|---|
| **A — Docker** | Shared team server (recommended) | Build once, run centrally; every developer connects via URL |
| **B — npx** | Personal use, no clone required | Published npm package runs locally via `npx` |
| **C — Local clone** | Contributors or personal use with full control | Clone the repo, build once, point your tool at the local binary |

Full setup instructions, per-tool config snippets, Docker development tips, and environment variables are in [mcp-server/README.md](mcp-server/README.md).

### Using an agent

In Claude Code: `/mcp__ide-expert-agents__codebase-archaeology`

In Cursor: type `/` and search for the agent name in agent mode.

---

## Agent stores

| Store | Agents | Description |
|---|---|---|
| [idf-agents-store](idf-agents-store/README.md) | 9 | Structured software delivery — design, risk, UAT, RCA, process health, and more |
| [devops-agents-store](devops-agents-store/README.md) | 1 | Infrastructure provisioning and IaC generation |
| [architect-agents-store](architect-agents-store/README.md) | 2 | Architecture review and cloud deployment inspection — deployment fitness assessment, agentic AI review |
| [coding-agents-store](coding-agents-store/README.md) | 2 | Code quality and targeted improvements — error handling audit, runtime debugging from logs/crashes/requirements |
| [qa-agents-store](qa-agents-store/README.md) | 1 | Testing and quality assurance — OWASP Top 10 / Top 25 Parameters static security scanning |
| [ux-agents-store](ux-agents-store/README.md) | 9 | UX design and research — persona/journey/service-blueprint/competitive-analysis/prototype generation, design-consistency auditing, design-concept generation, interaction-design review, and design-rationale documentation |
| [pre-sales-agents-store](pre-sales-agents-store/README.md) | 5 | Pre-sales pipeline — agentic AI opportunity mining, discovery interview, requirement elaboration, effort estimation, and proposal assembly |
| [data-platform-agents-store](data-platform-agents-store/README.md) | 8 | Data-platform analysis and evolution — repo analysis, due diligence, architecture advisory, opportunity scouting, implementation, validation, regression monitoring, and cycle close-out |
| [compliance-agents-store](compliance-agents-store/README.md) | 1 | AI compliance and governance — EU AI Act controls review with ISO 42001 and NIST AI RMF mapping |
| [delivery-agents-store](delivery-agents-store/README.md) | — | Delivery management *(coming soon)* |

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
