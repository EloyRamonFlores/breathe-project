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

### 2026-03-13 — Data Curation (v0.2.0)
- **Completed**: countries.json — 200 entries covering all sovereign states and major territories
  - 72 countries with `full_ban` status (source: IBAS alpha_ban_list.php, Sep 2025 revision)
  - 16 countries with `no_ban` status (source: USGS Mineral Commodity Summaries 2024)
  - 112 countries with `unknown` status (basic ISO/region data)
  - 15 priority countries with full regulatory timelines (3–5 events each)
  - All entries include iso2, iso3, region, common_materials, peak_usage_era, priority, sources
- **Completed**: materials.json — 20 real asbestos-containing materials
  - Covers roofing, flooring, insulation, fireproofing, industrial, and textiles
  - Each entry includes risk levels (intact/damaged/disturbed), friability, location, building types, actionable recommendations
  - Sources: EPA, WHO, HSE, USGS
- **Decision**: `priority: "high"` for 15 countries per SCOPE-V1.md; `"medium"` for other full/no_ban; `"low"` for unknown
- **Data source**: All ban years from IBAS chronological list; no ban years invented without source

### 2026-03-13 — Landing Page & Global Map (v0.3.0)
- **Completed**: Interactive landing page with hero section, animated counter, world map, CTA
- **Hero Section**: Animated counter showing 128 countries without asbestos ban (calculated from countries.json)
  - Count-up animation with ease-out, respects `prefers-reduced-motion`
  - Deaths stat: "~255,000 people die from asbestos exposure every year"
  - All text internationalized (EN + ES)
- **World Map**: Interactive Leaflet choropleth map (react-leaflet v5)
  - GeoJSON: Natural Earth 110m admin-0 countries (177 features, 169 matched to dataset)
  - Color-coded by ban_status: green (full_ban), amber (partial_ban), red (no_ban), gray (unknown)
  - Hover: tooltip with country name, status pill, and ban year
  - Click: navigates to `/country/[slug]`
  - CartoDB dark_all tiles (free, matches dark theme)
  - Legend overlay with translated status labels
  - Dynamic import with `ssr: false` (Leaflet requires browser APIs)
  - Responsive: 50vh mobile, 60vh tablet, 70vh desktop
- **Header**: Sticky navigation with backdrop blur
  - Logo "BREATHE" in Instrument Serif
  - Desktop: Map | Check Risk | Learn | Language toggle (EN/ES)
  - Mobile: hamburger menu with slide-down panel, close on ESC
  - Language switcher uses next-intl routing (locale-aware)
- **Footer**: Data source credits (IBAS, EPA, WHO), disclaimer, "Built by Koku-Tech"
- **CTA Section**: "Is your home at risk?" with link to /check
- **Design System Fix**: Added `--font-instrument-serif` CSS variable (was missing, broke `font-serif` Tailwind class)
- **Tooltip Styles**: Custom dark tooltip for Leaflet map matching design system
- **i18n**: Added keys for CTA title/description, map loading, map legend, footer built_by, nav aria labels
- **Build**: `npm run dev` and `npm run build` both pass with zero errors

### 2026-03-14 — Risk Checker (v0.4.0)
- **Completed**: Full Risk Checker at `/check` — 3-step form + results display + URL sharing
- **Step 1 — Country**: Searchable combobox filtering 195 countries; flag emoji from iso2; keyboard navigable (arrow keys, Enter, Escape); accessible (`role="combobox"`, `aria-activedescendant`)
- **Step 2 — Era**: 5 clickable cards with color-coded risk bars; peak badge for 1960–1980; `aria-pressed` state
- **Step 3 — Building Type**: 5 emoji icon cards (🏠🏢🏫🏛️🏭); clicking immediately triggers calculation
- **Results card**: Screenshot-worthy dark card with gradient header, risk level in Instrument Serif, score %, progress bar, context line (country · era · ban status at construction), materials list (up to 5, sorted by risk), action recommendations per level, share + reset buttons, disclaimer
- **URL sharing**: `/check?country=mx&era=1960-1980&type=residential` auto-loads results on any device; `router.push` updates URL on submit; `navigator.clipboard` for Share button with 2s copied feedback
- **Architecture**: `page.tsx` (server) wraps `<Suspense>` around `RiskChecker` (client) due to `useSearchParams` requirement; `RiskResults` is a separate client component
- **Risk logic**: Reuses existing `calculateRisk()` from `src/lib/risk-calculator.ts` — no new calculation logic
- **i18n**: Added ~20 new keys to `check` section in `en.json` + `es.json` including action arrays per risk level (`t.raw()` pattern)
- **Design**: Follows DESIGN.md dark theme; risk colors from CSS variables; smooth fade-in transitions; responsive 2–3 column grids; `prefers-reduced-motion` respected via Tailwind
- **Build**: `npm run dev` and `npm run build` pass with zero errors

