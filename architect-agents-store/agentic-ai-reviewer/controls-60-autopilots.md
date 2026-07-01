## Checklist: Autopilots

- **Module ID:** autopilots
- **Applies when:** The agent runs unattended on a schedule or event trigger (no human in the loop per run).
- **Applies in addition to:** Generic Baseline
- **Controls:** 17 (13 Automatable, 4 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Triggering | Schedule/event triggers fire reliably with missed-run detection. | High | Partial | Inspect trigger reliability & missed-run detection; runtime confirms. |
| 2 | Triggering | Bursts of triggers are throttled (backpressure) to protect downstream systems. | Medium | Automatable | Inspect trigger throttling/backpressure. |
| 3 | Triggering | Schedules are owned, documented, and change-controlled. | Medium | Partial | Detect schedule docs/change-control; ownership is organisational. |
| 4 | Execution Integrity | Runs are idempotent: duplicate/overlapping triggers do not double-execute side effects. | Critical | Automatable | Inspect idempotent runs / dedupe of overlapping triggers. |
| 5 | Execution Integrity | Overlapping/concurrent runs are isolated; race conditions are prevented. | High | Partial | Inspect concurrency isolation; races need test. |
| 6 | Execution Integrity | Long-running state is durably persisted and resumable. | High | Automatable | Inspect durable, resumable long-running state. |
| 7 | Execution Integrity | Failed long runs resume from a checkpoint rather than restarting. | High | Automatable | Inspect checkpoint-resume on failure. |
| 8 | Execution Integrity | Long-lived context is revalidated before acting (stale-context guard). | High | Automatable | Inspect stale-context revalidation before acting. |
| 9 | Bounded Autonomy | A human can pause/stop the autopilot at any time (kill switch). | Critical | Automatable | Inspect kill-switch / pause-stop control. |
| 10 | Bounded Autonomy | Per-run/period ceilings cap tokens, time, and number of actions. | High | Automatable | Inspect per-run ceilings on tokens/time/actions. |
| 11 | Bounded Autonomy | Irreversible actions require a human-in-the-loop gate even when unattended. | Critical | Automatable | Inspect human-in-the-loop gate on irreversible unattended actions. |
| 12 | Bounded Autonomy | Environment changes since the last run are detected before acting. | High | Automatable | Inspect environment-change detection before acting. |
| 13 | Safety & Oversight | Unattended errors fail closed and alert owners (no silent fail-open). | Critical | Automatable | Inspect fail-closed + owner alerts on unattended errors. |
| 14 | Safety & Oversight | Full lineage of unattended decisions and actions is auditable. | Critical | Automatable | Inspect full lineage/audit of unattended decisions. |
| 15 | Safety & Oversight | Autopilot health/liveness is monitored; hung runs are detected (heartbeat). | High | Automatable | Inspect heartbeat/liveness & hung-run detection. |
| 16 | Reporting & Continuity | Run outcomes are reported and failures alerted to owners. | High | Automatable | Inspect run-outcome reporting & failure alerts. |
| 17 | Reporting & Continuity | The autopilot can resume/contextualize a conversation when a human joins. | Medium | Partial | Inspect resume/contextualise on human join. |

