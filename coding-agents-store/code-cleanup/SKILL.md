---
name: code-cleanup
description: >-
  Clean up an existing codebase—especially AI/vibe-coded ones—by removing waste,
  simplifying bulky code, and fixing evidenced quality, performance, or security
  issues while preserving required behavior. Use when asked to clean/cleanup/
  simplify/improve code quality, remove vibe code or unnecessary complexity, or
  run code-cleanup. Default CLEAN: find → propose → human approves → fix →
  verify → continue (one cleanup at a time). Analyze and Review only when
  explicitly requested. Not an audit-report generator.
---

# Code Cleanup

**The purpose of this skill is to improve the codebase, not to produce an
audit report. Analysis, classification, and reporting exist only to make
cleanup safe.**

Clean existing codebases, especially AI/vibe-coded ones, by removing
unnecessary code and complexity, simplifying bulky implementations, improving
maintainability, fixing evidenced performance and security problems, and
preserving required behavior.

**Target outcome:** minimum justified complexity + required behavior preserved
+ better quality + less unnecessary work + safer code.

This is a **code cleanup / fixing** skill — not primarily a dead-code analyzer,
audit tool, or review-report generator.

A mature codebase may need **zero** changes. Stopping safely is success.

## Philosophy

```text
REMOVE WHAT SHOULD NOT EXIST
        ↓
SIMPLIFY WHAT MUST EXIST
        ↓
IMPROVE CODE QUALITY
        ↓
REMOVE UNNECESSARY WORK
        ↓
FIX SECURITY PROBLEMS
        ↓
VERIFY
        ↓
REPEAT
```

Prefer: **REMOVE → CONSOLIDATE → SPECIALIZE → SIMPLIFY → REUSE EXISTING CODE**
before introducing anything new.

**Used does not mean necessary. Working does not mean justified.**

## References (read when needed)

- [cleanup-checklist.md](cleanup-checklist.md) — checklist + Analyze classification detail
- [vibe-code-smells.md](vibe-code-smells.md) — AI/vibe-code smells
- [tooling-hints.md](tooling-hints.md) — optional mechanical evidence tools

## Operating modes

### CLEAN (default)

Normal workflow. If the user says clean / cleanup / improve / simplify /
remove vibe code / fix code quality / reduce unnecessary code — or does not
specify a mode — use **CLEAN**.

Do **not** generate a full analysis report first.

`APPLY` is an alias for CLEAN.

### REVIEW (optional)

Only when explicitly asked to inspect a **diff / branch / PR / recent agent
changes**. Diff-scoped scope-creep check. Remediations still require HITL.
Details: see Review section below.

### ANALYZE (optional)

Only when explicitly asked for an analysis, audit, report, or full findings
list. Produces baseline, findings, plan — **no source edits**.

---

## CLEAN workflow

```text
UNDERSTAND REPOSITORY
        ↓
BASELINE
        ↓
FIND NEXT WORTHWHILE CLEANUP
        ↓
UNDERSTAND WHY THE CODE EXISTS
        ↓
CAN IT BE SAFELY IMPROVED?
        │
    ┌───┴────┐
   NO       YES
    │        │
leave /      ↓
investigate  PROPOSE SMALLEST FIX
             ↓
        HUMAN APPROVAL
             ↓
          FIX CODE
             ↓
           VERIFY
             ↓
       HUMAN ACCEPTS
             ↓
      FIND NEXT CLEANUP
```

Do not build F1–F30 before the first fix. One useful cleanup → deal with it →
continue. Park other discoveries in a small **internal queue**.

### Cleanup search order

1. REMOVE WASTE
2. SIMPLIFY
3. IMPROVE CODE QUALITY
4. REMOVE UNNECESSARY WORK / PERFORMANCE
5. FIX SECURITY PROBLEMS
6. VERIFY

### 1. Understand repository

