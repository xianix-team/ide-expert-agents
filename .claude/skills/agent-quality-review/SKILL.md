---
name: agent-quality-review
description: Reviews an agent.md/SKILL.md file in a *-agents-store/<agent-name>/ folder against this repo's AI-agent quality-attribute checklist (correctness, groundedness, scope discipline, reliability, safety, efficiency, usability) and reports gaps. Triggered automatically after writing or editing an agent definition; can also be invoked manually, e.g. "review this agent for quality" or "/agent-quality-review".
---

# Agent Quality Review

Checks a single agent definition (`agent.md` or `SKILL.md` under `*-agents-store/<agent-name>/`) against the quality attributes an AI agent needs to be trustworthy in production use. **Report only** — list gaps for the author to fix. Never edit the agent file as part of this skill.

## Which file to review

- If a file path was given (via hook context, slash-command args, or the conversation), use it.
- Otherwise, use the `agent.md`/`SKILL.md` most recently written or edited in this conversation.
- If neither is available, ask which agent to review.

Read the target file plus any supporting `*.md` files in the same folder (they're concatenated into the served prompt, so they're part of what's being reviewed).

## Checklist

Walk every item below. For each, note ✅ (meets it), ⚠️ (partial / unclear), or ❌ (missing), with a one-line reason pointing at the specific line or section. Skip an item only if it's genuinely not applicable (e.g. "output location" for an agent that never writes files) — say so explicitly rather than omitting it silently.

**Correctness & scope definition**
- `description` frontmatter states concretely *when* to invoke this agent (trigger phrases, not vague "helps with X")
- The instructions define what "done" looks like — a specific output, artifact, or decision, not an open-ended conversation
- Every capability the instructions claim (e.g. "queries the database", "deploys the service") is backed by a tool actually listed in `tools:`

**Groundedness**
- Where the agent makes factual claims about a codebase, config, or external system, it's instructed to verify with Read/Grep/Glob (or an equivalent tool) rather than assume or infer from the request alone
- Nothing in the instructions asks the agent to fabricate data, citations, metrics, or results when it doesn't have them — "not stated" / "unknown" is the required fallback

**Scope discipline (autonomy)**
- `tools:` lists only what the workflow needs — no Write/Edit/Bash on an agent that only reads and reports, no broad tool grants "just in case"
- The instructions state what the agent does **not** do (a boundary statement), so it doesn't creep into adjacent work (scoping, implementation, deployment) uninvited
- If the agent produces an artifact, the output location is constrained (a declared path or pattern), not "write wherever seems right"

**Reliability & consistency**
- The workflow is procedural — numbered/staged steps (S0, S1, S2… or equivalent) rather than loose prose — so two runs on the same input produce comparably structured output
- Ambiguous, missing, or contradictory input is handled by an explicit clarifying step (asks the user) rather than silently guessing

**Safety & guardrails**
- No instruction tells the agent to skip confirmation before a destructive or hard-to-reverse action (delete, force-push, drop, overwrite, deploy to prod) — if the agent's domain includes such actions, it should explicitly pause for user approval
- If the agent could plausibly touch customer/client-specific content, it's instructed to stay generic per this repo's Customer IP notice (see root `CONTRIBUTING.md`) — no hardcoded client names, credentials, or proprietary specifics as examples
- If the agent runs shell commands or writes files, the risk is proportionate to what's declared in `tools:` — a "read-only analysis" agent shouldn't carry Bash

**Transparency**
- The agent's output is instructed to surface its own gaps/assumptions/uncertainty rather than presenting a confident answer over missing information
- Findings or recommendations come with a stated reason, not just a bare verdict

**Efficiency**
- The instructions don't force redundant work the model could get more cheaply (re-reading a whole codebase when a targeted grep would do, repeating a step already covered by an earlier stage)
- `tools:` and instruction length are proportionate to the task — no unused tools, no padding sections that don't drive the workflow

**Usability**
- If the task inputs could reasonably be ambiguous or incomplete, there's an upfront scope-agreement step that asks the user before work starts (mirrors `analyst-agents-store/requirement-analyzer/agent.md`'s S0 pattern)
- The `description` is distinct enough from sibling agents in the same store that a model routing between them wouldn't confuse this one for another (skim the store's other `agent.md` files if unsure)

## Repo-convention checks (not quality attributes, but required by this repo)

- Frontmatter has both `name` and `description`; `name` matches the folder name
- If this is a **new**, **removed**, or **materially changed** agent (name, prompt name, description, or "when to use" changed), the change must land alongside updates to **both**:
  1. That store's own `README.md` (row in the "Available Agents" table)
  2. The root `README.md` (agent count and one-line description for that store)

  If those README updates aren't part of the same change, flag it as a blocking gap — this is a hard rule in this repo's `CLAUDE.md` and `CONTRIBUTING.md`, not a suggestion.

## Output

Give a compact report grouped by the categories above, each item marked ✅/⚠️/❌ with its one-line reason. End with a short, ordered list of the concrete fixes the author should make — phrased as actions ("add a boundary statement after S2", "drop Bash from `tools:` — nothing in the workflow shells out"), not restatements of the checklist. Do not modify the agent file.
