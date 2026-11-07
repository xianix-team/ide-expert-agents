---
name: epic-test-plan
description: Create QA documentation for an epic from a Jira URL, attached file, pasted requirement, or meeting transcript. Sets up tests/features/<Epic-ID>/qa-artifacts/ and generates markdown artifacts — requirements.md, qa-level-assessment.md (spec-quality gate + risk-based QA level recommendation), test-plan.md, qa-estimate.md (detailed uncapped QA estimate), test-cases.md, impact-analysis.md — plus two HTML deliverables: qa-review-summary.html and the scope mindmap (test-mindmap.html) that is the basis for the QA estimate. HTML renderings of the markdown files are generated only when the user requests them. Also handles estimate-only runs and, on request, a client-facing testing estimate justification in the approved client format with a risk-transfer register. Use when the user provides an epic requirement or ticket, asks for a test plan / test cases / QA level assessment, says "estimate QA effort", "QA estimation for PAR-####", "justify this estimate to the client", or "testing estimate justification".
---

# Epic Test Plan & Test Cases

Generate complete QA documentation for an epic: a folder under `tests/features/<Epic-ID>/qa-artifacts/`, a requirements baseline, a QA level assessment (spec-quality gate + risk analysis recommending **Developer Verification / Minimal QA / Mandatory QA** per your team's QA strategy), test plan, a detailed QA estimate, test cases, impact analysis, and a QA review summary.

**Default output is markdown** plus two HTML-only deliverables (`test-mindmap.html`, `qa-review-summary.html`). HTML renderings of the markdown artifacts are **generated only when the user asks**. Detailed templates, tables, and specs live in `references/` — each step names the reference file to **Read before producing that artifact**.

---

## Inputs

The requirement may arrive in four forms:

1. **Jira ticket URL** — fetch the full epic via the MCP Atlassian tools (`getJiraIssue` + `searchJiraIssuesUsingJql` for child issues): Epic ID, title, description, acceptance criteria, all subtasks (with their own descriptions and ACs), attachments, and linked issues.
2. **Attached file** (md, txt, docx, pdf, etc.) — Read the file completely before proceeding.
3. **Pasted requirement text** — use exactly as provided.
4. **Meeting transcript / recording text** — save verbatim as `meeting-transcript.md`; `requirements.md` is then *derived* from it (see Step 2).

Also needed: **Epic ID** (`PAR-xxxx`) and **Epic title** — derive from the URL or content; ask only if they cannot be determined. Do **not** derive requirement content from unrelated project folders or documentation files unless the user explicitly references them.

---

## Step 1 — Create the epic folder

Create `tests/features/<Epic-ID>/qa-artifacts/` (e.g. `tests/features/PAR-XXXX/qa-artifacts/`). The folder name uses **only the Jira epic ID** — the epic title appears inside the documents, not in the path.

---

## Step 2 — Create `requirements.md`

Save the raw requirement content as `requirements.md`. **Preserve the exact source content — do NOT summarize, rewrite, paraphrase, or interpret it.** Include everything retrieved or provided: Epic ID and name, full description (verbatim), all acceptance criteria (verbatim), every subtask with its own description and ACs, attachments/external references, and linked issues/labels/metadata. Add a heading `# <Epic-ID> — <Epic Title>` if none is present.

**Purpose:** this file is the traceability baseline — written once, never modified; all QA artifacts are derived from it.

**Transcript input (form 4):** the verbatim baseline is `meeting-transcript.md`, saved exactly as provided. `requirements.md` is then *derived* from it — description, ACs the transcript actually states, roles, open points. **Do not invent** — anything the transcript doesn't support goes under `## Open points from transcript`, never into the ACs. The derived file opens with the banner:
`> **DERIVED DOCUMENT** — generated from meeting-transcript.md; NOT yet reviewed by PO/dev. Treat as provisional until reviewed.`
After creation it is frozen like any other baseline. Derived specs frequently WARN or FAIL the Step 3a gate — that's the gate doing its job, not a reason to pad the derivation.

---

## Step 3 — Analyze the requirement

Read `requirements.md` in full and extract: functional requirements, acceptance criteria (numbered), user roles, workflows, business rules, dependencies, assumptions, risks, requirement gaps, missing information, and clarification questions. If gaps or clarifications exist, document them rather than assuming. This extraction drives all artifacts and is the direct input to the gate in Step 3a.

---

## Step 3a — Spec-Quality Gate (blocking)

Runs before any QA artifact is generated. Evidence comes ONLY from `requirements.md` — no codebase tracing. Evaluate the six checks SQ-1…SQ-6 (clear description, testable ACs, roles identified, NFRs addressed, no contradictions, scope boundaries) as **Pass / Weak / Fail** — checklist table and recording format: **`references/qa-level-assessment.md`**. The gate result becomes **Section 1 of `qa-level-assessment.md`**.

Verdict:

- **PASS** — all six checks Pass.
- **PASS WITH WARNINGS** — 1–2 checks Weak, none Fail. Continue; warnings carry into Section 1 and the quality gate strip.
- **FAIL** — any check Fail, **or** ≥3 checks Weak.

**On FAIL:** write `qa-level-assessment.md` with only Section 1 plus plain-language clarification questions (per the reference), report the verdict and questions to the user, and **STOP — do not run Steps 3b–8.** Continue only on an explicit user override, recording the override in Section 1 and the gate strip.

---

## Step 3b — QA Level Assessment (`qa-level-assessment.md`)

Recommend **Developer Verification (candidate only) / Minimal QA / Mandatory QA** per your team's QA strategy. Evidence ONLY from `requirements.md`: every finding cites an AC number, a subtask key, or a quoted sentence; anything unstated is **Unknown** — never inferred from the codebase or other projects. The output is a recommendation for dev + QA review; **the final QA Level decision always rests with QA.**

**Read `references/qa-level-assessment.md` before writing** — it holds the document structure (5 sections), the Layer-1 technical signals (T-1…T-8), the Layer-2 business impact factors (B-1…B-10) with their rating disciplines, and the decision rules. Non-negotiables:

- Compliance = High **or** Revenue/financial = High → always **Mandatory QA** + the flag "security & compliance testing required and must be thorough".
- ≥3 Unknown Layer-1 signals → escalate the outcome one level and explain it in plain words.
- The document is written for humans: explain every mechanic where it appears; never print internal rule labels (R0, R-U, "fired"); write the decision section as prose, not a rule table.
- Developer Verification is only ever a **candidate**.

---

## Step 4 — Write `test-plan.md`

Create `test-plan.md` from the template in **`references/test-plan-template.md`** (sections 1–12: overview + QA level, scope-mindmap link, objective, scope, approach, environments, entry/exit criteria, risks, deliverables, QA estimate, references). Keep the plan concise — one to two pages; every testing type listed must be justified by the requirement — remove non-applicable types rather than writing placeholder content. Exit criteria **must include** the automation gate (≥1 happy-path flow from the Happy-Path Automation Candidates automated). Section 11 carries the estimate tables and must show numbers **identical** to `qa-estimate.md`.

---

## Step 4b — Build the scope mindmap (`test-mindmap.html`)

Create `test-mindmap.html` — a standalone, self-contained, **interactive HTML mindmap** decomposing the epic: Root (Epic ID + title) → Level 1 (feature areas) → Level 2 (applicable test types) → Level 3 (scenario groups). Dark theme, collapsible branches, colour-coded badge pills, and a legend — full content and style spec: **`references/html-specs.md`**. The Level-1 feature areas must be the same areas used in the per-area execution estimate (test-plan Section 11), so the estimate is traceable to the mindmap.

---

## Step 4c — Write `qa-estimate.md`

The **Tier 1 internal estimate** — the real number and the negotiation floor (audience: QA lead, tech lead, PO). **Read `references/qa-estimate.md` before writing** — it holds the document structure, grounding rules, and reconciliation rules. Method: five components (requirement reference, test design, per-area execution, cross-cutting work, buffer) + the optional automation line, in **hours**, uncapped, risk-weighted bottom-up — never shaved or padded by percentage (component definitions and risk axes: `references/test-plan-template.md` §11). Ground every scope claim in the design doc's latest decisions; do the arithmetic — subtotals and total must reconcile and match test-plan Section 11 exactly.

**Estimate-only runs** (user asks only for an estimate or a refresh): run just this step plus the Section 11 sync per the procedure in the reference — do not regenerate the other artifacts.

---

## Step 4d — Client-facing estimate justification (Tier 2 — on request only)

Produce **only when the user asks** to justify the estimate to the client ("justify this estimate to the client", "testing estimate justification", defending QA hours at a scope/sign-off meeting). It is `qa-estimate.md` compressed into a few client categories in the approved PAR-XXXX format. **Never invent a single number for the client directly** — the client document is always derived from a Tier 1 that exists first, and **every cut is logged by name in the risk-transfer register** (section 6 of `qa-estimate.md`) — never made by shaving percentages.

**Read references/client-estimate.md (compression, format, and language rules + the verify-before-handover checklist) before writing. The client doc goes wherever the user asks (typically their Downloads) — **not committed to a repo by default**.

---

## Step 5 — Write `test-cases.md`

**Every acceptance criterion must map to at least one test case.** **Read `references/test-cases.md` before writing** — it holds the document structure, the 14-column case format with column definitions, the mandatory coverage checklists (functional / UI / field-and-form validation / non-functional-when-relevant), the design techniques, happy-path rules, dedup criteria, and the traceability matrix format. Non-negotiables:

- Derive cases with formal black-box techniques (EP, BVA, Decision Table, State Transition, Pairwise, Negative/Error Guessing) — ad-hoc cases that ignore boundaries or rule combinations are a design gap.
- **Mark the happy paths:** prefix each feature area's primary success flow with `⭐ HP` (per-variant letters when consolidated — never negative/edge/boundary variants) and emit the `## Happy-Path Automation Candidates` section — self-contained ordered flows with suggested `@tag`s and spec paths; this is the automation backlog, bidirectionally linked to the `TC-###` cases.
- **Run the mandatory de-duplication pass:** cases sharing the same technique + same input class/boundary + same expected outcome merge into one; distinct boundaries and genuinely different role/type/state behaviours are **not** duplicates. State in the Test Scope Summary that the pass was applied.
- End with the **Requirement Traceability Matrix**: every AC from `requirements.md` appears; any without a test case is flagged `⚠ Not covered` with a reason.

---

## Step 6 — Write `impact-analysis.md`

Create `impact-analysis.md` in the epic folder:

```markdown
# <Epic-ID> — Impact Analysis

**Epic:** <Epic Title>
**Date:** <today's date>

## 1. Functional Impact
(table: Feature / Module | Change Type | Description)

## 2. User Impact
(table: User Role | Affected Workflow | Nature of Change)

## 3. Regression Impact
(table: Existing Feature | Risk Level | Reason | Regression Priority)

## 4. Data Impact
(table: Data Entity | Change | Validation Impact | Reporting Impact)

## 5. Integration Impact
(table: System / API / Service | Dependency Type | Impact)

## 6. Risk Assessment
(table: Risk | Category | Likelihood | Impact | Severity | Mitigation)

Risk severity levels: High | Medium | Low
```

---

## Step 7 — Write `qa-review-summary.html`

Generate `qa-review-summary.html` — a standalone HTML summary document (no markdown version) in the house style, with the recommended-QA-level badge in the hero header. Contents (12 sections: overview, QA level + quality gate strip, scope, test case summary, functional/non-functional coverage, regression impact, traceability, gaps, clarification points, risks, recommendations) and KPI cards: **`references/html-specs.md`**. The recommendations must point explicitly at the Happy-Path Automation Candidates section of `test-cases.md` as the automation backlog.

---

## Step 8 — Verify and report

Confirm the folder contains **at least** the eight expected files (nine when the input was a transcript) — epic folders may also hold the on-request HTML renderings (`qa-level-assessment.html`, `test-plan.html`, `qa-estimate.html`, `test-cases.html`, `impact-analysis.html`):

```
tests/features/<Epic-ID>/qa-artifacts/
├── requirements.md            ← exact source content, never modified
├── meeting-transcript.md      ← only for transcript input; verbatim source
├── qa-level-assessment.md     ← spec-quality gate + QA level recommendation
├── test-plan.md
├── test-mindmap.html          ← interactive scope mindmap; basis for the estimate
├── qa-estimate.md             ← detailed uncapped estimate; matches test-plan §11
├── test-cases.md
├── impact-analysis.md
└── qa-review-summary.html
```

Finish with a short summary:

- Epic ID and title
- Folder path
- Spec-quality gate verdict (and whether it was overridden)
- Recommended QA Level + the one-line reason
- QA estimate: total hours, buffer %, and the optional automation hours (marked as not included)
- Test case counts: total / functional / UI / validation / non-functional / P0
- AC traceability: covered / uncovered
- Requirement gaps identified (count and brief list)
- Open clarification questions (count and brief list)
- Any assumptions made that the user should confirm

---

## General rules

- The QA level never reduces artifact depth — all artifacts are always generated in full regardless of level.
- **Markdown by default.** HTML renderings of the markdown artifacts are generated only when the user asks (specs: `references/html-specs.md`). `test-mindmap.html` and `qa-review-summary.html` are HTML-only deliverables and are always produced.
- Avoid generic test cases — steps and expected results must be specific to this epic's data, roles, and flows.
- Identify unclear requirements and flag them in the traceability matrix and QA review summary; highlight assumptions explicitly in the review summary and impact analysis.
- Consider every user role for every feature — behaviour differences per role each warrant their own case.
- Consider regression impact for every change — even small UI changes can break existing flows.
- Prioritise meaningful coverage over volume — one precise P0 test case is worth more than five vague P2 cases.
