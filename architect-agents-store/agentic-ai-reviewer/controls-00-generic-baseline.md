## Checklist: Generic Baseline

- **Module ID:** generic-baseline
- **Applies when:** Always — the mandatory core for every agentic-AI review.
- **Applies in addition to:** — (this is the base set)
- **Controls:** 46 (25 Automatable, 16 Partial, 5 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | 1. Interaction Plane | Ambiguous or under-specified requests are confirmed/disambiguated before the agent acts. | High | Partial | Inspect prompt/flow for disambiguation logic; behavioural effectiveness needs eval. |
| 2 | 1. Interaction Plane | Inputs are validated and sanitized at the boundary (malformed payloads, injection patterns). | Critical | Automatable | Scan boundary code for schema/input validation & sanitisation. |
| 3 | 1. Interaction Plane | Every request is bound to an authenticated user/agent identity (enterprise IAM). | Critical | Automatable | Inspect auth middleware/IAM binding on request entry. |
| 4 | 1. Interaction Plane | Rate limits, token quotas, and dollar-spend caps are enforced at the gateway per user/dept/client. | High | Partial | Inspect gateway/config for rate/quota/spend caps; some limits live in cloud console. |
| 5 | 1. Interaction Plane | Session/conversation memory is scoped per user and tenant with no cross-session leakage. | Critical | Partial | Inspect memory-store keys for per-user/tenant scoping; leakage confirmed by test. |
| 6 | 1. Interaction Plane | Loop/recursion circuit breakers cap execution depth on agent-to-agent handoffs. | High | Automatable | Grep for depth/recursion limits & circuit breakers in the agent loop. |
| 7 | 1. Interaction Plane | Graceful degradation: a defined safe fallback (human handoff / safe message) when confidence is low. | High | Automatable | Inspect for low-confidence fallback / human-handoff branch. |
| 8 | 2. Control Plane | Agent role, scope, and boundaries are explicitly specified and version-controlled. | High | Automatable | Confirm role/scope defined in a versioned system prompt/config. |
| 9 | 2. Control Plane | Factual answers are grounded in retrieved/authoritative sources rather than parametric memory. | Critical | Partial | Inspect grounding/RAG wiring; groundedness itself needs eval. |
| 10 | 2. Control Plane | Hallucination controls exist (citations, confidence signals, abstention on low evidence). | Critical | Automatable | Inspect prompt/code for citations, confidence signals, abstention. |
| 11 | 2. Control Plane | Actions are emitted as validated structured specifications (JSON/YAML), not free-form commands. | High | Automatable | Check actions emitted as validated JSON/YAML schemas. |
| 12 | 2. Control Plane | Model selection/tiering matches task complexity, with documented rationale. | Medium | Partial | Config shows model tiering; documented rationale is manual. |
| 13 | 2. Control Plane | Tool selection is bounded and guard-railed; the agent cannot invent or over-reach tools. | High | Automatable | Inspect tool registry/allowlist & guardrails. |
| 14 | 2. Control Plane | Prompts, models, and configurations are versioned and change-controlled. | Medium | Automatable | Confirm prompts/models/configs under VCS & change control. |
| 15 | 2. Control Plane | Context window is managed (reranking/trimming); critical instructions are never truncated. | High | Automatable | Inspect context assembly for rerank/trim & instruction protection. |
| 16 | 3. Runtime / Execution Plane | The reasoning layer holds no direct administrative/execution credentials. | Critical | Partial | Scan for admin/exec creds in reasoning layer; full assurance needs infra review. |
| 17 | 3. Runtime / Execution Plane | Proposed actions are validated against an independent policy engine (policy-as-code) before execution. | Critical | Automatable | Inspect for policy-as-code validation before execution. |
| 18 | 3. Runtime / Execution Plane | Tools/actions run under least-privilege, scoped credentials (RBAC). | Critical | Partial | Repo IAM roles/policies inspectable; actual cloud perms need review. |
| 19 | 3. Runtime / Execution Plane | State-changing actions are idempotent or guarded against duplicate execution. | High | Automatable | Grep for idempotency keys/dedupe on state-changing actions. |
| 20 | 3. Runtime / Execution Plane | Failed actions trigger pre-engineered compensating workflows / rollback to a safe baseline. | High | Automatable | Inspect for compensating/rollback workflows on failure. |
| 21 | 3. Runtime / Execution Plane | High-impact / irreversible actions require explicit human-in-the-loop authorization. | Critical | Automatable | Inspect for human-in-the-loop gate on irreversible actions. |
| 22 | 3. Runtime / Execution Plane | Post-action assertion tests confirm the intended state was achieved. | Medium | Automatable | Inspect for post-action assertion tests. |
| 23 | 3. Runtime / Execution Plane | Errors fail closed (safe), with bounded retries and backoff; no infinite waits. | High | Automatable | Inspect error handling: fail-closed, bounded retries/backoff. |
| 24 | 4. Data Layer | Storage is partitioned by access pattern (transient, vector, graph, transactional, time-series). | Medium | Automatable | Inspect data layer/IaC for storage partitioning. |
| 25 | 4. Data Layer | Runtime reads live state; stale-configuration reads are prevented. | High | Partial | Inspect caching/config-read paths; runtime staleness needs test. |
| 26 | 4. Data Layer | An immutable, append-only audit ledger records decisions and actions with lineage. | Critical | Automatable | Inspect for immutable append-only audit log with lineage. |
| 27 | 4. Data Layer | PII is redacted/minimized at boundaries; retention periods are defined and enforced. | Critical | Partial | Inspect PII redaction code; retention enforcement partly policy. |
| 28 | 4. Data Layer | Secrets/credentials live in a vault and never appear in prompts, logs, or code. | Critical | Automatable | Secret-scan the repo; confirm vault usage (strong Copilot/Claude fit). |
| 29 | 4. Data Layer | Knowledge sources have named owners, curation, and access controls. | High | Manual | Named owners/curation are organisational; only access controls are inspectable. |
| 30 | 5. Evaluation & Observability | An offline evaluation suite (golden set) covers accuracy, groundedness, and safety. | Critical | Partial | Detect golden-set eval suite; run if present, adequacy is judgment. |
| 31 | 5. Evaluation & Observability | Live quality metrics are monitored (accuracy, deflection, escalation, latency). | High | Partial | Detect metrics/dashboard code; live values are runtime. |
| 32 | 5. Evaluation & Observability | End-to-end tracing links intent → retrieval → tool calls → output. | High | Automatable | Inspect tracing instrumentation across intent->retrieval->tools->output. |
| 33 | 5. Evaluation & Observability | A regression eval gate runs before any prompt/model/tool change ships. | High | Automatable | Inspect CI config for a regression-eval gate. |
| 34 | 5. Evaluation & Observability | User/agent feedback is captured and routed into an improvement loop. | Medium | Partial | Detect feedback-capture code; the improvement loop is process. |
| 35 | 6. Security & Safety | Defenses are tested against direct and indirect prompt injection (incl. via retrieved/tool content). | Critical | Partial | Detect injection guards & tests; live red-team is manual. |
| 36 | 6. Security & Safety | Output is filtered for toxic/unsafe content and PII leakage. | High | Automatable | Inspect output moderation / PII-leak filters. |
| 37 | 6. Security & Safety | Untrusted tool/retrieval output is treated as data, never as instructions. | Critical | Automatable | Inspect prompt construction: untrusted content isolated as data. |
| 38 | 6. Security & Safety | Agent capability is scoped to the minimum needed (excessive-agency limits). | High | Automatable | Inspect tool scope/permissions for excessive-agency limits. |
| 39 | 6. Security & Safety | Periodic adversarial / red-team testing against abuse and misuse is performed. | High | Manual | Red-team testing is a performed activity, not a repo artifact. |
| 40 | 7. Governance & Lifecycle | Applicable regulation (EU AI Act, GDPR, sector rules) is mapped to the system. | High | Manual | Regulatory mapping is a governance deliverable. |
| 41 | 7. Governance & Lifecycle | A named owner, escalation path, and RACI exist for the agent. | Medium | Manual | Owner/escalation/RACI is organisational. |
| 42 | 7. Governance & Lifecycle | Users are informed they interact with AI; limitations are disclosed. | Medium | Partial | Inspect UI copy/system prompt for AI disclosure; placement is UX. |
| 43 | 7. Governance & Lifecycle | Architecture, prompts, tools, and operational runbooks are documented and maintained. | Medium | Partial | Detect docs/runbooks in repo; currency/quality is judgment. |
| 44 | 7. Governance & Lifecycle | Deployment uses staged/canary rollout with defined rollback triggers. | Medium | Automatable | Inspect deploy pipeline/IaC for staged/canary + rollback triggers. |
| 45 | 7. Governance & Lifecycle | Per-transaction token metering and cost attribution/chargeback are in place. | Medium | Partial | Detect token-metering code; chargeback is a finance process. |
| 46 | 7. Governance & Lifecycle | Incidents and eval gaps feed a prioritized continuous-improvement backlog. | Low | Manual | Improvement-backlog process is organisational. |

