## Checklist: ML + Agentic

- **Module ID:** ml-agentic
- **Applies when:** The agent consumes a custom ML model (not just a hosted LLM) — e.g. a scoring/classification model.
- **Applies in addition to:** Generic Baseline
- **Controls:** 16 (5 Automatable, 11 Partial, 0 Manual)

| # | Dimension | Control | Severity | Automation | How to check |
|---|---|---|---|---|---|
| 1 | Model Governance | Underlying ML models are versioned in a registry with metadata and lineage. | High | Automatable | Inspect model registry/versioning metadata & lineage. |
| 2 | Model Governance | Training data, code, and parameters are reproducible for audit. | Medium | Partial | Check training code/data/params reproducibility; full audit needs artifacts. |
| 3 | Model Governance | Bias and fairness are tested for disparate impact across customer segments. | High | Partial | Detect fairness/disparate-impact test code; running needs labelled segments. |
| 4 | Model Governance | Model decisions are explainable to the degree regulation requires. | Medium | Partial | Detect explainability tooling; sufficiency vs regulation is judgment. |
| 5 | Data & Features | There is no train/serve skew between training and serving features. | High | Partial | Detect train/serve skew checks; confirming skew needs data. |
| 6 | Data & Features | Feature pipelines are reproducible and monitored for reliability. | High | Automatable | Inspect feature-pipeline reproducibility & monitoring. |
| 7 | Data & Features | A ground-truth/label pipeline captures outcomes for monitoring and retraining. | High | Partial | Detect ground-truth/label capture pipeline. |
| 8 | Monitoring | Input data drift is detected and alerted. | Critical | Partial | Detect data-drift detection/alerts; live drift is runtime. |
| 9 | Monitoring | Concept drift / performance decay is monitored against ground truth over time. | Critical | Partial | Detect concept-drift monitoring vs ground truth; runtime. |
| 10 | Monitoring | Model output scores/probabilities are calibrated; thresholds are justified. | Medium | Partial | Inspect calibration/threshold code; justification is analysis. |
| 11 | Agent Integration | The agent consumes model outputs via a typed, validated interface contract. | High | Automatable | Inspect typed/validated model-output interface contract. |
| 12 | Agent Integration | The agent acts on confidence/uncertainty and abstains when confidence is low. | High | Automatable | Inspect agent abstains on low confidence. |
| 13 | Agent Integration | A deterministic fallback exists when the model is unavailable or low-confidence. | High | Automatable | Inspect deterministic fallback when model unavailable/low-confidence. |
| 14 | Agent Integration | End-to-end evaluation covers both model accuracy and agent behavior. | High | Partial | Detect end-to-end eval (model + agent); running needs datasets. |
| 15 | Lifecycle | Retraining cadence/triggers are defined with an approval gate. | Medium | Partial | Inspect retraining cadence/triggers & approval-gate config. |
| 16 | Lifecycle | New models are validated in shadow / champion-challenger before promotion. | Medium | Partial | Detect shadow / champion-challenger validation setup. |

