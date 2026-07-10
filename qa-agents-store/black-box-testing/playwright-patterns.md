# Playwright Execution Patterns

How to turn a designed test case into a Playwright run against a live web app, assert on
the outcome, and capture evidence for any defect. This assumes Playwright is available
via the CLI. If a dedicated Playwright setup already exists in your project, defer to it
for install/runner specifics and use this file for the black-box testing patterns.

**Two execution modes — pick per purpose:**

- **Interactive (`playwright-cli`)** — for one-off execution of designed cases where the
  run itself is the deliverable. Open the browser (`playwright-cli open --browser=chrome`,
  `resize 1920 1080`), then work case by case: `snapshot` to discover element refs,
  `click e<N>` / `fill e<N> "value"` to act, `snapshot` / `screenshot` to assert and
  capture evidence.
- **Runner (`@playwright/test`)** — everything below. Use it when the suite is meant to
  be **re-run** (regression candidates, CI): it gives retries, parallelism, `expect`,
  and traces.

## Contents
1. Setup & running
2. Locator strategy
3. Assertion patterns by outcome type
4. Authentication handling
5. Evidence capture
6. Mapping a test case to a script
7. Pitfalls

---

## 1. Setup & running

Check availability, install on first use if needed:

```bash
npx playwright --version || npm i -D @playwright/test && npx playwright install chromium
```

Run patterns:

```bash
npx playwright test                       # run all specs
npx playwright test tests/login.spec.ts   # one spec
npx playwright test -g "BVA"              # filter by title
npx playwright test --headed              # watch it run
npx playwright test --trace on            # record a trace for evidence
npx playwright show-report                # open the HTML report
```

Prefer the `@playwright/test` runner over a bare script — it gives you retries,
parallelism, built-in `expect`, and the trace viewer, all of which matter for reporting.

---

## 2. Locator strategy

Use semantic, user-facing locators. They survive markup changes and read like the test
case. Order of preference:

```ts
page.getByRole('button', { name: 'Submit' })   // 1st choice: role + accessible name
page.getByLabel('Email address')                // form fields by their label
page.getByPlaceholder('Search')
page.getByText('Order confirmed')
page.getByTestId('cart-total')                  // if the app exposes data-testid
page.locator('#id, .class')                     // last resort: CSS/XPath — brittle
```

Avoid auto-waiting workarounds like fixed `waitForTimeout`. Playwright's locators
auto-wait for the element to be actionable; assert on web-first conditions instead.

---

## 3. Assertion patterns by outcome type

Match the assertion to what the test case's "Expected result" describes.

**Validation / error message (negative cases):**
```ts
await page.getByLabel('Age').fill('15');
await page.getByRole('button', { name: 'Save' }).click();
await expect(page.getByText('Must be 18 or older')).toBeVisible();
```

**Field rejected — form did not submit:** assert you're still on the same page AND the
error shows. Don't assert only the message; a message can appear while the record still
saves.
```ts
await expect(page).toHaveURL(/\/signup/);
await expect(page.getByText('Invalid')).toBeVisible();
```

**Successful navigation / state change:**
```ts
await expect(page).toHaveURL(/\/dashboard/);
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
```

**Persistence (data integrity) — re-fetch, don't trust the toast:**
```ts
await page.getByRole('button', { name: 'Create' }).click();
await expect(page.getByText('Saved')).toBeVisible();
await page.reload();                              // or navigate to the list
await expect(page.getByRole('row', { name: /Acme Corp/ })).toBeVisible();
```

**Authorization blocked:**
```ts
await page.goto('/admin/users');                  // as a non-admin
await expect(page).toHaveURL(/\/(login|403|forbidden)/);
// or assert the forbidden message, not the admin content
await expect(page.getByText('Admin Panel')).toBeHidden();
```

**State transition blocked (invalid move):** confirm the disallowed action isn't offered,
or is refused if forced.
```ts
// e.g. a shipped order must not be cancellable
await expect(page.getByRole('button', { name: 'Cancel order' })).toBeHidden();
```

---

## 4. Authentication handling

Log in once and reuse the session — don't log in per test (slow and flaky). Save storage
state, then load it.

```ts
// global-setup: authenticate and persist
await page.goto('/login');
await page.getByLabel('Email').fill(process.env.TEST_USER!);
await page.getByLabel('Password').fill(process.env.TEST_PASS!);
await page.getByRole('button', { name: 'Sign in' }).click();
await page.context().storageState({ path: 'auth/user.json' });
```

```ts
// in config or per-project: reuse it
use: { storageState: 'auth/user.json' }
```

For authorization tests, keep one storage-state file per role (`user.json`, `admin.json`,
`anon` = no state) and point the relevant tests at the right one.

Never hardcode credentials in the spec — read from environment variables.

**Redirect-based auth (MSAL / Azure B2C / OAuth) caveat:** login is a full page
reload through an external identity host, not an SPA route change. After submitting
credentials, wait for the post-redirect page load and assert on the final URL + a page
landmark. Also beware in health checks: a protected URL can 302 → login page → 200, so
`status < 400` passes while the app behind it is broken.

---

## 5. Evidence capture

Every failure needs a reproduction artifact for the report.

```ts
// playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
  video: 'retain-on-failure',
}
```

- **Screenshot** — quick visual of the failure state.
- **Trace** — the gold standard: open with `npx playwright show-trace trace.zip` to step
  through DOM, network, and console at the moment of failure.
- For a specific manual capture: `await page.screenshot({ path: 'evidence/BVA-03.png' })`.

Reference the artifact path in the defect entry in your Test Run Summary.

---

## 6. Mapping a test case to a script

A designed case translates directly. Keep one `test()` per case, titled with the case ID
so the report traces back to the design.

Designed case:
> **BVA-06** — Quantity field, valid 1–99. Input `100`. Expected: rejected with
> "Quantity must be 1–99", form not submitted.

Becomes:
```ts
test('BVA-06: quantity 100 is rejected', async ({ page }) => {
  await page.goto('/product/123');
  await page.getByLabel('Quantity').fill('100');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByText('Quantity must be 1–99')).toBeVisible();
  await expect(page.getByText('Added to cart')).toBeHidden();   // confirm it did NOT submit
});
```

Group cases by feature into spec files (`checkout.spec.ts`, `signup.spec.ts`) and by
technique within, so coverage is visible at a glance.

---

## 7. Pitfalls

- **Asserting the message but not the effect.** A negative case must verify the action
  was *prevented*, not just that text appeared. Check URL/state/persistence too.
- **Trusting the success toast.** Re-fetch the record to confirm a write actually landed.
- **Fixed sleeps.** `waitForTimeout` makes tests slow and flaky; use web-first `expect`.
- **Logging in every test.** Reuse storage state.
- **Running destructive cases on real data.** Confirm it's a staging/test environment
  first; deletes and updates are irreversible.
- **CSS selectors tied to styling.** They break on redesigns; prefer role/label/test-id.
- **One giant test.** If a test has five reasons to fail, a failure tells you little.
  One case, one assertion focus.
