# Usability Lens (UI/UX)

Explore whether the app is clear, consistent, and pleasant to use. The primary oracle is
the team's own design source of truth — a `Design.md`, design system, or style guide in the
repo. Test the UI against what that document specifies. Where no such document exists, fall
back to Nielsen's heuristics.

## Contents
1. Locate and load the design oracle
2. Testing against the design spec
3. Fallback — Nielsen's 10 heuristics
4. Common UX defect patterns
5. Reporting usability findings

---

## 1. Locate and load the design oracle

Before evaluating, find the standard you're evaluating against:

1. Search the repo for the design source:
   ```bash
   find . -iname 'design.md' -o -iname 'design-system*' -o -iname 'styleguide*' \
     -o -iname 'STYLE.md' 2>/dev/null | grep -vi node_modules
   ```
   Also check common spots: repo root, `/docs`, `/design`, a Storybook config, or a
   `README` section on design.
2. **Read it fully** before testing. It is the claims-oracle: the UI is "wrong" where it
   contradicts what this document says.
3. If you can't find one, tell the user you're falling back to Nielsen's heuristics
   (section 3) and proceed — but note it, since a missing or misplaced design spec may
   itself be worth flagging.

---

## 2. Testing against the design spec

Treat each thing the document specifies as a checkable expectation. Typical contents and
how to test them:

- **Design tokens** — colors, typography scale, spacing units. Spot-check rendered values
  against the documented tokens; flag off-scale spacing, off-palette colors, wrong weights.
- **Components** — documented components (buttons, inputs, cards, modals) should match in
  appearance, sizing, and the variants defined. Flag ad-hoc components that should reuse a
  standard one.
- **States** — if the doc defines hover / focus / active / disabled / loading / error /
  empty states, verify each actually exists and matches. Missing empty and error states are
  among the most common gaps.
- **Layout & grid** — alignment, breakpoints, max-widths. Check the UI honors them.
- **Responsive behavior** — test the documented breakpoints; confirm the layout adapts as
  specified rather than breaking or overflowing.
- **Voice & tone** — if the doc specifies microcopy/tone, check labels, errors, and empty
  states follow it (e.g. plain, human error messages vs raw codes).
- **Interaction / motion** — documented transitions, durations, feedback patterns.

For each, the test is: render the relevant screen/state in the browser, observe, compare to
the doc, and record any divergence as a finding citing the specific rule.

---

## 3. Fallback — Nielsen's 10 heuristics

When there's no design oracle, evaluate against these well-established usability heuristics
(heuristic evaluation):

1. **Visibility of system status** — the app keeps users informed (loading, saved, progress).
2. **Match between system and real world** — familiar language and concepts, not jargon.
3. **User control and freedom** — clear exits, undo/redo, cancel; no dead ends.
4. **Consistency and standards** — same thing looks/behaves the same; follows platform norms.
5. **Error prevention** — designs that stop mistakes before they happen (confirmation,
   constraints, good defaults).
6. **Recognition rather than recall** — options visible; users needn't remember across screens.
7. **Flexibility and efficiency** — shortcuts/accelerators for frequent users.
8. **Aesthetic and minimalist design** — no irrelevant clutter competing with the essentials.
9. **Help users recognize, diagnose, recover from errors** — plain-language errors that say
   what happened and how to fix it.
10. **Help and documentation** — discoverable help where needed.

Walk the app applying each as a lens; note where the UI violates one.

---

## 4. Common UX defect patterns

High-yield things to probe regardless of oracle:

- **Missing feedback** — an action with no visible response (did the save work?).
- **Unclear errors** — raw codes, vague "something went wrong", or errors that don't say how
  to fix it.
- **Broken empty / loading / error states** — a list with no items shows a blank void;
  a slow call shows nothing; a failed call shows a broken page.
- **Inconsistent components** — three button styles for the same action; varying labels for
  the same concept.
- **Responsive breakage** — overflow, clipping, overlap, tiny tap targets on small viewports.
- **Confusing navigation** — no clear "where am I", no way back, hidden primary actions.
- **Destructive actions without confirmation or undo.**
- **Form friction** — unclear required fields, lost input on error, no inline validation.
- **Inconsistent state after the fact** — UI not reflecting a change until refresh.

Drive these in the browser across viewports; capture screenshots as evidence.

---

## 5. Reporting usability findings

Per finding, record: **where** (screen/component), **what** (the issue), **which rule** it
violates (cite the design spec section, or the Nielsen heuristic if using the fallback),
**impact** on the user, and **evidence** (screenshot). Distinguish **objective** violations
(contradicts a documented design rule) from **heuristic** observations (judgment calls) —
the first are clear defects; the second are recommendations the human should weigh. Don't
present taste as fact; usability has a subjective edge, and the human curates the call.
