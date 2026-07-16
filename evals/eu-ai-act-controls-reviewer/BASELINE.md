# Baseline — eu-ai-act-controls-reviewer

Measured after Task 2 (lean loader + MCP Resources).  
Command: `cd mcp-server && npm run build && node ../evals/measure-baseline.mjs`  
Measured at: `2026-07-16T04:50:57.289Z`

## Served prompt size (structural)

| Metric | Value |
|---|---|
| Prompt lines | 224 |
| Prompt chars | 15 952 |
| Approx tokens (chars/4) | ~3 988 |
| MCP Resources | 11 (10 control modules + `enforcement-timeline.md`) |

### Prior behaviour (pre–Task 2, for comparison)

Control modules and timeline were concatenated into the prompt (~400 served lines). Lean load serves the entry only (**224 lines** including the resource index); modules are fetchable as Resources.

## Cases

6 cases in `cases/` (3 positive, 2 negative, 1 forbidden-neighbour). See `rubrics.md`.

## LLM trials (with-skill vs bare)

Not run in Task 1 (no automated runner yet). Use these cases for manual or future Skillgrade trials.

| Case id | with-skill | bare | Notes |
|---|---|---|---|
| — | — | — | Pending |