### 2026-03-14 — Risk Checker Data Bug Fix (v0.4.1)
- **Bug**: `"factory"` building type in the Risk Checker form was not matching any materials in `materials.json` — all materials used `"industrial"` in their `building_types` array, returning an empty materials list for factory selections
- **Fix**: Updated `building_types` in all affected industrial/fireproofing material entries in `materials.json` to include `"factory"` alongside `"industrial"`
- **Bug**: Several Latin American materials (cement roof tiles, asbestos-cement pipes) were missing `"latin_america"` from their `prevalence_regions` array, causing them to be excluded from risk results for Mexican and other LATAM country queries
- **Fix**: Added `"latin_america"` to `prevalence_regions` for all affected entries in `materials.json`
- **Build**: `npm run build` passes with zero errors

### 2026-03-14 — Country Profile Pages (v0.5.0)
- **Completed**: Country profile pages for all 200 countries in countries.json
- **Routing**: `generateStaticParams()` generates 400 static routes (200 countries × 2 locales)
- **SEO**: `generateMetadata()` per country — unique title "Is Asbestos Banned in [Country]?", unique description from ban_status
- **High priority (15 countries)**: Full regulatory timeline, all stats (ban year, mesothelioma rate, buildings at risk), common materials
- **Medium/low priority**: Simplified view with available stats + "Detailed information coming soon" note
- **Timeline component**: New `src/components/ui/Timeline.tsx` — vertical timeline with year, event type badge (color-coded: ban=green, regulation=blue, court_ruling=amber, other=gray), source link; server component using `getTranslations`
- **Country Header**: Flag emoji from iso2 regional indicator encoding + country name (Instrument Serif) + ban status pill (color-coded) + region
- **Stats Grid**: Ban year, mesothelioma rate (per million/year), estimated buildings at risk — all with "Data not available" fallback
- **What To Do section**: Contextual recommendations per ban_status (full_ban, partial_ban, no_ban, de_facto_ban, unknown) via i18n arrays
- **CTA**: Links to `/check?country=[iso2]` to pre-select country in Risk Checker
- **Sources**: External links to IBAS, EPA, WHO per country
- **i18n**: 30+ new keys added to `country` namespace in `en.json` + `es.json` — mesothelioma rate, buildings at risk, timeline types, what-to-do arrays, CTA, disclaimer
- **Design**: Dark theme throughout — bg-secondary cards, border-bg-tertiary, semantic color pills, font-mono for data values
- **Build**: `npm run type-check` and `npm run build` pass with zero errors

