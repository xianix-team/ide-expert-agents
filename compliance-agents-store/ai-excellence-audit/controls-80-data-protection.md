## Framework module: Data protection (customer IP & PII)

- **Module ID:** data-protection
- **Pillar group:** Foundation
- **Applies when:** Always.
- **Intent:** Customer code and data are entrusted to us - they never become training data or prompts in the wrong place. Protecting customer intellectual property and personal data.
- **Controls:** 10 (1 Automatable, 9 Partial, 0 Manual); 7 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Classify before you prompt** - Know the class of what you're sharing: public, 99x internal, customer confidential (code, docs, designs), personal data, secrets. The classification decides which tools are allowed (see matrix). | Baseline | A.7.2 · 4.1/4.2 | High | Partial | Look for a data-classification scheme/matrix referenced from the rules file and tied to tool permissions. |
| 2 | **Enterprise AI only for customer assets** - Use only 99x- or customer-approved AI tools under enterprise terms: no training on inputs, defined/zero retention, known hosting region, a DPA where personal data could be processed. Never use personal or free AI accounts for customer work. | Baseline | A.10.3 · A.4.4 · GDPR Art. 28 | Critical | Partial | Look for configs using organisation-managed endpoints/accounts rather than personal keys, and tool-register entries recording no-training/retention/region/DPA terms. Account type and contract terms need a human. |
| 3 | **No real personal data in prompts or context** - Do not paste production records, logs, support tickets or database extracts into AI tools. Use synthetic or properly anonymised data. Pseudonymised data is still personal data. | Baseline | A.7.2 · A.7.5 · GDPR Art. 5 | Critical | Partial | Look for committed dumps, logs, exports or fixtures that look like real personal data (never reproduce values), deny rules on such paths in agent config, and a rule in the rules file. Prompt behaviour itself is not verifiable. |
| 4 | **No production data in dev & test** - Development, test and agent environments use synthetic or masked data sets. Production copies require documented approval and masking. | Baseline | A.7.4 · A.7.5 · GDPR Art. 25 | Critical | Partial | Look for tracked `*.sql`/`*.bak`/`*.csv` dumps, seeds that are not synthetic (faker/masking scripts are good signs), and dev/test configs pointing at production hosts. |
| 5 | **Secrets never leave the vault** - Credentials, keys and connection strings are never shared with AI tools and are excluded from agent read access. | Baseline | A.7.2 · SSDF PS.1 · OWASP ASI03 | Critical | Automatable | Agent-facing angle: no secrets in agent-visible files (rules, skills, prompts, MCP configs), and agent deny rules cover `.env*`, key files, `secrets/`. Also check history: files such as `.env`, `*.pem` or `*.key` ever added (`git log --all --diff-filter=A`) are a `Fail` even if since deleted, with "rotate the credential" as the action. (Scanning tooling is assessed under Guardrails.) |
| 6 | **Ownership & licence clarity** - Confirm in the contract how AI-generated code is owned and licensed. Enable public-code filters / code-reference detection and record third-party code provenance. | Baseline | A.10.2 · A.10.4 | Medium | Partial | Look for a `LICENSE`, third-party provenance (`NOTICE`, `THIRD_PARTY`), and any recorded public-code-filter setting. Contract terms need a human. |
| 7 | **Incident reporting** - Accidental sharing of customer data or PII with a tool is reported immediately via the 99x incident process so the customer can be informed and personal-data breach timelines (e.g. 72 hours under GDPR) can be met. | Baseline | A.8.4 · A.3.3 · GDPR Art. 33 | High | Partial | Look for `SECURITY.md` or an incident process doc that covers accidental disclosure to AI tools and the reporting timeline. Awareness is organisational. |
| 8 | **Customer-tenant tooling** - Where customers require it, run AI tools inside the customer's tenant / cloud subscription or use self-hosted models, so code never leaves the customer boundary. | Advanced | A.10.2 · A.4.5 | Medium | Partial | Look for agent/tool configs pointing at the customer's tenant or self-hosted models (base URL, region) where the engagement requires it. |
| 9 | **Privacy by design in AI features** - When building AI features into customer products, perform a data protection impact assessment and an AI impact assessment, and document data sources and provenance. | Advanced | A.5 · A.7.2 | Medium | Partial | Applies only if the product ships AI features; otherwise `N/A`. Look for a DPIA and AI impact assessment. For depth, point to `gdpr-controls-reviewer` and `eu-ai-act-controls-reviewer`. |
| 10 | **Retention of agent artefacts** - Agent transcripts, logs and caches may contain customer code or PII - apply the same retention and deletion rules as for the source data. | Advanced | A.7.4 · A.6.2.8 | Low | Partial | Check agent transcripts, chat histories and caches are not tracked (for example `.specstory/`, `.aider.chat.history.md`, `.aider.input.history`, exported `*.jsonl` transcripts, `.claude/projects/`) and that `.gitignore` covers them. A tracked transcript is a `Fail` and must be checked for customer data. Look for a retention/deletion note. Local retention is organisational. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Customer IP disclosed to third parties** (high) - Proprietary code or designs retained by, or used to train, an external model; breach of contract; loss of customer trust and business.
- **Personal data breach via AI tooling** (high) - PII in prompts, logs or test fixtures processed by an unapproved processor; regulatory fines and mandatory notification.
- **Secrets exposed** (high) - Credentials shared in a prompt or read by an agent are leaked, enabling access to customer systems.
- **Unclear ownership of generated code** (med) - Disputes over IP ownership or licence obligations in delivered software.
- **Production data in non-production environments** (high) - Personal data exposed to agents, tools and people without a lawful basis or need.
- **Late or missing incident reporting** (high) - Missed legal deadlines; customer learns of the issue from elsewhere.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Can every engineer state which AI tools are allowed for this customer and why?
- Do dev, test and agent environments contain any real personal data?
- Are secrets and data exports excluded from agent read access?
- Does the contract address AI use and ownership of AI-generated code?
- Does the team know how to report an accidental disclosure, and how fast?
