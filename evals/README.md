# Agent evals

Minimal eval scaffolding for skill-design improvements (Task 1).

These cases define **what success looks like**. They are not a full LLM runner yet.
Use them to grade manual or scripted trials. Record structural baselines (served prompt size) in each agent's `BASELINE.md`.

## Layout

```
evals/
  README.md
  measure-baseline.mjs
  <agent-name>/
    BASELINE.md
    rubrics.md
    cases/
      NN-<id>.yaml
```

## Case schema

| Field | Meaning |
|---|---|
| `id` | Stable case id |
| `type` | `positive` \| `negative` \| `forbidden-neighbour` |
| `task` | User-facing task prompt |
| `expect` | Observable outcomes / behaviours |
| `must_not` | Hard failures |
| `grader` | `rubric` (LLM/human) or `outcome` (artifact/script check) |
| `rubric_ids` | Keys from that agent's `rubrics.md` |
| `preferred_agent` | For forbidden-neighbour: agent that should handle the task instead |

## Agents covered (Task 1)

| Agent | Folder | Prompt name |
|---|---|---|
| IPA / iac-generator | `iac-generator/` | `ipa` |
| EU AI Act controls reviewer | `eu-ai-act-controls-reviewer/` | `eu-ai-act-controls-reviewer` |

## Measure served prompt size

From repo root (after `mcp-server` build):

```bash
cd mcp-server && npm run build && node ../evals/measure-baseline.mjs
```

## Next (not Task 1)

- Wire Skillgrade / Docker trial runners
- CI smoke on PRs that touch pilots
- pass@k / pass^k reporting
