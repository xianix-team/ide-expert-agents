# SEO/GEO Agents Store

Agents for search engine optimization and generative engine optimization — technical SEO audit, AI search readiness audit, framework-aware fix implementation, and content-level per-route optimization.

All agents in this store are served via the repository's MCP server. See [mcp-server/README.md](../mcp-server/README.md) for setup instructions.

---

## Available Agents

<!-- generated:agents:start — edit catalog.json or runbooks/*.md, then run `npm run docs` in mcp-server/ -->
| Agent | Prompt name | Autonomy | Human judgement | When to use |
|---|---|---|---|---|
| **SEO Auditor** | `seo-auditor` | High | Medium | When you want a read-only technical SEO audit of a web application — crawlability (robots.txt, sitemap, noindex), meta tags (title, description, canonical, hreflang, OG/Twitter), structured data (JSON-LD presence and schema-type fit), Core Web Vitals config signals, URL structure, internal linking, and security signals. Fetches the latest Google Search Central thresholds on each run. Produces a severity-ranked findings report (Critical / Important / Nice-to-have) with evidence and remediation hints. Use before a production launch, before an SEO uplift sprint, or after a major site change |
| **GEO Auditor** | `geo-auditor` | High | Medium | When you want to audit a web application's readiness to be cited by AI search engines (ChatGPT, Perplexity, Gemini, Claude.ai, Bing Copilot) — llms.txt presence and quality, AI-crawler access in robots.txt, passage structure for AI snippet candidacy, named authorship, freshness signals, citation-worthiness markers, and schema types that aid AI consumption (FAQPage, HowTo, Article). Produces a GEO Readiness Scorecard across five dimensions with a prioritized action plan. Use before an AI search optimization sprint, when adding a blog or documentation site, or when organic AI-search traffic is a goal |
| **SEO Implementer** | `seo-implementer` | Medium | Medium | When you want to implement approved SEO and GEO fixes in a web application — meta tags (title, description, canonical, hreflang, OG/Twitter), JSON-LD structured data, sitemap.xml, robots.txt (including AI-crawler directives), llms.txt, and image/font performance attributes. Framework-aware: Next.js (App Router and Pages), Nuxt, Astro, Remix, SvelteKit, plain HTML. Reads an seo-auditor or geo-auditor report as its primary input, presents a scoped implementation plan with a checkpoint, then applies changes only after explicit approval. Use after seo-auditor or geo-auditor surfaced findings to fix |
| **Content SEO Optimizer** | `content-seo-optimizer` | Medium | Medium | When you want per-route content-level SEO improvements — title tags, meta descriptions, heading hierarchy (single H1, logical H2–H6), keyword placement, passage length for AI snippet candidacy (100–200 words per section), internal linking (minimum 3 contextual links per page), image alt text, and FAQ schema opportunities. Works one route at a time or across a set of routes, with a per-route checkpoint before any edits. Use after seo-implementer has applied technical fixes, or on new content pages before publish |
<!-- generated:agents:end -->

---

## Adding an agent

1. Create a folder here with an `agent.md` file, starting from [templates/AGENT_TEMPLATE.md](../templates/AGENT_TEMPLATE.md). It needs `name` (equal to the folder name) and `description` in YAML frontmatter.
2. Rebuild the MCP server (`npm run build` in `mcp-server/`).
3. Add the agent to [catalog.json](../catalog.json) under this store, with a display `title` and `whenToUse` text, then run `npm run docs` in `mcp-server/` to regenerate the table above. Don't edit the table by hand.
4. The agent appears automatically on the next server restart.