### 2026-03-14 — Educational Content Pages (v0.6.0)
- **Completed**: 5 educational pages under `/learn` + full index page
- **`/learn` (index)**: Card grid linking to all 5 sub-pages; `generateMetadata` + SSG; dark-theme responsive card layout
- **`/learn/what-is-asbestos`**: Fiber types (chrysotile/amosite/crocidolite) with danger badges; friability + biopersistence explainers; frustrated phagocytosis mechanism; diseases (mesothelioma, asbestosis, lung cancer)
- **`/learn/where-it-hides`**: Reads `materials.json` at build time; groups 20 materials by 8 location categories (roof → underground); risk badge + friability badge per material; 3-column recommendations (intact / damaged / renovation); CTA to risk checker
- **`/learn/history`**: Inline vertical timeline of 10 events 1906–2024 (new `HistoryEventType` system, not using `Timeline.tsx`); dot/badge colors by event type (coverup=red, regulation=green, science=blue, legal=amber); source links
- **`/learn/what-to-do`**: 3 scenario blocks (suspect / professional / confirmed) with colored borders; "Never Do These Things" do-not list in danger/red cards; when-to-call section
- **`/learn/by-the-numbers`**: 4 animated stat blocks (255,000 deaths/yr, 72 banned, N without ban, 125k km² roofing); Recharts stacked `BarChart` by world region + `PieChart` distribution — wrapped in `ByTheNumbersCharts.tsx` client component; server page computes all data from `countries.json`
- **i18n**: Expanded `learn` namespace in `en.json` + `es.json` with ~200 new keys covering all 5 pages; history events and what-to-do steps fully translated in Spanish
- **Types**: Added 7 new interfaces/types to `src/lib/types.ts` (`FiberTypeData`, `DiseaseData`, `HistoryEventType`, `HistoryEventData`, `ScenarioData`, `RegionBanData`, `DistributionEntry`)
- **New component**: `src/components/ui/ByTheNumbersCharts.tsx` — `"use client"` Recharts wrapper; receives pre-translated labels as props from server page; design-system hex colors
- **Architecture**: History events in i18n (not data file) for Spanish translation; `ByTheNumbersCharts` receives pre-translated strings as props — no `useTranslations` inside client component
- **Build**: `npm run build` passes with zero errors; 12 static paths (6 pages × 2 locales)

### 2026-03-14 — SEO Implementation (v0.7.0)
- **Sitemap**: `src/app/sitemap.ts` — dynamic Next.js sitemap generating ~413 URLs (2 locales × [8 static pages + 200 country pages]); priority-weighted (home=1.0, check=0.9, learn=0.8, country high=0.9, country low=0.7); `lastModified` from `country.last_updated` per country
- **Robots**: `src/app/robots.ts` — allows all crawlers, references sitemap URL; `BASE_URL` via `NEXT_PUBLIC_BASE_URL` env var (default: `https://breathe.global`)
- **Home page metadata**: Added `generateStaticParams` + `generateMetadata` to `/[locale]/page.tsx`; i18n keys `home.meta_title` + `home.meta_description` added to `en.json` + `es.json`; OG tags + hreflang alternates
- **Check page metadata**: Added `generateStaticParams` + `generateMetadata` to `/[locale]/check/page.tsx`; i18n keys `check.meta_title` + `check.meta_description` added; OG tags + hreflang alternates
- **WebApplication JSON-LD**: Schema.org `WebApplication` structured data on Risk Checker page (`applicationCategory: "HealthApplication"`)
- **FAQ JSON-LD**: Schema.org `FAQPage` structured data on all 200 country profile pages; answer text reuses same ban-status descriptions as meta description
- **Article JSON-LD**: Schema.org `Article` structured data on all 6 learn pages (index + 5 subpages); locale-aware headline from existing translations
- **hreflang alternates**: Added `alternates.languages` to all pages — home, check, country (slug-based), and all 6 learn pages; enables language-switching signals for Google
- **i18n**: Added 4 new keys: `home.meta_title`, `home.meta_description`, `check.meta_title`, `check.meta_description` to both `en.json` and `es.json`
- **Architecture**: `BASE_URL` constant pattern (`process.env.NEXT_PUBLIC_BASE_URL ?? "https://breathe.global"`) used consistently across sitemap, robots, and all `alternates` — Vercel env var at deploy time
- **Build**: `npm run build` passes with zero errors; all 420+ static routes generated

### 2026-03-16 — Globe Enhancements + Counter-Triggered Reveal (v1.2.0)
- **Globe: dark sphere** — replaced earth-night.jpg with a 2×2 canvas filled `#0D1526`, converted to dataURL (`darkGlobeTexture()`); only colored country polygons are visible, no ocean imagery
- **Globe: animated trade arcs** — 12 arcs from major asbestos producers (Russia, Kazakhstan, China) to no-ban consumer countries (India, Pakistan, Indonesia, Thailand, Iran, Serbia, Ethiopia, Nigeria, Kenya); red gradient (`rgba(239,68,68,0.05)` → `rgba(239,68,68,0.75)`), dash-animated at 2200ms
- **Globe: zoom on country click** — `getPolygonCenter()` computes polygon centroid (largest ring for MultiPolygon); `globe.pointOfView({altitude: 1.2}, 800ms)` zooms in before navigating; navigation fires after 900ms
- **Globe: hover pauses rotation** — `controlsHolder` ref pattern (populated after chain, used inside async hover callback); `autoRotate = false` on hover-enter, resumes via `setTimeout(800ms)` on hover-leave; drag also pauses/resumes via OrbitControls `start`/`end` events (2000ms resume delay)
- **Globe: counter-triggered reveal** — Globe only mounts after counter animation completes
  - `AnimatedCounter` gains `onComplete?: () => void` callback prop — fires when count-up finishes (or instantly on `prefers-reduced-motion`)
  - New `src/components/layout/HeroSection.tsx` — client component holding `globeReady` state
  - `page.tsx` (server component) passes pre-translated strings as props to `HeroSection`; no client state in page
  - `Globe3DLoader` gains `show?: boolean` prop — returns `null` until `show=true`, then mounts `Globe3DInner`
  - Sequence: counter counts 0→128 (2500ms) → `onComplete` fires → `globeReady=true` → globe mounts → globe fades in (2s ease-in)
