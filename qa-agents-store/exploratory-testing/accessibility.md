# Accessibility Lens (WCAG)

Explore whether everyone can use the app, not just a mouse-using sighted user. The oracle
is WCAG, organized by the four POUR principles. Automation catches only part of this —
roughly 30–40% of issues — so the keyboard and semantic checks below are done by driving
and observing, not just by running a scanner.

> This file is the **light in-session pass**. For a full WCAG 2.2 AA audit with a formal
> report, use the `ui-ux-accessibility-testing` agent instead. Caveat: some apps render to
> a `<canvas>` (e.g. Flutter CanvasKit) — there is no usable DOM/accessibility tree, so
> the semantic and axe-based checks below don't apply there; note that as a limitation
> rather than reporting false passes.

## Contents
1. POUR principles & what to check
2. Keyboard-only pass
3. Screen-reader / semantics pass
4. Visual pass (contrast, target size, reflow)
5. Automated layer — axe-core via Playwright
6. Reporting accessibility findings

---

## 1. POUR principles & what to check

WCAG groups success criteria under four principles:

- **Perceivable** — can users perceive the content? (text alternatives for images, captions,
  sufficient color contrast, content not conveyed by color alone, resizable text).
- **Operable** — can users operate it? (everything reachable and usable by keyboard, visible
  focus, no keyboard traps, enough time, no seizure-inducing motion, adequate target size).
- **Understandable** — is it clear and predictable? (readable text, consistent navigation,
  labelled inputs, clear error identification and suggestions).
- **Robust** — does it work with assistive tech? (valid semantic markup, correct ARIA,
  name/role/value exposed for custom components).

Common target is **WCAG 2.1/2.2 Level AA**. Confirm the user's target level if it matters.

---

## 2. Keyboard-only pass

Put the mouse away and traverse with Tab / Shift+Tab / Enter / Space / arrow keys.

- [ ] Every interactive element is **reachable** by Tab (links, buttons, inputs, custom
      controls, menus, modals).
- [ ] **Focus is visible** at all times — you can always see what's focused.
- [ ] **Focus order is logical** — it follows reading/visual order, not a scrambled sequence.
- [ ] **No keyboard trap** — focus can always move on; you never get stuck inside a widget.
- [ ] **Operability** — every action doable by mouse is doable by keyboard (dropdowns,
      drag-and-drop alternatives, custom sliders).
- [ ] **Modals manage focus** — focus moves into the dialog on open, is trapped within while
      open, and returns to the trigger on close.
- [ ] **Skip link** to bypass repeated nav, where applicable.

In Playwright: `await page.keyboard.press('Tab')` repeatedly and assert on
`page.evaluate(() => document.activeElement?.outerHTML)` to follow focus.

---

## 3. Screen-reader / semantics pass

You may not have a live screen reader, so inspect the accessibility tree and semantics that
a screen reader relies on.

- [ ] **Images** have meaningful `alt` text (or empty `alt=""` if decorative).
- [ ] **Form fields** have associated labels (`<label for>`, `aria-label`, or
      `aria-labelledby`) — not placeholder-only.
- [ ] **Buttons and links** have discernible accessible names (not an icon with no label).
- [ ] **Landmarks / headings** structure the page (`<main>`, `<nav>`, logical `<h1>`–`<h6>`
      order with no skipped levels).
- [ ] **Custom components** expose correct role/name/value via ARIA (a div acting as a button
      has `role="button"`, is focusable, and responds to Enter/Space).
- [ ] **Dynamic updates** are announced (`aria-live` for toasts, validation, async results).
- [ ] **State** is exposed (`aria-expanded`, `aria-checked`, `aria-selected`, `aria-invalid`).

Playwright exposes the accessibility tree via `page.accessibility.snapshot()` and
role-based locators (`getByRole`) — if you can't locate a control by its role and name, a
screen-reader user likely can't either.

---

## 4. Visual pass (contrast, target size, reflow)

- [ ] **Color contrast** — text meets AA (4.5:1 normal, 3:1 large text); UI components and
      focus indicators meet 3:1.
- [ ] **Color isn't the only cue** — errors, required fields, links aren't signaled by color
      alone (also icon/text/underline).
- [ ] **Target size** — interactive targets are large enough (WCAG 2.2 AA: 24×24 CSS px
      minimum, with spacing exceptions).
- [ ] **Reflow** — at 320 px width / 400% zoom, content reflows without horizontal scroll or
      loss; nothing clipped or overlapping.
- [ ] **Reduced motion** — respects `prefers-reduced-motion`; no unavoidable autoplay/parallax.

---

## 5. Automated layer — axe-core via Playwright

Automate the machine-checkable subset, then do the manual passes above for the rest.

```bash
npm i -D @axe-core/playwright
```

```ts
import AxeBuilder from '@axe-core/playwright';

test('a11y: dashboard has no detectable WCAG A/AA violations', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  // Report each violation; fail or warn per the user's bar
  expect(results.violations).toEqual([]);
});
```

Each violation includes the rule, impact, affected nodes, and a help URL — cite these in
the report. Be explicit that a clean axe run is **not** a clean bill of health: it doesn't
judge focus order quality, label *meaningfulness*, logical reading order, or whether a
custom widget actually works with a keyboard. Those are the manual passes.

---

## 6. Reporting accessibility findings

Per finding, record: the **WCAG criterion** (e.g. 1.4.3 Contrast), **severity/impact**,
**where** (page + element), **what's wrong vs expected**, and **evidence** (screenshot or
the axe node). Group by POUR principle so patterns are visible (e.g. systemic missing
labels across forms). Separate **automated** findings from **manual** ones so the reader
knows what tooling caught vs what exploration caught.
