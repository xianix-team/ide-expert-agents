# Compliance Agents Store

Agents for AI governance, regulatory fitness, and control assessment.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

| Agent | Prompt name | When to use |
|---|---|---|
| **EU AI Act Controls Reviewer** | `eu-ai-act-controls-reviewer` | When you want to review an agentic-AI code repository for fitness against the **EU AI Act**, with every requirement cross-mapped to **ISO/IEC 42001** Annex A controls and the **NIST AI RMF** functions. Determines the likely EU AI Act risk tier, assesses each obligation verifiable from code/config/prompts/IaC/CI/tests, flags organisational and legal items for a human, and writes a single Markdown fitness report. Read-only. A control-fitness and gap-analysis aid — not legal advice or a formal conformity assessment |

---

## Adding an agent

1. Create a folder here with an `agent.md` file containing `name` and `description` in YAML frontmatter.
2. (Optional) Split the control set into modular `controls-NN-<id>.md` files in the agent folder — they are auto-concatenated into the prompt, so new obligation areas or frameworks are drop-in. Keep authoring templates in a `templates/` subfolder (not concatenated).
3. Rebuild the MCP server (`npm run build` in `mcp-server/`).
4. The agent appears automatically on the next server restart — no other changes needed.
