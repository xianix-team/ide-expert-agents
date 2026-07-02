# UX Agents Store

Agents for UX analysis and design generation — design-system consistency auditing, design-concept generation, interaction-design review, and design-rationale documentation. Ported from `agent-platform`'s pre-sales/UX agents, adapted to be standalone: no external database, no engagement slugs — each agent asks for what it needs and writes its output as a file in your own project.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **Persona Builder** | `persona-builder` | Starting discovery on a client/product — generates evidence-grounded personas (or clearly-labelled proto-personas) from whatever research inputs exist |
| **Journey Mapper** | `journey-mapper` | After a persona exists — maps their end-to-end journey through one scenario (actions, thoughts, emotions, pain points, opportunities) |
| **Service Blueprint** | `service-blueprint` | After a journey map exists — extends it below the line of visibility (frontstage/backstage/support processes/failure points) |
| **Competitive Analysis** | `competitive-analysis` | Building the competitive picture for a pitch — competitor matrix, positioning, and differentiation opportunities from public research |
| **Prototype Builder** | `prototype-builder` | Need something to click through — scaffolds a clickable Vite+React+Tailwind demo with mock data in an isolated folder |
| **Design Consistency Audit** | `design-consistency-audit` | Auditing a built UI against the project's own design tokens for theme/token/contrast/a11y/spacing/UX consistency, with a gated fix mode |
| **Design Concept Lab** | `design-concept-lab` | Need a few design directions for a screen or flow — generates distinct rendered mockup variants against the project's own tokens and stops for the engineer to pick one |
| **IxD Review** | `ixd-review` | Heuristic interaction-design review of a product, flow, or prototype from screenshots, files, or a live URL — evidence-backed, prioritised recommendations |
| **Design Rationale** | `design-rationale` | After design-consistency-audit findings are resolved — turns them into a factual, customer-facing Design Decision Record |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
4. Add a row to the table above so this README stays accurate.

These agents are fully standalone — no external database, no ticket refs, no engagement slugs. Each one asks for the inputs it needs (target project, output path, design tokens, etc.) and writes its output as a plain file in your own repo.
