# Market Triggers: Norway, EU, and EEA

Used in Identify to spot documents and product features a market may call for, and in Draft and Review to phrase questions. Never write a row into a draft as a statement. **Leads for the lawyers, not statements of law.** A market trigger alone gives *Lawyers to confirm*.

**How far to trust a row.** Only rows with a **✓** were read on the named official page, in November 2026, and a page can have changed since. **Every other row is unverified background**, from general knowledge or secondary sources. Put it to the lawyers as a question and never quote it as a requirement. This skill doesn't browse, so it can't refresh these rows.

## Which situation?

Norway, Iceland, and Liechtenstein are in the **EEA, not the EU**. An EU act generally applies there only once it is in the EEA Agreement and in national law. Selling into an EU country can bring the EU act in earlier.

| Situation | Use |
|---|---|
| Publisher and users in Norway only | "EU and EEA" and "Norway". Acts not yet Norwegian law: list as *upcoming* |
| Norwegian publisher with users or customers in EU countries | The above, plus the "EU users" column, plus the national rules of those countries |
| Publisher in an EU country, **no** users or customers in Norway | "EU and EEA" and the "EU users" column, plus national rules. **Not** "Norway" |
| Publisher in an EU country, with users or customers in Norway | The row above, plus "Norway" |
| Iceland or Liechtenstein | "EU and EEA", plus a question on national law and each act's EEA status |
| Outside the EEA (including the UK and Switzerland) | Not covered. Ask which lawyers cover that market |

National rules add to EU law everywhere, especially on consumer terms, cookies, marketing, language, provider details, and age of consent. Ask the lawyers for each country in scope.

## EU and EEA

| If the product… | It points to | Ask the lawyers about |
|---|---|---|
| Processes personal data | Privacy policy, DPA where one party processes for another | GDPR: notice content, processor terms, legal basis |
| Uses cookies, SDKs, or device storage beyond the strictly necessary | Cookie information, and consent before they run | The national cookie rule and the regulator's guidance |
| Sells online to consumers | Terms, withdrawal and cancellation information, provider details | Consumer-rights, digital-content, unfair-terms, and e-commerce rules |
| Sends marketing messages | Consent and opt-out handling | National marketing rules |
| Is used by children, or uses health, biometric, or other sensitive data | Extra notice, consent, and safeguards | Specialist advice, national age of consent |
| Is **accessed from outside the EEA** by development, support, or operations | Transfer statements in the privacy policy, DPA, sub-processor list, and support agreement | Whether the access is a transfer, and on what basis. "Stored in the EEA" doesn't answer it. For Norway see the ✓ row below |
| Is a public-sector site or app | Accessibility statement | The national rule and authority |
| Runs in a critical sector, health, or finance | Security, incident, outsourcing, and sector terms | NIS2, DORA, and national sector rules, with specialist lawyers |

## Norway

| If the product… | It points to | Ask the lawyers about | Checked |
|---|---|---|---|
| Processes personal data | As above | *Personopplysningsloven*, national identity numbers, children's consent | |
| Uses cookies or similar | Consent before non-essential use | *Ekomloven* § 3-15: consent to the GDPR standard, narrow exceptions, shared supervision by Datatilsynet and Nkom | ✓ nkom.no/internett/informasjonskapsler-cookies (page dated 16 May 2025) |
| Is accessed from outside the EEA | As above | Datatilsynet's guidance treats remote access by a different controller or processor outside the EEA as a transfer, with a narrow exception for a travelling employee | ✓ datatilsynet.no, transfers out of the EEA (changed 29 Jan 2026) |
| Is a public-sector site or app | Accessibility statement | Uutilsynet says public sites and apps have one, made through uustatus.no and updated at least yearly. Language: *språklova* | ✓ uutilsynet.no, tilgjengelighetserklæring (undated). Language not checked |
| Sells online to consumers | As above | *Angrerettloven*, *digitalytelsesloven*, *avtaleloven* §§ 36–37, *markedsføringsloven*, *ehandelsloven* | |
| Sends marketing messages | As above | *Markedsføringsloven* § 15 | |
| Is bought by a public body | Possibly SSA contract annexes (e.g. SSA-L, SSA-V, SSA-D, cloud) instead of a separate SLA or support agreement | Which SSA and version, *offentleglova*, *arkivlova* | |
| Keeps invoices or payments | Possible exceptions to a deletion promise | *Bokføringsloven* | |
| Runs in a critical sector, health, or finance | As above | *Digitalsikkerhetsloven*, *Normen*, DORA in Norway | |

## EU acts with a different status in Norway

| Act | EU users: may point to | Norway, at last review | Checked |
|---|---|---|---|
| AI Act, Art 50 | AI notice in the product | *KI-loven* not adopted, bill reported for spring 2027 | |
| Withdrawal function ("angreknapp") | In-product withdrawal function. Reported to apply in the EU from 19 June 2026 | Reported adopted in 2026, date not found. The Storting committee expected a delayed start | ✓ for the expected delay only: stortinget.no, Innst. 395 L (2025–2026) |
| Data Act | Switching, export, and exit terms for hosted services | Reported not in Norwegian law in 2026 | |
| Accessibility Act | Accessibility information for consumer services | Not in the EEA Agreement or Norwegian law. Uutilsynet says Norwegian businesses selling to EU countries are expected to follow it there | ✓ uutilsynet.no, EAA (changed 1 Oct 2025) |
| Cyber Resilience Act | Vulnerability disclosure, support period, update terms. Reporting since 11 September 2026 | Not in the EEA Agreement on 11 September 2026. Norwegian makers selling in the EU may have to report to an EU state | ✓ nkom.no (11 Sept 2026) |
| Digital Services Act | Content rules, reporting, complaints for user content | *Digitaltjenesteloven* reported delayed | |
| Digital Omnibus (GDPR, cookies) | Nothing yet, reported still under negotiation | Nothing yet | |
| ODR platform | Reported closed 20 July 2025. Raise a remaining link as a question | Same | |

Official sources for the engineer or lawyers to check: lovdata.no, europalov.no, eur-lex.europa.eu, datatilsynet.no, nkom.no, forbrukertilsynet.no, uutilsynet.no, anskaffelser.no.

## Stores and platforms

Unverified and changeable. Ask the engineer for the current store documentation before treating one as a **platform** basis.

| Platform | Points to |
|---|---|
| Apple App Store | Privacy policy link in the listing and the app, in-app account deletion, privacy labels, Apple's standard EULA or a custom one |
| Google Play | Privacy policy at a public, non-geofenced, non-PDF URL, Data safety form, account deletion in the app and by web link |
| Other marketplaces | Required URLs and terms in the publisher documentation |
| AI providers | Whether the provider's terms ask for a usage policy or disclosure to users |
