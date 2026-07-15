# Accessibility Reference — WCAG 2.2 AA

The oracle for the accessibility track. Target conformance is **WCAG 2.2 Level AA** (A + AA)
unless the user says otherwise. WCAG 2.2 is the current W3C Recommendation (published
5 Oct 2023); it is backward-compatible with 2.1/2.0 with one change — **4.1.1 Parsing was
removed** (obsolete), so do not test for it.

Automated tooling (axe-core, Lighthouse) reliably catches only **~30–50%** of WCAG issues.
The manual passes below cover the rest — they are not optional.

## Contents
1. WCAG 2.2 — new criteria (vs 2.1)
2. Carried-over AA criteria most relevant to a web app
3. Manual passes (keyboard, semantics, visual, pointer, motion, forms/auth)
4. axe-core reference (impact levels, results shape)
5. Severity mapping (axe impact + WCAG level → P1/P2/P3)

---

## 1. WCAG 2.2 — new criteria (vs 2.1)

Nine criteria are new in 2.2. Prioritize the **AA** ones for a web app.

| SC # | Name | Level | What it checks |
|---|---|---|---|
| 2.4.11 | **Focus Not Obscured (Minimum)** | **AA** | Focused element is not *entirely* hidden by author content (sticky headers, cookie banners, toolbars). |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | Focused element is not *partially* hidden. |
| 2.4.13 | Focus Appearance | AAA | Focus indicator meets minimum size + contrast thresholds. |
| 2.5.7 | **Dragging Movements** | **AA** | Any drag action (sliders, drag-to-reorder, map pans) has a single-pointer alternative (tap/click). |
| 2.5.8 | **Target Size (Minimum)** | **AA** | Pointer targets are **≥ 24×24 CSS px**, or adequately spaced (exceptions: inline links, native controls, essential). |
| 3.2.6 | **Consistent Help** | **A** | Help mechanisms (contact, chat, help link) appear in the **same relative order** across pages. |
| 3.3.7 | **Redundant Entry** | **A** | Don't force re-entering info already provided in the same process (auto-populate or offer to select). |
| 3.3.8 | **Accessible Authentication (Minimum)** | **AA** | No cognitive-function test to log in — allow password managers/paste; offer alternatives to puzzle CAPTCHAs. |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | As above, no object-recognition/personal-content exceptions. |

---

## 2. Carried-over AA criteria most relevant to a web app

| SC # | Name | Level | Testable requirement |
|---|---|---|---|
| 1.1.1 | Non-text Content | A | Meaningful images have alt text; decorative images silenced (`alt=""` / `aria-hidden`). |
| 1.3.1 | Info & Relationships | A | Structure conveyed programmatically — headings, lists, `<table>` headers, form label associations. |
| 1.4.1 | Use of Color | A | Meaning never conveyed by color alone (errors/required/status also use text/icon/shape). |
| 1.4.3 | Contrast (Minimum) | AA | Text **4.5:1**; large text (≥18.66px bold / ≥24px) **3:1**. |
| 1.4.4 | Resize Text | AA | Text scales to **200%** without loss of content/function. |
| 1.4.5 | Images of Text | AA | Use real text, not images of text. |
| 1.4.10 | Reflow | AA | No horizontal scroll at **320 CSS px** width (≈ 400% zoom on 1280px). |
| 1.4.11 | Non-text Contrast | AA | UI components + graphical objects (icons, input borders, focus rings) **≥ 3:1**. |
| 1.4.12 | Text Spacing | AA | No clipping when line-height/letter/word/paragraph spacing is increased. |
| 1.4.13 | Content on Hover/Focus | AA | Hover/focus content is dismissible, hoverable, persistent. |
| 2.1.1 | Keyboard | A | All functionality operable by keyboard. |
| 2.1.2 | No Keyboard Trap | A | Focus can move away from any component with the keyboard alone. |
| 2.4.3 | Focus Order | A | Tab order is logical and meaningful. |
| 2.4.7 | Focus Visible | AA | Keyboard focus indicator is visible. |
| 2.5.3 | Label in Name | A | Visible label text is contained in the accessible name. |
| 3.2.3 / 3.2.4 | Consistent Navigation / Identification | AA | Repeated nav + components are consistent across pages. |
| 3.3.1 | Error Identification | A | Errors identified in text, not color/icon alone. |
| 3.3.2 | Labels or Instructions | A | Inputs have labels/instructions. |
| 3.3.3 / 3.3.4 | Error Suggestion / Error Prevention | AA | Suggest fixes; allow review/reverse for legal/financial submissions. |
| 4.1.2 | Name, Role, Value | A | Custom controls expose correct role/name/state to assistive tech. |
| 4.1.3 | Status Messages | AA | Status updates announced without focus change (ARIA live regions). |

---

## 3. Manual passes

Automated scans can't judge these — drive and observe.

### Keyboard-only operation (put the mouse away)
- [ ] Every interactive element reachable and operable via `Tab` / `Shift+Tab` / `Enter` / `Space` / arrow keys (2.1.1).
- [ ] **Tab order matches visual/reading order** (2.4.3).
- [ ] **No keyboard trap** — focus never gets stuck (2.1.2).
- [ ] **Skip link** ("skip to main content") present and working.
- [ ] Custom widgets (menus, tabs, comboboxes) follow ARIA Authoring Practices keyboard patterns.

