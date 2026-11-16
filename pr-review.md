# PR Review Guidelines — Agent Changes

How to review a pull request that **adds, removes, or updates** an agent under any
`*-agents-store/<agent-name>/` folder. Scope: this document covers agent-definition
changes specifically. PRs that only touch `mcp-server/src/` (server code) should
still pass "MCP server changes" below, but don't need the rest of this checklist.

Reject/request-changes on anything marked **[BLOCKING]**. Items marked **[ADVISORY]**
are strong suggestions — call them out, but don't hold the PR hostage over them.

---

## 0. Identify the change type

Look at the diff and classify it before reviewing:

- **Added** — new `*-agents-store/<agent-name>/` folder with a new `agent.md`/`SKILL.md`
- **Removed** — a folder deleted, or an agent's frontmatter effectively retired
- **Updated** — `name`, prompt name (folder name), `description`, instructions, or
  `tools:` changed on an existing agent

A single PR can mix these across multiple agents — check each one independently
against the sections below.

---

## 1. Repo-convention checks [BLOCKING]

These come straight from `CONTRIBUTING.md` and are mechanical — verify, don't debate.

- [ ] Agent lives at `*-agents-store/<agent-name>/agent.md` or `SKILL.md` (not both —
      "first match wins" at serve time, so a folder with both is ambiguous)
- [ ] Frontmatter has both `name` and `description`
- [ ] `name` in frontmatter matches the folder name exactly (the server has no
      registry — this is the only link between the folder and the served prompt)
- [ ] `description` states **concretely when to invoke** the agent — trigger phrases
      or scenarios, not a vague "helps with X" restatement of the title
- [ ] If the agent was split into supporting `.md` files, confirm they're plain
      markdown in the same folder (they get auto-concatenated into the prompt —
      check the concatenation order won't read confusingly, e.g. `techniques.md`
      before `agent.md` content is referenced)
- [ ] No changes needed to `mcp-server/src/` just to add/edit an agent — if the PR
      touches server code for what looks like a routine agent add, ask why

**For removals specifically:**
- [ ] The whole `<agent-name>/` folder is deleted, not just `agent.md` (orphaned
      supporting `.md` files would otherwise silently stop being served but stay
      in the repo)
- [ ] Nothing else in the repo references the removed agent's prompt name (other
      agents' instructions, docs, examples) — grep for the folder/prompt name
      across the repo before approving

---

## 2. Documentation sync [BLOCKING]

This is the rule this repo is strictest about (`CLAUDE.md` and `CONTRIBUTING.md` both
call it out as required, not optional). A PR that adds/removes/updates an agent but
doesn't touch both READMEs **in the same PR** is incomplete — request changes, don't
approve with a follow-up comment.

- [ ] **Store README** (`*-agents-store/README.md`) — the "Available Agents" table
      row is added / removed / edited to match: Agent name, Prompt name, When to use.
      The "When to use" column should track the frontmatter `description`, not drift
      from it.
- [ ] **Root README** (`README.md`) — the "Agent stores" table:
  - [ ] Agent **count** for that store is updated (+1 / −1 / unchanged on rename)
  - [ ] The store's **one-line description** is updated if this change alters what
        the store covers (a new capability, or the loss of one on removal)
- [ ] If a change is borderline (e.g. a wording tweak to `description` that doesn't
      change behavior), the repo's stated default is to update the docs anyway —
      don't wave through "the READMEs are close enough."

---

## 3. Quality-attribute checklist [BLOCKING for new/materially-changed agents]

This repo has a dedicated `agent-quality-review` skill
(`.claude/skills/agent-quality-review/SKILL.md`) and a hook that reminds the author
to run it after writing/editing an `agent.md`/`SKILL.md`. As reviewer:

