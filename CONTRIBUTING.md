# Contributing to IDE Expert Agents

Thanks for contributing an agent or improving the MCP server. This guide covers the conventions this repo expects.

## Repository layout

Agents live under `*-agents-store/<agent-name>/`, one folder per agent:

```
*-agents-store/
  <agent-name>/
    agent.md   ← instruction set + YAML frontmatter (Claude Code style)
    SKILL.md   ← instruction set + YAML frontmatter (Cursor style)
    *.md       ← supporting docs, auto-concatenated into the prompt
```

The MCP server in `mcp-server/` discovers agents by globbing these folders at startup — there is no registry to update.

## Adding a new agent

1. Pick the store that matches the agent's domain (see the "Agent stores" table in the root [README.md](README.md)), or propose a new store if none fits.
2. Create a folder: `*-agents-store/<agent-name>/`.
3. Add `agent.md` (or `SKILL.md`) with at minimum:

   ```yaml
   ---
   name: my-agent
   description: One sentence describing when to invoke this agent.
   ---

   # Agent instructions here...
   ```

4. Split long instruction sets into supporting `.md` files in the same folder if it improves readability — they're concatenated into the prompt at serve time.
5. Rebuild and sanity-check the server: `npm run build` in `mcp-server/`, then restart your MCP client connection and confirm the agent appears.

## Keep the docs in sync — required, not optional

Whenever an agent is **added**, **removed**, or **updated** (name, prompt name, description, or "when to use" changes), update **both** of the following in the same PR:

1. **That store's own `README.md`** — add/remove/edit the row in the "Available Agents" table (agent name, prompt name, when to use).
2. **The root `README.md`** — update the agent count and one-line description for that store in the "Agent stores" table.

A PR that changes an agent without touching both READMEs is incomplete. If you're unsure whether a change is significant enough to warrant a description update, update it anyway.

## Customer IP notice

Agents and skills here are shared publicly across teams. Content must be **generic and reusable**:

- No customer-specific data, proprietary business logic, confidential architecture details, credentials, or other protected IP belonging to a client.
- If an agent was inspired by client work, generalize the naming, examples, and domain specifics before contributing it.
- When in doubt, leave it out and check with your engagement lead.

## MCP server changes

Server code lives in `mcp-server/src/`. Common tasks:

```bash
cd mcp-server
npm install
npm run dev        # stdio transport, live reload via tsx
npm run dev:http    # HTTP Streamable transport
npm run build       # tsc + postbuild — always run before opening a PR that touches server code
```

Both transports (`index.ts` stdio, `http.ts` HTTP) share the same agent loader — you generally shouldn't need to touch server code just to add or edit an agent.

## Submitting changes

1. Branch off `main`.
2. Make your changes, keeping agent content and README updates in the same commit/PR (see above).
3. Run `npm run build` in `mcp-server/` if you touched server code, and confirm it succeeds.
4. Open a PR against `main` with a clear description of what the agent does and, if relevant, what prompted it.
5. Keep customer-identifying details out of PR descriptions and commit messages, same as agent content.
