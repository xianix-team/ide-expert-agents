# Vibe-Code Smells

Investigation guide for AI / "vibe coding" repositories, used in **CLEAN**
(find the next fix) and **ANALYZE** (report).

A smell is a signal to investigate — **not** automatically a defect. Every
smell below goes through the same CLEAN gates (evidence, Fixability Gate,
HITL APPROVE, preserve intentional boundaries). When uncertain → leave alone /
Report-only. Necessity detail: **Cleanup Checklist → Necessity /
used-but-unnecessary**.

Each entry: **Signs** · **Check** · **Clean when** · **Leave when**.

---

## 1. Duplicate solutions / old + new coexisting

- **Signs:** same use case implemented twice with slight naming differences;
  parallel `helpers`/`utils`/`lib`/`common`; copied validation/mapping/API
  clients; `*_old`, `*_v2`, `legacy`/`new` modules; a flag permanently
  selecting one path; compat shims or dual serializers after a finished
  migration; docs describing the retired path.
- **Check:** call sites and which variant production entry points / default
  config use; behavioral differences (bugs hide in "almost duplicates");
  remaining references incl. strings, DI, reflection; tests per path; git
  history for an incomplete migration.
- **Clean when:** one variant is clearly canonical, the other has no distinct
  behavior or reachable references, and call sites move in a small verified
  diff.
- **Leave when:** variants encode different rules/environments; the flag still
  toggles somewhere real; rollback path is operationally required; dynamic use
  can't be ruled out; consolidation needs a wide rename or public API change.

## 2. Speculative abstraction / generalization

- **Signs:** interfaces, factories, adapters, strategies, `Base*`/`Abstract*`
  with one implementation or that only forward calls; plugin/provider/registry
  systems with one registrant; config knobs, generics, or "for future use"
  parameters for a single case; caching/queues/pooling with no load need;
  options for unsupported environments; env vars always defaulted the same.
- **Check:** whether a second implementation or configuration exists (incl.
  other packages, deploy manifests) or is committed in-repo; whether it's an
  established local pattern or extension point; capability justification
  (required vs additional flexibility).
- **Clean when:** removing or specializing the layer leaves a simpler direct
  path with identical behavior, no external contract or configurator depends on
  it, tests target behavior not the seam, and the lost capability isn't
  required (human APPROVE).
- **Leave when:** it's a deliberate boundary (SDK, DI, test seam, plugin/public
  contract); implementations exist outside the scanned tree; removal forces a
  redesign; future commitment is unclear (Report-only).

## 3. Defensive / resilience / branch excess

- **Signs:** null checks for values the types or invariants guarantee;
  try/catch that swallows "just in case"; validation repeated at every layer;
  fallbacks that hide programming errors; stacked retries, timeouts, or
  circuit breakers on one call; enum values or states no behavior uses;
  branches for impossible states.
- **Check:** real invariants and trust boundaries; whether defenses mask bugs;
  logging/metrics that never fire; the required recovery story.
- **Clean when:** checks are proven unreachable or redundant, removal keeps the
  same failure modes, swallowed errors align to existing error patterns, and
  the change is local and covered.
- **Leave when:** it guards untrusted input; runtime data can break compile-time
  assumptions (dynamic languages, FFI, deserialization); removal changes
  production failure visibility.

## 4. Happy-path-only implementation

- **Signs:** no handling for empty lists, missing fields, timeouts, denied
  auth; TODO error paths; callers assume a success body; retries absent where
  siblings have them.
- **Check:** domain requirements, existing error patterns, logs or failing
  tests showing the gap, whether it's intentional MVP scope.
- **Clean when:** it fixes a correctness defect with clear expected behavior,
  following established patterns.
- **Leave when:** the failure UX/business rule is unspecified; proper handling
  is a new feature; edge cases are speculative.

## 5. File proliferation / responsibility drift

- **Signs:** many tiny single-wrapper files; near-empty generated modules;
  splits that don't match local conventions; UI doing persistence or business
  rules; a "service" spanning unrelated domains; files named for one concern
  doing another.
- **Check:** dominant file-size/folder conventions; whether splits match real
  boundaries; import-graph cost; whether drift already causes defects or
  change collisions; natural owners in the existing structure.
- **Clean when:** a small merge or move restores the existing pattern without
  new layers or an expanded public export surface.
