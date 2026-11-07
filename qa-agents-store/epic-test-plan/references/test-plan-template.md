# `test-plan.md` template (Step 4)

Create `test-plan.md` in the epic folder with the following structure:

```markdown
# <Epic-ID> — Test Plan

**Epic:** <Epic Title>
**Date:** <today's date>
**Author:** QA
**Recommended QA Level:** <level> (final decision by QA)

---

## 1. Epic Overview
(brief description of what the epic delivers and why)

### 1.1 QA Level
(2–3 lines: the recommended QA level with its one-line reason in plain words, and a link to `qa-level-assessment.md`. The level records who tests what — it does NOT scale artifact depth; all sections of this plan and all sibling artifacts are produced in full regardless of level.)

## 2. Scope Mindmap
A visual breakdown of the feature and its testing scope, produced as a separate deliverable **`test-mindmap.html`** (see Step 4b). **It is the basis for the estimate in Section 11** — the feature areas in the mindmap map one-to-one to the per-area execution estimate.

Link to `test-mindmap.html` here and briefly recap the top-level feature areas it contains.

## 3. Testing Objective

## 4. Scope

### In Scope
- Features covered
- User journeys
- Impacted components and areas

### Out of Scope
- Explicitly excluded areas

## 5. Testing Approach

### Functional Testing
### UI Testing
### Usability Testing
### Regression Testing
### Integration Testing
### Data Validation Testing
### Negative Testing
### Exploratory Testing

### Non-Functional Testing (include only what applies)
- Performance
- Security
- Accessibility
- Compatibility
- Data Privacy
- Reliability

## 6. Test Environments
(table: Product | URL | Notes)

Default environments unless the requirement specifies otherwise:

| Product | Primary Portal | Admin Portal |
|---|---|---|
| <Product A> | https://staging-portal.example.com | https://staging-admin.example.com |
| <Product B> | https://staging-portal-b.example.com | https://staging-admin-b.example.com |

Browser: Chrome Incognito, 1920×1080.

## 7. Entry Criteria
## 8. Exit Criteria
(list the epic's sign-off gates; **must include** an automation gate: "At least the main feature happy path is automated — ≥1 end-to-end flow from the Happy-Path Automation Candidates.")

## 9. Risks and Dependencies
(table: Risk | Impact | Mitigation)

## 10. Deliverables

## 11. QA Estimate

The estimate is **derived from the Scope Mindmap (Section 2 / `test-mindmap.html`)**, in **hours**, sized bottom-up by risk with **no hard caps** — a high-risk epic earns high numbers; a small clean epic earns small ones. Never shave or inflate by percentage to hit a target. The full detail (scope basis, reasoning, assumptions) lives in **`qa-estimate.md`** (Step 4c); this section carries the tables and must show identical numbers.

Five components + one optional line:

1. **Requirement reference** — time to study, review, and clarify the requirement (whole epic). Scales with requirement volume, ambiguity, and open clarification points.
2. **Test design** — time to design and write the test cases (AI-assisted, so usually modest — but size it by the epic's real complexity: number of areas, decision logic, state machines, combinatorics).
3. **Test execution** — the largest component. Estimated **per feature area** (the top-level branches of the mindmap), then summed. Weight each area up on the risk axes below.
4. **Cross-cutting work** — everything no single area owns: shared fixtures and test data setup, environment preparation, end-to-end regression line, consolidated security pass, sign-off evidence. Itemize what applies; drop what doesn't.
5. **Buffer** — re-tests, defect verification, blockers. A risk-chosen percentage (typically 10–20%; higher for one-way-door releases) of the sum of the other four. State the % used. No cap.
6. **Automation build (optional — outside the total)** — the cost of automating the ⭐ HP flows from `test-cases.md`, shown below the total and **not included** in it. If the team pulls it into scope, add it to the pre-buffer sum and recompute the buffer.

**Risk axes for weighting execution hours:** payment & billing flows · one-way doors (migrations, big-bang cutovers) · security/authz surface (public endpoints, secrets, new permission models) · tenant/operator isolation · missing automation coverage (weight the *manual* hours up; the *build* cost goes on the optional line).

Scenario counts are not repeated here — they live in `test-cases.md`.

### Execution breakdown (per feature area)

| Feature Area (from mindmap) | Hours |
|---|---|
| <Area 1> | |
| <Area 2> | |
| **Execution subtotal** | |

### Cross-cutting work

| Item | Hours |
|---|---|
| <Item 1> | |
| **Cross-cutting subtotal** | |

### Estimate summary

| Activity | Basis | Hours |
|---|---|---|
| Requirement reference | whole epic | |
| Test design | all areas | |
| Test execution | per-area breakdown above | |
| Cross-cutting work | itemized above | |
| Buffer (<X>%) | risk / re-test / defect verification | |
| **Total** | | |
| *Optional: build happy-path automation (not in total)* | *⭐ HP flows from test-cases.md* | *+N* |

## 12. References
(links to requirements.md, qa-level-assessment.md, qa-estimate.md, test-cases.md, and test-mindmap.html)
```

Keep the plan concise — one to two pages. Every testing type listed must be justified by the requirement; remove non-applicable types rather than writing placeholder content.

`test-plan.html` is generated on request only — spec in `references/html-specs.md`.
