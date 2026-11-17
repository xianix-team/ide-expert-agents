## GDPR reference: fine tiers, exposure, statutory deadlines, authorities

Use this to (a) read each control's **Fine tier**, (b) compute each gap's **exposure band**,
and (c) cite the statutory deadlines. Source: Regulation (EU) 2016/679 (GDPR). Verify against
the consolidated text in force on the review date. This is not legal advice.

### Applicability

- The GDPR has applied in full since **25 May 2018**. There is no phase-in, so every gap is
  already live. Instead of a deadline-based urgency, rank gaps by **exposure** (below).
- **Material scope (Art 2):** processing of personal data, wholly or partly by automated means.
  Purely personal or household activity is excluded.
- **Territorial scope (Art 3):** establishments in the EU, plus non-EU organisations that offer
  goods or services to, or monitor the behaviour of, people in the EU.
- **EEA:** applies in Norway, Iceland, and Liechtenstein through the EEA Agreement.
- **Pending changes:** the European Commission's Digital Omnibus package proposes amendments
  to the GDPR (among others, to the personal-data definition, processing for AI development,
  and breach notification). Assess against the text **in force on the review date**. If
  amendments have been adopted since this file was written, note that in *Assumptions*.

### Fine tiers (Art 83)

| Tier | Maximum | Articles (as used in the **Fine tier** column) |
|---|---|---|
| **Upper (83(5))** | €20M or 4% of worldwide annual turnover, whichever is higher | Principles (Art 5), lawfulness (6), consent (7), special categories (9); data-subject rights (12–22); international transfers (44–49); non-compliance with a supervisory authority order. |
| **Lower (83(4))** | €10M or 2% of worldwide annual turnover, whichever is higher | Controller and processor obligations (8, 11, 25–39, 42, 43), including privacy by design (25), processors (28), RoPA (30), security (32), breach notification (33–34), DPIA (35–36), DPO (37–39). |

When a row maps to several articles across tiers, the **Fine tier** cell names the higher tier
and the article that drives it.

### Exposure bands (compute per gap)

Read **live** as "the system processes real personal data in production". In automated mode,
assume live unless the repo shows otherwise.

- **CRITICAL**: any of:
  - an **Upper**-tier gap that is a **Fail** on a live system;
  - any gap touching **special-category, criminal, or children's data**;
  - real personal data or secrets committed to the repository;
  - a solely automated significant decision without Art 22(3) safeguards;
  - a cross-person or cross-tenant leakage path (agent memory, RAG, cache).
- **HIGH**: an Upper-tier **Partial** on a live system, or a Lower-tier **Fail** on a live
  system, or any Critical-severity control gap not already CRITICAL.
- **MODERATE**: a Lower-tier **Partial** on a live system, or any gap on a pre-production system
  that holds no real personal data.

Exposure factor for the A2 priority formula: `CRITICAL=3, HIGH=2, MODERATE=1`.

### Statutory deadlines

| Obligation | Deadline | Article |
|---|---|---|
| Notify the supervisory authority of a personal-data breach | Without undue delay and, where feasible, **within 72 hours** of becoming aware (with reasons if later) | Art 33(1) |
| Processor notifies the controller of a breach | **Without undue delay** after becoming aware | Art 33(2) |
| Tell affected people about a high-risk breach | **Without undue delay** | Art 34(1) |
| Respond to a data-subject request | **One month** from receipt, extendable by **two further months** for complex or numerous requests (inform the person within the first month) | Art 12(3) |
| Art 14 notice for indirectly obtained data | Within a reasonable period, at the latest **one month**, or at first communication or disclosure if earlier | Art 14(3) |

### Who enforces

- **National supervisory authorities (DPAs)**: one per member state. For cross-border
  processing, the **lead supervisory authority** is where the main establishment is
  (one-stop-shop, Art 56).
- **European Data Protection Board (EDPB)**: consistency mechanism and guidelines. Cite EDPB
  guidance (e.g. on legitimate interest, Art 22, DPIA, transfers, AI models) where relevant.
- **Norway (EEA, relevant to Nordic deployments):** GDPR applies through the
  *personopplysningsloven*. **Datatilsynet** is the supervisory authority, and **Personvernnemnda**
  hears appeals.
- **UK:** UK GDPR and the Data Protection Act 2018, enforced by the ICO, form a **separate
  regime**. Not assessed here. Note it under *Related regimes* if the system serves UK users.

### Adjacent regimes (note, don't assess)

- **EU AI Act**: use `eu-ai-act-controls-reviewer`. Overlaps include: Art 10(5) (special-category
  data for bias detection), Art 26(9) (deployers reuse the GDPR DPIA), Art 27 FRIA, and Art 50
  transparency next to GDPR Art 13.
- **ePrivacy Directive Art 5(3)**, national cookie and tracker rules: consent for
  non-essential cookies, SDKs, and device storage. Flag cookie-banner or tracker signals.
- **Data Act, NIS2, sector rules** (health, finance): flag only if clear signals exist.

### Mapping-version notes

- **ISO/IEC 27701** references use the **27701:2019** clause numbers:
  - clause 5: PIMS requirements
  - clause 6: privacy extensions to ISO/IEC 27002:2013 controls (6.2–6.15 follow 27002
    clauses 5–18)
  - clause 7 / Annex A: controller controls
  - clause 8 / Annex B: processor controls

  **ISO/IEC 27701:2025** restructured the standard as standalone. Re-map before using this as
  evidence for a 27701:2025 certification.
- **NIST Privacy Framework** references use **v1.0** category IDs (functions Identify-P,
  Govern-P, Control-P, Communicate-P, Protect-P). Check the current version's IDs before
  citing at subcategory level.