- **Build**: `npm run build` passes with zero TypeScript errors; 421 static routes generated

### 2026-03-16 — 3D Globe Hero + Split-screen Layout (v1.0.0)
- **New dependency**: `globe.gl` (~500KB, loaded via dynamic import after page load)
- **New component**: `src/components/map/Globe3D.tsx` — client-only 3D globe using globe.gl + Three.js
  - GeoJSON polygons colored by ban_status: green (full_ban/de_facto_ban), amber (partial_ban), red (no_ban), gray (unknown)
  - Slow auto-rotation (0.3 deg/frame) focused on Asia/Africa (high no-ban density)
  - Auto-rotation pauses on user interaction, resumes after 2s idle
  - Hover: country altitude lift (0.006 → 0.025) + tooltip with name, status dot, ban year
  - Click: navigates to `/country/[slug]`
  - Atmosphere glow: `rgba(59, 130, 246, 0.6)` — subtle blue
  - Transparent background (`backgroundColor: rgba(0,0,0,0)`, `alpha: true`) integrates with `#0A0F1C` dark theme
  - ResizeObserver for responsive canvas sizing; full cleanup on unmount
- **New component**: `src/components/map/Globe3DLoader.tsx` — client component wrapping Globe3D
  - WebGL availability check via `useEffect` + `getContext('webgl')` — avoids hydration mismatch
  - Loading state: circular pulse skeleton while WebGL check runs + while globe.gl chunk downloads
  - Fallback: if no WebGL, renders text notice + existing Leaflet MapLoader
  - Dynamic import with `ssr: false` ensures globe.gl never evaluates on server
- **Hero restructured**: `src/app/[locale]/page.tsx` — split-screen layout replacing centered counter + map
  - Desktop (≥1024px): side-by-side — globe fills left 50% full-height, stats/CTA fill right 50% centered
  - Mobile (<1024px): globe top (50vh), stats+CTA below with scroll
  - `min-h-screen` on hero section ensures above-the-fold on desktop with no scroll required
  - Counter now `text-[8.5rem]` (desktop) — larger and more dominant
  - Radial warning glow behind counter (elliptical, 18% opacity)
  - Source attribution line below CTA: "Source: IBAS, EPA, WHO"
- **Leaflet map preserved**: moved to dedicated section below hero with heading `explore_map`
  - Section has `bg-bg-secondary` + centered `font-serif` h2 heading
  - Full interactive functionality unchanged (hover, click, legend, mobile tap-to-interact)
- **i18n**: 8 new keys added to `home` namespace in `en.json` + `es.json`:
  `explore_map`, `globe_loading`, `globe_fallback`, `globe_tooltip_banned` (with `{year}`),
  `globe_tooltip_no_ban`, `globe_tooltip_unknown`, `source_attribution`
- **Build**: `npm run build` passes with zero errors; all 420+ static routes generated

### 2026-03-16 — Counter Animation Reverted + Globe Slower Fade (v1.1.2)
- **`AnimatedCounter.tsx`** — Fully reverted to original animation: no `delay` prop, `ease-out` easing (`progress * (2 - progress)`), IntersectionObserver fires immediately on visibility, duration 2500ms
- **`page.tsx`** — Removed all stagger/choreography CSS (`animate-[page-fade-in...]`, `[animation-delay:...]`) from hero right side; hero content renders immediately as before
- **`Globe3D.tsx`** — Globe fade-in slowed from `0.8s` to `2s ease-in` for a more gradual, cinematic reveal

