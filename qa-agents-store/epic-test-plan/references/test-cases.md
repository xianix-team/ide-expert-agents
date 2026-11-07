# `test-cases.md` — full spec (Step 5)

**Every acceptance criterion must map to at least one test case.**

## Structure

```markdown
# <Epic-ID> — Test Cases

**Epic:** <Epic Title>

## Test Scope Summary
(brief recap: what is covered, what is not)

## Functional Test Cases
### <Area 1>
### <Area 2>
...

## UI Test Cases

## Field & Form Validation Test Cases

## Non-Functional Test Cases
(include only when relevant to this epic)
### Security / Access Control
### Performance
### Accessibility
### Reliability / Error Handling
### Compatibility

## Happy-Path Automation Candidates
(the automation backlog — one row per end-to-end happy-path flow; see "Happy-path identification" below)

## Requirement Traceability Matrix
(see Section below)
```

## Test case format

Each test case is a table row with these columns:

| TC ID | Test Case Title | Req Ref | AC Ref | Module / Feature | User Role | Test Type | Priority | Preconditions | Test Data | Steps | Expected Result | Regression Impact | Execution Type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Column definitions:

- **TC ID** — `<Epic-ID>-TC-001`, sequential across the whole file
- **Test Case Title** — a short, specific title for the case. **Prefix happy-path cases with `⭐ HP`** (see "Happy-path identification" below); when the case is a consolidated parent and only some variants are the happy path, name them — e.g. `⭐ HP(a,c) Zone start → reserve → close`.
- **Req Ref** — the requirement or story this case covers (e.g. `PAR-XXXXX`)
- **AC Ref** — the specific acceptance criterion number (e.g. `AC-3`)
- **Module / Feature** — the UI section or API area being tested
- **User Role** — the role executing the test
- **Test Type** — Functional | UI | Validation | Security | Performance | Accessibility | Exploratory
- **Priority** — P0 (critical / blocker), P1 (important), P2 (nice to have)
- **Preconditions** — what must be true before the test starts
- **Test Data** — specific values, accounts, or states needed
- **Steps** — numbered, concrete enough for another tester to execute without extra context
- **Expected Result** — observable, verifiable outcome
- **Regression Impact** — None | Low | Medium | High (and which area)
- **Execution Type** — Manual | Exploratory | Regression

## Functional coverage (mandatory)

- Positive scenarios (happy path per role)
- Negative scenarios (invalid input, missing data, wrong permissions)
- Business rules and constraints
- Role-based access (one test per relevant role where behaviour differs)
- Permission boundaries
- Error handling (API failures, validation errors, empty states)

## Happy-path identification & automation candidates (mandatory)

Happy paths are automated first, per your team's QA strategy. This step makes them explicit and hands them to automation.

**What is a happy path:** the **primary success scenario** of a feature/flow — valid data, an authorised role, no errors — one per feature area, per role and per lot-type/branch where behaviour genuinely differs. Negative, edge, boundary, and error variants are **never** marked as happy paths.

**Mark them inline:** prefix the happy-path case's **Test Case Title** with `⭐ HP`. With per-variant precision — when a consolidated parent bundles the happy path with negative/edge variants, name only the happy variant letters, e.g. `⭐ HP(a) …`. The marker flags the row; the flows section (below) carries the automatable detail.

**Emit a `## Happy-Path Automation Candidates` section** (placed just before the Requirement Traceability Matrix). It lists each happy path as a **self-contained, ordered end-to-end flow** that can be handed directly to the `playwright-cli` skill. One row per flow, with these columns:

| Column | Content |
|---|---|
| Flow ID | `HP-01`, `HP-02`, … |
| Covers | the `TC-###` (+ variant letters) the flow chains — the doc↔code back-reference |
| User Role | the role that runs it |
| Entry Point | URL / screen / API entry |
| Steps | ordered, self-contained steps — enough to drive without extra context |
| Expected End State | final observable state (DB / UI / receipt / status) |
| Suggested Tag(s) | `@smoke` (primary success / build-verification), `@critical` (business-critical), `@regression` (full suite) — per the strategy taxonomy `@smoke @regression @sanity @critical` |
| Suggested Spec Path | `tests/regression/<Epic-ID>-<slug>/<flow>.spec.ts` |
| Suggested Naming | `test.describe.serial('[<Epic-ID>]: <flow> — happy path', { tag: [...] })`, with per-step `test('<HP-ID>-NN: …')` |

