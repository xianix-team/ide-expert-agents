## Framework module: Human Oversight

- **Module ID:** human-oversight
- **Applies when:** The system is high-risk, or takes consequential actions on behalf of users.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 4 (2 Automatable, 1 Partial, 1 Manual)

| # | Requirement (control question) | EU AI Act | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|
| 1 | Human-oversight measures are built in so a person can understand, monitor and correctly use the system. | Art 14(1)-(4) | A.9 | MANAGE 2 | Critical | Automatable | Inspect for human-in-the-loop review steps and output-interpretation aids. |
| 2 | A human can intervene, override, or stop the system (stop button / disregard output). | Art 14(4)(e) | A.9 | MANAGE 2 (e.g. 2.3-2.4) | Critical | Automatable | Inspect for a kill-switch / override / disregard-output path. |
| 3 | Measures counter automation bias / over-reliance on outputs. | Art 14(4)(b) | A.9 | MEASURE 3; MANAGE 4 | Medium | Partial | Look for confidence surfacing and cautionary UX; effectiveness needs eval. |
| 4 | Where applicable, biometric-identification decisions require separate two-person verification. | Art 14(5) | A.9 | MANAGE 2 | Low | Manual | Applies only to specific biometric use cases. |

