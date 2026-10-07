# Vibe-Code Smells

Investigation guide for AI / "vibe coding" repositories. Use with
`code-cleanup` **CLEAN** (next fix) or **ANALYZE** (report).

A smell is a signal to investigate — **not** automatically a defect.
When uncertain, leave alone / report; do not change the code.

For necessity, Fixability Gate, and approval rules: see `SKILL.md`.
For checklists: see [cleanup-checklist.md](cleanup-checklist.md).

**Feature flow:** when complexity spans a feature, reconstruct
Requirement → flow → machinery before judging individual files.

---

## 1. Duplicate solutions

**Symptoms**
- Two or more modules implement the same use case with slight naming differences
- Parallel utility folders (`helpers`, `utils`, `lib`, `common`) with overlapping functions
- Same validation, mapping, or API-client logic copied across features

**What to investigate**
- Call sites for each variant; which one is actually used in production paths
- Behavioral differences (subtle bugs often hide in the "almost duplicate")
- Tests: which implementation is covered
- Git history / comments suggesting an incomplete migration

**When it is safe to clean**
- One implementation is clearly canonical; others have no distinct behavior
- Call sites can be redirected with a small, verified diff
- Tests or manual checks cover the consolidated path

**When NOT to automatically change it**
- Variants encode different business rules or environments
- Dynamic loading makes ownership unclear
- Consolidation would require a wide rename or public API change

---

## 2. File proliferation

**Symptoms**
- Many tiny files each containing a single thin wrapper or type
- New file per micro-function without an existing folder convention for that split
- "One class/component per file" taken to extremes that hurt navigation vs local norms
- Empty or near-empty modules left after generation

**What to investigate**
- Dominant repository file-size and folder conventions
- Whether splits match real boundaries or only AI output habits
- Import graph complexity introduced by the split

**When it is safe to clean**
- Merging restores the repository's existing module pattern
- No public export surface expands unintentionally
- Build/tests still pass; navigation improves or stays equal

**When NOT to automatically change it**
- The project standard genuinely prefers fine-grained files
- Files are code-generated or plugin-loaded by path
- Merge would create an oversized mixed-responsibility module

---

## 3. Speculative abstractions

**Symptoms**
- Interfaces/protocols with a single implementation
- Factories, adapters, repositories, or strategy layers with no alternate impl
- Generic `Base*` / `Abstract*` types that only forward calls
- Premature plugin or provider systems for one consumer
- Abstractions introduced only to satisfy a design principle

**What to investigate**
- Whether a second implementation exists or is planned in-repo (docs, TODOs with owners)
- Indirection cost vs call-site clarity
- Whether the abstraction matches an established local pattern
- Capability justification: required capability vs additional flexibility
- Public contracts, DI seams, tests, plugins, or framework conventions that need the boundary

**When it is safe to clean**
- Removing the layer reveals a simpler direct call with identical behavior
- No external/public contract depends on the abstraction
- Tests target behavior, not the artificial seam
- Capability lost is not currently required and human APPROVE was obtained

**When NOT to automatically change it**
- The abstraction is a required boundary (SDK, DI, testing seam used deliberately)
- Multiple implementations exist outside the scanned tree (packages, plugins)
- Removal forces a large redesign
- Requirement ownership or future commitment is unclear (report-only)

---

## 4. Pattern inconsistency

**Symptoms**
- Mixed approaches for the same concern (e.g. three HTTP client styles)
- Inconsistent error returns, logging, or config access across siblings
- Folder A follows pattern X; Folder B reinvented pattern Y for the same job

**What to investigate**
- Which pattern is dominant and documented
- Whether inconsistency causes bugs or onboarding friction (evidence)
- Migration leftovers vs intentional dual support

**When it is safe to clean**
- Aligning a small area to the dominant pattern without behavior change
- Dual patterns are accidental and one path is unused

**When NOT to automatically change it**
- Domains genuinely differ (e.g. legacy module vs new module during planned migration)
- "Consistency" would mean a repo-wide rewrite
- No dominant pattern can be established from evidence

---

## 5. Defensive-code explosion

**Symptoms**
- Nested null checks for values the type system or invariants already guarantee
- Repeated try/catch that swallow errors "just in case"
- Redundant validation at every layer with no trust-boundary rationale
- Default fallbacks that hide programming errors

**What to investigate**
- Actual invariants and trust boundaries
- Whether defenses mask real bugs
- Logging/metrics that never fire (dead defenses)

**When it is safe to clean**
- Redundant checks are proven unreachable and removal preserves failure modes
- Swallowed errors can be aligned to existing error-handling patterns
- Change is local and covered by tests

**When NOT to automatically change it**
- Boundary validation protects untrusted input
- Runtime data can violate compile-time assumptions (dynamic languages, FFI, deserialization)
- Removing checks would change failure visibility in production

