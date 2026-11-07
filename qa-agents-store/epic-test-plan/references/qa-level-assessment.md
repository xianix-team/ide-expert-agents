# QA Level Assessment — full spec (Steps 3a & 3b)

Detailed spec for the Spec-Quality Gate and `qa-level-assessment.md`. Evidence for everything in this document comes ONLY from `requirements.md` — no codebase tracing; anything the requirement does not state is **Unknown**, never inferred.

---

## Spec-Quality Gate checklist (Step 3a)

Evaluate each check as **Pass / Weak / Fail**, citing the evidence or the gap:

| # | Check | What passes |
|---|---|---|
| SQ-1 | Clear description | What is being built and why, unambiguous |
| SQ-2 | Testable ACs | Numbered (or numberable) acceptance criteria, each with a verifiable, observable outcome |
| SQ-3 | User roles identified | Every role that interacts with the feature is named |
| SQ-4 | NFRs addressed | Non-functional requirements (performance, security, PII, accessibility, compatibility) identified or explicitly marked N/A |
| SQ-5 | No contradictions | Description, ACs, and subtasks do not conflict |
| SQ-6 | Scope boundaries | In-scope / out-of-scope can be stated from the requirement |

Record the results in the document as a table `# | Check | Verdict | Evidence / Gap`, followed by the warnings carried forward (numbered) and — separately marked as informational, not gate failures — any open points the requirement itself already tracks.

### On FAIL — what to write

Write `qa-level-assessment.md` containing Section 1 (checklist table + verdict) and a numbered list of clarification questions in plain language (say what's missing, not just which check failed). Render Sections 2–5 as "Not assessed — blocked by the spec-quality gate". If the user explicitly replies to proceed anyway, record `Spec quality gate: failed — overridden by user on <date>` in Section 1 and the gate strip, then continue.

Transcript-derived requirements always get a warning note in the spec quality section, regardless of check results.

---

## `qa-level-assessment.md` structure (Step 3b)

```markdown
# <Epic-ID> — QA Level Assessment

**Epic:** <Epic Title>
**Date:** <today's date>
**Author:** QA
**Source:** requirements.md (<Jira | file | pasted | transcript-derived>)
**Recommended QA Level:** <level> (recommendation — final decision rests with QA)

## 1. Spec-Quality Gate
(checklist table + verdict from Step 3a, warnings carried forward, clarification questions, any override note)

## 2. Technical Risk Signals (Layer 1)

## 3. Business Impact Checklist (Layer 2)

## 4. QA Level Decision

## 5. Recommendation & Next Steps
```

**Plain-language rule for the whole document:** every mechanic that appears must be explained where it appears — a reader who has never seen this skill must understand every line. Internal rule labels (R0, R-U, "fired") never appear in the document; state rules in words ("an epic with high revenue or compliance risk always gets Mandatory QA").

## Section 2 — Technical Risk Signals (Layer 1)

Table `# | Signal | Finding (Yes/No/Unknown) | Evidence (AC / subtask / quoted sentence)`:

| # | Signal |
|---|---|
| T-1 | DB schema or data-migration change |
| T-2 | API contract change (new/modified endpoints, payload changes) |
| T-3 | UI change — name which portals (Admin / Owner / Customer) |
| T-4 | Pricing / billing / invoicing / revenue-recognition logic |
| T-5 | Integration touched (camera, PCP, Microlog, EV, payment) |
| T-6 | PII / compliance-sensitive data (GDPR, financial, accessibility) |
| T-7 | Cross-module or cross-portal impact |
| T-8 | Performance-sensitive / high-traffic path |

End the section with `**Unknown count:** N of 8`, immediately followed by a short note explaining it in plain words — an "Unknown" is a question the requirement doesn't answer (e.g. it never said whether the database changes); several Unknowns are refinement gaps and push the recommended level higher to be safe. (The count feeds the uncertainty rule below.)

## Section 3 — Business Impact Checklist (Layer 2)

Table `# | Factor | Rating (High/Medium/Low) | Justification (one line, grounded in the Section-2 evidence)`:

B-1 Business value / strategic importance · B-2 Stakeholders affected (which groups) · B-3 Revenue / financial impact · B-4 Customer experience impact · B-5 Reputational / trust impact · B-6 Compliance / legal / regulatory exposure · B-7 Operational impact if it fails · B-8 Blast radius (modules / portals / integrations) · B-9 Reversibility · B-10 Volume / scale of affected users

Two rating disciplines:

- **Polarity:** ratings are **risk** ratings — for B-9, High = *hard* to reverse (data migrations, irreversible billing events, third-party state).
- **Unknown handling:** a factor whose Layer-1 drivers are all Unknown may be rated Medium or High but **never Low**.

## Section 4 — QA Level Decision

Decide the level with these rules, applied **top-down; first match wins**. The rule labels (R0…R-U) are **internal decision discipline only** — they never appear in the document:

| Rule | Condition | Outcome |
|---|---|---|
| R0 (hard) | B-6 Compliance = High **or** B-3 Revenue/financial = High | **Mandatory QA** + flag: "security & compliance testing required and must be thorough" |
| R1 | ≥2 factors rated High | **Mandatory QA** |
| R2 | Exactly 1 High, **or** ≥3 Medium | **Minimal QA** |
| R3 | 0 High **and** ≤2 Medium **and** B-8 Blast radius = Low **and** B-9 Reversibility = Low | **Developer Verification — CANDIDATE** |
| R4 (fallback) | 0 High, ≤2 Medium, but R3's blast-radius/reversibility condition not met | **Minimal QA** |
| R-U (uncertainty) | Layer-1 Unknown count ≥3 | Escalate the outcome one level (DV-candidate → Minimal, Minimal → Mandatory; Mandatory stays) and state this explicitly |

Write the section as **short prose, not a rule table**:

- State the deciding rule in plain words and show that it applies — e.g. *"The QA strategy has one overriding rule: an epic with high revenue risk or high compliance risk always gets Mandatory QA — this epic has both (see Section 3)."*
- State the decision. When the revenue/compliance rule decided it, add: *"security & compliance testing is required and must be thorough."*
- Close with a short "for completeness" paragraph: would the threshold rules give the same answer (the High/Medium counts, in words), and did uncertainty raise the level (the Unknown count, in words)?

## Section 5 — Recommendation & Next Steps

Keep it short and plain:

- The recommended level.
- One "in short" paragraph naming the epic's strongest risk drivers (money, personal data, platform reach, reversibility, operational cost of failure — whichever apply) and what testing that calls for.
- **"Things to carry into the test plan" bullets** — the security & compliance flag when it applies, and any exit-gate ACs the requirement contains (e.g. "existing tests must pass unmodified").
- Next step: review in the dev + QA sync; record the confirmed level on the epic; note the final decision rests with QA.
- **Only when the recommendation is Developer Verification**, add the caveat: it is a candidate/eligibility finding only — assigning it depends on QA capacity, which this assessment cannot judge. Omit it otherwise.

---

`qa-level-assessment.html` is generated on request only — spec in `references/html-specs.md`.
