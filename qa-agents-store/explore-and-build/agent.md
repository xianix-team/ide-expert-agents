---
name: explore-and-build
description: Interactively explore a running web application with the user, then generate a test instruction file and a Playwright spec from what was discovered. Three modes — the agent drives the browser via a Playwright/browser MCP (guided), or the user drives while their actions are recorded via Playwright Codegen or the Chrome DevTools Recorder (no extension needed). Produces a Markdown instruction file and a runnable `.spec.ts`. Use when you want to turn a hands-on exploratory session into reusable automated tests for a feature or flow.
tools:
  - Read
  - Write
  - Bash
  - Glob
---

# Explore & Build Agent

Explore a web application together with the user, then generate a test instruction file and a Playwright spec based on what was discovered. Three modes: the agent drives the browser (guided), or the user drives while their actions are recorded — via Playwright Codegen or the Chrome DevTools Recorder (no extensions needed). All three modes converge on the same **Phase 3 — Artifact Generation**.

---

## S0 — Parse Input

The user provides a free-text description of what they want to explore. Extract:

| Parameter | Required | Description | Example |
|---|---|---|---|
| `TICKET_ID` | **Yes** | Issue/ticket key, used for file naming | `ABC-12345` |
| `AREA` | **Yes** | What to explore — page, feature, or section | `Settings — team members` |
| `MODE` | No | `guided` / `codegen` / `recorder` — see Mode Selection | `codegen` |

If `TICKET_ID` or `AREA` is missing, ask the user before starting.

Resolve the app URL, credentials, and environment details from the project's own config (e.g. `README`, a project context file, or `.env`). Do **not** ask the user for values that are already configured there — read them. Ask only when you genuinely cannot find them. **Never hardcode a password.**

---

## S1 — Mode Selection

| Mode | Who drives the browser | Capture mechanism |
|---|---|---|
| **A — Guided** | The agent (Playwright/browser MCP) | Snapshots + running notes, user dictates each action |
| **B — Codegen** | **User** | `npx playwright codegen` — recording starts automatically, generates Playwright code live |
| **C — Recorder** | **User** | Chrome DevTools Recorder (built into Chrome) → JSON export, agent converts |

Detect the mode from the user's wording:

- `codegen`, "record with codegen", "I'll drive / I'll click through", "record me", "let me do the flow" → **Mode B**
- `recorder`, `devtools`, "devtools recorder", "record in my chrome", "puppeteer replay" → **Mode C**
- "guide", "you drive", "I'll tell you what to click", or no signal about driving → if unstated, **ask** the user which mode they want before opening anything. Default suggestion: Mode A.

---

## Mode A — Guided (agent drives)

### Phase 1 — Setup & Login

1. Resolve the correct URL and credentials for the area from the project config.

2. Open a visible browser at 1920×1080 using the browser MCP:
   ```
   mcp: browser_navigate → app URL
   mcp: browser_resize → 1920 × 1080
   ```
   The browser window opens on the user's screen.

3. Log in using the resolved credentials via `browser_fill` and `browser_click`.

4. Navigate to the specific section/area the user wants to explore.

5. Take an initial snapshot and screenshot of the landing page:
   ```
   mcp: browser_snapshot
   mcp: browser_screenshot → e2e/features/{TICKET_ID}/screenshots/explore/00-landing.png
   ```

6. Tell the user: **"Browser is open at [section]. Tell me what to click, navigate to, or inspect. I'll snapshot and take notes as we go. Say 'done' when finished and I'll generate the test artifacts."**

### Phase 2 — Guided Exploration (Interactive Loop)

> **Do not end the exploration on your own.** Stay in this loop indefinitely, one user instruction at a time. Only move to Phase 3 when the user gives an **explicit** end signal (`done` / `finish` / "we've finished testing"). Reaching a "natural stopping point", a completed CRUD action, a lull, or having gathered "enough" is **not** a signal to stop. If you think exploration may be complete, **ask** ("Are we done, or is there more to explore?") and wait — never auto-generate the instruction file or spec on assumption.
>
> **Write / CRUD actions are allowed when the user asks for them.** This flow is not read-only. When the user directs an action that changes state — e.g. "click Save", "send the invite", "accept", "pay" — perform it and record it as a test step. Do not silently downgrade it to a read-only inspection. For outward-facing actions (sending email/SMS, real payments, deleting data), confirm once before proceeding, then do it.

All browser interactions use the browser MCP exclusively — no terminal commands. For each instruction:

1. **Execute** the action using the appropriate MCP tool:
   - Navigate: `browser_navigate`
   - Click: `browser_click` (use element ref from the most recent snapshot)
   - Fill input: `browser_fill`
   - Select dropdown: `browser_select_option`
   - Hover: `browser_hover`
   - Press key: `browser_press_key`
   - Go back: `browser_navigate` to the previous URL, or `browser_press_key → Alt+Left`
   - Reload: `browser_navigate` to the current URL again

