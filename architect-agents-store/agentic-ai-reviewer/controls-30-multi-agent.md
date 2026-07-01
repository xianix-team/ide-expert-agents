## Checklist: Multi-Agent

- **Module ID:** multi-agent
- **Applies when:** An orchestrator/supervisor coordinates multiple sub-agents (agent-to-agent handoffs).
- **Applies in addition to:** Generic Baseline
- **Controls:** 16 (9 Automatable, 7 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Topology & Roles | Orchestration topology (supervisor/router) is documented with clear responsibilities. | High | Partial | Detect topology docs/diagram; completeness is judgment. |
| 2 | Topology & Roles | Each sub-agent has a single, well-scoped responsibility. | Medium | Automatable | Inspect each sub-agent for a single scoped responsibility. |
| 3 | Topology & Roles | Routing selects the correct sub-agent/skill for the intent, and accuracy is measured. | High | Partial | Inspect router logic; routing accuracy needs eval. |
| 4 | Coordination | Inter-agent (A2A) messages use typed, versioned schemas/contracts. | High | Automatable | Inspect A2A messages for typed/versioned schemas. |
| 5 | Coordination | Loop and recursion control (depth limits / circuit breakers) bound A2A handoffs. | Critical | Automatable | Inspect loop/recursion depth limits on handoffs. |
| 6 | Coordination | Shared state/blackboard is consistent; race conditions are prevented. | High | Partial | Inspect shared-state concurrency handling; races need test. |
| 7 | Coordination | Clear termination conditions stop the orchestration. | High | Automatable | Inspect for explicit termination conditions. |
| 8 | Coordination | Deadlock/livelock between agents is prevented. | Medium | Partial | Inspect for deadlock/livelock guards; needs reasoning. |
| 9 | Coordination | Context handed between agents preserves critical information (no lossy handoff). | High | Partial | Inspect handoff payloads for context preservation; loss needs test. |
| 10 | Coordination | Conflict-resolution strategy handles disagreeing or contradictory agent plans. | Medium | Automatable | Inspect for a conflict-resolution strategy. |
| 11 | Resilience & Cost | One agent's failure is contained (isolation/bulkheads); it does not cascade. | High | Automatable | Inspect failure isolation/bulkheads. |
| 12 | Resilience & Cost | Fan-out token cost is bounded with per-run budget caps. | High | Automatable | Inspect per-run token / fan-out budget caps. |
| 13 | Resilience & Cost | Aggregate latency across multi-hop flows is bounded to a budget. | Medium | Partial | Inspect latency-budget config; actual latency is runtime. |
| 14 | Security | Sub-agents hold only their own least-privilege credentials (privilege isolation). | Critical | Partial | Inspect per-sub-agent scoped creds; cloud perms need review. |
| 15 | Security | Sub-agent outputs are validated, not blindly trusted by peers/supervisor. | High | Automatable | Inspect that peer/supervisor validate sub-agent outputs. |
| 16 | Observability | End-to-end traces span all agents within a single run. | High | Automatable | Inspect end-to-end trace spanning all agents. |

