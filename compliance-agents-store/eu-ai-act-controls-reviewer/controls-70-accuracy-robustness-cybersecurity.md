## Framework module: Accuracy Robustness Cybersecurity

- **Module ID:** accuracy-robustness-cybersecurity
- **Applies when:** The system is high-risk. Also a strong baseline for any production agent.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 5 (2 Automatable, 3 Partial, 0 Manual)

| # | Requirement (control question) | EU AI Act | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|
| 1 | Appropriate accuracy is declared and measured with defined metrics. | Art 15(1)-(3) | A.6.2 | MEASURE 2 (validity/reliability, e.g. 2.5) | High | Automatable | Inspect for an eval harness with accuracy metrics and declared thresholds. |
| 2 | Robustness: the system is resilient to errors, faults and inconsistencies, with fail-safe / fallback behaviour. | Art 15(4) | A.6 | MEASURE 2 (safety, e.g. 2.6); MANAGE 2 | High | Automatable | Inspect error handling, fallbacks, retries/backoff, redundancy. |
| 3 | Resilience against attempts to alter use or behaviour — data/model poisoning, adversarial examples, and prompt injection — is designed and tested. | Art 15(5) | A.6 | MEASURE 2 (security & resilience, e.g. 2.7) | Critical | Partial | Inspect injection/poisoning defences and tests; a live adversarial test remains manual. |
| 4 | Cybersecurity measures are appropriate to the risks. | Art 15(5) | A.6; A.4 | MEASURE 2.7; MANAGE 4 | High | Partial | Inspect secrets management, authz, dependency/vuln scanning; a pentest remains manual. |
| 5 | If the system continues to learn after deployment, feedback loops are guarded against biased/degraded outputs. | Art 15(4) | A.6 | MANAGE 4 | Low | Partial | Only if online/continuous learning is present — inspect the update guardrails. |

