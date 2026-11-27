# GEO Optimization Reference

Fallback values for `geo-auditor` when live fetches are unavailable.

---

## Known AI Crawler User-Agents

### Search / grounding crawlers (blocking these prevents citation)

| Engine | User-Agent string(s) |
|---|---|
| OpenAI SearchBot | `OAI-SearchBot` |
| Anthropic Claude search | `Claude-SearchBot`, `Claude-User` |
| Perplexity | `PerplexityBot` |

Blocking these in `robots.txt` is a **Critical** GEO defect — the engine cannot use the site as a grounded source for real-time answers.

### Training crawlers (blocking is a deliberate IP/privacy choice, not a GEO defect)

| Engine | User-Agent string(s) | Note |
|---|---|---|
| OpenAI GPTBot | `GPTBot` | Training data crawl |
| OpenAI ChatGPT-User | `ChatGPT-User` | Training data crawl |
| Google Extended | `Google-Extended` | Opts out of AI training use; does NOT control AI Overviews or search grounding |
| Common Crawl | `CCBot` | General training data aggregator |
| Anthropic training | `ClaudeBot`, `anthropic-ai` | Training data crawl |

Blocking training crawlers is a legitimate choice. Report their status as informational, not a defect.

---

## llms.txt Specification (v1 — 2024)

Official spec: `https://llmstxt.org/`

**Required format:**

```
# <Product Name>

> <One-paragraph description of the product or site for LLM context.>

## <Section heading>
- [<Title>](<URL>): <One-line description>
- [<Title>](<URL>): <One-line description>

## <Section heading>
- [<Title>](<URL>): <One-line description>
```

**Rules:**

- Served at `/llms.txt` from the site root (e.g. `https://example.com/llms.txt`)
- `llms-full.txt` is the extended variant — same format but each linked document's full text is inlined
- Section headings use `##` (H2 markdown)
- Each link entry is a markdown list item: `- [Title](URL): description`
- The intro paragraph after `# Product Name` optionally uses `>` blockquote syntax (the `>` summary line is optional per the spec)
- Plain markdown only — no HTML, no frontmatter

**Minimum recommended coverage (≥ 5 sections, ≥ 10 links):**

- Documentation or API reference
- Pricing / plans
- About / company
- Key product features or use cases
- Blog or changelog (most recent entries)
