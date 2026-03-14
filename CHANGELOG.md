# CHANGELOG.md — Build Progress & Decision Log

All notable changes, decisions, and progress for the BREATHE platform.

---

## [Unreleased] — Pre-Build Phase

### 2026-03-13 — Project Inception
- **Decision**: Project scope defined. Full vision (multi-substance platform) + V1 scope (asbestos only, static data)
- **Decision**: Stack chosen — Next.js 14+, TypeScript, Tailwind, Leaflet, Recharts, next-intl
- **Decision**: V1 uses static JSON data only. No backend until v2.
- **Decision**: Dark theme, editorial design direction. NOT typical nonprofit aesthetic.
- **Decision**: 15 priority countries for v1 launch (see SCOPE-V1.md)
- **Decision**: English + Spanish for v1 i18n. Architecture ready for 10+ languages.
- **Data validated**: IBAS ban list confirmed as primary source (72 countries, updated Feb 2026)
- **Data validated**: IBAS chronological list provides year-by-year timeline per country
- **Data validated**: Construction materials by decade well-documented via EPA, Wikipedia, multiple sources
- **Risk logic**: Defined three-factor scoring algorithm (country × era × building type)
- **Created**: Project kit with CLAUDE.md, docs/, and data architecture

### 2026-03-13 — Project Initialization (v0.1.0)
- **Setup**: Next.js 16 + App Router + TypeScript (strict) + Tailwind CSS v4
- **Dependencies**: react-leaflet, leaflet, recharts, next-intl v4, @types/leaflet
- **Structure**: Full folder structure per CLAUDE.md — `app/[locale]/`, `components/`, `data/`, `lib/`, `messages/`
- **i18n**: next-intl configured with `[locale]` routing, middleware, en.json + es.json with all UI strings
- **Design System**: Tailwind configured with DESIGN.md CSS variables (dark theme palette, semantic colors, map colors)
- **Fonts**: Instrument Serif (display), DM Sans (body), JetBrains Mono (data) — loaded via Google Fonts
- **Data**: Placeholder JSON files created — countries.json (3 samples: US, India, Mexico), materials.json (4 entries), risk-matrix.json (full scoring logic)
- **TypeScript**: Types defined in `src/lib/types.ts` matching DATA.md interfaces
- **Risk Calculator**: `src/lib/risk-calculator.ts` — full implementation of the 3-factor scoring algorithm
- **Pages**: Placeholder pages for all routes — home, check, country/[slug], learn
- **Git**: Repository initialized with initial commit

### Upcoming — Week 1
- [x] Initialize Next.js project with TypeScript + Tailwind
- [ ] Curate countries.json (all 195 countries, 15 detailed)
- [ ] Curate materials.json (15-20 material entries)
- [ ] Build landing page with interactive Leaflet world map
- [ ] Build Risk Checker (form + scoring logic + results page)
- [ ] Setup i18n architecture (next-intl, en.json, es.json)

### Upcoming — Week 2
- [ ] Build 15 country profile pages (template + data)
- [ ] Build 5 educational content pages
- [ ] SEO setup (meta tags, sitemap, structured data, OG images)
- [ ] Responsive testing, accessibility audit
- [ ] Deploy to Vercel

### Upcoming — Week 3
- [ ] QA and polish
- [ ] Soft launch (Reddit, social media)
- [ ] Submit to Google Search Console
- [ ] Iterate based on feedback
