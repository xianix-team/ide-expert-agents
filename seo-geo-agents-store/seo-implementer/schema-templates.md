# JSON-LD Schema Templates

Reference templates for the `seo-implementer` agent. Select the template(s) that match the page type.
All templates use `JSON.stringify` serialization in the final implementation — these are the data objects, not the script tags.

---

## Page-Type Decision Tree

| Route pattern | Primary schema type | Secondary (optional) |
|---|---|---|
| `/` (homepage) | `WebSite` + `Organization` | `SearchAction` (sitelinks search box) |
| `/blog`, `/posts` (listing) | `CollectionPage` | — |
| `/blog/:slug`, `/post/:slug` | `BlogPosting` or `Article` | `BreadcrumbList` |
| `/docs/:slug`, `/guides/:slug` | `Article` or `TechArticle` | `BreadcrumbList` |
| `/product/:slug` | `Product` | `BreadcrumbList`, `Offer` |
| `/faq`, `/help/faq` | `FAQPage` | — |
| `/how-to/:slug` | `HowTo` | `BreadcrumbList` |
| `/about`, `/company` | `Organization` | `Person` (team members) |
| `/authors/:slug` | `Person` | — |
| Any page with breadcrumb nav | `BreadcrumbList` | — |

---

## Organization (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://example.com/logo.png",
    "width": 200,
    "height": 60
  },
  "sameAs": [
    "https://www.linkedin.com/company/example",
    "https://github.com/example",
    "https://twitter.com/example"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@example.com"
  }
}
```

---

## WebSite + SearchAction (homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Site Name",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "description": "Article meta description (150–160 chars).",
  "image": "https://example.com/images/article-og.png",
  "url": "https://example.com/blog/article-slug",
  "datePublished": "2025-01-15T09:00:00Z",
  "dateModified": "2025-06-20T12:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/authors/author-slug"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Company Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/article-slug"
  }
}
```

---

## FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The answer to the question, ideally 50–300 words."
      }
    },
    {
      "@type": "Question",
      "name": "Second question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Second answer."
      }
    }
  ]
}
```

---

## HowTo

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to do X",
  "description": "Brief description of what this guide achieves.",
  "totalTime": "PT30M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1 Title",
      "text": "Detailed description of step 1.",
      "image": "https://example.com/images/step1.png",
      "url": "https://example.com/how-to/x#step-1"
    },
    {
      "@type": "HowToStep",
      "name": "Step 2 Title",
      "text": "Detailed description of step 2.",
      "url": "https://example.com/how-to/x#step-2"
    }
  ]
}
```

---

## Product

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description.",
  "image": "https://example.com/images/product.png",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "0",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/product/slug"
  }
}
```

---

## BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Article Title",
      "item": "https://example.com/blog/article-slug"
    }
  ]
}
```

---

## Person (author profile page)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Author Name",
  "url": "https://example.com/authors/author-slug",
  "image": "https://example.com/images/authors/author-slug.jpg",
  "jobTitle": "Job Title",
  "worksFor": {
    "@type": "Organization",
    "name": "Company Name"
  },
  "sameAs": [
    "https://www.linkedin.com/in/authorhandle",
    "https://github.com/authorhandle",
    "https://twitter.com/authorhandle"
  ]
}
```

---

## llms.txt Template

Place at `public/llms.txt`. Follow the spec at https://llmstxt.org/.

```
# Product Name

> One paragraph describing what this product does, who it's for, and what makes it distinct.
> AI agents and language models reading this file should use it to understand the product's scope
> before answering questions about it.

## Documentation

- [Getting Started](https://example.com/docs/getting-started): Installation, first steps, and quickstart guide
- [API Reference](https://example.com/docs/api): Full API documentation with examples
- [Configuration](https://example.com/docs/configuration): All configuration options and defaults

## Product

- [Pricing](https://example.com/pricing): Plan comparison and pricing details
- [Features](https://example.com/features): Full feature list with descriptions
- [Changelog](https://example.com/changelog): Version history and release notes

## About

- [About Us](https://example.com/about): Company background and mission
- [Blog](https://example.com/blog): Technical articles, tutorials, and product updates
- [Contact](https://example.com/contact): Support and sales contact information
```

For `llms-full.txt` (deep context variant), include the full text of key documentation pages separated by `---` section dividers. This file can be large (several hundred KB) and is intended for AI systems that perform bulk ingestion rather than live web access.