### 2026-03-16 — Counter Easing Fix (v1.1.1)
- **`AnimatedCounter.tsx`** — Changed easing from ease-out to cubic ease-in-out to fix jarring fast-start behavior
- **`page.tsx`** — Changed counter `delay` from 900ms to 150ms to eliminate 750ms dead-time showing "0"
- Reverted in v1.1.2 at user request (original ease-out animation preferred)

### 2026-03-16 — Choreographed Hero Animation (v1.1.0)
- **Problem**: All hero elements (counter animation, loading skeleton, globe canvas pop-in) fired simultaneously, creating competing visual noise and a low-quality perceived loading experience
- **Solution**: Temporal choreography — one visual "event" at a time draws user attention
- **`AnimatedCounter.tsx`** — Added `delay?: number` prop (default `0`)
  - Observer declared outside `setTimeout` closure for safe React cleanup (no memory leaks)
  - Cleanup returns `clearTimeout(timer)` + `observer?.disconnect()`
  - `prefers-reduced-motion`: delay ignored, count shown immediately
- **`page.tsx`** — Staggered entrance for right-side hero elements using existing `page-fade-in` keyframe
  - Pattern: `animate-[page-fade-in_0.5s_ease-out_both] [animation-delay:Xms]`
  - `animation-fill-mode: both` keeps elements at `opacity:0` before delay fires — no flash
  - AnimatedCounter: 150ms | h1: 300ms | deaths stat: 420ms | CTA: 540ms | source: 660ms
  - `<AnimatedCounter delay={900} />` — count-up starts after all text has settled
- **`Globe3D.tsx`** — Globe fades in after full initialization (not on import)
  - Container set to `opacity: 0` before async import
  - After controls wired up: `transition: opacity 0.8s ease-in` → `opacity: 1`
  - Replaces abrupt canvas pop-in with graceful reveal
- **`Globe3DLoader.tsx`** — Removed pulsing skeleton loading state
  - Returns `null` while WebGL check runs — left side stays dark (intentional, not broken)
  - Globe's own fade-in handles the appearance; no skeleton competing with counter
- **UX sequence**: text stagger (150–660ms) → count-up (900ms) → globe fade-in (~1.5–2s)
- **`prefers-reduced-motion`**: all durations collapse to 0.01ms via existing global CSS; counter shows 128 instantly
- **No new CSS**: reuses `page-fade-in` keyframe already in `globals.css`
- **Build**: `npm run build` passes with zero errors; 421 static routes generated

### 2026-03-16 — Performance Optimization: Remove Leaflet from Home (v1.0.1)
- **Removed**: Leaflet map section from home page (`src/app/[locale]/page.tsx`)
  - Eliminates Leaflet JS (~200KB), Leaflet CSS (~50KB), react-leaflet chunk, and duplicate world.json load (~300KB) from the home page bundle
  - `MapLoader` import removed from `page.tsx`
  - Shimmer divider between hero and map removed (no longer needed)
- **Rationale**: Globe3D renders the same geographic data visually; the Leaflet flat map below the hero was redundant and doubled the JS payload on the landing page
- **Page structure after**: Hero (split-screen globe + stats) → CTA section → Footer
- **Leaflet map preserved** in `src/components/map/` — available for future use on country/learn pages
- **Build**: `npm run build` passes with zero errors; all 421 static routes generated

