## Checklist: Conversational Support

- **Module ID:** conversational-support
- **Applies when:** A chat-first / customer-support surface handling end-user conversations.
- **Applies in addition to:** Generic Baseline
- **Controls:** 19 (6 Automatable, 13 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Accuracy & Grounding | Support answers are grounded in current KB/policy, not invented. | Critical | Partial | Inspect grounding to KB/policy; groundedness needs eval. |
| 2 | Accuracy & Grounding | Answers reflect current policy and the customer's actual entitlements. | Critical | Partial | Inspect policy/entitlement wiring; correctness needs test. |
| 3 | Accuracy & Grounding | The agent never promises actions (refunds, credits) it cannot guarantee. | Critical | Partial | Inspect guardrails/prompt against over-promising; behaviour needs eval. |
| 4 | Accuracy & Grounding | Support knowledge base is kept current; outdated answers are prevented. | High | Partial | Inspect KB sync jobs; freshness SLA is a target. |
| 5 | Conversation Quality | Multi-turn context is retained accurately across the conversation. | High | Partial | Inspect multi-turn memory handling; retention needs test. |
| 6 | Conversation Quality | The agent asks clarifying questions instead of guessing on ambiguity. | High | Partial | Inspect clarify-vs-guess flow; behaviour needs eval. |
| 7 | Conversation Quality | Tone matches brand voice and remains professional under pressure. | Medium | Partial | Inspect tone/style prompt; brand-voice match is subjective. |
| 8 | Conversation Quality | Language and locale are handled correctly (multilingual support). | Medium | Partial | Inspect locale/i18n handling; correctness needs test. |
| 9 | Escalation & Safety | Reliable handoff to a human agent passes full conversation context. | Critical | Automatable | Inspect human-handoff passes full transcript/context. |
| 10 | Escalation & Safety | Escalation triggers are defined (low confidence, sensitive topic, repeated failure). | High | Automatable | Inspect defined escalation triggers. |
| 11 | Escalation & Safety | Sensitive topics (disputes, legal, financial) are handled with care and disclaimers. | High | Partial | Inspect sensitive-topic handling/disclaimers; adequacy is judgment. |
| 12 | Escalation & Safety | Abusive users and unsafe requests are handled gracefully and safely. | Medium | Automatable | Inspect abuse / unsafe-request handling. |
| 13 | Privacy & Trust | Customer-specific data is used only within the customer's entitlement. | Critical | Partial | Inspect data scoping to entitlement; needs test. |
| 14 | Privacy & Trust | Customers are told they are interacting with an AI (disclosure). | Medium | Partial | Inspect AI-disclosure copy in the chat surface. |
| 15 | Operations | Containment, resolution, CSAT, and escalation rates are tracked. | High | Partial | Detect containment/escalation metrics; CSAT is survey-based (manual). |
| 16 | Operations | Conversations are logged for QA, dispute resolution, and compliance. | Medium | Automatable | Inspect conversation logging for QA/compliance. |
| 17 | Conversation Quality | Every user turn is reliably received, acknowledged, and persisted to history; dropped or lost messages are detected and recoverable. | High | Automatable | Inspect turn delivery/ack/persistence & lost-message detection. |
| 18 | Accuracy & Grounding | Compound / multi-intent requests are fully decomposed and every sub-intent is answered and aggregated (no dropped intents). | High | Partial | Inspect intent decomposition/aggregation; completeness needs eval. |
| 19 | Conversation Quality | Streamed (SSE/token) responses handle mid-stream errors, cancellation, and partial output without leaving a broken or misleading reply. | Medium | Automatable | Inspect streaming error/cancellation/partial-output handling. |

