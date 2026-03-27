# ToxinFree — Global Toxic Substance Awareness Platform

## Project Overview
A multilingual, data-driven web platform that makes toxic substance exposure information actionable for citizens worldwide. Starting with asbestos (72 countries have bans, billions still live with it), designed to expand to PFAS, lead, microplastics.

The core product is a Risk Checker where users input country + construction year → get personalized risk assessment. Wrapped in a global interactive map and educational content.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Static Site Generation)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet + react-leaflet (2D), globe.gl (3D)
- **Charts**: Recharts
- **i18n**: next-intl (EN/ES, 380+ keys per locale)
- **Testing**: Vitest (78 tests — calculator + data integrity)
- **CI/CD**: GitHub Actions (type-check, lint, test, build)
- **Data**: Static JSON files in `/src/data/`
- **Hosting**: Vercel (free tier)
- **Package Manager**: npm

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── [locale]/           # i18n locale wrapper
│   │   ├── page.tsx        # Landing page with global map
│   │   ├── check/          # Risk Checker tool
│   │   ├── country/[slug]/ # Country profile pages
│   │   └── learn/          # Educational content pages
├── __tests__/              # Vitest tests (calculator + data integrity)
├── components/
│   ├── map/                # WorldMap (Leaflet), Globe3D (globe.gl), Globe3DLoader
│   ├── checker/            # Risk checker form + results
│   ├── home/               # BanTicker, StatRotator, RegionSummary
│   ├── search/             # CountrySearch with autocomplete
│   ├── layout/             # Header, footer, navigation
│   └── ui/                 # ErrorBoundary, AnimatedCounter, ScrollReveal, Timeline
├── data/
│   ├── countries.json      # 195 countries: ban status, year, details
│   ├── materials.json      # Asbestos materials by decade + risk level
│   ├── risk-matrix.json    # Risk calculation logic
│   └── geo/                # GeoJSON for world map boundaries
├── lib/
│   ├── calculators/        # Risk assessment engine (v2.1, weighted average)
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # Site URL, content dates
│   ├── map-constants.ts    # Shared map color definitions
│   ├── i18n.ts             # Internationalization config
│   └── utils.ts            # Shared utilities
├── messages/               # i18n translation files
│   ├── en.json
│   └── es.json
└── styles/
    └── globals.css         # Tailwind base + custom styles
```

## Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (SSG, 424+ static pages)
npm run lint         # ESLint
npm run type-check   # TypeScript strict check
npm test             # Vitest unit + data integrity tests (78 tests)
```

## Coding Rules
- Use functional React components with hooks exclusively
- Use ES modules (import/export), never CommonJS
- Prefer server components; use "use client" only when needed (map, forms, interactivity)
- Use Tailwind utilities; no custom CSS unless absolutely necessary
- All data comes from static JSON files in `/src/data/` — no backend, no API calls for v1
- TypeScript strict mode; no `any` types
- All user-facing text must go through i18n (never hardcode strings in components)
- Components must be responsive (mobile-first)
- Accessibility: semantic HTML, ARIA labels, keyboard navigation
- Images: use Next.js Image component, always include alt text

## Design Direction
Read `docs/DESIGN.md` for complete design system. Key points:
- Dark theme primary (deep navy/charcoal), with sharp warning accents (amber, red)
- NOT a typical nonprofit site. Modern, data-forward, editorial feel.
- Think: Our World in Data meets a Bloomberg terminal for toxic substances
- Typography: distinctive display font + clean body font
- The map is the hero element — it should feel like a command center
- Risk checker results must be visually shareable (screenshot-friendly)

## Data Architecture
Read `docs/DATA.md` for complete data schema and sources. Key points:
- All regulatory data sourced from IBAS (International Ban Asbestos Secretariat)
- Materials data from EPA, WHO, and public construction databases
- Every data point must include a `source` field with URL
- Risk calculation logic documented in `docs/RISK-LOGIC.md`

## Content Guidelines
- Written for 8th grade reading level (global audience, many non-native English speakers)
- No legal advice language — always "consult a professional"
- Every page has a clear disclaimer: "Information aggregated from public sources"
- Tone: urgent but not alarmist, factual but accessible

## SEO Requirements
- Every page must have unique title, meta description, Open Graph tags
- Static generation (SSG) for all pages — no client-side-only rendering
- Structured data: FAQ schema on educational pages, HowTo on guide pages
- Country pages target: "is asbestos banned in [country]"
- All images need descriptive alt text for accessibility and SEO

## Changelog
See `CHANGELOG.md` for build progress and decisions log.

## Reference Docs (read when relevant)
- `docs/SCOPE-FULL.md` — Complete platform vision and expansion roadmap
- `docs/SCOPE-V1.md` — V1 scope: what's included, what's deferred, and why
- `docs/DESIGN.md` — Design system, color palette, typography, component patterns
- `docs/DATA.md` — Data schema, sources, and curation methodology
- `docs/RISK-LOGIC.md` — Risk assessment algorithm and scoring
- `docs/SEO.md` — SEO strategy, target keywords, structured data specs
