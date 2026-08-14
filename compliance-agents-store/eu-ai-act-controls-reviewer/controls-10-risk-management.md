## Framework module: Risk Management System

- **Module ID:** risk-management-system
- **Applies when:** The system is (or may be) high-risk under Annex III/I. Also a best-practice baseline for any consequential agent.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 4 (1 Automatable, 2 Partial, 1 Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | A documented, continuous risk-management system runs across the lifecycle. | Art 9(1)-(2) | 2 Dec 2027 | A.6.1; Clause 6.1 | MAP 1-5; MANAGE 1 | Critical | Partial | Look for a risk register, threat model, or risk ADRs in-repo; process maturity is judgment. |
| 2 | Foreseeable risks to health, safety and fundamental rights are identified and mitigated. | Art 9(2) | 2 Dec 2027 | A.5 | MAP 5; MANAGE 2 | High | Partial | Risk docs plus mitigations realised in code (guardrails, validators). |
| 3 | Residual risks are evaluated as acceptable and communicated. | Art 9(5) | 2 Dec 2027 | A.5 | MANAGE 1 | Medium | Manual | Documentation / sign-off artifact. |
| 4 | Testing identifies and validates risk-mitigation measures against defined metrics and thresholds. | Art 9(6)-(8) | 2 Dec 2027 | A.6.2 | MEASURE 2 | High | Automatable | Look for a test suite / eval harness with pass thresholds wired into CI. |

