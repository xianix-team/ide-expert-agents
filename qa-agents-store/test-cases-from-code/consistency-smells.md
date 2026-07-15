# Consistency Smells

Code patterns that are suspicious **regardless of domain knowledge**, because the code
contradicts itself or is provably unsafe. Use in Phase 3. For each finding, record
`file:line`, a one-line description, and severity.

| Smell | What it looks like | Why suspicious without domain knowledge | Confirm by |
|---|---|---|---|
| Dead / unreachable branch | A condition that can never be true given upstream constraints or earlier guards. | Either the guard is wrong or the branch is vestigial; both are defects. | Trace the values that reach the condition. |
| Contradictory validations | Two rules that can't both hold, or one forbids what another requires. | No input can satisfy the feature; guaranteed broken path. | Find an input and check both rules against it. |
| State with no exit / orphan state | A workflow state with no outgoing transition, or a transition to a state that doesn't exist. | Users get stuck, or a path is unreachable. | Map the transition graph. |
| Reachable divide-by-zero / overflow | A divisor or accumulator that a reachable input can drive to 0 or past range. | Crash or silently wrong number on real input. | Trace the operand's possible range. |
| Overlapping / shadowed errors | Two error conditions match the same input; the first always wins, the second is dead. | One error message can never fire; logic intent is unclear. | Check condition order and overlap. |
| Boundary / off-by-one mismatch | `>` where comparable code uses `>=`, inclusive vs exclusive used inconsistently for the same quantity. | The edge case behaves differently in two places; at least one is wrong. | Compare the boundary handling across sites. |
| Inconsistent rounding / precision | The same quantity computed with different rounding or decimal precision in different places. | Totals won't reconcile; a real correctness bug (especially in money/tax math). | Compare the calculation sites. |
| Default contradicts validation | A default value that the validator for the same field would reject. | The default state is invalid; intent is incoherent. | Run the default through the validator logic. |
| Swallowed exception on a live path | `catch` that discards the error on a path where the outcome matters. | Failures vanish silently; wrong result with no signal. | Check whether the path produces user-visible output. |
| Missing enum case | An enum/constant handled in some switches but not all. | An unhandled value falls through to wrong/default behavior. | Diff handled cases against the enum definition. |
| Inconsistent authz across paths | An action gated on one entry point but reachable ungated via another. | Privilege check is bypassable; security-relevant. | Find all call paths to the protected action. |
| TOCTOU / check-then-use gap | A value checked, then used after something could have changed it. | Check and use can diverge; intermittent wrong behavior. | Inspect what can mutate the value between check and use. |

## Isolation & framework smells

These exploit conventions common in multi-tenant / ORM / DI-based codebases. Same rule:
record `file:line`, one-line description, and severity. The first is the highest-value finding
this agent produces — file it as `ISOLATION-LEAK-SUSPECTED` (route to security too); the rest
are `LIKELY-BUG-INCONSISTENCY`.

| Smell | What it looks like | Why suspicious without domain knowledge | Confirm by |
|---|---|---|---|
| **Missing tenant / ownership filter** | A query on a tenant/owner-scoped entity (a fetch/list/single call) with **no** tenant/owner predicate, where a sibling method in the same service **does** filter. If there is no global tenant query filter, the omission is silent. | Cross-tenant data leak — one tenant/account sees another's data. Detectable purely by contrast with the sibling; no domain knowledge needed. | Diff the query against filtering siblings in the same service; then prove it with a two-tenant unit probe (seed A + B, query as A, assert B is invisible). |
| **ORM property/column mapping mismatch** | A new entity property with no corresponding column mapping, while the migration/DB script creates a column under a different (convention-mangled) name. | The ORM looks for the wrong column at runtime → "invalid column name" on first query. A guaranteed runtime break, invisible at compile time. | Diff new entity properties against the ORM model configuration and the migration's column names. |
| **New filterable column with no index** | A migration adds a column used in `WHERE`/join/`ORDER BY`, or a new table queried by non-PK, with no matching index in the same change. | Invisible in dev, production slowdown once data volume grows (especially on a large shared-tenant instance). | Check the migration for an index covering the new filter/sort column; flag for PR review if absent. |
| **Framework DI / lifetime misuse** | A dependency the framework injects only one way (e.g. constructor injection) taken instead as a method parameter or resolved in the wrong scope/lifetime, so it is null or wrong at runtime. | The dependency is unavailable at runtime and throws on first use — provably wrong regardless of intent. | Check how the framework supplies that dependency vs how this code obtains it. |