- Read README / AGENTS.md / CONTRIBUTING / rules
- Structure, entry points, conventions, dependencies
- Build / test / lint / typecheck commands
- Prefer [tooling-hints.md](tooling-hints.md) when present
- Scope to a user-specified module when asked; large repos → one module at a time
- Do not infer architecture from a single file

### 2. Baseline

- Run available build/tests/lint/typecheck
- Record pre-existing failures
- Never weaken checks to get green

No automated coverage for the area? Require a short **manual smoke-check**
before claiming verified. If no smoke-check is feasible, leave alone / keep
confidence capped — do not treat "build passed" alone as enough.

### 3. Find next worthwhile cleanup

Actively look for waste and unjustified machinery (see checklist + vibe smells).

**Remove waste examples:** dead code, unused files/exports/deps/config,
abandoned dual implementations, AI leftovers, commented-out code, speculative
features, unnecessary fallbacks/compatibility/flags/helpers/wrappers/
interfaces/factories/providers, unused branches, committed build artifacts.

Unused ≠ automatically safe to delete. Check DI, reflection, dynamic loading,
plugins, config, serialization, CLI, public contracts, tests, runtime.

**Feature flow before file cleanup:** when complexity spans a feature,
reconstruct:

```text
Request → Controller → Service → Factory → Interface → Provider → External API
```

Ask whether every layer owns a real responsibility. Do not judge files in
isolation when the waste is the chain.

**Vibe-code expansion:** simple requirement → oversized implementation.

```text
REQUIREMENT → ACTUAL FEATURE FLOW → IMPLEMENTATION MACHINERY
```

Which parts are necessary for the required behavior? Referenced layers are not
automatically justified.

**Simplify bulky code:** large methods/classes, deep nesting, repeated
mapping/validation/errors, forwarding wrappers, abstraction chains, one-use
generics, excessive defense, unused state machines. Prefer simpler existing
code — not a replacement architecture.

**Quality:** duplication, unclear responsibility, weak errors, misleading
names, pattern inconsistency, weak tests, AI chat residue, terminology drift.
No style-only rewrites, mass renames, or forced SOLID/DRY/Clean Architecture.

**Performance — remove work first:** Can we stop doing this work entirely?
Then optimize only if needed. Look for repeated queries/API/JSON/mapping,
N+1, over-fetch, duplicate validation, work before early exit, unnecessary
polling, unbounded caches, etc. Evidence required. Do not add caching/queues/
concurrency/batching without justification.

**Security — trust boundaries:** External input → API → validation →
authn/authz → business logic → DB/FS/external. Evidence required. Prefer the
**smallest secure fix**. Do not invent vulns or build a security architecture
for a local hole.

### 4. Understand why it exists (lightweight)

For referenced code that might be unnecessary, ask briefly:

1. What does it do?
2. Why does the app need it?
3. What breaks if removed/simplified?
4. Is that capability required today?
5. Can existing repo code do it more simply?

Do **not** force a long questionnaire every time. Go deeper only when unsure.

If still unclear after repo investigation: ask the human **one** simple
requirement question. If still unclear: leave alone and move on.

Weak justifications alone ("future-proof", "SOLID", "nice to have") are not
enough to keep complexity — nor enough to delete. Investigate.

Preserve intentional boundaries (public contracts, established DI, real test
seams, security, plugins, framework conventions). One implementation ≠ delete.

Detailed necessity / capability justification for Analyze: see
[cleanup-checklist.md](cleanup-checklist.md).

### 5. Fixability Gate

Before presenting to the human:

1. Do I understand the problem?
2. Do I understand required behavior?
3. Do I know a smaller/safer implementation?
4. Can I keep the change reasonably contained?
5. Can I verify the result?

- **YES** → propose the fix
- **NO** → investigate (repo first)
- Still unclear → one human question, then leave alone if needed

Do not produce a long report because a possible issue exists.

### 6. Propose + human approval (mandatory)

One cleanup at a time. **No automatic source modification.**

Every HITL message: simple English, a short summary, then **one target
question**. The options must answer that question only.

