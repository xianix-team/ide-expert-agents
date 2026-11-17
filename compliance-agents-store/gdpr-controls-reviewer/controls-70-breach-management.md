## Framework module: Personal Data Breach Management

- **Module ID:** personal-data-breach-management
- **Applies when:** The system processes any personal data. Mostly procedural: expect Manual, with detection and forensic logging verifiable in-repo.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 5 (1 Automatable, 2 Partial, 2 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Personal-data breaches can be detected: security monitoring and alerting cover the stores and flows that hold personal data. | Art 32(1)(d); 33(1) | Lower (83(4)) | Both | 6.13.1.2 | GV.MT-P; PR.PT-P | High | Partial | Inspect alerting rules, anomaly detection, and monitoring config for data stores, auth, and unusual export volumes. Whether it works operationally is runtime. |
| 2 | A breach-response runbook exists, covering: assess risk, notify the supervisory authority within the statutory deadline, and (as processor) notify the controller without undue delay. | Art 33(1)-(2) | Lower (83(4)) | Both | 6.13.1.5 | GV.PO-P; CM.PO-P | Critical | Partial | Look for an incident or breach runbook in-repo (`docs/`, `runbooks/`, `SECURITY.md`) that names the deadlines in `gdpr-reference.md`. Ownership and rehearsal are manual. |
| 3 | Affected people are told without undue delay when a breach is likely to pose a high risk to them. | Art 34 | Lower (83(4)) | Controller | 6.13.1.5 | CM.AW-P | High | Manual | Communication process and templates. Organisational. |
| 4 | Every breach is documented in a register (facts, effects, remedial action), including those not notified. | Art 33(5) | Lower (83(4)) | Controller | 6.13.1.6 | GV.MT-P | Medium | Manual | Organisational record. |
| 5 | Forensic readiness: logs allow working out which people, which records, when, and by whom, so a notification can describe scope (without logging the data itself). | Art 33(3) | Lower (83(4)) | Both | 6.9.4.1 | PR.PT-P | High | Automatable | Inspect whether audit logs record actor, action, timestamp, and record or subject identifiers (pseudonymised), with retention long enough to investigate. |
