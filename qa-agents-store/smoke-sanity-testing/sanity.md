# Sanity Testing (narrow & deep)

Sanity testing checks that one specific change — a bug fix or small feature — actually works
and didn't obviously break its immediate surroundings. Narrow and deep: ignore the rest of
the app, focus hard on what changed and what it touches. It's a focused subset of regression,
usually unscripted and lightly documented, run after a change lands.

## Contents
1. Scope to the change
2. Map the blast radius
3. Verify the change (depth-first)
4. Check the neighbors
5. When to escalate to full regression
6. Sanity go/no-go criteria

---

## 1. Scope to the change

Start by pinning down exactly what changed. Without that, you can't focus.

- What was the fix / change? (the ticket, the PR, the reported bug.)
- What was the **specific defect or behavior** it was meant to address?
- Which screen / function / endpoint did it touch?

Everything outside this is out of scope for sanity. The discipline is *not* re-testing the
whole app — that's regression, and it's slower than sanity is meant to be.

---

## 2. Map the blast radius

A change rarely affects only the line that changed. Identify the immediate neighbors that
could be affected:

- **Shared code** — components, utilities, or services the changed code depends on or feeds.
- **Same screen** — other controls/sections on the page that was modified.
- **Upstream/downstream in the flow** — the step before and after the changed step.
- **Shared data** — features that read/write the same records the change affects.

If the project has flow/architecture docs (end-to-end flow maps with their tables and
controllers, a dependency graph, or a feature map), use them to name the neighbors instead
of guessing.

Keep the radius *immediate* — one hop out. If the change is genuinely far-reaching, that's a
signal to escalate to regression (section 5), not to expand the sanity pass indefinitely.

---

## 3. Verify the change (depth-first)

Unlike smoke's shallow happy path, go deep on the change itself:

- **Confirm the fix works** — reproduce the original bug's steps; verify it no longer occurs.
- **Test the specific edge it targeted** — the exact condition that was broken, plus a couple
  of values around it (a mini boundary check on the fixed behavior).
- **Confirm the happy path still works** through the changed function — the fix didn't break
  the normal case.

**Example — fix was "quantity 100 now correctly rejected":**
```ts
test('sanity: the fixed boundary behaves', async ({ page }) => {
  await page.goto('/product/123');
  // the bug: 100 was wrongly accepted; verify it's now rejected
  await page.getByLabel('Quantity').fill('100');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByText('Quantity must be 1–99')).toBeVisible();
  // and the valid case still works
  await page.getByLabel('Quantity').fill('99');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByText('Added to cart')).toBeVisible();
});
```

---

## 4. Check the neighbors

Do a quick pass over the blast-radius items from section 2 — not exhaustively, just enough
to catch obvious collateral damage:

- The other controls on the changed screen still function.
- The step before and after the change still flow through.
- Anything sharing the changed component still renders and works.

If a neighbor looks broken, that's a finding — and possibly a sign the change had wider
impact than expected (escalate).

---

## 5. When to escalate to full regression

Sanity is a quick focused check, not a safety net for risky changes. Recommend full
regression instead when:

- The change touched **widely-shared** code (a core component, auth, a base service).
- The blast radius keeps growing as you map it — the change isn't actually localized.
- Sanity **turned up collateral breakage** in neighbors — impact is wider than scoped.
- The change is **high-risk / high-criticality** regardless of size.

Say so explicitly in the report: sanity passed but the risk profile warrants regression.

---

## 6. Sanity go/no-go criteria

- **GO** — the change works (including the specific edge it targeted) and immediate neighbors
  show no obvious breakage. The change is ready to proceed.
- **NO-GO** — the fix doesn't fully work, or it broke something in its blast radius. Back to
  dev with the specifics.

Note in the verdict if sanity passed but you're recommending regression (section 5) — a
"GO with caveat" is honest where a risky change only got a narrow check.
