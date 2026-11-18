## Framework module: Documentation

- **Module ID:** documentation
- **Pillar group:** Build
- **Applies when:** Always.
- **Intent:** Agents are only as good as the context they are given. Architecture and domain context available to agents.
- **Controls:** 8 (4 Automatable, 4 Partial, 0 Manual); 5 Baseline, 3 Advanced

| # | Practice (control) | Level | ISO/IEC 42001 and other refs | Severity | Automation | How to check |
|---|---|---|---|---|---|---|
| 1 | **Architecture overview in the repo** - A docs/architecture/ folder with a current system overview (e.g. C4 context and container diagrams as text - Mermaid or PlantUML) and key integration points. | Baseline | A.6.2.2 · A.6.2.3 | Medium | Automatable | Look for `docs/architecture/` (or equivalent) with a text-based system overview (Mermaid/PlantUML/C4). Compare last-modified date to recent structural change. |
| 2 | **Architecture Decision Records** - ADRs for significant decisions, so agents (and people) understand why things are the way they are and don't "fix" deliberate choices. | Baseline | A.6.2.3 · A.6.2.7 | Medium | Automatable | Look for `docs/adr/`, `doc/adr/`, `adr/`; count them and check recency and that they carry status/context/decision. |
| 3 | **Domain glossary & business rules** - Key domain terms, invariants and business rules in plain language. These prevent the most expensive class of AI mistakes: correct code for the wrong rule. | Baseline | A.6.2.2 | Medium | Partial | Look for a glossary or business-rules doc (`GLOSSARY.md`, `docs/domain/`). Existence is checkable; correctness is not. |
| 4 | **Docs updated with the change** - Documentation changes are part of the same pull request. The PR template asks "Did this change behaviour or architecture? Update docs." | Baseline | 7.5.3 | Medium | Partial | Look for a PR-template prompt about docs and a docs check in CI. Sample recent history for commits that touch code and docs together. |
| 5 | **Sanitised content** - No credentials, real personal data or production samples in docs. Use realistic synthetic examples. | Baseline | A.7.2 · GDPR Art. 5 & 32 | High | Automatable | Scan docs for credentials, real-looking personal data (emails, phone numbers, IDs) and production URLs/connection strings. Never print the values; cite `path:line` only. |
| 6 | **Discoverable index** - AGENTS.md links to the most important docs so agents load the right context without reading everything. | Advanced | A.6.2.3 | Low | Automatable | The rules file links the key docs. Verify the links resolve. |
| 7 | **Agent-assisted doc maintenance** - Use agents to draft and refresh docs from code, with human review - keeping docs current is cheap now. | Advanced | A.6.2.6 | Low | Partial | Look for a doc-refresh skill, prompt or CI job with human review. Weak evidence either way. |
| 8 | **Document AI features you build** - If the product itself includes AI features, document intended use, limitations, data used and how to report problems. | Advanced | A.8.2 · A.5 | Medium | Partial | Applies only if the product ships AI features; otherwise `N/A`. Look for documented intended use, limitations, data used and a problem-reporting route. For regulatory depth, point to `eu-ai-act-controls-reviewer`. |

**Risks if this pillar is weak** (framework risk register - cite the relevant one in a finding's reason):

- **Correct code, wrong business rule** (high) - Agents implement plausible but incorrect behaviour; defects surface in production or in front of the customer's users.
- **Architecture erosion** (med) - Agents bypass layers or duplicate services because boundaries aren't documented.
- **Knowledge locked in people** (med) - Agents - and new team members - repeatedly rediscover context; key-person risk.
- **Sensitive data in documentation** (high) - Real customer records or secrets in docs end up in agent context and possibly outside approved boundaries.
- **Stale documentation** (low) - Agents follow outdated designs with full confidence.

**Self-check questions for a human** (use in A3 to gather attestations for Manual and unverifiable rows):

- Could a new engineer - or an agent - find the architecture overview from AGENTS.md in one step?
- Are significant decisions captured as ADRs?
- Is there a domain glossary or business-rules page?
- When did a PR last update docs alongside code?