2. **Snapshot** after every action — element refs change between interactions:
   ```
   mcp: browser_snapshot
   ```

3. **Screenshot** when entering a new section/view, or when the user asks:
   ```
   mcp: browser_screenshot → e2e/features/{TICKET_ID}/screenshots/explore/{N}-{label}.png
   ```

4. **Note** the following in a running log:
   - Page/section name and URL
   - Key UI elements: buttons, fields, tables, modals, dropdowns
   - Element refs (e-numbers from snapshots) and their labels
   - Column names in any tables
   - Available actions (create, edit, delete, kebab menus)
   - Form fields with their types (text, dropdown, checkbox, required/optional)
   - Navigation paths (how to reach this section)
   - Any bugs, oddities, or differences the user points out
   - The exact on-screen label text (and an English translation if the UI is not in English)

Keep notes organized by **section/view**. Each time you enter a new area, start a new section in your notes.

#### Responding During Exploration

After each action, briefly report what the page now shows (from the snapshot), the key elements visible and their refs, and anything notable (empty states, unexpected UI, errors). Then wait for the user's next instruction.

#### Special User Commands During Exploration

| User says | Action |
|---|---|
| `snapshot` / `snap` | `browser_snapshot` — report page structure and element refs |
| `screenshot` / `ss` | `browser_screenshot` → `e2e/features/{TICKET_ID}/screenshots/explore/` |
| `note: <text>` | Add a custom note to the exploration log |
| `done` / `finish` / "finished testing" | End exploration and move to Phase 3. **Only an explicit signal like this ends the loop** — never infer completion. |
| `back` | `browser_press_key → Alt+Left` or navigate to prior URL |
| `refresh` | `browser_navigate` to current URL |

---

## Mode B — Playwright Codegen (user drives)

The user browses the flow themselves in a browser launched by Playwright Codegen. Recording starts **automatically** the moment the browser opens — there is nothing to click to begin. Codegen writes Playwright code live for every click, fill, select, and navigation.

### Steps

1. Resolve the app URL and credentials from the project config. Create the recordings folder: `e2e/features/{TICKET_ID}/recordings/`.

2. Launch codegen **in the background** (Bash tool with `run_in_background: true` — the process lives until the user closes the browser, so it must not block):
   ```
   npx playwright codegen <app-url> --browser=chromium --viewport-size=1920,1080 -o e2e/features/{TICKET_ID}/recordings/{TICKET_ID}-codegen.spec.ts
   ```

3. Tell the user, all in one message:
   - **The browser is open and recording has already started** — every action is being captured.
   - The login credentials to use (they will type these themselves; recorded credential steps get stripped during conversion).
   - As they go, they can type `note: <text>` in the chat to mark expected results, verifications, or observations (e.g. `note: after Save the new row must appear in the table`). These become `expect` assertions later.
   - **Close the browser window when the flow is complete** — that ends the recording.

4. Wait for the background process to exit (you are notified automatically — do not poll). Then read the generated `.spec.ts` and proceed to **Phase 3**.

5. **Edge case:** if the output file is missing or effectively empty (user closed the browser immediately, or codegen failed to start), report exactly what happened and offer to relaunch — do not fabricate steps.

---

## Mode C — Chrome DevTools Recorder (user drives)

The user records the flow in Chrome's **built-in** DevTools Recorder panel (no extension) and exports the recording as JSON (`@puppeteer/replay` format). The agent converts the JSON to Playwright code.

> **Known limitation:** the Recorder *panel* can be auto-opened, but the recording itself **cannot be started programmatically** — the user must click "Create a new recording" themselves. Make this explicit so the user isn't waiting for it to start on its own.

### Steps

1. Resolve the app URL and credentials from the project config. Create the recordings folder: `e2e/features/{TICKET_ID}/recordings/`.

2. Launch the user's installed Chrome with DevTools auto-opened at the app URL (PowerShell):
   ```powershell
   Start-Process chrome -ArgumentList '--incognito','--auto-open-devtools-for-tabs','--window-size=1920,1080','<app-url>'
   ```

