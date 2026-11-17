## Framework module: Security Of Processing

- **Module ID:** security-of-processing
- **Applies when:** The system processes any personal data. The prompt-injection row applies when an LLM or agent can read or send personal data.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 7 (5 Automatable, 2 Partial, 0 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Personal data is encrypted in transit (TLS) and at rest (DBs, buckets, vector stores, backups). | Art 32(1)(a) | Lower (83(4)) | Both | 6.7.1.1 | PR.DS-P | High | Automatable | Inspect IaC and config for storage encryption, TLS enforcement, and plain-HTTP endpoints. |
| 2 | Access to personal data is authenticated, authorised, and least-privilege — for users, services, admins, and AI-agent tools (scoped credentials, no broad DB access from the agent). | Art 32(1)(b); 25(1) | Lower (83(4)) | Both | 6.6.2.1; 6.6.2.2; 6.6.4.2 | PR.AC-P | Critical | Automatable | Inspect authn and authz middleware, RBAC, IAM policies (look for wildcard grants), agent tool scopes, and admin endpoints. |
| 3 | Secrets and credentials are kept out of code and loaded from a secrets manager or environment. | Art 32(1)(b) | Lower (83(4)) | Both | 6.6.4.2; 6.9.4.2 | PR.AC-P; PR.DS-P | High | Automatable | Search for API keys, connection strings, and tokens in source, config, notebooks, and IaC. Never print values. |
| 4 | Availability and resilience: backups exist, and restore is tested. | Art 32(1)(b)-(c) | Lower (83(4)) | Both | 6.9.3.1 | PR.DS-P; PR.MA-P | Medium | Partial | Inspect backup config in IaC and any restore-test job or runbook. Actual restore testing happens at runtime. |
| 5 | Security is regularly tested: dependency and vulnerability scanning, SAST, and secret scanning in CI. | Art 32(1)(d) | Lower (83(4)) | Both | 6.9.6.1; 6.11.2.8 | PR.PO-P; GV.MT-P | Medium | Automatable | Inspect CI workflows for SCA (Dependabot, Renovate, Snyk), SAST, and secret scanning. |
| 6 | LLM and agent paths resist prompt injection and data exfiltration: tool and retrieval output is treated as untrusted, outbound calls are allowlisted, and model output cannot trigger unreviewed disclosure (e.g. rendering untrusted links or images, sending email). | Art 5(1)(f); 32(1)(b) | Upper (83(5)) | Both | 6.11.2.1; 6.11.2.5 | PR.PT-P; PR.DS-P | Critical | Partial | Inspect guardrails, input and output filters, egress allowlists, confirmation before outbound actions, and injection tests. Live adversarial testing stays manual. |
| 7 | Access to personal data is audit-logged (who, what, when), and the logs are protected from tampering and themselves minimised. | Art 32(1)(b), (d); 5(2) | Lower (83(4)) | Both | 6.9.4.1; 6.9.4.2 | PR.PT-P | High | Automatable | Inspect audit-log events for reads, exports, and admin actions on personal data, plus log-store access controls and immutability. |
