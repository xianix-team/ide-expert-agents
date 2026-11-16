# Analysis Passes

Detailed procedure for each phase of this agent. Read the relevant section when you reach
that phase. These describe analysis you (the agent with repo access) perform directly
against the checked-out branch.

## Universal guardrail — paste into your own reasoning for every pass
> Report only what the code does, with a `file:line` for each claim. Do **not** infer or
> state the intended, expected, or "correct" behavior. Where the code's purpose is
> ambiguous, write "intent unclear" rather than guessing. Distinguishing "what it does" from
> "what it should do" is the core discipline; the second is never answered here. And in a
> real app, "what it does" is conditional — name the tenant / instance / config value /
> feature flag / role any statement assumes.

## Pass A — Behavioral spec extraction (Phase 1)

Diff the branch against its base (the integration branch) to scope what the feature touches,
then read the touched modules. **Also read the branch's DB migration / release script** if it
has one — in many codebases the schema truth lives there rather than in the ORM model. Extract
testable statements from these high-density locations, roughly in this priority:

1. **Schema & DB constraints** — from the migration/release script (columns, nullability,
   uniqueness, FKs, defaults, check constraints, seed rows) *and* the ORM entity definition.
   Watch for a property-name → column-name mapping convention: the code property name is not
   always the DB column name, and a rule can hide in either place.
2. **Validation logic** — field and cross-field rules in the business/service layer and
   helper/validator classes; what's rejected and the message.
3. **Conditional branches** — every `if`/`switch` and the condition that selects each path.
   Each branch is at least one test case. Flag any branch gated on a feature flag or config
   value — it feeds Pass A-config below.
4. **State / workflow transitions** — allowed transitions, guards, terminal states.
5. **Calculations** — money/tax/fees (note the rounding site and precision), timezone-aware
   time, per-tenant currency. Trace inputs to outputs.
6. **Authorization gates** — the role/permission checks and role constants; who can do what on
   which path.
7. **Error/warning messages + triggers** — pair each user-facing message constant with the
   exact condition that raises it. Usually the clearest plain-language business logic in the
   codebase. (Capture verbatim even if it is in a non-English language.)

Emit each as: `[id] When <condition>, system <does Y>. (path/file.ext:line)`. Keep statements
atomic — one rule each — so each maps cleanly to a test case later.

### Pass A-tenant — tenant/ownership-filter presence check
For **every** query on a tenant/owner-scoped entity, record whether it filters on the
tenant/owner id or a tenant predicate. If the ORM has **no global tenant query filter**,
isolation is per-query and easy to miss. A query that lacks the filter *where a sibling method
in the same service has it* is a Pass C finding — note it now.

### Pass A-config — config / flag axis capture (feeds Phase 1.5)
List the axes that change the touched behavior: tenant/owner scope, instance/product variant,
config value / environment label, feature flag, and — for front-end apps — environment/config
values. This becomes the Phase 1.5 matrix.

## Pass B — Reconciliation (Phase 2)

Load the existing test cases. For each, find the spec statement(s) it corresponds to and
classify:
- **Match** → retain, label `EXISTING-OK`.
- **Contradiction** → the existing expected result conflicts with the code's actual behavior.
  Label the case `DISCREPANCY`; open a register entry `DISCREPANCY-INTENT-UNKNOWN` recording
  both behaviors and their citations. Do not attempt to decide which is right. If they differ
  only because the existing case assumed a *different tenant/instance/flag*, that's not a
  contradiction — it's a missing config assumption; note it and move on.
- **No corresponding code rule** → the test references behavior the branch doesn't implement
  (possibly removed, possibly never built). Flag for the register.

Then invert: every spec statement with **no** existing test → coverage gap (feeds Pass D).
Produce a coverage table: rules total, covered, gap, contradicted.

## Pass C — Consistency hunt (Phase 3)

Scan for the smells in `consistency-smells.md`. For each, give `file:line`, a one-line
description, and severity (high = reachable crash / silent wrong result / isolation leak;
medium = contradictory or dead logic; low = stylistic risk). File each as
`LIKELY-BUG-INCONSISTENCY` — except a missing tenant/ownership filter, which is
`ISOLATION-LEAK-SUSPECTED` and routes to security as well. These need no domain knowledge to
flag because the code disagrees with itself (or with its siblings) — that's the signal.

## Pass D — Test generation (Phase 4)

For each coverage gap and each high/medium smell, write a test case in the schema. Rules:
- Concrete inputs and observable expected results — no "verify it works correctly."
- Cite the `file:line` that justifies the expected result in the Source column.
- Fill **Instance / scope** and **Config assumptions** for every case (principle 4). Never
  leave them blank; "none" is a deliberate claim that the result is unconditional.
- Cover both sides of every boolean branch and each enum/state value.
- For boundaries, test the value, value ± 1, and the inclusive/exclusive edge.
- For each error condition, one case that triggers it and one that just misses.
- **Tenant rule:** for every read of a tenant/owner-scoped entity, add a cross-tenant negative
  case (tenant A must not see tenant B).
- **Config rule:** generate one case per relevant cell of the Phase 1.5 matrix (e.g. flag on
  vs off, instance X vs Y), and name the cell in Config assumptions.
- Set **Execution vehicle**: `unit-probe` for backend logic/calc/validation/tenant checks;
  `E2E` or `manual` for user-facing or config-conditional flows.
- New cases = `CODE-DERIVED`. Rewritten stale cases = `EXISTING-UPDATED`.
- For a smell, write the case that would expose it, label `DISCREPANCY`, link the register
  entry, and leave Status blank — its "correct" result is contested.

## Pass E — Execution (Phase 5)

Choose the vehicle per case:

- **Unit probe (preferred for backend logic).** Write a throwaway unit test in the relevant
  test project using the project's existing test builders/fixtures to exercise the rule
  deterministically. This is the only vehicle that can *prove* an isolation leak cheaply: seed
  two tenants, query as one, assert you cannot see the other. Run with the project's test
  command, filtered to your probe. Passing → `CODE-VERIFIED (unit)`.
- **E2E / manual (required for config-conditional or user-facing behavior).** Run against a
  deployed branch via the project's E2E harness (with DB-state assertions where available), or
  manually. Passing → `CODE-VERIFIED (staging)`. Staging carries live tenant/flag/config data —
  record the actual tenant/instance/flag state you ran under, because that's the context your
  verification covers.

Record actual result, Pass/Fail/Blocked, and any environment/data preconditions discovered.
On a code-vs-running-app divergence, open a register entry and cite both. Never drive a
`DISCREPANCY` case to a verdict. Before treating a red test as a real finding, rule out known
build/environment quirks and pre-existing failures.
