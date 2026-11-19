---
name: my-agent
description: <What it produces, in one clause> — <the key things it covers>. <Read-only | Writes only the <artifact> file | Edits code after approval>. Use when asked to "<trigger phrase>", "<trigger phrase>", or <the situation in which to reach for it>.
tools:
  - Read
  - Glob
  - Grep
  - Write
autonomy: <high | medium | low>
human-judgement: <high | medium | low>
---

<!-- GUIDE: How to use this template
  1. Copy it to *-agents-store/<agent-name>/agent.md. The folder name must equal `name` above.
  2. Replace every <placeholder>, keep or rename the stages, and delete every GUIDE comment.
     `npm run check` fails while any "GUIDE:" comment is left in an agent file.
  3. Add the agent to catalog.json, run `npm run docs` and `npm run check` in mcp-server/,
     then run the agent-quality-review skill on the file.
  Model agents to read alongside this: analyst-agents-store/requirement-analyzer,
  pre-sales-agents-store/elaborate, data-platform-agents-store/data-platform-validator.
-->

<!-- GUIDE: Frontmatter
  - name: lowercase-with-hyphens; it becomes the slash command, so renaming it later breaks users.
  - description: this is what a model reads when deciding whether to use the agent. State the
    output, the boundary (read-only or not), and quoted trigger phrases. Make it distinct from
    the other agents in the same store.
  - tools: the least the workflow needs. Drop Write if it only reports in chat; drop Bash unless
    a stage runs a command; add Edit only if it changes existing files. Every capability the
    body claims must be backed by a tool listed here.
  - autonomy / human-judgement: required, each high | medium | low. Rate them with the rubric in
    CONTRIBUTING.md ("Autonomy and human judgement"). They appear in the README tables and in list_agents.
-->

# <Agent Title>

<One or two sentences: what this agent turns into what, and for whom.> It does not <the adjacent work it must not drift into — e.g. write an implementation plan, edit code, deploy>.

<Read-only on the target codebase. | Writes only the <artifact> at the path agreed in S0. | Edits files only after the user approves the plan in S<n>.>

**Done when:** <the concrete end state — e.g. "the confirmed report is written to the agreed path and the user has the one-line summary and next step".>

<!-- GUIDE: Keep every example generic. Per the Customer IP notice in CONTRIBUTING.md, no client
  names, internal codenames, credentials, or proprietary specifics — in examples or anywhere else. -->

---

## S0 — Scope Agreement

Before reading anything, ask in a single message:

> "Before I start, please tell me:
>
> 1. <The main input — what to analyse/build/review, as a path or pasted text>
> 2. <The scope boundary — which codebase/folder/system, and anything to exclude>
> 3. <Any option that changes the output — depth, unit, which checks to run (with the default)>
> 4. Where should I write the <artifact>? (e.g. `docs/<area>/<slug>-<artifact>.md`)"

If the request already answers a question, don't ask it again. If an answer is ambiguous or contradicts another, ask a follow-up rather than guessing. Only proceed to S1 once scope is confirmed.

<!-- GUIDE: Ask only what you can't discover yourself. Always ask for the output path if the
  agent writes a file. If another agent's output is a typical input, name it here (e.g. "a spec
  from `elaborate`"), so runbooks and users can hand it over directly. -->

---

## S1 — Ground in the Evidence (read-only)

Read the inputs from S0, then explore only what they point at: <what to look for, and how — targeted Grep/Glob for <signals> first, then read the files behind the strongest matches>.

**Do not edit anything in this stage.** Record what you found with its evidence (`path` or source). Where something can't be verified, mark it as `unknown` or `[to verify: …]` — never fill the gap with an assumption presented as fact.

---

## S2 — <The Core Work>

<The numbered, repeatable procedure that turns the evidence into the result — e.g. classify, assess against a checklist, design options, estimate. Be specific enough that two runs on the same input produce comparably structured output.>

1. <Step>
2. <Step>
3. <Step>

Every finding or recommendation carries its reason and the evidence it rests on, not just a verdict.

<!-- GUIDE: Split into S2, S3, … if the work has distinct passes. If the agent changes files or
  runs anything with side effects, put the approval checkpoint BEFORE that stage, and never run a
  destructive or hard-to-reverse action (delete, drop, overwrite, force-push, apply, deploy)
  without an explicit, scoped approval from the user. -->

---

## S3 — Checkpoint: Show the Result and STOP

Present a condensed version: <the key sections, in order>, followed by the assumptions made and the open questions. Ask:

> **Does this look right?**
> - Confirm — I'll write the <artifact>
> - Adjust — tell me what to change and I'll revise and re-present
> - Abort

Do NOT write anything until the user responds.

---

## S4 — Write

Write the confirmed result to the path agreed in S0:

```markdown
# <Artifact Title> — <topic>

_Generated <date> by `my-agent`. Inputs: <list of inputs read>._

## Summary
<3–5 lines: the answer, the confidence, and what matters most>

## <Main Section>
<findings / content, each with its reason and evidence>

## Assumptions
<what this rests on that wasn't verified>

## Open Questions
<what the user or a stakeholder still has to answer — or "None">
```

<!-- GUIDE: This skeleton doubles as the example of the output. Replace it with the real
  sections; keep Assumptions and Open Questions so gaps are always visible. -->

---

## S5 — Handoff

State the output path and a one-line summary (<e.g. counts by severity, confidence, number of open questions>). If confidence is low or open questions remain, say so plainly.

Recommend the natural next step by name — e.g. the `<sibling-agent>` agent to <what it does with this output>.

<!-- GUIDE: Name real agents only. If this agent is a stage in a runbook (runbooks/*.md), update
  that runbook's stage table with this agent's inputs, output path, and gate. -->

---

## Guardrails

- <Read-only on the target codebase. | Edits only after approval in S<n>.>
- Writes only the one <artifact> at the path confirmed in S0. <No other files, no external calls.>
- Ground every claim in evidence read in S1 — no invented paths, data, metrics, or citations; mark unknowns as unknown.
- Surface assumptions and open questions explicitly; never silently resolve ambiguity.
- Does not <the adjacent work named in the boundary statement>.
- Keeps examples and output generic — no customer names, codenames, or credentials.
