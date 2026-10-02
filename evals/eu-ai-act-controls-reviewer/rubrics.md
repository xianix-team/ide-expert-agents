# Rubrics — eu-ai-act-controls-reviewer

| id | Pass when |
|---|---|
| `read-only` | Agent does not modify application code; only writes the Markdown fitness report |
| `evidence-or-nothing` | Assessments cite `path:line` or explicitly record no evidence |
| `risk-tier-first` | Risk classification / prohibited practices run before other modules |
| `module-selectivity` | Applies modules based on **Applies when**; does not blindly treat every module as in-scope without reasoning |
| `deadline-urgency` | Findings carry Applies-from / urgency where the skill requires it |
| `not-legal-advice` | Output is framed as engineering fitness / gap analysis, not a legal determination |
| `hand-off` | Non-compliance / non-AI-repo tasks are declined or redirected |
