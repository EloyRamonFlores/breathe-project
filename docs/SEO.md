# SEO.md — Search Engine Optimization Strategy (Updated v1.13.0)

## Core SEO Architecture
The site uses Next.js Static Site Generation (SSG). Every page is pre-rendered at build time as pure HTML. This gives us perfect Core Web Vitals and instant indexing.

## Target Keywords by Page Type

### Country Pages (15 in v1, expand to 195)
Primary: "is asbestos banned in [country]"
Secondary: "[country] asbestos regulations", "asbestos in [country] homes"
Long-tail: "does [country] still use asbestos", "asbestos ban [country] [year]"

### Risk Checker
Primary: "check asbestos risk my house"
Secondary: "asbestos risk by year built", "does my home have asbestos"
Long-tail: "house built in [decade] asbestos risk", "asbestos in homes built before 1980"

### Educational Pages
"what is asbestos" — extremely high volume, competitive but winnable with quality
"where is asbestos found in homes" — high intent, visual content wins
"asbestos history cover up" — trending after Veritasium video
"what to do if you find asbestos" — high commercial intent, practical value

## Page-Level SEO Requirements

Every page MUST have:
```tsx
// In page metadata (Next.js generateMetadata)
{
  title: "Unique Page Title | ToxinFree",          // <60 chars
  description: "Unique meta description",           // <155 chars
  openGraph: {
    title: "Title for social sharing",
    description: "Description for social sharing",
    images: ["/og/page-specific-image.png"],        // 1200x630px
    type: "website",
  },
  alternates: {
    languages: { en: "/en/page", es: "/es/page" }, // hreflang
  }
}
```

## Structured Data

### Country Pages — FAQ Schema
```json
{
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Is asbestos banned in India?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "No. As of 2026, India has no national ban on asbestos..."
    }
  }]
}
```

### Educational Pages — Article Schema
```json
{
  "@type": "Article",
  "headline": "What Is Asbestos? A Complete Guide",
  "datePublished": "2026-03-13",
  "dateModified": "2026-03-13",
  "author": { "@type": "Organization", "name": "ToxinFree" }
}
```

### Risk Checker — WebApplication Schema
```json
{
  "@type": "WebApplication",
  "name": "Asbestos Risk Checker",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web"
}
```

## Technical SEO Checklist
- [x] Sitemap.xml auto-generated at build time (424+ routes)
- [x] robots.txt allows all crawling
- [ ] Canonical URLs on every page
- [x] hreflang tags for all language variants (next-intl middleware)
- [x] No JavaScript-only content (SSG ensures HTML-first)
- [ ] Images: WebP format, responsive sizes, descriptive alt text
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [x] Mobile-first responsive design
- [x] HTTPS (automatic with Vercel)
- [x] Internal linking between country pages and educational content

## Open Graph Images
Dynamic OG images implemented via @vercel/og since v1.1.0:
- Country pages: map thumbnail + country flag + ban status
- Home page: dynamic OG with global stats
- Risk checker results: risk level + key stats (designed for screenshot sharing)

## Launch Checklist
- [x] Submit sitemap to Google Search Console (live since March 2026)
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify rich results with Google Rich Results Test
- [ ] Test OG images with Facebook Sharing Debugger and Twitter Card Validator
- [ ] Check mobile rendering with Google Mobile-Friendly Test