Pattern:

```text
F<n> — <simple title>

What I found:
- <one short point>
- <one short point>

What I want to do:
- <one short point>

<one target question>

1. ...
2. ...
3. ...
```

Example:

```text
F4 — Extra provider setup

What I found:
- The app sends push through Expo only
- Extra factory/interface exists for switching providers

What I want to do:
- Remove the unused switch setup and keep Expo

Apply this cleanup?

1. Yes
2. Show why
3. Change approach
4. Skip
5. Stop
```

Then **STOP**.

Do not dump priority/confidence tables, full evidence, capability essays, or
large plans unless needed or requested.

Decisions: Yes → APPROVE; Show why → details then re-ask; Change approach →
MODIFY APPROACH; Skip → SKIP; Stop → STOP. Also support Investigate / Defer
when relevant.

### 7. Fix (after APPROVE only)

Apply **only** that cleanup.

Do not fix another issue in the same file, refactor unrelated code, rename
unrelated symbols, update unrelated docs, add "while we're here" work, or add
unrelated dependencies. Newly discovered issues → internal queue, leave unchanged.

#### Change budget

Before editing, record expected surface (internal):

```text
Expected: files changed / created / deleted / deps changed
```

After: compare Actual vs Expected. If surface expands unexpectedly → **STOP**.
Do not accept extra changes automatically.

#### Net complexity guard

Compare conceptual complexity (files, abstractions, layers, deps, config,
states, branches, indirection).

Cleanup should normally **reduce or preserve** conceptual complexity.
If Service→Helper becomes Service→Interface→Factory→Strategy→Helper → **STOP**.
Increasing complexity only with a concrete correctness/security/performance/
contract/infrastructure reason — explicitly justified.

#### Workspace safety

Before each cleanup, capture: tracked mods, staged mods, untracked files,
deleted files. Pre-existing changes belong to the user — never
modify/delete/revert them automatically.

After edits and after mutating commands, re-check workspace. Unexpected
changes → **STOP**.

Never routinely use `git clean -fd` or `git reset --hard`.

#### Creation / dependency guards

Before any **new** source file: search owner, similar code, consolidate first;
create only for a clear responsibility that cannot live elsewhere.

Before any **new** dependency: check existing deps, platform/stdlib, repo
utils; add only when benefit clearly beats cost. Cleanup normally removes deps.

### 8. Verify

#### Verification safety

- Correct working directory
- Prefer repository-defined commands
- Know whether the command writes files
- Avoid accidental build output in source trees
- Re-check workspace after mutating commands

Failed command ≠ automatically "code is broken." Distinguish: code failure,
pre-existing failure, environment, missing tool, wrong command, wrong cwd,
generated-artifact issue.

#### After one cleanup

- Build / relevant tests / lint / typecheck as appropriate
- Security/performance checks when that was the fix
- Inspect git diff
- Check change budget + unexpected files
- Confirm required behavior remains
- Net complexity OK

Short result — same pattern: summary points, then one target question:

```text
F<n> cleaned.

Changed:
- ...

Removed:
- ...

Checked:
- build / tests / no unexpected files

Behavior:
No expected behavior change.

Keep this cleanup?

1. Accept
2. Revise
3. Revert
4. Show diff
5. Stop
```

Then **STOP**.

### 9. Accept / Revise / Revert

- **Accept** → mark resolved; find next (or end). Commits optional (below).
- **Revise** → keep active; re-approve if scope expands.
- **Revert** → undo only that cleanup (see Git). Verify revert.

### Commits are optional

Important loop: one cleanup → one approval → isolated change → verify → accept.

Do **not** require one git commit per finding. This is not a Git workflow
manager. Commit after Accept only if the user asks (or session convention).
If a commit exists, Revert = `git revert <sha>`; else undo only that cleanup's
files. Never touch unrelated user changes.

### End condition

