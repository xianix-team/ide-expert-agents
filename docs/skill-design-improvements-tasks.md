# Skill design improvements — task plan

Track progress here. Mark items `[x]` when done. Resume from the first unchecked item.

Source plan: [skill-design-improvements-plan.md](./skill-design-improvements-plan.md)

## Status

| ID | Task | Status |
|---|---|---|
| 1 | Evals baseline | **done** |
| 2 | Loader + MCP Resources | **done** |
| 3 | Pilot: `iac-generator` | pending |
| 4 | Pilot: compliance agent | pending |
| 5 | Description pass (catalog) | pending |
| 6 | Authoring guide + README | pending |
| 7 | Scripts for pilots | pending |
| 8 | Gotchas / delta pass | pending |

---

## 1. Evals baseline

- [x] Add `evals/iac-generator/` with ≥5 cases (include negative / forbidden-neighbour)
- [x] Add `evals/<compliance-agent>/` with ≥5 cases the same way (`eu-ai-act-controls-reviewer`)
- [x] Define outcome graders + simple rubrics
- [x] Record baseline: served prompt size (LLM with-skill vs bare deferred — no runner yet)

**Done when:** both pilots have runnable case files and a recorded baseline.

---

## 2. Loader + MCP Resources

- [x] Change [`mcp-server/src/agents.ts`](../mcp-server/src/agents.ts): serve entry file only; stop default sibling `*.md` concat
- [x] Support optional frontmatter `always_include: […]`
- [x] Expose `references/` via MCP Resources (or a fetch tool) so npx/Docker work
- [x] Also expose top-level supporting `*.md` as Resources (bridge until pilots move files into `references/`)
- [x] Update [`mcp-server/src/server.ts`](../mcp-server/src/server.ts) capabilities + handlers
- [x] Smoke-test ListPrompts / GetPrompt / resource fetch locally (`npm run smoke`)

**Done when:** lean prompt loads; a reference file is fetchable without disk paths.

---

## 3. Pilot: `iac-generator`

- [ ] Split into lean `SKILL.md` + `references/`
- [ ] Add routing table (task → resource)
- [ ] Add Gotchas section
- [ ] Re-run evals vs baseline; keep or revert based on results

**Done when:** served core ≤ ~500 lines / ≤ ~5k tokens and evals do not regress.

---

## 4. Pilot: compliance agent

Pick one: `eu-ai-act-controls-reviewer` or `agentic-ai-reviewer`.

- [ ] Lean core + `references/` + routing (no “load all modules”)
- [ ] Gotchas section
- [ ] Re-run evals vs baseline

**Done when:** same budgets as pilot 3; progressive fetch evals pass.

---

## 5. Description pass (full catalog)

- [ ] Rewrite each agent description: WHAT + WHEN + Do-NOT / hand-off
- [ ] Target ~50–100 tokens; cut workflow restatement
- [ ] Sync each store README + root README (docs-sync rule)

**Done when:** all ~40 agents have dense routing descriptions and READMEs match.

---

## 6. Authoring guide + README

- [ ] Add `docs/skill-authoring.md` (budgets, delta/gotchas, layout, MCP rules)
- [ ] Point store “Adding an agent” sections at it
- [ ] Update root README: replace “supporting docs auto-concatenated” with lean prompt + MCP Resources

**Done when:** new contributors have one clear contract.

Note: root + mcp-server README load-path wording already updated in Task 2. Task 6 still owns the full authoring guide.

---

## 7. Scripts for pilots

- [ ] Add `scripts/` for fragile multi-step flows on pilot agents
- [ ] Core instructs “run script X”; do not paste script source into the prompt
- [ ] Prefer stdout / artifacts

**Candidates:** `iac-generator`, later `dependency-audit`, `delivery-commitment-health-report`, `owasp-security-scanner`.

**Done when:** at least one pilot uses a script instead of a long shell recipe.

---

## 8. Gotchas / delta pass

- [ ] Review oversized agents (e.g. `deployment-architect`, `codebase-archaeology`)
- [ ] Apply deletion test: keep only what the model gets wrong
- [ ] Add Gotchas from known failures; cut encyclopedic prose

**Done when:** no unjustified served prompt above ~800 lines among reviewed agents.

---

## Resume notes

_Last session:_ Tasks **1** and **2** done. Smoke passed (`ipa` 135 lines / 3 resources; `eu-ai-act-controls-reviewer` 224 lines / 11 resources).

_Next action:_ start **3. Pilot: `iac-generator`**.

_Blocked by:_ —
