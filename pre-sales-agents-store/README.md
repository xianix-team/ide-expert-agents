# Pre-Sales Agents Store

Agents for the pre-sales pipeline — discovery, scope elaboration, effort estimation, and proposal assembly. Ported from `agent-platform`'s pre-sales pipeline agents, adapted to be standalone: no external database, no ticket refs — each agent asks for what it needs and writes its output as a file in your own project.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Explore Agentic AI Use Cases** | `explore-agentic-ai-usecases` | Mining an existing product codebase for agentic AI opportunities — minimal targeted questions, then a business-reader report (problem, value, solution, spec, man-day estimate) sorted with high-value / low-effort use cases first |
| **Discovery Interview** | `discovery-interview` | Starting a new engagement or opportunity — a Socratic, one-question-at-a-time interview that resolves ambiguity before any scoping happens |
| **Elaborate** | `elaborate` | Turning a loose request into a clear, codebase-grounded requirement and scope spec before any implementation plan is written |
| **Estimate** | `estimate` | Building a 3-point (PERT) effort estimate from a requirement spec, with a client-ready estimation sheet |
| **Proposal** | `proposal` | Assembling a client-facing proposal from whatever discovery, spec, and estimate material exists |
| **Case Study Drafter** | `casestudy-drafter` | Turning a delivered codebase (single repo or multi-repo estate) into industry-class customer case studies — analyses the domain and user journeys, proposes candidate angles (flagging which need customer metrics), narrows them down with minimal structured questions, and writes one Markdown case study per selection (synopsis, problem domain, solution with optional high-level technical approach, impact), named or anonymized per run, with a post-write revise step |

This store forms a full pipeline: `discovery-interview` → `elaborate` → `estimate` → `proposal`. For agentic AI opportunities, `explore-agentic-ai-usecases` runs up front — its prioritized use cases feed `elaborate` → `estimate` → `proposal` for the selected candidates. After delivery, `casestudy-drafter` turns the shipped work into case-study collateral that feeds future `proposal` runs as proof of capability.

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
4. Add a row to the table above so this README stays accurate.

These agents are fully standalone — no external database, no ticket refs, no engagement slugs. Each one asks for the inputs it needs and writes its output as a plain file in your own repo.
