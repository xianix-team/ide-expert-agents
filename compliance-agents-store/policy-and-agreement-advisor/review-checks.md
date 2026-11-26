# Review Checks

Used in R2, and in D3 on our own draft. Record the result with its evidence. Don't propose other numbers or wording. In D3, a result that would be a finding becomes a placeholder, product work, or a raised gap.

## Promise check

For every commitment ask: **who decided it, what delivers it, and how would we know it was broken?** Then apply the same rule as R3: if the answer **isn't known yet**, the commitment is *unverified*, with who can answer. It is a **Can't keep** finding only when someone entitled to say, or the product itself, confirms the capability, process, owner, or measurement **doesn't exist**. The options are change the product, change the process (with an owner), or ask the lawyers to change the text.

| Promise | Check |
|---|---|
| "We delete your data within N days" | Every store: database, files, search index, vector store, caches, logs, analytics, vendors, backups |
| "You can export your data" | An export exists, its scope, and its format |
| "We never share your data" | Vendors, SDKs, AI providers, support tools |
| "Data stays in Norway" or "in the EEA" | Vendors, telemetry, backups, and people with access from elsewhere, including our own delivery and support teams |
| "We tell you before adding a sub-processor" | Someone owns the list and the notice |
| "Breach notice within N hours" | Detection, an owner, and the upstream vendor's own notice time |
| "We don't use your content to train AI" | The provider setting or contract, and internal use |
| "Non-essential cookies only with consent" | Nothing runs before consent, including tags loaded at run time (needs a browser check) |
| "You can cancel at any time" | The path exists and stops billing |
| "Encrypted at rest" | Each store, including backups and exports |
| "24×7 support" | A staffed rota and a monitored channel |
| "Certified to …" | A current certificate that covers this product and this party |
| Absolutes ("always", "100%", "bank-grade", "promptly") | Can anyone measure it? If not: **Unclear to deliver** |

## Service level checks

For an SLA or support agreement:

1. **Make the number concrete.** Write the target as a fraction of 1 first (99.9% is 0.999). Allowed downtime = period × (1 − target). For 99.9% over a 720-hour month: 720 × (1 − 0.999) = 0.72 hours = 43 min 12 s. Do not multiply by (100 − 99.9). Check a 720-hour, around-the-clock month against this table, and recalculate the same way for business hours or another period:

   | Target | 99% | 99.5% | 99.9% | 99.95% | 99.99% |
   |---|---|---|---|---|---|
   | Allowed in 720 hours | 7 h 12 min | 3 h 36 min | 43 min 12 s | 21 min 36 s | 4 min 19 s |

2. **Definition:** formula, period, measuring point, what counts as "down", partial outages, exclusions, and planned maintenance. Anything undefined is **Unclear to deliver**.
3. **Dependencies:** services that must all work multiply: 99.95% × 99.99% × 99.9% ≈ 99.84%. This is a rough ceiling that assumes independent failures and no redundancy. Ask the engineer for the vendor SLA of the tier in use. A vendor SLA is the point where it owes credit, not a prediction.
4. **History:** measured results. "We don't measure it" is a **Can't keep** finding. "Don't know" is *unverified*.
5. **Recovery:** RTO and RPO against the backup schedule and the last **tested** restore.
6. **People:** hours × time zones × severity against the real rota, holidays, and leave. A 15-minute response out of hours needs someone on call.
7. **Chain:** a commitment that relies on another party (vendor, customer IT, first-line support) can't be faster than theirs.
8. **Releases:** planned downtime per release against the maintenance window.
9. **Response or fix?** Response, restoration, and resolution kept apart, with who sets severity.
10. **Cost of missing it:** credits and caps go to our commercial owner. Note only that they exist.

## Consistency check

- product name, parties, contacts, definitions, dates, and versions agree;
- one severity scale, one set of support hours, one availability figure;
- retention periods agree across privacy policy, retention policy, DPA, and exit terms;
- vendors agree across privacy policy, cookie policy, sub-processor list, and AI notice;
- storage location, transfer, and access statements agree everywhere;
- nothing contradicts a signed contract or SSA supplied (quote both, and leave the precedence question to the lawyers);
- links, cross-references, annexes, and section numbers resolve, and contact routes exist (ask, don't send anything);
- consumer and business terms aren't mixed, and language versions say the same;
- no leftovers: another company or product name, unfilled brackets, closed services, outdated consent wording;
- no drafting leftovers: the draft banner, quoted section notes, `[CONFIRM]`-style placeholders, `[from the template]` or `[from the lawyers]` marks, *How This Draft Was Prepared*, and *Open Points*. At least **Major** if the document is about to be published or signed.

## Integration check

What the product must do for the document to work. Anything missing is **Product work**, with an owner.

| Item | Check |
|---|---|
| **Shown** | Footer, sign-up, checkout, installer, settings, store listing. Without login, on mobile, accessible, at a stable URL |
| **Accepted** | Where the document relies on acceptance: the step exists, and who, which version, when, and how is recorded |
| **Consent** | Separate from terms, off by default, as easy to withdraw as to give, and nothing non-essential runs first |
| **Versions and changes** | Version and date shown, earlier versions kept, and users notified as the document says |
| **Languages** | The languages promised exist |
| **Promised functions** | Export, deletion, cancellation, withdrawal, preferences, and report-abuse work |
| **Operations** | Mailboxes and queues monitored, status page and SLA reports running, rota staffed |
| **Stores** | Privacy labels and data-safety forms match the policy. Required URLs are set |
| **Offline or on-premise** | Document shipped with the build and shown in the installer |
