## Framework module: Transparency And Information To Data Subjects

- **Module ID:** transparency-and-information
- **Applies when:** The system collects personal data from people, or obtains it about them from other sources (scraping, enrichment, imports). Controller role.
- **Primary regime:** EU GDPR (mapped to ISO/IEC 27701 and NIST Privacy Framework)
- **Controls:** 4 (0 Automatable, 3 Partial, 1 Manual)

| # | Requirement (control question) | GDPR | Fine tier | Role | ISO/IEC 27701 | NIST PF | Severity | Automation | How to check |
|---|---|---|---|---|---|---|---|---|---|
| 1 | A privacy notice is shown at the point of collection (sign-up, forms, chat entry) and covers the Art 13 items: controller identity and contact, DPO, purposes, lawful basis, recipients, transfers, retention, rights, complaint right. | Art 12(1); 13(1)-(2) | Upper (83(5)) | Controller | 7.3.2; 7.3.3 | CM.AW-P | High | Partial | Find the privacy-notice link or text in UI flows and the chat or assistant entry point. If the notice is in-repo, compare it with Art 13. Legal sufficiency is manual. |
| 2 | Personal data obtained indirectly (scraped, enriched, bought, imported from CRM) triggers an Art 14 notice within the required time, unless an exemption applies. | Art 14 | Upper (83(5)) | Controller | 7.3.2; 7.3.3 | CM.AW-P | Medium | Partial | Detect ingestion of third-party personal data (scrapers, enrichment APIs, bulk imports). Whether people are notified, or an exemption applies, is manual. |
| 3 | The notice discloses AI/LLM processing: AI providers as recipients, any transfers this causes, and meaningful information about the logic of automated decisions. | Art 13(1)(e)-(f); 13(2)(f); 14(2)(g) | Upper (83(5)) | Controller | 7.3.2; 7.3.10 | CM.AW-P | High | Partial | Compare the LLM and AI providers found in A1 with the recipients listed in the notice. Look for an AI-processing section and decision-logic explanation. |
| 4 | Information is concise, intelligible, in plain language, and easy to access (including for children where relevant). | Art 12(1) | Upper (83(5)) | Controller | 7.3.3 | CM.PO-P | Low | Manual | Readability and accessibility judgment. |
