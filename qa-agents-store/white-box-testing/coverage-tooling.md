# Coverage Tooling by Stack

How to run the suite with coverage, read the branch report, and find the exact uncovered
branches per language. Detect the stack from the repo (lockfiles, build files, existing
test config) and confirm the run command before assuming. Always enable **branch**
coverage — line coverage alone hides the untaken side of decisions.

## Contents
1. Per-language runner + coverage commands
2. Reading a coverage report
3. Enforcing a threshold
4. Mutation testing tools
5. Pitfalls

---

## 1. Per-language runner + coverage commands

### JavaScript / TypeScript
- **Jest:** `npx jest --coverage --coverageReporters=text --coverageReporters=html`
  (Jest reports branch coverage by default; the HTML report highlights uncovered branches.)
- **Vitest:** `npx vitest run --coverage` (uses v8 or istanbul; set `coverage.provider`).
- **Angular (Karma + Jasmine):**
  `npx ng test --watch=false --browsers=ChromeHeadless --code-coverage` — writes an
  istanbul HTML report to `coverage/<app>/index.html` with a Branch % column. Enforce
  thresholds in `karma.conf.js`:
  ```js
  coverageReporter: { check: { global: { branches: 80 } } }
  ```
- Branch data comes from istanbul/v8 — the report's "Branch %" column is the one to watch.

### Python
- **pytest + coverage.py:** `pytest --cov=<package> --cov-branch --cov-report=term-missing --cov-report=html`
- `--cov-branch` is essential — without it you get statement coverage only.
- `term-missing` prints the uncovered line numbers inline; `htmlcov/index.html` shows
  partially-covered branches in yellow.

### Java
- **JUnit + JaCoCo** (Maven): `mvn test jacoco:report` → `target/site/jacoco/index.html`.
- JaCoCo reports both line and branch ("missed branches") coverage natively.
- Gradle: apply the `jacoco` plugin, then `./gradlew test jacocoTestReport`.

### Go
- `go test -coverprofile=cover.out ./... && go tool cover -html=cover.out`
- Go's default is statement coverage; for decision insight inspect the per-block counts in
  the HTML view. Use `-covermode=count` to see how often each block ran.

### Ruby
- **SimpleCov:** require it at the top of the test helper; run `rspec` or `rake test`.
  Enable branch coverage with `SimpleCov.enable_coverage :branch`.

### .NET
- **coverlet (collector) + xUnit/NUnit** — the standard recipe:
  ```bash
  # 1. Run with the coverlet collector, emit cobertura
  dotnet test <Project>.Tests --collect:"XPlat Code Coverage" \
    -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=cobertura
  # → TestResults/<guid>/coverage.cobertura.xml

  # 2. Render a browsable branch-coverage report
  dotnet tool install -g dotnet-reportgenerator-globaltool   # once
  reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:coveragereport \
    -reporttypes:Html
  # open coveragereport/index.html — "Branch coverage" column + per-line branch markers
  ```
- Scope the run to the target test project — running the whole solution's tests dilutes
  the signal and is slow on large solutions.
- **Threshold enforcement** (coverlet.msbuild package):
  `dotnet test /p:CollectCoverage=true /p:Threshold=80 /p:ThresholdType=branch` — fails
  the run under 80% branch on the covered assemblies. With the collector instead, gate on
  the cobertura file in CI (ReportGenerator or a script).
- Exclude generated/migration code with `/p:Exclude="[*]*.Migrations.*"` or
  `[ExcludeFromCodeCoverage]` so the number reflects real logic.

If the stack isn't listed, search for "<language> <framework> branch coverage" and confirm
the flag that enables branch (not just line) reporting before running.

---

## 2. Reading a coverage report

The number is the start, not the answer. To turn a report into tests:

1. **Sort by lowest branch coverage**, not lowest line coverage — that's where untested
   decisions are.
2. **Open the file view** and find the partially-covered decisions (usually highlighted
   yellow/orange: one side of the branch taken, the other not).
3. For each, identify the input that drives the **missing** side, and write that test.
4. **Distinguish kinds of uncovered:**
   - Reachable but untested → write a test.
   - Defensive code for a state that can't occur → may be acceptable; note it.
   - Genuinely unreachable → a finding (dead code), report it.

`term-missing` (Python) and the HTML highlighters (Jest/JaCoCo) point at the exact lines —
let the tool tell you where to aim instead of guessing.

---

## 3. Enforcing a threshold

To keep coverage from regressing, fail the build under a target. Set the threshold on
**branch** coverage and scope it to the code under test, not the whole repo (which dilutes
the signal with config, generated code, and vendored files).

- **Jest:** `coverageThreshold: { global: { branches: 80 } }` in config.
- **pytest:** `--cov-fail-under=80` (combine with `--cov-branch`).
- **JaCoCo:** a `check` rule with `BRANCH` counter minimum in the Maven/Gradle config.

Pick a target that reflects criticality. 80% branch is a common general bar; critical
modules may warrant higher or MC/DC. Don't mandate 100% globally — it pushes people toward
assertion-free filler tests.

---

## 4. Mutation testing tools

To check test *quality*, not just reach (see techniques.md §7):

- **JS/TS:** Stryker (`npx stryker run`)
- **Python:** mutmut (`mutmut run`) or cosmic-ray
- **Java:** PIT / pitest (`mvn org.pitest:pitest-maven:mutationCoverage`)
- **Ruby:** mutant
- **.NET:** Stryker.NET

These are slow (the suite runs once per mutant) — point them at a critical module with
already-high line coverage, then kill the survivors by strengthening assertions.

---

## 5. Pitfalls

- **Chasing 100%.** The last few percent is usually unreachable or trivial; the effort is
  better spent strengthening assertions on code that's already "covered."
- **Assertion-free tests.** Calling a function without checking its result raises the
  percentage and catches nothing. Coverage measures execution, not correctness.
- **Line coverage mistaken for branch coverage.** Always enable branch — they diverge most
  exactly where bugs are.
- **Coverage on generated / vendored code.** Exclude it; it distorts the number and wastes
  effort.
- **Flaky tests.** Intermittent failures erode trust and can mask real gaps — fix or
  quarantine them before reading coverage as truth.
- **Covering the happy path only.** Error and exception branches are the least-covered and
  highest-value; target them deliberately.