Rules:
- Every `⭐ HP` case must be covered by at least one flow, and every flow's **Covers** must reference real `TC-###`/variant letters (bidirectional bridge — no dangling refs).
- Match the repo's automation conventions exactly: `[PAR-XXXXX]:` describe prefix + `@tag` arrays selected via `--grep` in the Azure pipelines. Reuse existing Page Objects/helpers rather than proposing new code when a flow is later automated.
- Flows are the **automation backlog** — ordered and independent enough that each becomes one `test.describe.serial` spec.

## UI coverage (mandatory)

- Field visibility and labels
- Button states (enabled, disabled, loading)
- Navigation and routing
- User-facing messages (success, error, warning, info)
- Loading states
- Empty states
- Responsive behaviour where the requirement implies it

## Field and form validation (mandatory where forms exist)

Apply these checks per field where applicable:

- Mandatory vs optional
- Data format (email, phone, date, numeric)
- Min / max length
- Allowed and disallowed values
- Character restrictions
- Default values
- Error message content and placement

## Test design techniques (mandatory design discipline)

Cases must be **derived using formal black-box techniques**, not written ad hoc. Before writing cases for an area, decide which of these apply and design accordingly (a technique need not be printed in the table, but the resulting cases must reflect it):

- **Equivalence Partitioning (EP)** — for any input with distinct valid/invalid classes, test one representative per class (not many values from the same class).
- **Boundary Value Analysis (BVA)** — for any ordered range (length, number, date, quantity, duration, time windows), test just-below / on / just-above each edge (min−1, min, min+1; max−1, max, max+1).
- **Decision Table** — when several conditions combine into different outcomes (eligibility, access, pricing, flow-by-type), build the condition/action table and cover each surviving rule — including the negative/"no action" rule teams forget.
- **State Transition** — for any lifecycle/workflow (draft→active→closed, reservation→extend/shorten/stop), test each valid transition once **and** confirm invalid transitions are blocked.
- **Pairwise / Combinatorial** — when several independent options/toggles interact (config matrices, feature flags, filter combinations), cover every value-pair rather than the full cross-product.
- **Negative / Error Guessing** — always layered on: empty/whitespace, wrong type, over-length, special chars, injection probes, double-submit, back/refresh mid-flow, stale/forged tokens.

For each feature area, EP + BVA + Negative apply almost always; add Decision Table / State Transition / Pairwise wherever the area's logic, workflow, or option-matrix warrants it. An input range with no boundary case, or a multi-condition rule with no decision-table coverage, is a design gap.

## Non-functional coverage (include only when relevant)

Security: authentication, authorisation, direct-URL bypass, sensitive data exposure.
Performance: response time under load, large dataset handling.
Accessibility: keyboard navigation, ARIA labels, screen reader usability.
Data integrity: consistency across save/retrieve cycles, reporting accuracy.
Reliability: behaviour under network failure, retry handling.

## De-duplication & redundancy pass (mandatory)

Before finalizing `test-cases.md`, review the whole set and remove redundant cases. A case is **redundant** — and must be merged into the stronger one, not kept — when it shares **all** of:

- the same **design technique** (e.g. both are BVA), **and**
- the same **input equivalence class or boundary** (e.g. both assert "duration = max is accepted"), **and**
- the same **expected outcome**.

Rules:

- Two cases that test the *same rule / same boundary / same class* are one case — keep the clearest, delete the rest. (E.g. "duration = exactly max → accepted" written twice is one case; "plate = 2 chars → blocked" written twice is one case.)
- Distinct boundaries are **not** duplicates: just-below, on, and just-above an edge are three separate legitimate cases — do not collapse them.
- Different roles, lot types, or payment states with genuinely different expected behaviour are **not** duplicates.
- Prefer merging into the case with the more precise steps/data. After merging, renumber so `TC` IDs stay sequential with no gaps.
- Redundancy is judged by *behaviour and technique*, not wording — two cases phrased differently that assert the same class+outcome are still duplicates.

State in the Test Scope Summary that this pass was applied.

## Requirement Traceability Matrix

At the end of `test-cases.md`, add a traceability section:

```markdown
## Requirement Traceability Matrix

| Req / AC Reference | Acceptance Criterion Summary | Test Case IDs | Coverage Status |
|---|---|---|---|
| PAR-xxxxx AC-1 | <AC text summary> | TC-001, TC-002 | Covered |
| PAR-xxxxx AC-2 | <AC text summary> | — | ⚠ Not covered |
```

Every AC from `requirements.md` must appear in this table. Flag any with no test case as `⚠ Not covered` and note why (out of scope, requires clarification, etc.).

`test-cases.html` is generated on request only — spec in `references/html-specs.md`.
