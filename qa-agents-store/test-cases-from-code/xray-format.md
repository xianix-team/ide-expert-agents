# Xray XLSX output format

Many teams import manual test cases into Jira/Xray from an Excel workbook in the **Xray Test
Case Importer** layout. When the user wants importable output (or says "Xray format"), write
the workbook in this shape instead of the agent's native Markdown tables.

If the team has a canonical importer template, read it first to pick up the exact header row
and any column tweaks — treat the live template as source of truth over this doc, and **never
overwrite it**; write results to a new file.

## Sheet1 — columns (one test case = one header row + one row per extra step)

| Col | Header | What goes in it |
|---|---|---|
| A | `TCID` | Integer id, **repeated on every step row of the same test case**. Xray groups rows by this. |
| B | `Project` | Jira project key. Filled on the **first row only**. |
| C | `Region` | Region value your Xray instance uses, if any. First row only. |
| D | `Issue_Type` | `Test`. First row only. |
| E | `Environment` | The env the case targets (e.g. `Staging`). First row only. |
| F | `Summary` | The test title. First row only. |
| G | `Component` | The component/area under test. First row only. |
| H | `Description` | **Where the agent's rich metadata folds in** — see below. First row only. |
| I | `Reporter` | The requesting user's display name. First row only. |
| J | `Priority` | `High` / `Medium` / `Low` (map from severity). First row only. |
| K | `Labels` | Comma-separated, no spaces — see below. First row only. |
| L | `Test_Type` | `Manual`. First row only. |
| M | `Step` | Action for this step. **One per row.** |
| N | `Data` | Concrete input data for this step. One per row. |
| O | `Expected_Result` | Observable outcome for this step. One per row. |

Confirm the exact headers/values (`Project`, `Region`, etc.) against your own Xray instance
before importing — they vary per Jira/Xray configuration.

**Grouping rule:** the first row of a test carries B–L plus its first step in M/N/O; each
additional step is its own row with **only** A (the same TCID) and M/N/O filled, B–L left
blank. This is how Xray stitches multi-step manual tests together.

## Mapping the agent's test-case schema onto Xray

Xray's fixed schema has no columns for provenance, source citation, instance/scope, config
assumptions, execution vehicle, or linked risk. Do **not** drop them — fold them in so the
discipline survives the export:

- **`Description` (col H)** — pack, one per line:
  - `Precondition: <precondition / data state>`
  - `Scope: <instance/variant>, tenant-scoped (<which tenant>)`  ← the agent's *Instance / scope*
  - `Config: <label / flag the expected result assumes>`  ← the agent's *Config assumptions*
  - `Source: <file:line>`  ← **required**, the code that justifies the expected result
  - `Provenance: <CODE-DERIVED | CODE-VERIFIED (unit) | ...>`
  - `Linked risk: <R#>` (only if any)
- **`Labels` (col K)** — `<ticket>,<feature>,<PROVENANCE>,<vehicle>,<R# if any>`
  (e.g. `ABC-123,billing,CODE-DERIVED,unit-probe,R1`). Execution vehicle lands here.
- **`Priority` (col J)** — High/Medium/Low from the case's severity.
- A `DISCREPANCY` case: keep Status out of the sheet (Xray sets it on execution), phrase the
  Expected_Result as **contested** ("CONTESTED: ... Do not mark pass/fail; see risk R#"), and
  link the risk in Description + Labels.

## Companion sheets (agent outputs Xray doesn't model)

Xray imports Sheet1 only, so put the rest on extra sheets in the same workbook:
- **`Risk Register`** — columns: `ID, Type, Severity, Description, Code behavior (file:line),
  Instance / scope, Why unresolved, Routed to, Decision` (Decision left blank for ratification).
  Route any `ISOLATION-LEAK-SUSPECTED` to security as well.
- **`Coverage`** — the honest coverage statement (branch, scenario, assumed instance/label/flags,
  what was verified vs not, whether Phase 5 ran, and the counts that need a release-owner decision).

## Writing the file

Generate the workbook with a spreadsheet library — `openpyxl` via `python` works well: load the
template (if any) to inherit the header row, `delete_rows` the sample data (keep row 1), write
the test-case rows with the TCID grouping above, then add the `Risk Register` and `Coverage`
sheets. Save to a new output file — never over the template.
