## What this changes

<!-- One or two sentences. For an agent change: what the agent does, and what prompted the change. -->

## Change type

- [ ] Agent added
- [ ] Agent removed
- [ ] Agent updated (name, description, instructions, or `tools:`)
- [ ] Runbook added or updated
- [ ] MCP server code (`mcp-server/src/`)
- [ ] Docs, CI, or tooling only

## Checklist

Full reviewer checklist: [pr-review.md](../pr-review.md). Items below are the ones authors most often miss.

**Every PR**
- [ ] `npm run check` passes in `mcp-server/` (Node 20+)
- [ ] No customer names, internal codenames, credentials, or client-specific details — in content, examples, commit messages, or this description (see the Customer IP notice in [CONTRIBUTING.md](../CONTRIBUTING.md))

**Agent or runbook changes**
- [ ] `catalog.json` is updated (`title`, `whenToUse`, and the store `description` if coverage changed)
- [ ] `npm run docs` was run and the regenerated READMEs are committed — tables not hand-edited
- [ ] Runbooks that list a renamed, removed, or re-scoped agent are updated
- [ ] New agents start from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md)
- [ ] The `agent-quality-review` skill was run on each new or materially changed agent, and its blocking gaps are fixed
- [ ] A renamed agent (prompt name) is called out below — it breaks existing `/` commands, so it needs a version bump

## Notes for the reviewer

<!-- Anything non-obvious: trade-offs, follow-ups, how you tested the agent on a real task. -->
