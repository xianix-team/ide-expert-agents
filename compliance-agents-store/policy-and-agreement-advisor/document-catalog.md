# Document Catalog

Used in S1 (what to look for), I1 (what is needed), and R2 (what to check). "Prepared by" is the usual arrangement, so confirm it. The lawyers decide the content. The lists here cover only what can be checked against the product.

## Grounding signals

Case-insensitive leads for S1. In Identify use all of them. In Review use the ones the submitted documents touch. Distinctive terms aren't anchored with `\b`, because that would miss names such as `OPENAI_API_KEY` or `user_email`. Expect false positives: open the file before recording a fact, and ignore UI or tree uses of `children`.

The lists are examples. A vendor or data field with another name won't match, so also read dependency manifests, environment templates, and outbound URLs, and look through the data models.

```text
Personal data:      e-?mail|first[_-]?name|last[_-]?name|full[_-]?name|surname|phone|address|street|birth|\bdob\b|_dob\b|\bdob_|national[_-]?id|f[oø]dselsnummer|personnummer|\bssn\b|_ssn\b|\bssn_|passport|ip[_-]?addr|device[_-]?id|latitude|avatar
                    glob: **/migrations/** **/models/** **/entities/** **/schema*.{prisma,sql,graphql}
Sensitive/children: health|medical|patient|diagnos|biometric|face[_-]?id|ethnic|religio|criminal|\bminors?\b|is[_-]?minor|child|age[_-]?(gate|limit|verif)|parental|guardian
Trackers, cookies:  gtag|googletagmanager|analytics|segment|mixpanel|amplitude|posthog|hotjar|clarity|\bfbq\b|set-?cookie|document\.cookie|localStorage|sessionStorage|consent
Vendors:            stripe|paypal|adyen|vipps|sendgrid|mailchimp|twilio|auth0|okta|\bentra\b|entra[_-]?id|firebase|sentry|datadog|intercom|zendesk|hubspot|salesforce
AI providers:       openai|anthropic|bedrock|vertex[_-]?ai|gemini|mistral|cohere\b|cohere[_-]|langchain|embedding
Retention, rights:  \bttl|[_-]ttl|ttl[_-]?(sec|min|hour|day)|retention|purge|soft[_-]?delete|anonymi[sz]|export[_-]?(my[_-]?)?data|data[_-]?export|delete[_-]?(my[_-]?)?account|account[_-]?deletion|unsubscribe|opt[_-]?out
Accounts, licence:  licen[cs]e[_-]?key|activation|subscription|trial|\b(seat|plan|tier)\b|(seats|plans|tiers)\b|(seat|plan|tier)_?(id|type|name|code|count|limit)|entitlement|suspend|terminat
Payments:           invoice|refund|auto[_-]?renew|cancel[_-]?subscription|proration|in[_-]?app[_-]?purchase
User content:       upload|(comments|posts)\b|(comment|post)_?(id|text|body)|moderat|report[_-]?(abuse|content)|flag[_-]?content|takedown
Service levels:     health[_-]?check|healthz|uptime|\bsl[ao]\b|_sl[ao]\b|\bsl[ao]_|alert[_-]?(rule|manager|ing)|pagerduty|opsgenie|status[_-]?page|backup|restore|failover|maintenance
Hosting, regions:   (region|location)\s*[:=]   glob: **/*.tf **/*.bicep **/*.{yaml,yml} **/Dockerfile
Permissions:        glob: **/AndroidManifest.xml **/Info.plist **/PrivacyInfo.xcprivacy **/manifest.json
Open source:        glob: **/package.json **/*.csproj **/pom.xml **/build.gradle* **/requirements*.txt **/pyproject.toml **/go.mod **/Cargo.toml **/LICENSE* **/NOTICE*
Existing documents: glob: **/*privacy* **/*terms* **/*eula* **/*licen* **/*sla* **/*support* **/SECURITY.md **/security.txt **/*cookie* **/*accessib* **/*personvern* **/*vilkar*
Acceptance flow:    accept(ed)?[_-]?terms|terms[_-]?(version|accepted)|agreed[_-]?at|consent[_-]?version|i agree
```

