# Tooling hints

Optional, per-language tools that can supply **HIGH-confidence mechanical
evidence** for dead code and unused dependencies.

These tools are **not required**. The skill stays technology-neutral. Prefer
their output over manual grep when a tool is already present in the repo or is
clearly installable without unrelated dependency upgrades. If a tool is absent
and installing it would widen scope, rely on repository search instead and keep
confidence accordingly.

Evidence from these tools still feeds the existing confidence / priority /
classification model. A tool report is not automatic permission to delete.

---

## TypeScript / JavaScript

| Concern | Tools (examples) | Notes |
|---------|------------------|-------|
| Unused exports / dead files | `knip`, `ts-prune` | Prefer project config; respect path aliases |
| Unused dependencies | `depcheck`, `knip` | Confirm dynamic `require` / plugin loading |
| Unused CSS / exports (frontend) | `knip`, `unimported` | Framework-aware configs matter |

## Python

| Concern | Tools (examples) | Notes |
|---------|------------------|-------|
| Dead / unused code | `vulture` | Whitelist false positives for dynamic use |
| Unused dependencies | `pipdeptree`, poetry/uv unused checks | Check entry points and extras |

## C# / .NET

| Concern | Tools (examples) | Notes |
|---------|------------------|-------|
| Unused / IDE diagnostics | Roslyn analyzers, IDE0005, etc. | Respect InternalsVisibleTo / reflection |
| Unused packages | `dotnet` unused package analyzers | Check host builders and DI registration |

## Java / JVM

| Concern | Tools (examples) | Notes |
|---------|------------------|-------|
| Unused code | IDE inspections, Error Prone, etc. | Reflection / SPI / Spring can hide use |
| Unused dependencies | Maven/Gradle dependency plugins | Check annotation processors |

## Optional Jev

If Jev is available, it may only evaluate structured safety evidence
(budget exceeded, unexpected files, scope, complexity increase) as
`ALLOW` / `STOP` / `HUMAN_REVIEW`. It is not required and must not replace
agent reasoning or code edits. See `SKILL.md`.
