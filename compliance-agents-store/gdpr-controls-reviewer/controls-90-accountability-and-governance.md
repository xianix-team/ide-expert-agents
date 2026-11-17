## Framework module: Accountability And Governance

- **Module ID:** accountability-and-governance
- **Applies when:** The system processes any personal data. Mostly organisational: expect Manual. The DPIA row matters most for AI/LLM systems, large-scale profiling, special-category data, or systematic monitoring.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 6 (1 Automatable, 2 Partial, 3 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | A record of processing activities (RoPA) is maintained and reflects this system. | Art 30 | Lower (83(4)) | Both | 7.2.8; 8.2.6 | ID.IM-P | High | Partial | Look for a data map, RoPA export, or data-inventory doc in-repo and compare it with the A1 inventory. Keeping it up to date across the organisation is manual. |
| 2 | A DPIA is done before high-risk processing (new technology such as LLMs on personal data, large-scale profiling, special-category data, systematic monitoring) and kept current. | Art 35(1), (3), (7) | Lower (83(4)) | Controller | 7.2.5 | ID.RA-P | High | Partial | Look for a DPIA document or reference. Whether one is needed is a DPO judgment. Note that EU AI Act deployers may reuse it for a FRIA. |
| 3 | The supervisory authority is consulted before processing when a DPIA shows high residual risk. | Art 36 | Lower (83(4)) | Controller | 7.2.5 | GV.PO-P | Low | Manual | Regulatory process. |
| 4 | A DPO is designated where required, published, and involved. | Art 37–39 | Lower (83(4)) | Both | 6.3.1.1 | GV.PO-P | Medium | Manual | Organisational. Check for DPO contact details in the privacy notice. |
| 5 | Data-protection policies, roles, and staff training are in place, so the organisation can show compliance. | Art 5(2); 24(1)-(2); 39(1)(b) | Upper (83(5)) for Art 5(2) | Both | 6.2.1.1; 6.4.2.2 | GV.PO-P; GV.AT-P | Medium | Manual | Organisational. Note any CODEOWNERS or governance docs that assign privacy ownership. |
| 6 | Privacy controls are checked continuously by automated tests in CI: erasure covers all stores, redaction works, retention jobs run, no PII appears in logs, and tenant isolation holds. | Art 5(2); 24(1); 32(1)(d) | Lower (83(4)) | Both | 6.15.2.3 | GV.MT-P | Medium | Automatable | Look for privacy-specific tests in the suite and whether CI runs them. |
