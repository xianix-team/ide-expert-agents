# GEO Optimization Reference

Fallback values for `geo-auditor` when live fetches are unavailable.

---

## Known AI Crawler User-Agents

| Engine | User-Agent string(s) |
|---|---|
| OpenAI GPTBot | `GPTBot` |
| OpenAI ChatGPT browse | `ChatGPT-User` |
| Google Gemini / AI Overviews | `Google-Extended` |
| Perplexity | `PerplexityBot` |
| Anthropic Claude | `ClaudeBot`, `anthropic-ai` |
| Bing AI (Copilot) | `bingbot` (covered by default Bing allow) |
| Common Crawl | `CCBot` |

Blocking any of these in `robots.txt` prevents that engine from using the site as a grounded source.

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
- The intro paragraph after `# Product Name` uses `>` blockquote syntax
- Plain markdown only — no HTML, no frontmatter

**Minimum recommended coverage (≥ 5 sections, ≥ 10 links):**

- Documentation or API reference
- Pricing / plans
- About / company
- Key product features or use cases
- Blog or changelog (most recent entries)
