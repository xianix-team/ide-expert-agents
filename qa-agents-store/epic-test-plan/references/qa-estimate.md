# `qa-estimate.md` — detailed estimate spec (Step 4c)

The detailed estimate behind test-plan Section 11, built with the same method (five components + optional automation line, hours, no caps, risk-weighted — the method and component definitions are stated in full in `references/test-plan-template.md`, Section 11). This is the **Tier 1 internal estimate** — the real number and the negotiation floor; audience: QA lead, tech lead, PO. Markdown by default (`qa-estimate.html` is on request only — spec in `references/html-specs.md`).

**Ground before writing numbers.** If a design doc exists it is the single source of truth, including its latest amendments/decision log — scope changes late, and an estimate justified against stale scope gets shredded in review. Cross-check every scope claim against it, reconcile the story list against Jira, and flag (to the user, not in the doc) any items the design moved out of scope.

## Estimate-only runs

When the user asks only for a QA estimate (or an estimate refresh) — not the full documentation set — run just Step 4c plus the Section 11 sync: if the epic folder exists, derive the feature areas from `test-mindmap.html` and the counts from `test-cases.md` (confirm they still match the latest design decisions); if not, fetch the epic from Jira / the given requirement and decompose into feature areas yourself. Refresh an existing `qa-estimate.md` rather than starting over. Do not regenerate the other artifacts.

## Structure

```markdown
# <Epic-ID> — QA Estimate

**Epic:** <Epic Title>
**Date:** <today's date>
**Unit:** hours
**Basis:** scope mindmap (`test-mindmap.html`) + test cases (`test-cases.md`, <N> cases)

## 1. Scope basis
(the feature areas, one line of scope each, and where they came from; name excluded/deferred areas)

## 2. Execution breakdown (per feature area)
(table: Feature Area | Hours, with a bold Execution subtotal row)

## 3. Cross-cutting work
(table: Item | Hours, with a bold Cross-cutting subtotal row)

## 4. Estimate summary
(table: Activity | Basis | Hours — the five components, a bold Total row, then the italicized
optional automation row outside the total)

## 5. Assumptions and exclusions
(resourcing — how many QA people; tenant coverage; deferred stories; whether the optional
automation line is in or out; open decisions that can move the numbers)

## 6. Risk-transfer register
(empty at creation — filled only when a client-facing compression is produced in Step 4d:
every item cut for the client, by name, with the risk the client owns by removing it.
Internal only — never in the client document.)
```

## Rules

- **Do the arithmetic** — every subtotal and the grand total must reconcile; don't trust the draft.
- The tables in test-plan.md Section 11 and this file must show **identical numbers** — they are the same estimate at two levels of detail.
- Note: the finalized `test-cases.md` (Step 5) supplies the case count and the ⭐ HP flows for the optional automation line — if the case set changes after estimation, revisit both this file and Section 11.
