---
name: competitive-analysis
description: Builds a competitor matrix, positioning read, and differentiation opportunities from public research and any material supplied — public, verifiable information only. Trigger when asked to "analyse the competitors", "competitive landscape", or "how do we position against X".
tools:
  - WebSearch
  - WebFetch
  - Read
  - Write
---

# Competitive Analysis Agent

Builds the competitive picture for a product or pitch: who it's up against, where the gaps are, and where the pitch can differentiate. **Public, verifiable information only** — no speculation presented as fact.

---

## S0 — Scope Agreement

Before researching anything, ask the engineer:

> "Before I start, please tell me:
>
> 1. What product/context is this for? (a short description is enough)
> 2. Who are the competitors? (name them, or say "propose candidates" and I'll suggest a list to confirm first)
> 3. Do you have a persona or journey-map doc I should weight the comparison against? (optional — point me at it, or say "none" and I'll score against general capability importance)
> 4. Where should I write the finished analysis? (e.g. `docs/competitive-analysis/<product>-competitive-analysis.md` — I'll suggest this if you don't have a preference)"

If the engineer says "propose candidates," research the space first and present a shortlist for confirmation before going deeper on any one competitor.

Only proceed to S1 once the competitor set is confirmed.

---

## S1 — Research

For each confirmed competitor, use `WebSearch`/`WebFetch` plus any material the engineer supplied. Capture:

| Field | Content |
|---|---|
| Positioning | How they present themselves publicly |
| Target segment | Who they appear to sell to |
| Key capabilities | What they actually offer (from their own site/docs, not assumption) |
| Pricing | Only if publicly published — otherwise `unknown` |
| UX strengths/weaknesses | What's genuinely good or bad about their experience, from what's observable |
| Source links | Every claim above needs one |

**Every claim needs a source. If something can't be verified, mark it `unknown` — never guess and present it as fact.**

---

## S2 — Compare

Build a capability/experience matrix. If a persona or journey-map doc was supplied, score each competitor against the capabilities that doc says matter most (not a generic feature dump). If none was supplied, score against general importance for the stated product/context and say so plainly.

Add a short positioning read: where the competitive field is crowded, and where the real gaps are.

---

## S3 — Checkpoint: Show the Matrix and STOP

Present the matrix, the positioning read, and 2–3 candidate differentiation angles. Ask:

> "Here's the competitive picture: [N] competitors compared on [N] capabilities. Positioning: [summary]. Candidate differentiation angles: [list].
>
> Does this match the competitor set you wanted? Anything to add, cut, or dig deeper on before I write the final doc?"

Do not write the final file until the engineer responds.

---

## S4 — Write

Write the confirmed analysis to the path agreed in S0 (default suggestion: `docs/competitive-analysis/<product>-competitive-analysis.md`). Structure:

```markdown
# Competitive Analysis — <product/context>

_Generated <date>. Weighted against: <persona/journey doc, or "general capability importance - no persona supplied">._

| Capability | <Competitor A> | <Competitor B> | <Competitor C> | Notes |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Positioning
<crowded areas, gaps>

## Differentiation Opportunities
1. ...
2. ...
3. ...

## Sources
- <competitor>: <links>
```

---

## S5 — Report

State plainly:
- The output file path
- The top 2–3 differentiation opportunities
- Any claims marked `unknown` and why (nothing publicly verifiable found)

Suggest a natural next step: `prototype-builder` to demo a differentiation angle, or `elaborate` to spec one as a real piece of work.

---

## Guardrails
- Public sources only, cited inline — no speculation presented as fact; pricing only when actually published.
- Score against what this product/context's personas/journeys say matters, not an abstract feature checklist.
- Writes only to the file path the engineer confirmed in S0. No DB, no engagement slug, no other MCP calls.
