# Section Notes

Used in D2 and D3. **Every heading in a draft gets a note** on why the section matters and why this product's document needs to consider it. The notes replace legal wording and don't hint at any. The list below is general background, not read by a lawyer, and not legal advice.

## Format

Directly under the heading:

```markdown
> **Why it matters:** <what goes wrong for the reader or a party if this is missing, vague, or untrue>
> **Why it's considered here:** <the product fact, contract, platform, or market question behind it, in plain language>
> **To consider:** <the points to settle, with placeholder ids>
```

- **Why it matters** comes from the list, fitted to the document. It is practical, not legal: never "the law requires", "this limits your liability", or "this protects you".
- **Why it's considered here** is true of **this** product. Name a contract or store rule. If only a market trigger supports it, write a question: "Norway may have rules on this. For the lawyers to confirm." If nothing does, write "Usual in this kind of document. No product-specific reason was found."
- **To consider** lists open points and product facts, from *Supply*, *Check*, and *Often wrong* in the Document Catalog and *Consider* below. Never a recommended position, number, or wording.
- About three short sentences, in the draft's language. One line is enough for a heading that only states a detail (*Version*, *Contact*). A sub-heading needs a note only if its topic differs from its parent's. None in a shipped open-source notice file or in the last two sections.
- The customer and their lawyers read the notes: no weaknesses, past failures, insurance, price, or negotiating position. Where our company falls short (not measured, tested, or staffed), leave it out of the note and list it as a gap (D3).
- Legal topics joined in an outline each get their **own heading and note**.
- In a supplied template, put notes under its headings without changing its text.

## Why it matters, by topic

Use the closest. For a topic not listed, write the note from the product facts, or ask the engineer, and mark it `[CONFIRM]`.

- **Parties, scope, definitions:** Nobody can rely on a document that doesn't say who promises what, for which product. *Consider:* publisher, operator, and seller may differ. Versions, environments, and countries covered.
- **Contact, version, changes:** Readers need to know which text applies and whom to ask. *Consider:* monitored contact, how people hear of changes, where old versions are kept.
- **Data and its sources:** Readers judge everything else by what is collected. Omissions are the usual fault.
- **Purposes and legal basis:** Data used beyond the stated purpose breaks trust, and later uses need a new decision.
- **Recipients, vendors, sub-processors:** People and customers want to know who else handles the data.
- **Storage, access, transfers:** "Stored here" doesn't say who can reach it from elsewhere.
- **Retention and deletion:** A period nobody implements is an untrue promise.
- **Cookies and consent:** What runs before a choice is made is visible to anyone who looks.
- **AI and automated decisions:** People may act on output they don't know is automated or may be wrong.
- **Children:** Children may be users even when they aren't the audience. *Consider:* intended age, checks that exist, guardian involvement.
- **Security:** Readers rely on specific claims, and check them after an incident.
- **Rights and complaints:** A right without a working route can't be used.
- **Accounts and eligibility:** Decides who may use the product and who answers for an account. *Consider:* sign-up rules, shared accounts, administrators.
- **Plans, payment, renewal, refunds, withdrawal:** Unexpected charges are a common cause of disputes.
- **User content, reporting, handling:** Content affects other people, and someone must act on reports. *Consider:* who can see it, report route, who handles it and when.
- **Acceptable use and limits:** A rule without a control can't be applied evenly. *Consider:* limits enforced, who decides, steps before suspension.
- **Third parties:** Users meet services the publisher doesn't control. *Consider:* which services, what stops if one fails.
- **Availability and measurement:** A target means nothing without a formula and a measuring point.
- **Exclusions and maintenance:** Exclusions decide what the target is worth in practice.
- **Recovery:** After a failure, this decides how much data and time is lost.
- **Incidents, severity, response:** Both sides must mean the same by "urgent" and "fixed".
- **Service reporting:** A promise nobody reports on can't be checked.
- **Dependencies and customer duties:** The result often depends on someone else acting first.
- **Support channels, hours, levels:** Users plan around when help is really there.
- **Remote access and ticket data:** Support staff may see live data, sometimes from other countries.
- **Releases, versions, deprecation:** Others build on a version and need time to move.
- **Licence model, grant, restrictions, activation:** Decides what the user may do and what the product blocks.
- **Telemetry and updates:** The product changes or sends data without the user acting.
- **Open source:** Components carry their own terms.
- **Store or platform terms:** A listing can be rejected or removed. *Consider:* current store documentation, required links.
- **API access and keys:** A leaked key or sudden limit affects other products. *Consider:* key handling, limits, who is told.
- **Ownership:** People ask who may use the product, their content, and their feedback, and for what. *Consider:* whose content the product holds, custom work, third-party parts.
- **Warranty:** People ask what they can expect if the product doesn't work as described. *Consider:* public claims about the product, published limits.
- **Liability and indemnity:** People ask what happens if use of the product causes a loss. *Consider:* what users rely on the product for, who else provides part of it.
- **Credits, caps, fees:** People ask what happens when a commitment is missed, and how they'd know. *Consider:* which commitments are measured, and where a miss shows.
- **Suspension, termination, exit:** The end is when access and data are most often disputed.
- **Governing law and disputes:** People ask where a disagreement is handled, and parties may be in different countries. *Consider:* where the parties and users are, consumers or businesses.
- **Notice, assistance, audit:** Each party depends on the other to answer in time.
- **Vulnerability reporting:** Researchers need a safe route, or they publish or stay silent. *Consider:* monitored channel, scope, real response times.
- **Pilot limits, feedback, confidentiality:** Testers may rely on something unfinished. *Consider:* known limits, real or test data, end date.
