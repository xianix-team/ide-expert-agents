## Framework module: Transparency And Information

- **Module ID:** transparency-and-information
- **Applies when:** The system interacts with people, or generates synthetic content, or is high-risk. Art 50 applies horizontally regardless of risk tier.
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 4 (1 Automatable, 2 Partial, 1 Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | Users are informed they are interacting with an AI (unless obvious from context). | Art 50(1) | 2 Aug 2026 | A.8 | GOVERN 5; MAP 3 | High | Automatable | Inspect the UI / first-message flow for an AI-disclosure notice. (Enforceable from 2 Aug 2026 by national authorities.) |
| 2 | Synthetic/generated content (text, image, audio, video) is marked in a machine-readable way (watermark / C2PA / provenance metadata). | Art 50(2) | 2 Aug 2026 (systems live before 2 Aug 2026: grace to 2 Dec 2026) | A.8 | MEASURE 2; MANAGE 4 | High | Partial | Inspect the output pipeline for content-provenance marking; effectiveness needs verification. |
| 3 | Deep-fake / AI-generated content and emotion-recognition/biometric-categorisation use are disclosed to the persons exposed. | Art 50(4) | 2 Aug 2026 | A.8 | GOVERN 5 | Medium | Partial | Inspect for a disclosure/label on generated media and on any emotion/biometric feature. |
| 4 | Instructions for use are provided to deployers (capabilities, limitations, oversight, expected accuracy). | Art 13(3) | 2 Dec 2027 | A.8 | MAP 3; GOVERN 5 | Medium | Manual | Documentation artifact for downstream deployers (high-risk). |

