# Drafting Guide

Used in Draft. A draft is a **working document for the lawyers to complete and approve**. It saves them from asking how the product works. It doesn't replace them.

## Five kinds of text

| Kind | Write | Condition |
|---|---|---|
| **Fact:** what the product or service does | Plain sentences | Observed or Reported, checked in this run, and confirmed by the engineer. Otherwise `[CONFIRM: … — who]` |
| **Commitment:** what someone promises | The promise, with its number | It passes the **Promise check** (and **Service level checks**), **and** a named owner entitled to make it has agreed. Otherwise `[DECIDE: … — who]` |
| **Legal position:** who bears which risk, rights, or duty | The heading, its note, then `[LAWYER: question]` and any product facts they need. **No clause wording**, except as rule 1 and *Wording supplied by the lawyers* say | Always |
| **Section note:** why the section matters and why it's considered here | Under **every** heading, as **Section Notes** says. Removed before publication | Always |
| **Party detail:** legal name, number, address, contact | As given | Given by the engineer or a document. Otherwise `[FILL: …]` |

**Always a legal position:** legal basis, controller or processor role, transfer mechanism, statutory rights and withdrawal, licence grant and ownership, warranty, liability, indemnity, credits and penalties, termination rights, governing law, disputes, precedence between documents, changes to terms, age of consent, and whether the document is required.

An existing commitment in a signed contract is used as written and cited. Wording supplied by the lawyers is used exactly as given, marked `[from the lawyers, <date>]` until they approve the document.

## Rules

1. Start from the template the customer or their lawyers supplied, if there is one, and keep its wording and order. Mark its legal clauses `[from the template]` without assessing them, and check its factual statements and promises like any other. Otherwise use the outline below. Never copy another company's document, or reproduce a standard form from memory.
2. Write for the document's reader: short sentences, no code names, no internal detail. Use one term for one thing.
3. Describe what the product does **today**. A planned function is `[DECIDE: confirm before launch — who]`, never present tense.
4. If today's behaviour is awkward, describe it truthfully or use `[DECIDE]` and raise the gap. Never soften it, and never drop the topic so that the draft misleads. Security weaknesses stay out of the text, and so does any claim they contradict.
5. Prefer the specific. Replace "we may collect information" with the data listed. No absolutes ("always", "fully secure").
6. Every placeholder has an id (`D1`, `L1`, `C1`, `P1`), an owner, and appears in the list at the end. Remove none without an answer, a source, and a date.
7. Drafting in Norwegian: use the Norwegian titles in the catalog and ask for a native speaker's check. Draft one language first and translate only after the content is settled. Ask the lawyers which version prevails.

## Not drafted here

| Case | Do instead |
|---|---|
| The lawyers have a draft, or will write it | Give them the facts, then Review |
| Public-sector standard agreements (such as SSA) | Prepare the annexes' product facts only, in the official form the customer supplies |
| Sector agreements (health, finance, public) | Prepare the facts only. Specialist lawyers draft |
| Accessibility statement made through an official service | Prepare the facts for that service. For Norway see Market Triggers |
| Result *Not needed* or *Unclear* | Settle the question first |
| *Lawyers to confirm* | Draft only if the engineer asks, and say on the cover that the need isn't confirmed |

## Outlines

The order for each document. **F** fact, **C** commitment, **L** legal position. Take the facts from **Supply** in the Document Catalog. Leave out a section only when the facts show it doesn't apply, and list it in the draft notes.

| Document | Sections |
|---|---|
| Privacy policy | Who we are and how to contact us (F) · Data and where it comes from (F) · Purposes seen in the product (F) and legal basis (L) · Recipients and vendors (F) · Storage, and access from other countries (F), transfer mechanism (L) · Retention (F, C) · Cookies (F) · AI and automated decisions (F, L) · Children (F, L) · Security, in general terms (F) · Your rights (L) and how to use the product functions (F) · Complaints (L) · Changes and version (F, L) |
| Cookie policy | What is used (F table: name, provider, purpose, lifetime, category) · How to choose and change (F) · Consent basis (L) · Version (F) |
| Terms of service | Service and who it is for (F) · Accounts (F) · Plans, payment, renewal, cancellation (F, C, L) · User content and reporting (F, L) · Acceptable use (F, L) · Third parties and AI (F) · Availability, changes, suspension (F, C, L) · Data at the end (F, C) · Ownership, warranty, liability, law, disputes (L) · Contact and version (F) |
| EULA | Product and licensor (F) · Licence model as enforced (F), grant and restrictions (L) · Activation, updates, telemetry (F) · Open-source components (F, L) · Store terms (L) · End of use and uninstall (F, L) · Support (F, C) · Ownership, warranty, liability, law (L) |
| Acceptable use | Scope (F) · Limits with a control (F) · Prohibited uses (L, and DECIDE for the customer) · Reporting and enforcement steps that exist (F) |
| SLA | Services, environments, hours (F, C) · Availability target, formula, measuring point, period (C) · Exclusions and maintenance (C, L) · Recovery (C) · Reporting (F, C) · Incident and severity (F, C) · Dependencies on others (F) · Customer duties (C, L) · Credits, caps, termination (L) |
| Support agreement | Scope and versions (F, C) · Channels, hours, holidays, time zone (F, C) · Severity and who sets it (C) · Response, restoration, resolution, kept apart (C) · Levels and escalation (F) · Remote access and ticket data (F, L) · Releases and patches (F, C) · Customer duties (C, L) · Fees, liability, term (L) |
| DPA and sub-processors | Ask the lawyers which standard form applies, and fill **its** annexes. Processing description (F) · Security measures as implemented (F) · Sub-processors with location and access (F) · Notice, assistance, audit, deletion (C) · Everything else (L) |
| Open-source notices | Component, version, licence, copyright (F, from scanner output). Unknown or copyleft (L) |
| AI notice / terms | Where AI is used and what it does (F) · Data sent, retention, training setting (F) · Limits and errors seen (F) · Human review and contact (F) · Marking (F) · Required wording and duties (L) |
| Vulnerability disclosure | Scope (DECIDE) · Channel and who monitors it (F) · Response targets (C) · Safe-harbour and legal terms (L) |
| Subscription, refund, cancellation | Plans and price (F, C) · Renewal and cancellation steps (F) · Refund process (F, C) · Withdrawal rights (L) |
| Retention and deletion | Data, period, trigger, method, backups (F, C) · How to request (F) · Exceptions (L) |
| Content and notice | What users can post (F) · How to report (F) · Handling and targets (F, C) · Complaints, sanctions, rights holders (L) |
| API terms | Access and keys (F) · Limits (F, C) · Versions and deprecation (F, C) · Use restrictions, licence, liability (L) |
| Beta or pilot terms | What is tested and known limits (F) · Data used and end date (F, C) · Feedback, confidentiality, liability (L) |
| Export and exit | Formats, scope, how long (F, C) · Help offered (C) · Deletion afterwards (F, C) · Fees and duties (L) |

For a document not listed, agree its purpose, parties, and sections with the engineer at D2.