---

## 6. Comment noise

**Symptoms**
- Comments that narrate what the next line does
- AI chat residue (`Here's the updated function`, `I'll now refactor...`)
- Section banners and emoji decoration without information
- Docstrings that duplicate names/types without adding contracts

**What to investigate**
- Whether any comment documents non-obvious invariants, workarounds, or legal constraints
- Whether comments contradict the code (stale)

**When it is safe to clean**
- Pure narration or chat residue with no hidden requirements
- Clearly stale comments that mislead

**When NOT to automatically change it**
- Comments cite tickets, security rationale, or protocol quirks
- License headers or required attribution
- Uncertainty whether a "weird" comment marks a fragile workaround

---

## 7. Dependency inflation

**Symptoms**
- Large dependency lists for small applications
- Overlapping libraries for the same task
- Heavy packages used for one trivial helper
- Dependencies added in AI sessions and never referenced

**What to investigate**
- Actual import/usage of each dependency
- Stdlib/framework alternatives already used elsewhere
- Security and maintenance cost vs benefit

**When it is safe to clean**
- Unused dependencies confirmed across the repo and tooling
- Trivial usage replaceable with existing utilities without behavior change

**When NOT to automatically change it**
- Dependency is required by tooling, plugins, or optional features loaded dynamically
- Replacement would alter behavior or public APIs
- "Upgrade while removing" unrelated packages

---

## 8. Hallucinated or incorrectly used APIs

**Symptoms**
- Calls to methods/options that do not exist in the installed version
- Parameters that are ignored or mean something else in the real API
- Imports that typecheck via stubs but fail at runtime
- Copy-pasted examples that do not match project framework version

**What to investigate**
- Official docs / types for the locked dependency version
- Runtime failures, skipped tests, or `# type: ignore` / suppression comments
- Similar correct usages elsewhere in the repo

**When it is safe to clean**
- Correct usage is unambiguous for the pinned version
- Fix is localized; tests or typecheck catch regressions

**When NOT to automatically change it**
- Version skew across environments is unclear
- Behavior of the "correct" API call would change outputs
- Fix requires a framework upgrade (out of cleanup scope)

---

## 9. Happy-path-only implementations

**Symptoms**
- No handling for empty lists, missing fields, timeouts, or denied auth
- TODOs for error paths never implemented
- UI/API assumes success bodies always present
- Retries/fallback absent where sibling modules implement them

**What to investigate**
- Domain requirements and existing error patterns
- Production logs or failing tests hinting at gaps
- Whether omission is intentional MVP scope

**When it is safe to clean**
- Adding handling aligns with established patterns and does not invent new product behavior
- Change is necessary to fix a correctness defect with clear expected behavior

**When NOT to automatically change it**
- Desired failure UX/business rule is unspecified
- "Proper" handling would constitute a new feature
- Only speculative edge cases without evidence of need

---

## 10. Weak AI-generated tests

**Symptoms**
- Tests that mock the system under test until nothing real runs
- Assertions on call counts only, not outcomes
- Copy-pasted tests with renamed symbols and identical bodies
- Tests named for implementation details that break on valid refactors
- Coverage of getters/trivial code while critical paths go untested

**What to investigate**
- What behavior the test actually guarantees
- Whether failures would catch real regressions
- Dominant testing style in the repository

**When it is safe to clean**
- Replace or tighten tests to assert observable behavior without widening scope into new features
- Remove purely tautological tests that provide false confidence (only if suite remains honest)

**When NOT to automatically change it**
- Rewriting the suite for preference alone
- Deleting failing tests to green the baseline
- Expanding into large new product test matrices under "cleanup"

---

## 11. Unnecessary generalization

**Symptoms**
- Config knobs and generics for a single hard-coded case
- Over-parameterized helpers "for future use"
- Template/plugin systems with one instantiation
- Generic systems built for one concrete use case

**What to investigate**
- Real call sites and configuration values in use
- Whether generalization matches an established extension point
- Whether lost flexibility is a demonstrated requirement

**When it is safe to clean**
- Specializing to the actual case preserves behavior and simplifies call sites
- No external configurators depend on the knobs

**When NOT to automatically change it**
- Extension points are part of a public/plugin contract
- Multiple real configurations exist in deploy manifests not obvious from code alone

---

## 12. Old and new implementations coexisting after AI refactors

**Symptoms**
- `*_old`, `*_v2`, `legacy`, `new` modules both present
- Feature flag permanently selecting one path; the other still compiled
- Imports split across old/new with incomplete cutover
- Docs still describe the retired path

**What to investigate**
- Which path is live in default config and production entry points
- Remaining references (including strings, DI, reflection)
- Tests covering each path

**When it is safe to clean**
- Dead path has zero reachable references and verification is strong
- Cutover is complete; removing old code is behavior-neutral

