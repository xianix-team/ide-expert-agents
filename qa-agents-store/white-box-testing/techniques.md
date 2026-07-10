# Structural Test Design Techniques

Each technique has: what it's for, a recipe to derive the tests, and a worked example.
The coverage levels (1–4) form a hierarchy — each is strictly stronger than the one
before. Escalate only as far as the code's complexity and criticality justify (see the
selection table in the agent body above). Branch coverage is the sensible default for most code.

## Contents
1. Statement coverage
2. Branch / decision coverage
3. Condition coverage & MC/DC
4. Basis path testing (cyclomatic complexity)
5. Data flow testing (def-use)
6. Loop testing
7. Mutation testing
8. Picking a target

---

## 1. Statement coverage

**Goal:** every executable line runs at least once. The weakest level — necessary but far
from sufficient.

**Recipe:** run coverage, list the uncovered lines, add a test whose inputs reach each.

**Why it's weak — this passes statement coverage but tests nothing about the false case:**
```python
def fee(amount):
    discount = 0
    if amount > 100:
        discount = 10        # one test with amount=200 covers every line...
    return amount - discount  # ...but never checks amount <= 100 returns amount unchanged
```
A single input (`200`) gives 100% statement coverage while leaving the `<= 100` behavior
completely untested. That's why branch coverage is the real baseline.

---

## 2. Branch / decision coverage

**Goal:** every decision (if/else, switch, ternary, `&&`/`||` short-circuit, loop
condition) is taken both true and false at least once.

**Recipe:**
1. List each decision point in the target.
2. For each, ensure at least one test makes it true and one makes it false.
3. An `if` with no `else` still has an implicit false branch — test the path that skips it.

**Worked example — the `fee` function above needs two tests:**

| Input | Branch exercised | Expected |
|-------|------------------|----------|
| 200   | `amount > 100` true  | 190 |
| 50    | `amount > 100` false | 50  |

Now both outcomes are pinned. Branch coverage catches the class of bug where the
untaken side silently does the wrong thing.

---

## 3. Condition coverage & MC/DC

**For:** decisions built from multiple boolean sub-conditions, where branch coverage can
pass without testing each sub-condition's effect.

**Condition coverage:** each sub-condition is evaluated both true and false.

**MC/DC (Modified Condition/Decision Coverage):** the stronger form required in
safety-critical domains (avionics/DO-178C, automotive). Each sub-condition must be shown
to *independently* change the decision's outcome — hold the others fixed, flip one, and
the result flips.

**Recipe for MC/DC:**
1. For a decision with conditions A, B, C, find, for each condition, a pair of test cases
   that differ only in that condition and produce different decision outcomes.
2. This typically needs N+1 tests for N conditions (vs 2^N for full combinations).

**Worked example — `if (isPremium || total >= 50)`:**

| # | isPremium | total≥50 | result | shows independence of |
|---|-----------|----------|--------|-----------------------|
| 1 | T         | F        | T      | isPremium (vs #3)     |
| 2 | F         | T        | T      | total≥50 (vs #3)      |
| 3 | F         | F        | F      | both                  |

Three tests demonstrate each condition can independently drive the outcome — branch
coverage alone could be satisfied by just #1 and #3, never proving `total≥50` matters.

---

## 4. Basis path testing (cyclomatic complexity)

**For:** functions complex enough that branch coverage leaves path combinations untested.
Gives a concrete, minimal set of paths to cover.

**Recipe:**
1. Compute cyclomatic complexity: `M = decisions + 1` (count if/while/for/case/`&&`/`||`).
   This equals the number of linearly independent paths.
2. Derive M independent paths through the function — each introduces at least one edge the
   others don't.
3. Write one test per path with inputs that drive it.

**Worked example:** a function with 3 decisions → M = 4 → four independent paths → four
tests forming a basis from which every other path is a combination. High M (say >10) is
itself a signal: the function may be worth refactoring, not just testing.

---

## 5. Data flow testing (def-use)

**For:** catching bugs in how a variable's value travels from where it's set (def) to
where it's read (use) — stale values, use-before-def, defs that are never used.

**Recipe:**
1. For each variable, find its **defs** (assignments) and **uses** (reads).
2. Form def-use pairs: a def and a use with a path between them where the variable isn't
   redefined.
3. Cover each pair with a test (all-uses is the common practical target).
4. Flag a **def with no use** (dead assignment) and any **use reachable with no prior
   def** (potential bug) as findings.

**Worked example:** `total` defined at line 3, redefined inside a loop at line 7, used at
line 12. Test both the path where the loop body runs (line-7 def reaches line 12) and
where it doesn't (line-3 def reaches line 12) — the two defs reaching the same use are
exactly where an initialization bug would hide.

---

## 6. Loop testing

**For:** loops, where off-by-one and boundary bugs concentrate.

**Recipe — test these iteration counts:**
- **0** iterations (loop body skipped entirely — often the forgotten case).
- **1** iteration.
- **typical** number (some middle value).
- **max** iterations and, where bounded, **max+1** / over-limit.

For nested loops, start with the innermost at boundaries while outer loops run minimal,
then work outward — testing all combinations explodes, so cover them in sequence.

**Worked example — a paginator with page size 10:** test a result set of 0 items, 1 item,
9 items (one short page), 10 items (exactly one page), 11 items (spills to page 2).

---

## 7. Mutation testing

**For:** measuring whether your *tests* are any good — coverage proves lines ran, mutation
proves the assertions would catch a defect.

**How it works:** the tool makes small changes (mutants) to the code — flip `>` to `>=`,
`&&` to `||`, return value to null — then runs your suite. A mutant **killed** (a test
fails) is good. A mutant that **survives** (all tests still pass) reveals a behavior your
tests execute but don't actually check.

**Recipe:**
1. Run a mutation tool (see coverage-tooling.md) on a module with high line coverage.
2. For each surviving mutant, add or strengthen an assertion that would kill it.
3. Track the mutation score (killed / total). It's a far better quality signal than line %.

**When it's worth it:** critical logic where weak tests are dangerous. It's slow (runs the
suite once per mutant), so target it rather than running it across the whole repo.

---

## 8. Picking a target

- **Most application code:** branch coverage with real assertions. Don't chase 100% —
  the last few percent is often error handling for impossible states or generated code.
- **Complex algorithmic functions:** add basis path and loop testing.
- **Multi-condition decisions in important logic:** add condition coverage / MC/DC.
- **Code where a silent bug is costly:** validate test quality with mutation testing.
- **Treat unreachable branches as findings,** not coverage to force — they're dead code or
  impossible conditions worth reporting.
