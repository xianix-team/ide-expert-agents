# HTML deliverables & rendering specs

All HTML output for this skill: the shared house style, the two always-produced HTML deliverables (`test-mindmap.html`, `qa-review-summary.html`), and the five on-request renderings of the markdown artifacts. **On-request renderings are generated only when the user asks for HTML versions — never by default.**

---

## Shared QA document style (applies to every HTML artifact except the mindmap, which has its own look)

- Standalone, self-contained HTML; inline `<style>` block; Google Fonts import for Inter + Roboto Condensed is permitted
- CSS variables: `--primary:#0B4F7A; --primary-dark:#073655; --accent:#1DA1B4;` with matching surface, text, and badge palette
- Gradient hero header showing the epic ID + title with a meta pill (date, author)
- Table of contents in a `.toc` card (where the document warrants one)
- Tables in `.table-wrap` with a dark header row, zebra striping, and hover state
- Section headings styled consistently with the hero colour scheme

Badge classes used across artifacts:

| Class | Colour | Used for |
|---|---|---|
| `.b-critical` | red | Mandatory QA · P0 · High severity · signal finding "Yes" |
| `.b-high` | amber | Minimal QA · P1 · Medium severity |
| `.b-medium` | blue | P2 · Low severity · signal finding "No" |
| `.b-info` | neutral | Test Type badges · suggested tags |
| `.b-dv` | green, `background:#2e7d32` | Developer Verification candidate |
| `.b-unknown` | grey, `background:#5b6c76` | signal finding "Unknown" |
| `.b-hp` | green | happy-path (`⭐ HP`) marker |

### Quality gate strip

A horizontal row of gate chips with arrows between them (flex cards: `.gates` container, `.gate` chip with an uppercase name and a status badge, `.gate-arrow` "→" separators). Five chips in order:

1. **Spec Quality** — real status (Passed / Warnings / Failed / Overridden)
2. **Risk Analysis & QA Level** — the recommended level
3. **Dev Happy-Path Verification** — Pending
4. **QA Execution** — Pending
5. **Release / Production Sanity** — Pending

Gate status colours: Passed green / Warnings amber / Failed red. Gate names match the lifecycle diagram at `docs/QA-strategy/qa-lifecycle-quality-gates.html`.

---

## `test-mindmap.html` (always produced — Step 4b)

A standalone, self-contained, **interactive HTML mindmap** that decomposes the epic. This is the artifact people read to understand scope, and it is the basis for the estimate in the test plan.

### Content / structure

- **Root** — Epic ID + title
- **Level 1** — each feature / functional area, with a short one-line description of what it does
- **Level 2** — the test types that apply to that area (Functional / UI / Validation / Non-Functional / Regression — only those that apply)
- **Level 3** — scenario groups under each type

Annotate nodes where useful:

- A small **badge/pill** for priority or owner (e.g. `P0`, `Priority 0`, or a name) — colour-coded
- Dim inline notes for scope caveats (e.g. _"out of scope here"_) rendered in a muted colour

Include a **legend** that spells out what each badge means — do not assume the reader knows the priority scheme. Define the priorities explicitly (P0 = critical / blocker, P1 = important, P2 = nice to have) and label the Story pill as a Jira key. The legend also covers the node colours (Epic / Feature area / Test type).

### Look and behaviour (match the house style)

- **Dark theme**, rounded node "cards" connected by branch lines from a left spine
- **Collapsible branches** — each parent node has a toggle so users can expand/collapse
- Colour-coded badge pills for priority/owner; muted inline text for scope notes
- Fully **self-contained** — no external image files. Either hand-build the collapsible tree in inline CSS/JS, or use a mindmap library (e.g. markmap) embedded inline; do **not** depend on a separate PNG
- Legible at a glance and when zoomed, since it may be screenshotted into Jira or Confluence

The feature areas shown at Level 1 must be the same areas used in the per-area execution estimate (Section 11 of the test plan), so the estimate is traceable to the mindmap.

---

## `qa-review-summary.html` (always produced — Step 7)

A standalone HTML summary document (no markdown version) in the shared QA document style. Show the recommended-QA-level badge in the hero header next to the date pill.

Include:

1. **Epic Overview** — ID, title, brief business context
2. **Recommended QA Level & Quality Gates** — the level badge, a one-line plain-language reason, a link to `qa-level-assessment.md` (or its `.html` when that was generated on request), and a compact quality gate strip (spec above)
3. **QA Scope Summary** — what is and is not covered in this QA effort
4. **Test Case Summary** — total count with breakdown: functional / UI / validation / non-functional / P0 / P1 / P2
5. **Functional Coverage Summary** — areas covered and confidence level
6. **Non-Functional Coverage Summary** — which NFT types were included and why
7. **Regression Impact Summary** — high-risk areas identified, recommended regression scope
8. **Requirement Traceability Summary** — total ACs, covered count, not-covered count, list of uncovered ACs
9. **Requirement Gaps** — requirements that were unclear, missing, or ambiguous
10. **Clarification Points** — open questions that need product/dev input before or during testing
11. **Risks** — top risks from the impact analysis
12. **QA Recommendations** — suggested focus areas, test order, automation candidates, sign-off conditions. Point explicitly at the **Happy-Path Automation Candidates** section of `test-cases.md` as the automation backlog (the `⭐ HP` flows are the first-to-automate set).

Use KPI summary cards for: Total Test Cases | Covered ACs | Uncovered ACs | High Risks | Clarification Points | **Happy-Path Flows**.

---

## On-request renderings (only when the user asks for HTML versions)

### `qa-level-assessment.html`

Shared style, mirroring the md's five sections — including the plain-language notes (Unknown explainer, Section 4 as prose + a decision callout, not a rule table). Plus:

- **KPI cards (six):** Recommended Level | Spec Gate Verdict | High Ratings | Medium Ratings | Unknown Signals | Clarification Questions
- **Badges:** Mandatory QA → `.b-critical`, Minimal QA → `.b-high`, Developer Verification candidate → `.b-dv`; signal findings Yes → `.b-critical`, No → `.b-medium`, Unknown → `.b-unknown`; gate Passed green / Warnings amber / Failed red
- **Quality gate strip** — directly under the KPI row (spec above)

### `test-plan.html`

Shared style: gradient hero (epic ID + title, meta pill), `.toc` card, `.table-wrap` tables, consistent section headings.

### `qa-estimate.html`

Shared style — gradient hero with epic ID + title and a meta pill (date · unit · total hours · resourcing), KPI cards (Total Hours | Execution | Design | Cross-cutting | Buffer %), `.table-wrap` tables, risk factors as colour-coded badge pills, and the optional automation row visually distinguished (muted/dashed) and excluded from the KPI total.

### `test-cases.html`

Shared style, plus:

- KPI summary cards at the top: Total Cases | Functional | UI | Validation | Non-Functional | P0 Count | **Happy-Path Flows**
- Priority badges: P0 → `.b-critical`, P1 → `.b-high`, P2 → `.b-medium`
- Test Type badges in a neutral `.b-info` style
- **Happy-path marker** — render the `⭐ HP` title prefix as a green badge `.b-hp` on the row
- **Happy-Path Automation Candidates** — render the section as its own table (Flow ID | Covers | Role | Entry | Steps | Expected End State | Tag(s) | Spec Path | Naming), with the suggested tags shown as `.b-info` badges
- Traceability matrix table with a distinct header colour and `⚠` cells highlighted in amber

### `impact-analysis.html`

Shared style, with colour-coded severity badges: High → `.b-critical`, Medium → `.b-high`, Low → `.b-medium`.