## When each document is needed

The **Triggered when** column is the strong trigger. Where a row says *otherwise Recommended*, the weaker case never makes it Needed by itself.

| Document (Norwegian title) | Triggered when | Between | Usually prepared by | Needed by |
|---|---|---|---|---|
| **Privacy policy** (personvernerklæring) | Any personal data, including logs and analytics | Publisher → users | Customer's lawyers | Before real personal data is collected |
| **Cookie policy** (informasjonskapsler) | Cookies, SDKs, or device storage beyond the strictly necessary. Strictly necessary only: *otherwise Recommended*, usually inside the privacy policy | Publisher → users | Customer's lawyers, cookie list from engineering | Before public access |
| **Terms of service** (brukervilkår) | People or organisations outside the publisher sign up for or use a hosted product. Internal tool: *otherwise Recommended*, ask whether the employer's own policies cover it | Publisher → users or customer organisations | Customer's lawyers | Before sign-up opens |
| **EULA** (lisensavtale) | Software installed on the user's device or premises, or a store app needing its own licence | Licensor → end user | Customer's lawyers | Before distribution |
| **Acceptable use policy** (retningslinjer for bruk) | People outside the publisher's organisation can publish, message, upload for others, or run automated traffic. *Otherwise Recommended* if misuse is a named risk | Publisher → users | Customer's lawyers | Before sign-up opens |
| **SLA** (tjenestenivåavtale) | Someone commits to availability, performance, or recovery | Provider → customer. Confirm which: us → customer, or customer → their customers | Provider's lawyers and commercial owner, technical annex from engineering | Before signing |
| **Support agreement** (support-/vedlikeholdsavtale) | Someone commits to support hours, response, or maintenance | As for the SLA | As for the SLA | Before signing |
| **DPA** (databehandleravtale) and **sub-processor list** | One party processes personal data for another | Controller ↔ processor | Lawyers of both, list from engineering | Before the processor gets access |
| **Open-source notices** | Third-party components are shipped | Publisher → recipients | Engineering, lawyers for licence questions | Before distribution |
| **AI notice / AI terms** | Users interact with AI, or get or are affected by AI output | Publisher → users | Customer's lawyers, AI facts from engineering | Before the feature is live |
| **Accessibility statement** (tilgjengelighetserklæring) | Market trigger only: public-sector site or app, or a consumer service sold into the EU. *Lawyers to confirm* | Publisher → public | Customer, with an assessment | At launch |
| **Vulnerability disclosure policy** | A contract or customer policy asks for one, or software is distributed to others. Internet-facing service alone: *otherwise Recommended* | Publisher → researchers | Customer's security owner | At launch |
| **Subscription, refund, cancellation policy** | Paid plans, trials, auto-renewal, in-app purchases | Seller → buyer | Customer's lawyers and finance | Before the first sale |
| **Retention and deletion policy; account-deletion page** | A store app with accounts, or a contract or policy that refers to a separate document. *Otherwise Recommended*, usually inside the privacy policy | Publisher → users | Customer's lawyers, facts from engineering | Before launch or store submission |
| **Content and notice policy** | User-generated content | Publisher → users and rights holders | Customer's lawyers | Before publishing opens |
| **API terms** | Third parties call the API | Publisher → developers | Customer's lawyers | Before keys are issued |
| **Beta or pilot terms** | Pre-release use by real users | Publisher → testers | Customer's lawyers | Before the pilot |
| **Data export and exit terms** | A hosted service sold under contract to other organisations that hold their data in it. *Otherwise Recommended* | Provider → customer | Provider's lawyers | Before signing |
| **Sector agreement** (health, finance, public) | A contract or customer policy asks for one. A sector rule alone: *lawyers to confirm* | As the rule says | Specialist lawyers | Before real data |

A document not listed: review it with the general checks, agree its purpose and parties first, and mark it "not in catalog".

## What to check in each document

**Supply** is what engineering gives the lawyers (Identify). **Check** is what to compare with the product (Review). **Often wrong** is where submitted documents and products usually part ways.

