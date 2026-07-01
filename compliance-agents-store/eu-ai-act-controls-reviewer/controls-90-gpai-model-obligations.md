## Framework module: Gpai Model Obligations

- **Module ID:** gpai-model-obligations
- **Applies when:** You are the provider of a general-purpose AI (GPAI) model (not just a downstream user of one).
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 5 (0 Automatable, 2 Partial, 3 Manual)

| # | Requirement (control question) | EU AI Act | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|
| 1 | Technical documentation of the model (training process, evaluation) is maintained. | Art 53(1)(a) | A.6.2 | MAP 1; MEASURE 2 | High | Partial | Inspect for a model card / evaluation report; completeness is judgment. |
| 2 | Information is provided to downstream providers to enable their own compliance. | Art 53(1)(b) | A.8; A.10 | GOVERN 6 | Medium | Manual | Downstream documentation artifact. |
| 3 | A policy to comply with EU copyright law (including TDM opt-outs) is in place. | Art 53(1)(c) | A.7 | GOVERN 1 | Medium | Manual | Policy document. |
| 4 | A sufficiently detailed public summary of training content is published. | Art 53(1)(d) | A.7 | GOVERN 5 | Low | Manual | Published artifact. |
| 5 | For systemic-risk GPAI: model evaluation, adversarial testing, incident tracking and cybersecurity are performed. | Art 55 | A.6 | MEASURE 2; MANAGE 4 | High | Partial | Inspect for red-team / eval evidence; systemic-risk designation is a legal determination. |

