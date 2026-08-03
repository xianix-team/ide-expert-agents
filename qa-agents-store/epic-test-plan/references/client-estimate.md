# Client-facing estimate justification — rules (Step 4d, Tier 2)

The client document is `qa-estimate.md` (Tier 1) compressed into a small set of categories a non-technical client can follow, in the approved format **Never invent a single number for the client directly** — the client document is always derived from a Tier 1 that exists first.

## Compression

- Map the Tier 1 rows into a small set of client categories. The default set — **Features testing / Security / DB migration testing / Existing features testing** — is the default; drop or swap a category only when the epic genuinely has no migration or no new public surface. Don't force it.
- State depth honestly inside a category ("read-only screens get a light pass") — that's transparency, not weakness.
- **Cut by naming items from Tier 1, never by shaving percentages.** Log every cut in the risk-transfer register (section 6 of `qa-estimate.md`): the item, the hours saved, and the risk the client now owns. The register is the answer to every "can you cut more?" — each further cut gets a named risk the client must explicitly accept. It never appears in the client document.
- Requirement study, test design, environment setup, sign-off evidence, and the buffer are **spread inside the category rows**, never shown as their own lines — they still happen; the client just doesn't see them itemized.
- Sanity-check the ratio: QA above dev-effort is normal here (dev effort is review-of-AI-code; QA effort is runtime and data verification, which doesn't compress).

## Format (match the exemplar — the final approved shape)

- Markdown. Title `Testing Estimate Justification — PAR-#### (N hours)`. The total lives in the title only.
- **Tables only. No prose.** No author line, no intro paragraphs per category, no roll-up section, no closing notes. The document is the title plus one table per category, ending at the last subtotal.
- Column headers: `Epic | Coverage | Hours` for Features, `What we test | Coverage | Hours` for the rest. No Stories/counts column — story counts invite line-item haggling.
- Bold subtotal row per table. **Few rows per table** — fold internal activities into broader rows and spread their hours.
- The client doc goes wherever the user asks (typically their Downloads, as `.md` or printed to PDF) — **not committed to a repo by default**.

## Language rules (all learned from review — follow exactly)

- **Plain language.** Any non-technical reader must understand every row. No table/column names, no FK or schema jargon, no internal class names. "Compare money totals before and after the move", not "reconcile un-FK'd order links". Translate even mid-level phrasing: "pro-rated space changes" → "adding and removing spaces mid-period with correct pricing"; "PCI boundary" → "card details are never stored by us".
- **Domain shorthand the client uses daily is fine as row labels** — B2C, B2B, Barriers. Plain language means no *internal* jargon, not avoiding the client's own vocabulary.
- **Confident, settled tone.** No open questions, no ⚠ markers, no caveats, no "already cut from X hours", no compliance hedging (drop GDPR name-drops — say "divisions are fully separated" instead), no mentions of pending requirement clarifications. If something is genuinely unresolved, it's a conversation with the PO, not a line in the client doc.
- **Reads as human-written.** No em-dash chains, no parallel triads ("must not X, must never Y, must stop Z"), no storytelling, no cutesy column headers. Short, slightly uneven sentences. It should read like a QA lead getting a table out the door.
- **Precedent incidents** are your strongest justification — but in the tables-only format they belong in the covering email or the meeting, not in the document.

## Verify before handing over

- Every subtotal and the grand total reconcile — in both tiers, independently.
- Tier 2 totals trace back to Tier 1 rows plus named cuts in the register — no orphan numbers.
- Every scope claim still matches the design doc's latest decisions.
- Grep your own output for jargon leaks: table names, `_Id`, enum values, internal codenames.
