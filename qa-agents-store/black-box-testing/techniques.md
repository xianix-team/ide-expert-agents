# Test Design Techniques

Each technique below has: what it's for, a step-by-step recipe to derive cases, and a
worked web example. Apply only the techniques that fit the feature (see the selection
table in the agent body above). The coverage checklists at the end apply to almost every feature.

## Contents
1. Equivalence Partitioning
2. Boundary Value Analysis
3. Decision Table Testing
4. State Transition Testing
5. Pairwise (All-Pairs) Testing
6. Scenario / Use-Case Testing
7. Error Guessing
8. Coverage checklists (negative, authz, data integrity, workflow)

---

## 1. Equivalence Partitioning (EP)

**For:** inputs that fall into groups where every member is treated the same. Test one
representative per group instead of every value — same coverage, far fewer cases.

**Recipe:**
1. For each input, divide its domain into valid and invalid classes.
2. A class is a set the app should handle identically (e.g. "any well-formed email").
3. Pick one representative value from each class.
4. Write one case per class. Invalid classes each get their own case — don't bundle two
   invalid inputs into one case, or you can't tell which one triggered the rejection.

**Worked example — "Age" field, accepts integers 18–65:**
- Valid class: 18–65 → test `30`
- Invalid (too low): <18 → test `15`
- Invalid (too high): >65 → test `70`
- Invalid (non-numeric): → test `abc`
- Invalid (empty): → test `` (if the field is required)

EP tells you *which groups* to test; BVA (next) tells you *which exact values* at the edges.

---

## 2. Boundary Value Analysis (BVA)

**For:** any input with an ordered range — lengths, numbers, dates, quantities, file
sizes. Defects cluster at boundaries because off-by-one errors live there.

**Recipe:**
1. For each boundary, test: the value just below, the value on the boundary, and the
   value just above. (min−1, min, min+1) and (max−1, max, max+1).
2. Include the empty/zero case and the type's extreme where relevant.
3. Pair with EP so the middle of each range is covered by one representative value.

**Worked example — "Quantity" field, valid 1–99:**

| Value | Expectation        |
|-------|--------------------|
| 0     | Rejected (below)   |
| 1     | Accepted (min)     |
| 2     | Accepted (min+1)   |
| 98    | Accepted (max−1)   |
| 99    | Accepted (max)     |
| 100   | Rejected (above)   |

**String length example — username, 3–20 chars:** test length 2, 3, 4, 19, 20, 21.

---

## 3. Decision Table Testing

**For:** logic where several conditions combine to produce different outcomes — discount
rules, eligibility, access logic, pricing. Stops you from missing a combination.

**Recipe:**
1. List the conditions (inputs) and the actions (outcomes).
2. Build a table: each column is a rule = one combination of condition values.
3. With N boolean conditions there are 2^N combinations; collapse impossible or
   don't-care combinations to keep it manageable.
4. One test case per surviving column.

**Worked example — free shipping rule:** free if (order ≥ $50) OR (customer is Premium).

| Condition          | R1 | R2 | R3 | R4 |
|--------------------|----|----|----|----|
| Order ≥ $50        | T  | T  | F  | F  |
| Premium customer   | T  | F  | T  | F  |
| **Action: free?**  | Y  | Y  | Y  | N  |

Four cases — including R4 (the only one that should charge shipping), which is the one
teams most often forget to test.

---

## 4. State Transition Testing

**For:** features with states and rules about moving between them — order lifecycles,
approval workflows, account status, multi-step wizards. Tests both allowed transitions
and that *blocked* ones are actually blocked.

**Recipe:**
1. List the states and the events that move between them.
2. Draw the state-transition map: state + event → next state.
3. Test each **valid** transition once.
4. Test **invalid** transitions — fire an event that shouldn't be allowed from the
   current state and confirm the app refuses it (e.g. "ship" on a cancelled order).
5. Test it stays consistent after a full lifecycle.

**Worked example — order:** states Draft → Submitted → Approved → Shipped; Cancelled
reachable from Draft/Submitted/Approved but **not** Shipped.
- Valid: Draft→Submit→Approve→Ship, and cancel from each cancellable state.
- Invalid: try to Approve a Draft (skip Submit); try to Cancel a Shipped order; try to
  Ship a Submitted (not-yet-Approved) order. Each must be rejected.

