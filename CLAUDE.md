# IDE Expert Agents — repo instructions

This repo hosts agent definitions under `*-agents-store/<agent-name>/agent.md` (or `SKILL.md`), served via the MCP server in `mcp-server/`. See the root `README.md` for the full architecture.

## Rule: keep the catalog and README docs in sync with agent changes

The agent tables in the READMEs are **generated** — never edit them by hand. Their source of truth is [`catalog.json`](catalog.json) (store descriptions, plus each agent's display title and "When to use" text) and the frontmatter of `runbooks/*.md`.

Whenever an agent is **added**, **removed**, or **updated** (name, prompt name, description, or "when to use" changes) under any `*-agents-store/<agent-name>/` folder, in the **same change**:

1. **Update `catalog.json`**
   - Add/remove/edit the agent's entry under its store: key = the frontmatter `name` (which must match the folder name), `title`, `whenToUse`.
   - Update the store's `description` if the change alters what the store covers. If unsure, update it.
2. **Update any runbook** in `runbooks/` that lists the agent under `agents` (renamed or removed agents).
3. **Regenerate and check** — in `mcp-server/`: `npm run docs`, then `npm run check`. This rewrites the store README and root README tables (including the agent counts) and fails on any mismatch between disk, `catalog.json`, runbooks, and the READMEs. CI runs the same check on every PR.

A change that adds/removes/updates an agent without updating `catalog.json` and the regenerated READMEs is incomplete.
