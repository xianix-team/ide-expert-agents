# Feature Agents Store

Agents/skills for implementing specific product features — each one packages the steps needed to build a given feature end-to-end.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **User Intent Extractor** | `user-intent-extractor` | When building an in-app AI assistant, a "tell us what you need" entry point, smart onboarding, or any surface that should map a user's intent (via chat or generated action buttons) to the product's real features/services and offer the best fit — like a salesperson — instead of routing them through a fixed UI flow. Discovers the offering catalog and designs/implements three grounding layers: the offering registry, a per-user preference memory, and a curated cross-user plot library (the recurring intent-journeys the product sees over time), feeding an embedding-similarity matching pipeline with preference/plot-aware ranking |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. The agent appears automatically on the next server restart — no other changes needed.
