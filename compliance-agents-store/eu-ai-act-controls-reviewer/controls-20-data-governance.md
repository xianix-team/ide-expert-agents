## Framework module: Data And Data Governance

- **Module ID:** data-and-data-governance
- **Applies when:** The system is high-risk and is trained on, or retrieves from, datasets (includes RAG knowledge bases).
- **Primary regime:** EU AI Act (mapped to ISO/IEC 42001 Annex A and NIST AI RMF)
- **Controls:** 4 (0 Automatable, 3 Partial, 1 Manual)

| # | Requirement (control question) | EU AI Act | Applies from (enforceable) | ISO/IEC 42001 | NIST AI RMF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|
| 1 | Training/validation/test (and retrieval) datasets meet quality criteria — relevant, representative, appropriate, and as error-free as possible. | Art 10(2)-(3) | 2 Dec 2027 | A.7.2; A.7.3 | MAP 2; MEASURE 2 | High | Partial | Inspect data pipeline for validation/schema/quality checks and dataset documentation. |
| 2 | Datasets are examined for biases likely to affect health, safety or fundamental rights, or lead to discrimination. | Art 10(2)(f)-(g) | 2 Dec 2027 | A.7 | MEASURE 2 (fairness/bias) | High | Partial | Look for bias/fairness tests and class-balance checks; running them needs labelled segments. (Bias-detection legal basis now extended to all systems under strict necessity.) |
| 3 | Data governance is documented — provenance, collection, labelling, cleaning, and lineage. | Art 10(2) | 2 Dec 2027 | A.7.4 (data provenance) | MAP 4; GOVERN 6 | Medium | Partial | Inspect for data-lineage/provenance tracking in the pipeline and docs. |
| 4 | Special-category data is processed only with the safeguards required for bias detection/correction. | Art 10(5) | 2 Dec 2027 | A.7 | MEASURE 2; GOVERN 1 | Medium | Manual | Confirm legal basis and documented safeguards. |