- [ ] Confirm the PR shows evidence the author ran it (or run it yourself against
      the changed file) — check the same categories:

  **Correctness & scope**
  - `description` gives concrete trigger conditions
  - Instructions define what "done" looks like (a specific output/artifact/decision)
  - Every capability claimed in the prose is backed by a tool actually listed in
    `tools:` (e.g. don't claim "deploys the service" without `Bash`)

  **Groundedness**
  - Factual claims about a codebase/config/external system are instructed to be
    verified (Read/Grep/Glob or equivalent), not assumed
  - No instruction asks the agent to fabricate data, citations, metrics, or results
    — "not stated"/"unknown" is the required fallback

  **Scope discipline (autonomy)**
  - `tools:` lists only what the workflow needs — flag unused or "just in case"
    grants (esp. `Write`/`Edit`/`Bash` on an agent that should be read-only)
  - There's an explicit boundary statement (what the agent does **not** do)
  - If the agent writes an artifact, the output location is constrained to a
    declared path/pattern

  **Reliability & consistency**
  - The workflow is staged/numbered (S0, S1, S2…), not loose prose
  - Ambiguous/missing/contradictory input triggers an explicit clarifying step,
    not silent guessing

  **Safety & guardrails**
  - No instruction skips confirmation before a destructive/hard-to-reverse action
  - If the agent could plausibly touch customer/client content, it's instructed to
    stay generic (see §4 below)
  - Tool grants are proportionate to what's declared — a "read-only analysis" agent
    shouldn't carry `Bash`

  **Transparency**
  - Output is instructed to surface its own gaps/assumptions/uncertainty
  - Findings/recommendations come with a stated reason, not a bare verdict

  **Efficiency**
  - No forced redundant work (re-reading a whole codebase where a targeted grep
    would do, repeating an earlier stage)
  - `tools:` and instruction length are proportionate — no unused tools, no padding

  **Usability**
  - If inputs could be ambiguous/incomplete, there's an upfront scope-agreement
    step (an S0-style intake) before work starts
  - The `description` is distinct enough from sibling agents in the same store that
    a routing model wouldn't confuse them — skim the store's other `agent.md` files

- [ ] For a **removal**, this section doesn't apply — skip to §1 and §2.
- [ ] For a **minor update** (typo fix, small wording clarification) that doesn't
      touch behavior, tools, or scope, a full pass through this checklist is
      overkill — spot-check correctness/scope only.

---

## 4. Customer IP notice [BLOCKING]

Per `CONTRIBUTING.md` — this repo's agents/skills are shared publicly across teams.

- [ ] No customer-specific data, proprietary business logic, confidential
      architecture details, credentials, or other protected client IP appears in
      the agent's instructions, examples, or sample data
- [ ] If the agent's description or examples read as inspired by a specific client
      engagement, confirm names/domains/specifics were generalized before merging
- [ ] Same check applies to the PR description and commit messages themselves —
      don't let customer-identifying details leak in there even if the code is clean
- [ ] When in doubt, don't approve — ask the author to check with their engagement
      lead first

---

## 5. MCP server changes [BLOCKING if `mcp-server/src/` touched]

Most agent add/remove/update PRs shouldn't need this — the loader discovers agents
by globbing, no registry to update. If the PR *does* touch server code:

- [ ] `npm run build` in `mcp-server/` succeeds (tsc + postbuild) — ask the author to
      confirm, or run it yourself
- [ ] Both transports were considered — `index.ts` (stdio) and `http.ts` (HTTP
      Streamable) share the same agent loader/server factory, so a fix in one
      should apply to both automatically; if the PR patches transport-specific
      code, check whether the other transport needs the same fix
- [ ] Changes don't silently alter how `agent.md` vs `SKILL.md` precedence or
      supporting-`.md` concatenation works, since that would affect every existing
      agent, not just the one being touched — treat this as a higher-blast-radius
      change and ask for explicit justification

---

## 6. Review checklist summary (copy into PR comment)

```
Agent PR Review
- [ ] Repo conventions (folder, frontmatter, name==folder) — §1
- [ ] Store README updated — §2
- [ ] Root README updated (count + description) — §2
- [ ] Quality-attribute checklist (agent-quality-review) — §3
- [ ] Customer IP notice — §4
- [ ] MCP server build (if src/ touched) — §5
```

If any BLOCKING box can't be checked, request changes with the specific gap —
point at the missing checklist item, not a restatement of "please fix the docs."