Stop when remaining issues are preference-only, complexity is justified,
product/architecture decisions are required, perf/security ideas aren't
evidenced, further change would add complexity or only marginal benefit, or
safe verification isn't possible.

Say:

> Cleanup complete. I do not see another change that is clearly worth making
> safely.

### CLEAN session end report (concise)

Resolved / Skipped / Deferred / Left alone / Files changed-created-deleted /
Deps / Verification / Behavior / Why stopped.

No need to repeat evidence across sections.

---

## Human chat rules (CLEAN)

Point every HITL message at **one target question**.

- Simple English
- Short summary first (2–4 bullets: what I found / what I want to do / what I checked)
- Then ask **one** question those bullets lead to
- Options answer that question only; then STOP
- Do not bury the question under analysis
- Investigate the repo before asking the human
- Progressive disclosure: Show why / Show evidence / Show files on request
- "Not sure" → investigate further or leave alone; do not pressure approval
- Chat labels: Safe to fix / Needs more info / Leave it alone / Extra complexity
- Formal classification is for Analyze / internal / Show why — not default chat

If you need a requirement answer:

```text
What I found:
- Extra provider switch code exists
- Only Expo is used

Is another push provider planned?

1. Yes
2. No
3. Not sure
4. Show evidence
```

Then STOP. Do not ask several requirement questions in one message.

---

## REVIEW mode (explicit)

Diff scope:

1. Default `git diff <parent>...HEAD` (three-dot / merge-base)
2. Else worktree `git status` / `git diff`
3. User may override the ref

Hunk labels (map to existing types; don't invent a parallel system):

- **Intended** — matches stated goal
- **Unrelated but harmless** — outside scope, low risk
- **Scope creep** — outside scope, real change surface
- **Speculative addition** — new capability without demonstrated need

Only touched paths are in remediation scope. Cross-ref
[vibe-code-smells.md](vibe-code-smells.md) item 14.

Per-hunk revert only after HITL. No auto-revert.

---

## ANALYZE mode (explicit)

Discover → Baseline → Audit → Classify → Decide → Plan → Report.
No source edits. Full findings / confidence / priority / plan allowed here.
Use [cleanup-checklist.md](cleanup-checklist.md) for classification
detail. Still prefer evidence; a smell is not automatically a defect.

---

## Optional Jev decision gates

Jev may be used as an **optional** bounded safety layer. **Not** the cleaning
engine. The coding agent still understands code, proposes fixes, edits, and
verifies.

Jev may evaluate **structured evidence already gathered**, e.g.:

- Did actual change exceed approved budget?
- Unexpected files appear?
- Diff outside approved scope?
- Conceptual complexity increased?
- Human review required?
- STOP because a safety condition failed?

Example outputs: `ALLOW` | `STOP` | `HUMAN_REVIEW`

Do **not** ask Jev to redesign architecture, refactor large services, decide
from raw source whether an abstraction is necessary, or generate the fix.

The skill must work fully **without** Jev. No mandatory Jev dependency.

---

## Hard constraints

MUST NOT:

- introduce features under "cleanup"
- intentionally change business behavior
- change public contracts without explicit approval
- redesign architecture because another design looks nicer
- introduce speculative abstractions / unnecessary layers
- add deps for trivial functionality
- unrelated framework/dependency upgrades
- mass rename for style
- remove apparently unused code without checking indirect/dynamic use
- suppress tests, lint, compiler, or security checks
- rewrite working code solely for preferred style
- use "while we're here" / "for consistency" / "related cleanup" to expand scope

## Repository search guard

Prefer application source paths. Exclude `.git/`, `node_modules/`, `.next/`,
`dist/`, `build/`, `bin/`, `obj/`, `coverage/` unless specifically relevant.
Do not treat generated/dependency matches as app-usage evidence.
Failed search output is not evidence. Prefer narrow searches.
`git log --follow`: one path at a time.

## Principles are not mandates

Do not make subjective style mandatory. SOLID/DRY/patterns are reasoning aids
only when they reduce a concrete problem in **this** repository.
