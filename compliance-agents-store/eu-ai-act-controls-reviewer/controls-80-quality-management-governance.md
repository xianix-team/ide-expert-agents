## Framework module: Quality Management And Provider Governance

- **Module ID:** quality-management-and-provider-governance
- **Applies when:** The system is high-risk and you are (or act as) the provider. Mostly organisational — expect Manual. Note: market-surveillance & penalty powers activate 2 Aug 2026.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 6 (0 Automatable, 2 Partial, 4 Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | A quality-management system (QMS) / AI management system is in place. | Art 17 | 2 Dec 2027 | Clauses 4-10; A.2 | GOVERN 1-2 | High | Manual | Organisational — confirm a QMS / ISO 42001 AIMS exists. |
| 2 | Accountability: roles and responsibilities for AI governance are defined. | Art 16; 22 | 2 Dec 2027 | A.3 | GOVERN 2 | Medium | Partial | Inspect CODEOWNERS / governance docs in-repo; the org structure is manual. |
| 3 | A post-market monitoring system is established. | Art 72 | 2 Dec 2027 | A.6; A.9 | MANAGE 4 | High | Partial | Inspect for monitoring/telemetry hooks in-repo; the monitoring process is manual. |
| 4 | A serious-incident reporting process exists. | Art 73 | 2 Dec 2027 | A.9 | MANAGE 4 | Medium | Manual | Runbook / process artifact. |
| 5 | Conformity assessment and the EU declaration of conformity / CE marking are handled (as applicable). | Art 43; 47; 48 | 2 Dec 2027 | A.6 | GOVERN 1 | High | Manual | Regulatory deliverable — outside the repo. |
| 6 | Provider keeps automatic logs and registers the system in the EU database (as applicable). | Art 19; 49; 71 | 2 Dec 2027 | A.6 | GOVERN 1 | Medium | Manual | Organisational registration obligation. |

