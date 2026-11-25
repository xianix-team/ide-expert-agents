# Related Skills

Used in S2. Other skills in this library that make the documents more accurate, or build what they promise. This skill **recommends** them and the engineer decides and runs them.

## When to recommend

Go through every row. If an Observed or Reported fact meets the signal, recommending it is **required**, even when nobody asked. Without such a fact, don't recommend it. If the signal is unknown, ask for it as an open question instead.

| Signal in the facts | Recommend | What it gives the documents | When | Needs |
|---|---|---|---|---|
| Personal data of any kind, including logs, analytics, support tools, and AI prompts | `gdpr-controls-reviewer` | Personal-data inventory, vendor flows, retention, rights functions, and the role question, for the privacy policy, cookie policy, DPA, sub-processor list, and retention policy | **Before drafting or reviewing** those | Codebase |
| AI features: model calls, generated content, scoring, recommendations, automated decisions, agents | `eu-ai-act-controls-reviewer` | Provisional risk tier, role, and transparency gaps, for the AI notice and AI terms. It reviews against the EU act: see **Market Triggers** for its status in Norway | **Before drafting or reviewing** those | Codebase with AI |
| AI that processes personal data | Both of the above | As above, plus data sent to AI providers | **Before drafting or reviewing** | Codebase |
| AI agents that use tools or act for the user | `agentic-ai-reviewer` | Whether stated human oversight, limits, and safeguards exist | Before making those statements | Agentic codebase |
| A document describes security measures (DPA annex, security statement) | `owasp-security-scanner` | Code weaknesses that contradict a stated measure. Not proof that a measure works | Before making those statements | Codebase, web access |
| Sign-in, access control, or MFA is promised and is missing or weak | `auth-implementer` | Builds it | Before the promise takes effect | Codebase |
| Uptime or response times are promised and not measured | `observability-implementer` | The measurement an SLA depends on | Before signing | Codebase, platform |
| Hosting, region, redundancy, or backup is stated and the product is deployed | `deployment-architect` | What the live environment really provides, for the SLA, DPA, and location statements | Before making those statements | Read access to the cloud |
| An accessibility statement is needed or must be checked | `ui-ux-accessibility-testing` | Known accessibility gaps | Before the statement | Page URL, browser automation |
| The product is a data platform or warehouse | `due-diligence` | Data handling, access, and quality findings | Before the privacy documents and DPA | Repository |
| Acceptance, consent, export, deletion, or cancellation must be built | `elaborate`, then `estimate` | Scoped, estimated work | After Identify, Draft, or Review | Codebase |
| A release is planned with these documents | `release-readiness-checklist` | A recorded check before shipping | Last | A release and someone to answer |

If what it needs isn't there (for example, no code yet), still name the skill and say when it becomes useful. Open-source licence lists need a licence scanner; no skill here produces one.

## How to recommend

Show one row per recommendation:

| Skill | Why for this product | Helps with | Best time | Decision |
|---|---|---|---|---|
| `gdpr-controls-reviewer` | F1, F4: names and email stored, sent to a support vendor | Privacy policy, DPA | Before drafting | run first / later / no |

- Name at most the rows that apply, *before drafting or reviewing* first. If none apply, say so and which signals were checked.
- Ask for the decision in the same message as the next checkpoint. If the engineer chooses to run one first, stop there and say what to bring back.
- If the engineer goes on without one that was recommended **before**, continue. List the affected statements as *not covered by `<skill>`* in the internal notes, and don't ask again in this run.
- Reports are **internal**. Several of these skills write to the repository root by default, so tell the engineer to name the private folder instead.

## Using a report

- Cite the report, its date, its commit, and the section. Recheck any code fact under **Reusing facts** before relying on it. An older commit makes it a lead.
- Use what it says about **the product**. Its views on roles, risk tier, exposure, or gaps are provisional, so they become questions for the lawyers, never statements in a draft.
- *No evidence located* isn't proof of absence, and a pass isn't compliance.
- If it contradicts the facts here, show both and ask.
- A gap that makes a statement untrue is handled like any other: product work, a decision, or a Blocker that the customer hears about.
