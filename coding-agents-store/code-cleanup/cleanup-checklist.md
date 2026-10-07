# Cleanup Checklist

Technology-neutral checklist for the `code-cleanup` skill.

In **CLEAN** mode: use sections as a search aid for the *next* worthwhile
fix — not as a requirement to complete every box before fixing.

In **ANALYZE** mode: work through sections more thoroughly for a report.

A checked item means "investigated with evidence," not "must change."

---

## How to use (CLEAN)

1. Understand repo + baseline.
2. Scan for the next high-value, fixable item (waste → simplify → quality →
   unnecessary work → security).
3. Fixability Gate (see `SKILL.md`) before bothering the human.
4. Park other candidates internally; do not build F1–F30 first.

---

## Remove waste

- [ ] Dead / unreachable code
- [ ] Unused files, exports, methods, classes
- [ ] Unused dependencies or config
- [ ] Old and new implementations both present
- [ ] AI leftovers, commented-out code
- [ ] Speculative features / unused flags / stubs never selected
- [ ] Unnecessary wrappers, interfaces, factories, providers
- [ ] Unused states/branches
- [ ] Generated artifacts accidentally committed

**Before deleting:** static refs, DI, reflection, dynamic/string routes,
config loading, plugins, serialization, CLI, public contracts, tests, runtime.

---

## Feature flow / vibe-code expansion

- [ ] Reconstruct Requirement → feature flow → implementation machinery
- [ ] Every layer owns a real responsibility (not preference)
- [ ] Simple requirement was not expanded into provider/factory/registry stacks

See `SKILL.md` (Vibe-code expansion) and [vibe-code-smells.md](vibe-code-smells.md).

---

## Correctness

- [ ] Behavior matches documented/tested intent where known
- [ ] Domain-required edge cases handled (not every imaginable edge)
- [ ] Partial failures leave a safe state
- [ ] Regressions not hidden by weakened checks

---

## Duplication

- [ ] Near-identical logic with same responsibility
- [ ] Copy-paste drift causing inconsistent behavior
- [ ] Parallel helpers solving the same problem differently

**Do not force DRY** across different domains.

---

## Complexity / simplify bulky code

- [ ] Large methods/classes with multiple responsibilities
- [ ] Deep nesting / repeated conditions
- [ ] Repeated mapping, validation, error handling
- [ ] Forwarding wrappers / abstraction chains
- [ ] Generic solutions for one concrete use case
- [ ] Excessive defensive logic / unnecessary state machines

Prefer simpler existing code — not a new "cleaner" architecture.

---

## Necessity / used-but-unnecessary (Analyze detail)

Lightweight questions live in `SKILL.md`. Use this section for deeper
Analyze work or Show-why detail.

Quick ask:

1. What does it do?
2. Why does the app need it?
3. What breaks if removed/simplified?
4. Is that capability required today?
5. Can existing repo code do it more simply?

Capability justification (when proposing simplification):

```text
Current required capability:
Additional capability introduced:
Evidence additional capability is required:
Simpler alternative:
Capability lost by simplification:
Evidence loss is acceptable:
Uncertainty:
```

Weak justifications alone (not enough to keep *or* delete): "future-proof",
"more flexible/scalable", "SOLID/DRY/best practice", "nice to have", "just in case".

Justification hierarchy (stronger → weaker): runtime behavior → public
contracts → product requirements → security/correctness invariants →
deploy/infra → tests → runtime config → established boundaries → docs →
committed near-term plans.

Preserve intentional boundaries: public contracts, established DI, real test
seams, security, plugins, dynamic loading, framework conventions.

Checklist:

- [ ] Complexity required by current behavior?
- [ ] Capability lost if removed — is it required?
- [ ] Already solved elsewhere in the repo?
- [ ] Real boundary vs preference?
- [ ] Speculative / future-proof without commitment?
- [ ] Existing patterns express required behavior more simply?
- [ ] Would change reduce conceptual machinery?

When uncertain → leave alone / Report-only. Optional tools:
[tooling-hints.md](tooling-hints.md).

---

## Architecture / responsibility

- [ ] Boundaries match how the repo actually works
- [ ] Coherent ownership relative to local conventions
- [ ] Responsibility drift causing defects or change friction

**Do not** redesign toward Clean Architecture for taste.

---

## Dependencies

- [ ] Declared deps are used
- [ ] Overlapping libraries for same capability
- [ ] Trivial use replaceable by stdlib/framework/repo utils

No unrelated upgrades as "cleanup."

---

## Error handling

- [ ] Empty catch / log-and-ignore / converted to success
- [ ] Lost error information
- [ ] Inconsistent throw vs sentinel patterns
- [ ] Missing resource cleanup on failure

Align with existing repo error patterns.

---

## Security (first-class)

Trust boundary: External input → API → validation → authn/authz → logic →
DB/FS/external.

- [ ] Hard-coded secrets / credentials or sensitive data in logs
- [ ] Client-controlled IDs trusted
- [ ] Missing authZ / auth bypass
- [ ] Injection, unsafe command/URL/file/deserialization
- [ ] Path traversal / SSRF-style fetch
- [ ] Insecure defaults, overly broad CORS, token mishandling
- [ ] Error leakage; dangerous install hooks

Evidence required. Prefer **smallest secure fix**. No invented vulns. No new
security architecture for a local hole.

---

## Testing

- [ ] Critical paths untested where the repo otherwise tests
- [ ] Mock-only / tautological / implementation-detail tests
- [ ] Flaky timing assumptions

Do not weaken failing tests to green the baseline.

---

## Performance (first-class — remove work first)

**Can we stop doing this work entirely?** then optimize if needed.

- [ ] Repeated DB/API/JSON/mapping/calculations
- [ ] N+1; over-fetch; work before early exit
- [ ] Duplicate validation across layers
- [ ] Unnecessary polling; unbounded caches/collections
- [ ] Blocking in async flows; obvious safe concurrency skipped
- [ ] Unnecessary allocations/copies / file reads

Evidence required. No speculative micro-opts. No caching/queues/batching
without justification.

---

## Documentation

- [ ] Setup docs contradict reality
- [ ] AI chat residue / narrating comments
- [ ] Stale architecture docs

Prefer delete/update over new doc layers.

---

## Analyze classification (when reporting)

**Types:** Correctness, Security, Architecture, Maintainability, Duplication,
Dead Code, Dependency, Performance, Testing, Documentation,
Unjustified Complexity.

**Buckets:** Actionable / Report-only / Non-actionable. Uncertain → Report-only
or leave alone.

**Confidence** (separate from priority): High = demonstrated (exec/tests/build/
lint/tools/runtime/clear contradiction). Medium = strong static, impact/intent
unverified. Low = important context unknown → normally leave alone.

**Priority** (lowest supported by evidence): Critical = confirmed severe
security / data loss / cannot operate. High = confirmed important broken
behavior or security/build failure. Medium = concrete maintainability /
unjustified complexity with understood loss / test weaknesses. Low = localized /
docs / minor.

Never raise priority on hypotheticals alone. A smell is not automatically a
defect.

---

## Fixability / change gates (before CLEAN edit)

- [ ] Fixability Gate passed (`SKILL.md`)
- [ ] Change budget recorded
- [ ] Workspace baseline captured (user pre-existing files untouched)
- [ ] Creation/dependency guards if adding files/deps
- [ ] Net complexity expected to reduce or stay equal

If any fail → leave alone or investigate — do not modify.