---

## 5. Pairwise (All-Pairs) Testing

**For:** features with many independent options where the full combination count
explodes. Most defects involve at most two interacting factors, so covering every *pair*
of values catches the bulk of them with a fraction of the cases.

**Recipe:**
1. List each factor and its possible values (e.g. Browser: 3, Plan: 3, Country: 4).
2. Full cross-product would be 3×3×4 = 36. Instead generate a set where every *pair*
   of values across any two factors appears together at least once — typically ~12.
3. Use an all-pairs generator (e.g. `allpairspy` in Python, or PICT) rather than doing
   it by hand; hand-built sets miss pairs.
4. One test case per generated row.

**When to reach for it:** configuration matrices, search filters with many toggles,
forms where several dropdowns interact. Note pairwise won't catch a true three-way
interaction — call that out if the feature has known triple dependencies.

---

## 6. Scenario / Use-Case Testing

**For:** validating that a real user can accomplish a real goal end to end. Field-level
tests can all pass while the overall journey is broken.

**Recipe:**
1. Write the primary success scenario as a sequence of steps from the user's goal.
2. Add alternate paths (valid variations) and exception paths (what happens when a step
   fails — payment declined, session expires, back button mid-flow).
3. Chain steps so later steps depend on earlier state (real flows aren't isolated).

**Worked example — checkout:** browse → add to cart → apply coupon → enter shipping →
pay → see confirmation → order appears in history. Exception paths: invalid coupon,
declined card, navigating Back after payment, double-submitting the order.

---

## 7. Error Guessing

**For:** experience-driven probing of places defects love to hide. Layer this on top of
the systematic techniques — it catches what formal coverage misses.

**High-yield guesses for web apps:**
- Empty submit, whitespace-only input, leading/trailing spaces.
- Special characters: `' " < > & % ; \ /` and unicode/emoji.
- Very long strings (paste 10,000 chars into a name field).
- `0`, negative numbers, decimals where integers are expected.
- Duplicate submit (double-click the submit button) → duplicate records?
- Back/forward/refresh mid-flow; reopening a stale tab.
- Pasting vs typing; autofill.
- Concurrent edit of the same record in two tabs.
- Injection probes in inputs: `' OR 1=1--`, `<script>alert(1)</script>`
  (you're checking for unsafe handling/reflection, not exploiting anything).

---

## Coverage checklists

Apply these to almost every feature. They cover the layers beyond happy-path fields.

### Negative input
- [ ] Wrong data type in each field
- [ ] Out-of-range / over-length values (see BVA)
- [ ] Required field left empty
- [ ] Special characters and unicode
- [ ] Malformed structured input (bad email, bad date, bad phone)
- [ ] Injection probes reflected safely (XSS/SQLi strings handled, not executed)

### Authentication & authorization
- [ ] Access the feature while logged out → redirected/blocked
- [ ] Access with a role that shouldn't have permission → blocked
- [ ] Access another user's record by changing an ID in the URL (IDOR) → blocked
- [ ] Action allowed in UI matches action allowed on the backend (don't trust a hidden button)
- [ ] Session expiry / logout mid-action handled gracefully

### Data integrity
- [ ] Created record persists correctly (re-fetch and verify, don't trust the toast)
- [ ] Verified against the **database or API directly** where such an oracle is available —
      a UI re-fetch can render cached or transformed data
- [ ] Update saves all changed fields; unchanged fields untouched
- [ ] Delete removes the record and dependent/child records per the rules
- [ ] Referential integrity: deleting a parent with children behaves as specified
      (cascade vs block), no orphans left
- [ ] Duplicate submission doesn't create duplicate records
- [ ] Concurrent edits resolve sanely (last-write-wins or a conflict warning)

### Business rules & workflow
- [ ] Each documented rule has a passing and a failing case (see decision table)
- [ ] Invalid state transitions are blocked (see state transition)
- [ ] Calculated values (totals, taxes, discounts) are correct at boundaries
- [ ] Mandatory sequence enforced — steps can't be skipped via direct URL
