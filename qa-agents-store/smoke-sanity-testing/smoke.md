# Smoke Testing (wide & shallow)

Smoke testing verifies a fresh build is stable enough to justify deeper testing. Also called
Build Verification Testing (BVT). Breadth over depth: touch every critical function once, at
the happy-path level, fast. If the build "smokes" — a critical path is broken — reject it
before anyone spends a full cycle testing it.

## Contents
1. Identify critical paths
2. Health / endpoint pre-check
3. Design the checks (breadth-first)
4. Keep it fast
5. Wire into CI as a build gate
6. Smoke go/no-go criteria

---

## 1. Identify critical paths

Critical paths are the few journeys that, if broken, make the build not worth testing. Pick
them by asking "if this didn't work, would we stop everything?" Typical set:

- **App loads** — the entry point renders, no fatal error on boot.
- **Authentication** — a user can log in and log out.
- **Core feature** — the one or two things the product exists to do.
- **Core CRUD** — create and read back the primary entity (the central data flow).
- **Checkout / submit** — any money or primary conversion path, if present.
- **Key integrations up** — critical external dependencies respond (payment, auth provider,
  primary API) — at least reachable, not exhaustively tested.

Keep this list short — roughly 5–15 checks. The moment it grows past "must work," it's
turning into regression and losing the speed that makes it useful.

---

## 2. Health / endpoint pre-check

Before driving any UI, run a cheap layer that fails fast if the build is fundamentally down.
This saves minutes when a deploy is simply broken.

- Key pages return **200** (home, login, dashboard, primary feature).
- Critical **APIs** respond (a health endpoint, or a primary GET returns sane data).
- No fatal console errors on load of the main pages.

```ts
test('health: critical pages are up', async ({ page }) => {
  for (const path of ['/', '/login', '/dashboard']) {
    const res = await page.goto(path);
    expect(res?.status(), `${path} status`).toBeLessThan(400);
  }
});
```

**A bare status check can lie.** Two traps to harden against:

- **Auth redirects** — a protected URL behind MSAL/B2C/OAuth 302s to the identity host
  and returns 200 for the *login page* while the app behind it is broken. For any page
  behind auth, also assert the **final URL** and a **page landmark** (a heading or app
  shell element), not just the status.
- **Known-OK quirks** — some roots legitimately 404 (e.g. an app that only serves
  deep links). Keep the project's known-OK list in its context/config and check it
  before calling a red.

If the pre-check fails, that's an immediate **NO-GO** — don't bother with UI checks.

---

## 3. Design the checks (breadth-first)

One shallow check per critical function. Each verifies the path *works at all*, not that it
handles every edge — edges belong to black-box/regression, not smoke.

**Example smoke check (happy path only):**
```ts
test('smoke: user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill(process.env.SMOKE_USER!);
  await page.getByLabel('Password').fill(process.env.SMOKE_PASS!);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});
```

No boundary values, no negative cases, no obscure features. If login works for the valid
case, the smoke check passes — whether it rejects a bad password is a black-box concern.

---

## 4. Keep it fast

Speed is the feature. Techniques:

- **Happy path only** — one valid scenario per critical function.
- **Parallelize** — independent checks run concurrently (Playwright projects/workers).
- **Reuse auth** — log in once via stored storage state, not per check.
- **Fail fast on blockers** — if app-load or login fails, halt and report; downstream checks
  are meaningless on a dead build.
- **Target minutes.** If the smoke suite takes longer than a coffee break, prune it.

---

## 5. Wire into CI as a build gate

Smoke pays off most when it runs automatically on every build/deploy and *blocks promotion*
on red.

- Run the smoke suite as a required CI step after deploy to a test/staging environment.
- A failure should **fail the pipeline stage** — the build doesn't advance to QA or prod.
- Run it post-deploy against the real environment too (a "post-deploy smoke") to catch
  environment/config breakage that didn't show in CI.
- Keep credentials in CI secrets / environment variables, never in the suite.

---

## 6. Smoke go/no-go criteria

- **GO** — all critical-path checks pass. The build is stable enough to hand to deeper
  testing or to promote. Proceed.
- **NO-GO** — any critical-path check fails. Reject the build; don't spend a test cycle on it.
  Report the single blocker plainly and send it back to dev.

Smoke has no "partial pass." A critical path is either up or it isn't — that binary clarity
is the whole value of the gate.
