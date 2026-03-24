# ToxinFree — Global Toxic Substance Awareness Platform

A multilingual, data-driven web platform that makes toxic substance exposure information actionable for citizens worldwide. Starting with asbestos — 72 countries have bans, but billions still live with it.

The core product is a **Risk Checker** where users input country + construction year → get a personalized risk assessment. Wrapped in an interactive global map and educational content.

**Live:** [toxinfree.global](https://toxinfree.global)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Static Site Generation)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Maps:** Leaflet + react-leaflet (2D), globe.gl (3D)
- **Charts:** Recharts
- **i18n:** next-intl (English + Spanish)
- **Data:** Static JSON — no backend, no API keys
- **Hosting:** Vercel (free tier)

## Quick Start

```bash
npm install
npm run dev        # → localhost:3000
npm run build      # Production build (SSG, 424+ static pages)
npm run type-check # TypeScript strict check
npm run lint       # ESLint
```

## Project Structure

```
src/
├── app/[locale]/           # Pages: home, check, country/[slug], learn/*
├── components/
│   ├── map/                # WorldMap (Leaflet), Globe3D (globe.gl)
│   ├── checker/            # RiskChecker form + RiskResults
│   ├── layout/             # Header, Footer, HeroSection
│   ├── home/               # BanTicker, StatRotator, RegionSummary
│   ├── search/             # CountrySearch with autocomplete
│   └── ui/                 # Timeline, AnimatedCounter, ScrollReveal
├── data/
│   ├── countries.json      # 200 countries: ban status, timelines, sources
│   ├── materials.json      # 20 asbestos materials by decade + risk level
│   ├── risk-matrix.json    # Risk calculation weights + country overrides
│   └── geo/world.json      # GeoJSON for map boundaries
├── lib/
│   ├── calculators/        # Risk assessment engine (v2.1, weighted average)
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # Site URL, content dates
│   └── map-constants.ts    # Shared map color definitions
├── messages/               # i18n: en.json, es.json (380+ keys each)
└── i18n/                   # next-intl routing + request config
```

## Key Features

- **Interactive Global Map** — 3D globe on desktop, Leaflet fallback on mobile
- **Risk Checker** — Country + era + building type → risk assessment with matched materials
- **200 Country Profiles** — Ban status, regulatory timelines, mesothelioma data
- **Multilingual** — Full English and Spanish support
- **6 Educational Pages** — What is asbestos, where it hides, history, what to do, statistics, methodology
- **Ban Timeline Ticker** — Chronological scroll of global ban history
- **Region Summary** — 7 regions with ban progress bars

## Data Sources

- [IBAS](https://ibasecretariat.org/) — International Ban Asbestos Secretariat
- [EPA](https://www.epa.gov/asbestos) — U.S. Environmental Protection Agency
- [WHO](https://www.who.int/) — World Health Organization
- USGS, UN Comtrade — Production and trade data

All regulatory data includes source URLs and access dates. See [Data Methodology](https://toxinfree.global/en/learn/methodology).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on data corrections, translations, and code contributions.

## Documentation

- `docs/RISK-LOGIC.md` — Risk assessment algorithm and scoring
- `docs/DATA.md` — Data schema, sources, and curation methodology
- `docs/DESIGN.md` — Design system, color palette, typography
- `docs/SCALING.md` — Guide for adding new substances (PFAS, lead)
- `docs/SEO.md` — SEO strategy and structured data specs

## License

Code: MIT. Data: CC BY 4.0.
