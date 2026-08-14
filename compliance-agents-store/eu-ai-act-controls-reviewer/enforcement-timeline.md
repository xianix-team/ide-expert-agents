## Enforcement timeline & authorities (deadline reference)

Use this to (a) resolve each finding's **Applies from** date and (b) compute its **urgency**
relative to the review date. Source: internal EU AI Act timeline brief (13 Jul 2026),
reflecting the Digital Omnibus (final political agreement 7 May 2026; Council approval
29 Jun 2026). Verify against the adopted text in the Official Journal — not legal advice.

### Applicability dates

| Date | What becomes enforceable |
|---|---|
| **2 Feb 2025 — in force** | Art 5 prohibited practices; Art 4 AI-literacy duty (since softened to "support the development of"). |
| **2 Aug 2025 — in force** | GPAI model obligations (Arts 51–56); EU AI Office supervises GPAI providers. |
| **2 Aug 2026** | Art 50 transparency (AI-interaction disclosure, generated-content & deepfake/emotion/biometric disclosure); national market-surveillance authorities + member-state penalty regime activate; AI Office GPAI penalty powers exercisable. |
| **2 Dec 2026** | Art 50(2) machine-readable marking for generative systems already on the market before 2 Aug 2026 (4-month grace); transitional end for the new Art 5 nudifier/CSAM prohibition. |
| **2 Aug 2027** | Member-state regulatory-sandbox establishment deadline. |
| **2 Dec 2027** | Annex III stand-alone high-risk obligations — full Chapter III: risk management (Art 9), data governance (Art 10), technical docs (Art 11), logging (Art 12), transparency to deployers (Art 13), human oversight (Art 14), accuracy/robustness/cybersecurity (Art 15), QMS (Art 17), conformity assessment, EU-database registration. **(Moved from 2 Aug 2026.)** |
| **2 Aug 2028** | Annex I high-risk (AI embedded in regulated products: medical devices, machinery, vehicles). **(Moved from 2 Aug 2027.)** |

### Urgency bands (compute against the current review date)

- **OVERDUE / IN FORCE** — the Applies-from date has passed. A gap here is live legal exposure; a prohibited-practice (Art 5) hit is the most severe. Treat as immediate.
- **IMMINENT (≤ 90 days)** — deadline within ~3 months. Must be on the current sprint/roadmap.
- **DUE (≤ 12 months)** — deadline within a year. Plan and start the evidence trail now.
- **UPCOMING (> 12 months)** — deadline further out (typically the 2 Dec 2027 / 2 Aug 2028 high-risk items). Build the evidence trail early; retrofitting later is far costlier.

When an Applies-from cell contains two dates (e.g. Art 50(2): 2 Aug 2026 with grace to
2 Dec 2026), band against the date that applies to **this** system — new systems use the
earlier date; systems already on the market before 2 Aug 2026 use the grace date.

### Who enforces

- **EU AI Office (European Commission)** — GPAI model providers; and (under the Omnibus) exclusive competence over AI systems built on a same-provider GPAI model, and AI in VLOPs/VLOSEs.
- **National market-surveillance authorities** — everything else in-market (transparency, prohibitions, and from 2027/2028 high-risk); enforcement powers from 2 Aug 2026.
- **Norway (EEA — relevant to Nordic deployments)** — implementing via the national **KI-loven**, targeted to enter into force ~Aug 2026 in step with the EU; **Nkom** is the market-surveillance/coordinating authority, with Datatilsynet on data protection. Treat Norwegian deployments as if the AI Act applies from Aug 2026.

### Penalties

Up to **€35M or 7%** of global turnover (prohibited practices); up to **€15M or 3%**
(most other violations, including Art 50 transparency breaches).
