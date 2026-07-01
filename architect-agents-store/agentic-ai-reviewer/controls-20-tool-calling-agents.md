## Checklist: Tool-Calling Agents

- **Module ID:** tool-calling-agents
- **Applies when:** The agent invokes tools/APIs to take actions (function-calling, MCP tools, workflow steps).
- **Applies in addition to:** Generic Baseline
- **Controls:** 17 (14 Automatable, 3 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Tool Design | Each tool has a precise name, description, and typed parameters. | High | Automatable | Inspect tool defs: name/description/typed params. |
| 2 | Tool Design | The tool set is bounded; no over-broad, duplicate, or unused tools are exposed. | Medium | Automatable | Inspect registry; flag over-broad/duplicate/unused tools. |
| 3 | Tool Design | Tools are classified read vs. write/irreversible, and approvals are tied to that class. | Critical | Automatable | Check tools tagged read vs write/irreversible; approvals mapped. |
| 4 | Input/Output Safety | Tool input parameters are validated (type/range/format) before execution. | High | Automatable | Inspect input validation before tool execution. |
| 5 | Input/Output Safety | Tool return values are validated and typed before being used in reasoning. | High | Automatable | Inspect tool return typing/validation before reasoning. |
| 6 | Input/Output Safety | Tool failures are surfaced and handled explicitly, never silently ignored. | High | Automatable | Inspect tool-failure handling (no silent swallow). |
| 7 | Execution Safety | Write operations use idempotency keys / dedupe protection. | Critical | Automatable | Grep write ops for idempotency keys/dedupe. |
| 8 | Execution Safety | Multi-step workflows are atomic or use compensating transactions. | High | Automatable | Inspect multi-step workflows for atomicity/compensation. |
| 9 | Execution Safety | High-impact actions support a dry-run/preview before commit. | High | Automatable | Inspect high-impact actions for dry-run/preview. |
| 10 | Execution Safety | Execution is deterministic: the same validated spec yields the same execution path. | Medium | Partial | Inspect for deterministic execution path; needs reasoning/test. |
| 11 | Execution Safety | Mid-sequence failures recover via resume or compensation. | High | Automatable | Inspect mid-sequence resume/compensation. |
| 12 | Authorization | Each tool call is authorized under the correct scoped credentials (no shared super-creds). | Critical | Partial | Inspect scoped creds per tool; cloud perms need review. |
| 13 | Authorization | Confused-deputy attacks are prevented (agent privileges cannot be hijacked). | Critical | Partial | Inspect auth propagation for confused-deputy defence. |
| 14 | Reliability | Downstream API rate limits are respected with backoff and timeout budgets. | Medium | Automatable | Inspect downstream rate-limit backoff/timeout budgets. |
| 15 | Reliability | Per-tool latency SLAs and timeouts are defined. | Medium | Automatable | Inspect per-tool timeout/latency SLA config. |
| 16 | Observability | Every tool invocation is logged with identity, parameters, and result. | High | Automatable | Inspect per-invocation logging (identity/params/result). |
| 17 | Observability | Tools are testable against sandboxes/mocks before production. | Medium | Automatable | Inspect sandbox/mock tests for tools. |

