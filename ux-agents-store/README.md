# UX Agents Store

Agents for UX analysis and design generation — design-system consistency auditing, design-concept generation, interaction-design review, and design-rationale documentation. Ported from `agent-platform`'s pre-sales/UX agents, adapted to be standalone: no external database, no engagement slugs — each agent asks for what it needs and writes its output as a file in your own project.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **Persona Builder** | `persona-builder` | High | Medium | Starting discovery on a client/product — generates evidence-grounded personas (or clearly-labelled proto-personas) from whatever research inputs exist |
| **Journey Mapper** | `journey-mapper` | High | Medium | After a persona exists — maps their end-to-end journey through one scenario (actions, thoughts, emotions, pain points, opportunities) |
| **Service Blueprint** | `service-blueprint` | High | Medium | After a journey map exists — extends it below the line of visibility (frontstage/backstage/support processes/failure points) |
| **Competitive Analysis** | `competitive-analysis` | High | Medium | Building the competitive picture for a pitch — competitor matrix, positioning, and differentiation opportunities from public research |
| **Prototype Builder** | `prototype-builder` | High | Low | Need something to click through — scaffolds a clickable Vite+React+Tailwind demo with mock data in an isolated folder |
| **Design Consistency Audit** | `design-consistency-audit` | High | Medium | Auditing a built UI against the project's own design tokens for theme/token/contrast/a11y/spacing/UX consistency, with a gated fix mode |
| **Design Concept Lab** | `design-concept-lab` | Medium | High | Need a few design directions for a screen or flow — generates distinct rendered mockup variants against the project's own tokens and stops for the engineer to pick one |
| **IxD Review** | `ixd-review` | High | Medium | Heuristic interaction-design review of a product, flow, or prototype from screenshots, files, or a live URL — evidence-backed, prioritised recommendations |
| **Design Rationale** | `design-rationale` | High | Medium | After design-consistency-audit findings are resolved — turns them into a factual, customer-facing Design Decision Record |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.

These agents are fully standalone — no external database, no ticket refs, no engagement slugs. Each one asks for the inputs it needs (target project, output path, design tokens, etc.) and writes its output as a plain file in your own repo.