### Privacy policy

- **Supply:** data categories, where each comes from, purposes seen in the product, vendors and recipients, storage locations, who has access from outside the EEA, retention as implemented, automated decisions, AI use, available rights functions.
- **Check:** every data category, purpose, recipient, location, and retention period stated. Every real flow is mentioned. Rights and contact routes work. The named publisher is the one operating the product.
- **Often wrong:** logs, crash reports, support tools, backups, and AI prompts left out. "We don't share your data". Template vendors the product doesn't use.

### Cookie policy

- **Supply:** name, provider, purpose, lifetime, and category for each. A code search misses tags loaded at run time, so ask for a browser or scanner export.
- **Check:** the list matches, categories are right, and the change-your-choice route works.
- **Often wrong:** non-essential tags running before consent.

### Terms of service

- **Supply:** account, plan, payment, suspension, and termination behaviour, user-content features, third-party services, AI features, what happens to data at the end.
- **Check:** eligibility and age, account rules, renewal and cancellation, suspension, content reporting, notice of changes, and data after termination, all against what the product does.
- **Often wrong:** rights or restrictions the product can't perform, and business terms used for consumers (ask the lawyers).

### EULA

- **Supply:** licence model as enforced, activation, updates, telemetry, offline behaviour, components and their licences.
- **Check:** licence scope and limits, update and telemetry statements, uninstall, and store-specific terms.
- **Often wrong:** limits the product doesn't enforce, telemetry not mentioned, and open-source components covered by the same restrictions (ask the lawyers).

### Acceptable use policy

- **Supply:** rate limits, quotas, moderation, reporting, and enforcement functions.
- **Check:** each limit has a control, and each enforcement step has someone to do it.

### SLA

- **Supply:** hosting tier and redundancy, vendor SLAs, monitoring history, maintenance and release pattern, backup and restore tests, incident process.
- **Check:** run the **Service level checks**. Services and environments covered exist, the status page and reports exist, and exclusions match reality.
- **Often wrong:** a target with no measurement, and recovery times never tested.

### Support agreement

- **Supply:** support channels, staffed hours and time zones, levels and who does each, where support is given from, versions supported, release and patch pattern, ticket-data handling.
- **Check:** the Service level checks on hours, response, and severity. Escalation roles exist. Supported versions match. Remote-access terms match practice.
- **Often wrong:** Norwegian public holidays, time-zone gaps, response time read as fix time, and a severity scale that differs from the SLA.

### DPA and sub-processor list

- **Supply:** processing purposes, data types, people, sub-processors with service, data, storage location, and countries with access (including group companies and delivery or support teams), security measures as implemented.
- **Check:** annexes match the product, measures are real, deletion or return works, notice times are achievable, the list is complete, and audit and assistance duties have an owner.
- **Often wrong:** remote access from outside the EEA left out, and generic security annexes.

### Open-source notices

- **Supply:** direct dependencies and licences from manifests. For transitive ones, ask for licence-scanner output and say the list is incomplete without it.
- **Check:** the list matches the shipped build. Unknown and copyleft licences in distributed software go to the lawyers.

### AI notice / AI terms

- **Supply:** where AI is used, providers, data sent, retention and training settings, human review, marking of generated content.
- **Check:** each AI feature is mentioned, provider and training statements are true, and the route to a person exists.

### Other documents

| Document | Check |
|---|---|
| Accessibility statement | An assessment exists (for example from `ui-ux-accessibility-testing`), known gaps are listed, and the contact works |
| Vulnerability disclosure | The channel is monitored, and scope and response targets are real |
| Subscription and refund | Price, renewal, cancellation, and refund steps match the product |
| Retention and deletion | Each period is implemented, backups are covered, and the request route works |
| Content and notice | A reporting route and someone to handle it exist |
| API terms | Limits, keys, versioning, and deprecation notice are real |
| Beta or pilot terms | Data handling and end date match the pilot plan |
| Export and exit | Export formats, scope, time, and deletion after exit exist |