### 2026-03-15 — Design Polish + UX Fixes + Skills Audit (v0.9.0)
- **Bug fix**: Map scroll blocked on mobile — Leaflet dragging now disabled by default with tap-to-activate overlay; `scrollWheelZoom` permanently off; click-outside resets interaction state
- **Fix**: Map legend collapsible on mobile (<768px) via pill toggle with slide-down animation; always expanded on desktop
- **Hero polish**: Radial warning glow (`rgba(245,158,11,0.30)`) behind counter; hero grain texture (CSS SVG noise, opacity 0.03); "NO" highlighted in amber/bold via split i18n keys; reduced mobile padding (`pt-16` → `sm:pt-24`); shimmer gradient divider between hero and map
- **CTA section**: Left danger border (4px), gradient button (`from-accent to-accent/80`), CTA pulse animation, social proof text ("Free tool. No registration required.")
- **Footer**: Gradient divider replaces solid border-t; BREATHE letter-spacing 0.15em; center-expand underline on data source links; disclaimer text upgraded to `text-secondary` for better contrast (WCAG fix)
- **Header**: `backdrop-blur-xl` (was `backdrop-blur-md`); bg opacity 90% (was 80%); logo letter-spacing transition on hover; nav link center-expand underlines; added `aria-label` on "opens in new tab" footer links
- **Global texture**: Subtle noise grain on body (opacity 0.025, `pointer-events: none`, GPU-composited via `position: fixed`)
- **i18n**: 6 new keys in `home` namespace (en + es): `map_interact`, `map_legend_toggle`, `counter_prefix`, `counter_no`, `counter_suffix`, `cta_social_proof`
- **WCAG audit findings**: 3 critical (missing h1 — fixed with `sr-only` h1; disclaimer contrast — fixed; no skip link — deferred), 3 moderate (nav focus-visible styles, html lang attr, target=_blank labeling — footer links fixed, rest deferred)
- **SEO audit findings**: 2 gaps (no OG image, missing `x-default` in hreflang — both deferred to v0.9.1), all structured data and sitemap confirmed correct
- **Performance audit findings**: 2 deferred optimizations (next/font migration for Google Fonts link, GeoJSON bundled into client JS — both deferred to v0.10.0)
- **Build**: `npm run build` passes with zero errors; all 420+ static routes generated

### 2026-03-14 — Final Polish Pass (v0.8.0)
- **Typography verified**: Instrument Serif (display), DM Sans (body), JetBrains Mono (data) all confirmed correct via CSS vars + Tailwind `@theme inline`. No fixes needed.
- **Contrast verified**: All color pairs pass WCAG AA minimum — `text-primary #F9FAFB` and `text-secondary #9CA3AF` on `bg-primary #0A0F1C` confirmed.
- **Page transitions**: Added CSS `@keyframes page-fade-in` (opacity + translateY 6px) in `globals.css`; new `src/components/ui/PageTransition.tsx` client component uses `usePathname()` as `key` to trigger 250ms fade on every navigation; integrated in `[locale]/layout.tsx`.
- **Mobile menu animation**: Added `@keyframes slide-down` (opacity + translateY -8px); applied `animate-[slide-down_0.2s_ease-out]` to mobile nav in `Header.tsx` — menu slides in smoothly on open.
- **Reduced motion**: Added `@media (prefers-reduced-motion: reduce)` override in globals.css — all animation/transition durations collapsed to 0.01ms for accessibility.
- **Mobile 375px — hero counter**: Reduced `AnimatedCounter` class from `text-7xl` to `text-5xl` on mobile (`sm:text-7xl lg:text-[8rem]`) to prevent overflow at 375px viewport.
- **Mobile 375px — map legend**: Legend text scaled to `text-[10px] sm:text-xs` so the bottom-left overlay is compact on narrow viewports without overlapping map content.
- **Language toggle verified**: `router.replace(pathname, { locale })` with `usePathname()` from `@/i18n/navigation` (locale-agnostic) correctly preserves `/country/[slug]`, `/learn/*`, and all other routes when switching EN↔ES.
- **Emoji flags verified**: Unicode regional indicator pairs render correctly on iOS, Android, macOS, and Windows 11 — no changes required.
- **Build**: `npm run build` passes with zero errors; all 420+ static routes generated.

---

### Upcoming — Week 1
- [x] Initialize Next.js project with TypeScript + Tailwind
- [x] Curate countries.json (all 195 countries, 15 detailed)
- [x] Curate materials.json (20 material entries)
- [x] Build landing page with interactive Leaflet world map
- [x] Build Risk Checker (form + scoring logic + results page)
- [x] Setup i18n architecture (next-intl, en.json, es.json)

### Upcoming — Week 2
- [x] Build 15 country profile pages (template + data)
- [x] Build 5 educational content pages
- [x] SEO setup (meta tags, sitemap, structured data, OG images)
- [x] Responsive testing, accessibility audit
- [ ] Deploy to Vercel

### Upcoming — Week 3
- [x] QA and polish
- [ ] Soft launch (Reddit, social media)
- [ ] Submit to Google Search Console
- [ ] Iterate based on feedback
