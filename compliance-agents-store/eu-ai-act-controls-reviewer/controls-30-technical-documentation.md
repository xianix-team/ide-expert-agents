## Framework module: Technical Documentation

- **Module ID:** technical-documentation
- **Applies when:** The system is high-risk (Annex IV documentation is required).
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 3 (1 Automatable, 1 Partial, 1 Manual)

| # | Requirement (control question) | EU AI Act | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|
| 1 | Up-to-date technical documentation exists covering the Annex IV elements (system description, design, development, monitoring, performance). | Art 11; Annex IV | A.6.2 | MAP 1; GOVERN 1 | High | Partial | Look for a docs/ folder, model cards, architecture/design docs; completeness vs Annex IV is judgment. |
| 2 | Documentation demonstrates conformity and lets authorities assess the system. | Art 11(1) | A.6.2 | GOVERN 1 | Medium | Manual | Sufficiency for a conformity assessment is a human/legal judgment. |
| 3 | Key design choices and generated model/system records are captured in-repo. | Art 11; Annex IV | A.6.2 | MAP 1 | Medium | Automatable | Presence of model cards, ADRs, or auto-generated docs under version control. |

