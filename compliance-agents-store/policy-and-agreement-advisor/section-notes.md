# Section Notes

Used in D2 and D3. **Every heading in a draft gets a note** saying why the section matters and why this product's document needs to consider it, so that whoever completes it knows what is at stake. The notes replace legal wording. They don't hint at any.

## Format

Directly under the heading, before the text and placeholders:

```markdown
## <Heading>

> **Why it matters:** <what goes wrong for the reader or a party if this is missing, vague, or untrue>
> **Why it's considered here:** <the product fact, contract, platform, or market question behind it, in plain language>
> **To consider:** <the points to settle, with placeholder ids>

<text and placeholders>
```

- **Why it matters** comes from the table, shortened or fitted to the document. It is practical, not legal: never "the law requires", "this limits your liability", or "this protects you".
- **Why it's considered here** names something true of **this** product. A signed contract or store rule is named as such. If only a market trigger supports it, write a question: "Norway may have rules on this. For the lawyers to confirm." If nothing about the product supports it, but this kind of document normally covers it, write "Usual in this kind of document. No product-specific reason was found." Leave the section out only as the Drafting Guide says.
- **To consider** lists open points and product facts, never a recommended position, number, or wording.
- Keep the note to about three short sentences, in the draft's language. It is read by the customer and their lawyers, so rule 4 of the Drafting Guide and *Internal stays internal* apply.
- Topics joined in an outline, such as "Ownership, warranty, liability, law, disputes", each get their **own heading and note**.
- The notes are removed before publication, together with the open points. In a supplied template, put them under its headings without changing its text.

## Notes by topic

Use the closest row. A topic not listed: write the note from the product facts, or ask the engineer, and mark it `[CONFIRM]`.

| Topic | Why it matters | To consider |
|---|---|---|
| Parties, scope, definitions | Nobody can rely on a document that doesn't say who promises what, for which product | Publisher, operator, and seller may differ. Versions, environments, and countries covered |
| Contact, version, changes | Readers need to know which text applies and whom to ask | Monitored contact, how people hear of changes, where old versions are kept |
| Data and its sources | Readers judge everything else by what is collected. Omissions are the usual fault | Logs, support tools, backups, AI prompts, data from third parties |
| Purposes and legal basis | Data used beyond the stated purpose breaks trust, and later uses need a new decision | Each purpose seen in the product, optional uses, the basis for each |
| Recipients, vendors, sub-processors | People and customers want to know who else handles the data | Full vendor list, who keeps it current, notice of changes |
| Storage, access, transfers | "Stored here" doesn't say who can reach it from elsewhere | Hosting, backups, support and development access by country |
| Retention and deletion | A period nobody implements is an untrue promise | Every store including backups, trigger, exceptions |
| Cookies and consent | What runs before a choice is made is visible to anyone who looks | Run-time tags, categories, how a choice is changed |
| AI and automated decisions | People may act on output they don't know is automated or may be wrong | Where AI is used, known limits, data sent, human review, marking |
| Children | Children may be users even when they aren't the audience | Intended age, checks that exist, guardian involvement |
| Security | Specific claims are tested after an incident | Measures that are real and may be stated, shared duties |
| Rights and complaints | A right without a working route can't be used | Product functions, who answers, how long it takes today |
| Accounts and eligibility | Decides who may use the product and who answers for an account | Sign-up rules, shared accounts, administrators |
| Plans, payment, renewal, refunds, withdrawal | Unexpected charges are a common cause of disputes | Price display, renewal, cancellation path, refunds, consumer or business buyers |
| User content, reporting, handling | Content affects other people, and someone must act on reports | Who can see it, report route, who handles it and when |
| Acceptable use and limits | A rule without a control can't be applied evenly | Limits enforced, who decides, steps before suspension |
| Third parties | Users meet services the publisher doesn't control | Which services, what stops if one fails |
| Availability and measurement | A target means nothing without a formula and a measuring point | Measured history, hours, what counts as down |
| Exclusions and maintenance | Exclusions decide what the target is worth in practice | Release pattern, notice, vendor outages |
| Recovery | After a failure, this decides how much data and time is lost | Last tested restore, backup schedule |
| Incidents, severity, response | Both sides must mean the same by "urgent" and "fixed" | Who sets severity, response and fix kept apart, rota |
| Service reporting | A promise nobody reports on can't be checked | Source of figures, period, recipient |
| Dependencies and customer duties | The result often depends on someone else acting first | Access, information, first-line support, vendor times |
| Support channels, hours, levels | Users plan around when help is really there | Staffed hours, time zone, holidays, who does each level |
| Remote access and ticket data | Support staff may see live data, sometimes from other countries | Who, from where, how it's approved and logged |
| Releases, versions, deprecation | Others build on a version and need time to move | Supported versions, notice given today, patch pattern |
| Licence model, grant, restrictions, activation | Decides what the user may do and what the product blocks | Limits enforced, devices and users, offline use |
| Telemetry and updates | The product changes or sends data without the user acting | What is sent, opt-out, automatic updates |
| Open source | Components carry their own terms | Complete list for the shipped build, unknown or copyleft licences |
| Store or platform terms | A listing can be rejected or removed | Current store documentation, required links |
| API access and keys | A leaked key or sudden limit affects other products | Key handling, limits, who is told |
| Ownership | Without it, rights to the product, content, and feedback are unclear | Customer content, custom work, third-party parts |
| Warranty | Sets what a user may expect if the product doesn't work as described | Claims made in marketing and documents, known limits |
| Liability and indemnity | Decides who carries the cost when something goes wrong | Realistic failures, effect on users, insurance, other contracts |
| Credits, caps, fees | Puts a price on missing a commitment | Which commitments they attach to, how a miss is shown |
| Suspension, termination, exit | The end is when access and data are most often disputed | Notice, export formats, time, deletion afterwards |
| Governing law and disputes | Parties may be in different countries | Where the parties and users are, consumers or businesses |
| Notice, assistance, audit | One party can meet its own duties only if the other answers in time | Detection, owner, upstream notice times, evidence available |
| Vulnerability reporting | Researchers need a safe route, or they publish or stay silent | Monitored channel, scope, real response times |
| Pilot limits, feedback, confidentiality | Testers may rely on something unfinished | Known limits, real or test data, end date |
