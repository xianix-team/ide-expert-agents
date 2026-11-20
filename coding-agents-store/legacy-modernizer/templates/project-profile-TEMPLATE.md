# Legacy Modernizer — Project Profile

<!--
Copy this file to the ROOT of the repository you are upgrading, named `.legacy-modernizer.md`,
and commit it. The `legacy-modernizer` agent reads it before asking any question, and does not
ask for anything answered here.

Every section is optional — delete the ones you don't need. What the engineer says in the
conversation overrides this file. Rules here can add to the agent's guardrails but cannot relax
them (approval before edits, tests never weakened, no git history rewriting).

Do not put secrets, credentials, or customer-confidential details in this file.
-->

## Upgrade target

<!-- Stack, from → to. Or "recommend" to let the agent propose a target. -->
Spring Boot 2.7 → 3.3 (Java 11 → 21)

## Scope

<!-- Paths in scope, and paths to skip. -->
- In scope: `services/orders`, `libs/common`
- Skip: `services/legacy-reports` (being retired), `**/generated/**`

## Commands

<!-- Exact commands. The agent shows them and asks before running. -->
- Build: `./mvnw -q -DskipTests package`
- Test: `./mvnw test`
- Lint / type-check: `./mvnw checkstyle:check`

## Constraints

<!-- Anything the upgrade must respect. -->
- Production runtime: containers on Java 21 are available from the platform team
- External consumers: `libs/common` is published and used by other repositories — no public API changes without a deprecation cycle
- Frozen areas: none
- Libraries that can't be replaced: none

## Branch and commits

- Branch: `upgrade/<target-slug>`, created from `main`
- Commits: one commit per batch, message prefix `chore(upgrade):`

## Plan location

`docs/modernization/`

## Extra guidance

<!-- Internal migration notes or earlier analysis the agent should read alongside the official guides. -->
- `docs/architecture/upgrade-notes.md`

## Project rules

<!-- Additional rules for this project. -->
- Every batch must keep the CI pipeline green before the next one starts
- Do not change database schemas; raise them as `Decision` items