### Visible focus (2.4.7 / 2.4.11 / 1.4.11)
- [ ] Focus indicator always visible — not `outline:none` with no replacement.
- [ ] Focused element **never fully hidden** behind sticky headers/banners (2.4.11 — new in 2.2).
- [ ] Focus ring meets **3:1** non-text contrast.

### Focus management in modals/dialogs
- [ ] Focus **moves into** the dialog on open.
- [ ] Focus is **trapped** inside while open (Tab cycles within).
- [ ] `Esc` closes; focus **returns to the trigger** on close.
- [ ] Background content is inert / `aria-hidden`.

### Screen-reader semantics (inspect the a11y tree; NVDA/VoiceOver if available)
- [ ] Landmarks present (`<header> <nav> <main> <footer>` or roles).
- [ ] **Heading hierarchy** logical, no skipped levels, one `<h1>`.
- [ ] **Alt text quality** — conveys purpose, not "image123.jpg"; decorative images silenced.
- [ ] Form **labels programmatically associated** (`<label for>` / `aria-labelledby`), not placeholder-only.
- [ ] **ARIA correctness** — valid roles/states; no ARIA where native HTML suffices ("no ARIA is better than bad ARIA"); no misused/redundant roles.
- [ ] **Live regions** (`aria-live`, `role="status"`/`alert`) announce async updates — errors, toasts, counts (4.1.3).

### Color & contrast
- [ ] Text **4.5:1** normal / **3:1** large (1.4.3).
- [ ] Non-text/UI — icons, input borders, focus rings, chart segments — **3:1** (1.4.11).
- [ ] **Meaning never by color alone** (1.4.1).

### Resize, zoom, reflow
- [ ] Text zoom to **200%** — no clipping/loss (1.4.4).
- [ ] **Reflow at 400% zoom / 320px width** — no horizontal scroll, no lost content (1.4.10).
- [ ] Text-spacing overrides don't clip content (1.4.12).

### Pointer / touch (WCAG 2.2)
- [ ] Targets **≥ 24×24 px** or adequately spaced (2.5.8).
- [ ] Drag actions have a **single-tap alternative** (2.5.7).

### Motion
- [ ] Honors **`prefers-reduced-motion`** — disables/reduces non-essential animation, autoplay, parallax.

### Auth & forms (WCAG 2.2)
- [ ] Login allows **paste / password managers**; no memory/transcription puzzle; CAPTCHA has an accessible alternative (3.3.8).
- [ ] No **redundant re-entry** of same-process data (3.3.7).
- [ ] Help mechanisms in a **consistent location/order** (3.2.6).

---

## 4. axe-core reference

- **Version:** pin `axe-core@4.12.1` (package root path — see the agent body above) for reproducible baselines.
- **Results object:** `{ violations, passes, incomplete, inapplicable, url, timestamp, ... }`.
  - `violations` — rules that failed → your defect list.
  - `incomplete` — axe couldn't decide → **needs manual review**; treat as P2 triage, never as a pass.
  - `passes` / `inapplicable` — informational.
- **Violation shape:** `{ id, impact, tags[], description, help, helpUrl, nodes[] }`; each node has
  `target[]` (CSS selector), `html`, `failureSummary`.
- **Impact levels:** `critical` > `serious` > `moderate` > `minor`.
- **Tags for WCAG A/AA incl. 2.2:** `['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']`.
- A clean axe run is **not** a clean bill of health — it doesn't judge focus-order quality, label
  *meaningfulness*, logical reading order, or whether a custom widget works by keyboard. Do the
  manual passes.

---

## 5. Severity mapping (axe impact + WCAG level → P1/P2/P3)

| QA Severity | Maps from | Rationale |
|---|---|---|
| **P1 — Critical** | axe `critical`, **or** any **Level A** blocker: keyboard trap (2.1.2), no keyboard access (2.1.1), missing form labels (3.3.2/1.3.1/4.1.2), missing alt on essential content (1.1.1), inaccessible auth (3.3.8), focus never returns / trap failure. | Blocks a user group entirely from a core task. Fix before release. |
| **P2 — Serious/Major** | axe `serious`, **or** **Level AA** failures: contrast < 4.5:1 (1.4.3), non-text contrast (1.4.11), focus not visible/obscured (2.4.7/2.4.11), target size < 24px (2.5.8), reflow break (1.4.10), status not announced (4.1.3), meaning by color alone (1.4.1). Also all axe **`incomplete`** (needs triage). | Significant barrier or degraded experience; a workaround may exist. Fix this cycle. |
| **P3 — Moderate/Minor** | axe `moderate` / `minor`, AAA-level items, cosmetic semantics (redundant ARIA, minor heading-order nits), best-practice-tagged rules. | Low user impact or polish. Backlog. |

Rules of thumb:
- **axe impact is the default anchor**, but **escalate on Level A** — an A-level violation is P1 even if axe rates it lower, because A criteria are baseline access.
- Severity is `max(tool impact, journey impact)` — a P3-rated finding that fully blocks a critical journey (e.g. checkout, login) escalates to P1.
- Always **separate automated findings from manual ones** in the report so the reader knows what tooling caught vs what exploration caught.

---

**Sources:** [WCAG 2.2 What's New (W3C/WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) ·
[axe-core API docs](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md) ·
[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing) ·
[Lighthouse accessibility scoring](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