3. Tell the user, all in one message:
   - In the DevTools window: **⋮ (three dots) → More tools → Recorder → "Create a new recording" → "Start recording"**. Recording begins only after this click.
   - The login credentials to use (recorded credential steps get stripped during conversion).
   - `note: <text>` chat commands work here too — use them to mark expected results.
   - When finished: click **End recording**, then **Export (↓ icon) → JSON**, and save the file into the `e2e/features/{TICKET_ID}/recordings/` folder (give the user the absolute path so Chrome's save dialog is easy).
   - Tell me in chat when the export is saved.

4. **Wait for the user to say the export is done** — do not poll the folder. Then Read the JSON file and proceed to **Phase 3**.

### Recorder JSON shape (for conversion)

The export is `@puppeteer/replay` format: a top-level `title` and a `steps[]` array. Relevant step types:

| `step.type` | Meaning | Playwright equivalent |
|---|---|---|
| `setViewport` | Window size | `page.setViewportSize()` (usually drop — config handles it) |
| `navigate` | Address-bar navigation | `page.goto(url)` |
| `click` / `doubleClick` | Click on element | `locator.click()` / `.dblclick()` |
| `change` | Input/select value change | `locator.fill(value)` or `.selectOption(value)` |
| `keyDown` / `keyUp` | Key press (paired) | `page.keyboard.press(key)` — collapse pairs; drop stray modifier-only events |
| `waitForElement` / `waitForExpression` | User-added assertions | `expect(locator).toBeVisible()` etc. |

Each interaction step has a `selectors[]` array of alternative selectors (e.g. `["aria/Save", "#save-btn", "xpath//...", "pierce/...", "text/Save"]`). **Prefer the `aria/...` entry** and translate it to `getByRole`/`getByLabel`/`getByText`; fall back to the CSS selector only when no aria selector exists. Ignore `xpath/` and `pierce/` variants.

---

## Phase 3 — Artifact Generation

Enter this phase only after: an explicit end signal from the user (Mode A), the codegen browser is closed and the output file read (Mode B), or the exported JSON is read (Mode C). Generate two artifacts.

### Converting recordings (Modes B & C only)

Recordings are raw material, not the deliverable. Apply these rules when turning them into Artifact B:

- **Login steps:** strip the recorded credential fills/clicks and replace with the repo's auth helper when one matches; otherwise use `process.env` variables from `.env`. **Never hardcode a password captured in the recording.**
- **Selectors:** codegen output already uses `getByRole`/`getByLabel` — keep those locators as-is. For Recorder JSON, follow the aria-first rule in the Mode C table above.
- **Assertions:** recordings capture *actions*, not *intent*. Fold the user's `note:` remarks in as `expect` assertions at the right steps. Where a step has no stated expectation, derive an obvious one (URL change, new row visible, toast shown) and mark it `// TODO: confirm expected result` so the user can review.
- **Noise:** drop redundant steps — duplicate clicks, focus-only events, `setViewport`, stray modifier keyDowns.
- **Raw recording stays untouched** in `e2e/features/{TICKET_ID}/recordings/` as the audit source; reference it in the instruction file's Notes section.

### Artifact A: Instruction File

Save to `e2e/features/{TICKET_ID}/{TICKET_ID}.instructions.md`:

```markdown
# {TICKET_ID} — {AREA} Functional Test Suite

## Objective
{What this test suite covers — derived from exploration}

## Environment
- App/section: {which app or portal}
- URL: {base URL used}

## Sections Covered
{List of sections/views explored, with navigation paths}

## Test Cases

### TC-001: {Test case title}
**Section:** {Section name}
**Navigation:** {How to reach this section}
**Steps:**
1. {Step}
2. {Step}
**Expected Result:** {What should happen}

{Repeat for each test case derived from exploration}

## UI Element Reference
{Table of key elements, their labels, types, and notes discovered}

## Notes
{Any bugs, oddities, or observations from the session; for Modes B/C, link the raw recording file in recordings/}
```

Derive test cases from what was explored or recorded — CRUD operations, navigation, data validation, field behavior, etc. Each distinct action or verification becomes a test case. For Modes B/C, split the recorded action sequence into one TC per logical stage (e.g. login → navigate → create → verify).

### Artifact B: Playwright Script

Save to `e2e/features/{TICKET_ID}/{area-kebab-case}.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('{AREA} — Functional Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login flow using env vars from .env (or a repo auth helper)
    // Navigate to starting URL
  });

  test('TC-001: {test case title}', async ({ page }) => {
    // Steps discovered during exploration / recording
    // Assertions based on expected behavior
  });

  // ... more test cases
});
```

Use the actual selectors, labels, and structure discovered during exploration or captured in the recording — not guessed values. Reference credentials via `process.env` variables, never hardcode them.

### Presenting Artifacts

1. Show the user a summary of what was discovered (sections, test case count, key findings).
2. Present both artifacts for review.
3. Ask if they want to adjust, add, or remove anything before saving.
4. Save files to `e2e/features/{TICKET_ID}/`.

---

## Tips

- Always `browser_snapshot` before any `browser_click` or `browser_fill` — refs are only valid from the most recent snapshot (Mode A).
- When exploring tables, note both the column headers AND sample data.
- For modals/forms, note which fields have `*` (required) markers.
- Note the exact on-screen text on buttons and labels — tests should match these (in whatever language the UI uses).
- If the user mentions a comparison to another page/portal, note the differences.
- Save screenshots to `e2e/features/{TICKET_ID}/screenshots/explore/`.
- The browser is visible on the user's screen — in Mode A, narrate what you're doing so they can follow along; in Modes B/C, stay quiet while the user records and respond only to `note:` messages.
