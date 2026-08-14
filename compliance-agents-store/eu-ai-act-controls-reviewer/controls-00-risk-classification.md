## Framework module: Risk Classification And Prohibited Practices

- **Module ID:** risk-classification-and-prohibited-practices
- **Applies when:** Always — run first; it decides which obligation modules apply.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 4 (0 Automatable, 2 Partial, 2 Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | The system's EU AI Act risk tier is determined and documented (prohibited / high-risk per Annex III or I / limited-risk transparency / minimal). | Art 6; Annex III | Ongoing / design-time (HR obligations bite 2 Dec 2027) | A.5 (AI system impact assessment) | MAP 1; MAP 5 | High | Partial | Look for a documented risk classification / DPIA / FRIA. Infer likely tier from the domain the code serves (biometrics, employment, credit, education, essential services). |
| 2 | Provider vs deployer role — and any GPAI-model-provider role — is identified. | Art 3; 16; 25 | Ongoing / design-time | A.3 (roles & responsibilities) | GOVERN 2 | Medium | Manual | Role is contractual/organisational; confirm with the team. |
| 3 | No prohibited practices are present (social scoring, untargeted facial-image scraping, emotion recognition at work/school, subliminal/manipulative techniques, non-compliant real-time remote biometric ID; new: nudifiers / foreseeable CSAM). | Art 5 | In force (2 Feb 2025); nudifier/CSAM by 2 Dec 2026 | A.5 | MAP 5.1; GOVERN 1 | Critical | Partial | Scan for biometric / emotion-recognition / social-scoring / scraping / image-generation features; flag any hit for immediate legal review (already enforceable). |
| 4 | A Fundamental Rights Impact Assessment (FRIA) is performed where required. | Art 27 | 2 Dec 2027 | A.5 | MAP 5 | High | Manual | Documentation artifact — confirm it exists for in-scope high-risk deployers. |