**When NOT to automatically change it**
- Flag still toggles in real environments
- Rollback path is operationally required
- Reference search cannot rule out dynamic use

---

## 13. Responsibility drift

**Symptoms**
- UI module performing persistence and business rules
- "Service" class that orchestrates unrelated domains
- Shared kernel that accumulates unrelated helpers over AI sessions
- Files named for one concern but implementing another

**What to investigate**
- Local architecture and naming conventions
- Whether drift already causes defects or change collisions
- Natural ownership for each responsibility in the existing structure

**When it is safe to clean**
- Small moves back to existing owners without new layers
- Behavior preserved; tests updated only as needed for new locations

**When NOT to automatically change it**
- Fix implies a broad architectural redesign
- Ownership is disputed or undocumented and behavior is unclear
- Move would break public package layout

---

## 14. Unexpected diff expansion

**Symptoms**
- Cleanup of one function touches many unrelated files
- Formatting, renames, or import reshuffles dominate the diff
- Generated code or lockfiles change without intent
- Agent "while at it" improvements accumulate

**What to investigate**
- Root cause: tooling auto-format, wrong scope, cascading renames
- Whether each file change maps to the stated plan item
- Prefer **REVIEW** mode (`SKILL.md`) for a formal diff-scoped audit after
  agent sessions

**When it is safe to clean**
- Revert unrelated hunks under Human-in-the-loop; re-apply only the planned
  minimal change
- Re-run verify on the narrowed diff

**When NOT to automatically change it**
- Continue stacking fixes on an already exploded diff
- Accept drive-by upgrades or mass renames as collateral

**Rule:** If the diff expands unexpectedly, **stop and reassess**.

---

## 15. Naming / domain terminology drift

**Symptoms**
- Multiple names for the same domain entity (`User`, `Account`, `Customer`, `Client`)
- AI synonyms introduced mid-refactor (`fetchX` vs `getX` vs `loadX` for same operation)
- Folder names disagree with type names and API routes
- Misleading names that imply behavior the code does not perform

**What to investigate**
- Ubiquitous language in docs, API contracts, and dominant modules
- Whether drift causes incorrect calls or operator confusion
- Public API / serialization names that must remain stable

**When it is safe to clean**
- Local rename to the dominant term within a private module, with search-confirmed completeness
- Fixing a name that is actively misleading and privately scoped

**When NOT to automatically change it**
- Mass rename across the repository for stylistic consistency
- Renaming public contracts, DB columns, or external payloads without explicit approval
- Ambiguous domain language with no clear canonical term

---

## 16–23. Used-but-unnecessary / speculative complexity (smell index)

Full necessity rules live in **Necessity analysis** in `SKILL.md`. Use that
section for capability justification, weak justifications, hierarchy,
boundaries, and classification safety. Also use the **Vibe-code expansion
detector** in `SKILL.md` (Requirement → actual implementation).

Below: smell-specific **symptoms** only.

### 16. Used-but-unnecessary code

**Symptoms**
- Code is imported, called, compiles, and may have tests
- Machinery exists mainly for flexibility, purity, or "niceness"
- Removing or specializing it would not remove a demonstrated product behavior

### 17. Speculative / nice-to-have functionality

**Symptoms**
- Working capability with no demonstrated current or committed requirement
- Fallback provider nobody currently requires
- Optional features enabled "just in case"
- AI-added helpers that product flows never need

### 18. Premature extensibility

**Symptoms**
- Extensibility hooks with no demonstrated extension
- Provider switching with one fixed provider
- Plugin/registry systems for a single registrant

### 19. Premature scalability

**Symptoms**
- Caching, queues, sharding, pooling, or fan-out with no demonstrated load need
- Scalability infrastructure for hypothetical traffic

### 20. Hypothetical configuration

**Symptoms**
- Configuration options with no demonstrated current use
- Modes/flags for unsupported environments
- Env vars read once and always defaulted the same way

### 21. Redundant resilience

**Symptoms**
- Multiple retry layers "for safety"
- Duplicate timeouts/circuit breakers wrapping the same call
- Fallbacks that hide errors without a required recovery story

### 22. Unnecessary compatibility layers

**Symptoms**
- Compatibility code for unsupported versions
- Shims bridging APIs the repo no longer targets
- Dual serializers/clients "for migration" with migration complete

### 23. Unnecessary states / branches

**Symptoms**
- Additional states or branches that support no demonstrated behavior
- Enums/status machines with unused values still threaded everywhere
- Defensive branches for impossible or already-protected states

For items 16–23: investigate and decide using `SKILL.md` Necessity analysis.
When safe to clean / when not: same gates as SKILL (evidence, HITL APPROVE,
Report-only when uncertain, preserve intentional boundaries).
