## Framework module: Automated Decision-Making And Profiling

- **Module ID:** automated-decision-making-and-profiling
- **Applies when:** The system profiles people, or makes or materially drives decisions about them (eligibility, credit, hiring, pricing, access, fraud flags, account bans, moderation). This includes an AI agent acting on someone's behalf where the outcome has legal or similarly significant effect.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 5 (1 Automatable, 4 Partial, 0 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Solely automated decisions with legal or similarly significant effects are identified, and each has a valid Art 22(2) exception (contract necessity, law, or explicit consent). | Art 22(1)-(2) | Upper (83(5)) | Controller | 7.3.10 | ID.RA-P; GV.PO-P | Critical | Partial | Find decision points where a model or rule output directly triggers an outcome (approve, reject, ban, price, rank-out) with no human step. Which exception applies is legal. |
| 2 | Safeguards exist: the person can obtain human intervention, express their view, and contest the decision. | Art 22(3) | Upper (83(5)) | Controller | 7.3.10 | CT.DM-P; CM.AW-P | Critical | Automatable | Inspect for an appeal or contest path, a human-review queue, reviewer override, and an audit trail of overrides. |
| 3 | Special-category data is not used for automated decisions unless Art 9(2)(a) or (g) applies with suitable safeguards. Proxies (e.g. postcode for ethnicity) are considered. | Art 22(4) | Upper (83(5)) | Controller | 7.3.10; 7.2.2 | CT.DM-P; ID.RA-P | Critical | Partial | Check features, prompts, and model inputs for special-category fields or obvious proxies. Whether a legal condition applies is for counsel. |
| 4 | Meaningful information about the logic, significance, and consequences is available, and a per-decision reason can be produced on request. | Art 13(2)(f); 15(1)(h) | Upper (83(5)) | Controller | 7.3.2; 7.3.10 | CM.AW-P | High | Partial | Look for stored reason codes, explanations, or model and prompt version per decision, retrievable for an access request. Whether the explanation is good enough is judgment. |
| 5 | Profiling is fair and accurate: errors and discriminatory effects are measured and minimised (Recital 71). | Art 5(1)(a), (d); 22 | Upper (83(5)) | Controller | 7.4.3 | ID.RA-P; GV.MT-P | High | Partial | Look for bias and fairness tests, error-rate monitoring by segment, and threshold reviews. Running them needs labelled data. See also the EU AI Act reviewer (Art 10, 14). |
