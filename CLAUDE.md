# IDE Expert Agents — repo instructions

This repo hosts agent definitions under `*-agents-store/<agent-name>/agent.md` (or `SKILL.md`), served via the MCP server in `mcp-server/`. See the root `README.md` for the full architecture.

## Rule: keep README docs in sync with agent changes

Whenever an agent is **added**, **removed**, or **updated** (name, prompt name, description, or "when to use" changes) under any `*-agents-store/<agent-name>/` folder, update both of the following in the **same change**:

1. **That store's own `README.md`** (`*-agents-store/README.md`)
   - Add/remove/edit the row in the "Available Agents" table: Agent name, Prompt name, When to use.
2. **The root `README.md`**
   - Update the agent count for that store in the "Agent stores" table.
   - Update the store's one-line description if the change alters what the store covers.

Never leave these docs stale — a PR that adds/removes/updates an agent but doesn't touch both READMEs is incomplete. If you're unsure whether a change is significant enough to warrant a description update, err on the side of updating it.
