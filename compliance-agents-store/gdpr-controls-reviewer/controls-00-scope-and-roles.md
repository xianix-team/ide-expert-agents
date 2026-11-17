## Framework module: Scope, Personal Data And Roles

- **Module ID:** scope-personal-data-and-roles
- **Applies when:** Always — run first; it decides whether the GDPR applies at all and which obligation modules apply.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 4 (0 Automatable, 2 Partial, 2 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | The personal data the system processes is identified — categories, data subjects, and every place it is stored or flows (DBs, logs, caches, vector stores, prompts, conversation history, third parties). | Art 4(1); 30(1)(c) | Lower (83(4)) | Both | 7.2.8; 8.2.6 | ID.IM-P | High | Partial | Use the A1 inventory: schemas, models, migrations, DTOs, prompt templates, logging. Compare with any data map / RoPA in-repo; completeness across the organisation is manual. |
| 2 | Special-category (Art 9), criminal-offence (Art 10), and children's data (Art 8) are identified, and none is processed without a documented condition. | Art 8; 9; 10 | Upper (83(5)) for Art 9 · Lower (83(4)) for Art 8 | Controller | 7.2.2; 7.2.3 | ID.IM-P; GV.PO-P | Critical | Partial | Search for health, biometric, genetic, ethnicity, religion, political, union, sexual-orientation, criminal, minor/age signals in fields, prompts, and classifiers. Inferring such traits with a model also counts. The Art 9(2) condition itself is legal. |
| 3 | Controller / processor / joint-controller role is determined for each processing activity (e.g. processor for tenant data in a B2B SaaS, controller for own account data). | Art 4(7)-(8); 24; 26; 28 | Lower (83(4)) | Both | 7.2.7; 8.2.1 | ID.DE-P; GV.PO-P | Medium | Manual | Contractual and organisational. Record the provisional role the code suggests (multi-tenant, customer-configured processing → likely processor). |
| 4 | Territorial scope is confirmed, and an EU representative is appointed where a non-EU controller/processor targets or monitors people in the EU. | Art 3; 27 | Lower (83(4)) | Both | 5.2.1 | GV.PO-P | Low | Manual | Legal determination. Note signals such as EU locales, EUR pricing, EU regions. |