- **Leave when:** the project prefers fine-grained files; files are generated
  or plugin-loaded by path; the merge creates a mixed-responsibility module;
  the fix implies redesign or breaks public package layout.

## 6. Pattern inconsistency / naming drift

- **Signs:** several styles for one concern (HTTP clients, error returns,
  logging, config access); one entity with many names (`User`/`Account`/
  `Customer`); `fetchX`/`getX`/`loadX` for one operation; misleading names.
- **Check:** which pattern or term is dominant and documented (docs, API
  contracts, main modules); whether the drift causes bugs or wrong calls;
  migration leftovers vs intentional dual support.
- **Clean when:** a small, privately scoped area aligns to the dominant
  pattern/term with search-confirmed completeness, or a name is actively
  misleading.
- **Leave when:** domains genuinely differ; alignment means a repo-wide rewrite
  or mass rename; public contracts, DB columns, or payloads would change; no
  dominant pattern can be shown.

## 7. Dependency inflation

- **Signs:** big dependency lists for small apps; overlapping libraries;
  heavy packages for one trivial helper; deps added in AI sessions and never
  imported.
- **Check:** actual imports/usage (see **Tooling hints**); stdlib/framework
  alternatives already used; maintenance and security cost.
- **Clean when:** unused across repo and tooling, or trivial use is replaceable
  by existing utilities with no behavior change.
- **Leave when:** needed by tooling, plugins, or dynamically loaded features;
  replacement changes behavior/APIs; it would mean unrelated upgrades.

## 8. Hallucinated or misused APIs

- **Signs:** methods/options missing from the installed version; ignored or
  misread parameters; imports that pass stubs but fail at runtime; examples
  for another framework version.
- **Check:** docs/types for the locked version; runtime failures, skipped
  tests, suppression comments; correct usages elsewhere in the repo.
- **Clean when:** correct usage is unambiguous for the pinned version and the
  fix is local with tests/typecheck as a net.
- **Leave when:** version skew across environments is unclear; the correct call
  changes outputs; it needs a framework upgrade.

## 9. Weak AI-generated tests

- **Signs:** the system under test mocked away; call-count-only assertions;
  copy-pasted bodies; tests tied to implementation details; trivial code
  covered while critical paths aren't.
- **Check:** what behavior each test actually guarantees; whether it would
  catch a real regression; the repo's dominant test style.
- **Clean when:** tightening assertions to observable behavior, or removing
  tautological tests while the suite stays honest.
- **Leave when:** it's preference-only rewriting; it means deleting failing
  tests to go green; it grows into a new test matrix.

## 10. Comment noise

- **Signs:** comments narrating the next line; AI chat residue ("Here's the
  updated function"); decorative banners/emoji; docstrings that repeat
  names/types.
- **Check:** whether a comment records an invariant, workaround, ticket,
  security or legal constraint; whether it contradicts the code.
- **Clean when:** it's pure narration/residue, or clearly stale and misleading.
- **Leave when:** it cites tickets, security rationale, or protocol quirks; it's
  a license/attribution header; it may mark a fragile workaround.

## 11. Used-but-unnecessary / speculative functionality

- **Signs:** code that's imported, called, compiles, maybe tested — but exists
  for flexibility or "niceness"; a working capability with no current or
  committed requirement (fallback provider nobody needs, features enabled
  "just in case", AI-added helpers no flow uses).
- **Check / decide:** **Cleanup Checklist → Necessity / used-but-unnecessary**
  and **Vibe-code expansion** in the CLEAN workflow (Requirement → actual
  implementation).

## 12. Unexpected diff expansion

- **Signs:** cleaning one function touches many unrelated files; formatting,
  renames, or import reshuffles dominate; generated code or lockfiles change
  without intent; "while at it" fixes pile up.
- **Check:** root cause (auto-format, wrong scope, cascading renames); whether
  every changed file maps to the approved item. Use **REVIEW mode** for a
  formal diff-scoped audit after agent sessions.
- **Clean when:** reverting unrelated hunks under HITL and re-applying only the
  planned minimal change, then re-verifying the narrowed diff.
- **Never:** keep stacking fixes on an exploded diff or accept drive-by
  upgrades/mass renames as collateral.

**Rule:** if the diff expands unexpectedly, **stop and reassess**.
