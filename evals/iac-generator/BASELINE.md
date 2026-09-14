# Baseline — ipa (iac-generator)

Measured after Task 2 (lean loader + MCP Resources).  
Command: `cd mcp-server && npm run build && node ../evals/measure-baseline.mjs`  
Measured at: `2026-07-16T04:50:57.289Z`

## Served prompt size (structural)

| Metric | Value |
|---|---|
| Prompt lines | 135 |
| Prompt chars | 10 620 |
| Approx tokens (chars/4) | ~2 655 |
| MCP Resources | 3 (`workflow.md`, `templates.md`, `examples.md`) |

### Prior behaviour (pre–Task 2, for comparison)

Eager concat of sibling markdown produced ~904 served lines for this agent. Lean load cuts that to **135 lines** at GetPrompt time; detail stays available via Resources.

## Cases

6 cases in `cases/` (3 positive, 2 negative, 1 forbidden-neighbour). See `rubrics.md`.

## LLM trials (with-skill vs bare)

Not run in Task 1 (no automated runner yet). Use these cases for manual or future Skillgrade trials. Record pass@k / pass^k here when available.

| Case id | with-skill | bare | Notes |
|---|---|---|---|
| — | — | — | Pending |
