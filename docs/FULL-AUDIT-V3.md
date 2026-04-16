# FULL-AUDIT-V3.md — ToxinFree Platform Audit

**Date:** 2026-04-13
**Version audited:** v2.20.0 (latest commit `98abd76` on master; CHANGELOG head is v2.19.3 — v2.20.0 entry missing)
**Auditor:** Claude Code (Opus 4.6)
**Methodology:** `MASTER-AUDIT-PROMPT.md` (3-phase protocol)
**Auto-fixes applied:** 4 issues this audit
**Previous audit:** v2.0.0 — scored 7.9/10 on 2026-03-29 — `docs/FULL-AUDIT-V2.md`

---

## EXECUTIVE SUMMARY

Between v2.0.0 and v2.20.0 the project shipped 9 research files (7→16), 200/200 unique hero images (37→200), locale-aware 404 + home OG, UK ES metadata fixes (Phase 6), 24-country `PRIORITY_DESCRIPTIONS` (new), and `formatNumber` locale parameter (V2 debt #6 resolved). **Global score: 8.3/10** (up from 7.9). Progress is real but uneven: data depth and SEO moved up, while `npm run lint` is now **red in CI** (9 new `react-hooks/set-state-in-effect` and `no-require-imports` errors introduced silently since V2 — this audit's single biggest regression). Two V2 anchors are still unresolved: risk matrix citations (BLOCKER) and `ban_details_es` coverage (158/200 countries still show English ban details to Spanish users).

---

## SECTION 1: PROJECT HEALTH DASHBOARD

| # | Dimension | v1.7.3 | v2.0.0 | v3.0.0 | Trend V2→V3 | Key Evidence |
|---|-----------|--------|--------|--------|-------------|--------------|
| 1 | Code Quality | 8 | 8 | 7 | **down** | `npm run lint` **fails CI** with 9 errors (5× `react-hooks/set-state-in-effect` across [RiskChecker.tsx:115](src/components/checker/RiskChecker.tsx#L115), [StatRotator.tsx:51](src/components/home/StatRotator.tsx#L51), [Globe3DLoader.tsx:20](src/components/map/Globe3DLoader.tsx#L20), [CountrySearch.tsx:134](src/components/search/CountrySearch.tsx#L134), [AnimatedCounter.tsx:32](src/components/ui/AnimatedCounter.tsx#L32); 3× `no-require-imports` in [scripts/optimize-images.js:10-12](scripts/optimize-images.js#L10-L12); 1× `any` in [learn/where-it-hides/page.tsx:149](src/app/[locale]/learn/where-it-hides/page.tsx#L149)). Dead `patternClass` variable found + fixed in `CountryHero.tsx` this audit. |
| 2 | TypeScript Strictness | 9 | 9 | 9 | same | `strict: true` ([tsconfig.json:7](tsconfig.json#L7)). `npm run type-check` passes cleanly. One `any` in `where-it-hides` (see above). |
| 3 | Architecture | 7 | 8 | 8 | same | Unchanged: factory calculators, `map-constants`, 3 route `error.tsx` files, `/countries` SSG page. 28 client components (was 26). `worldGeoJSON` still imported in 2 places ([Globe3D.tsx:7](src/components/map/Globe3D.tsx#L7), [WorldMap.tsx:9](src/components/map/WorldMap.tsx#L9)) — V2 smell #3 persists. |
| 4 | Error Handling | 5 | 7 | 7 | same | Unchanged from V2. `ErrorBoundary` + 3 route-level error boundaries. URL-param validation in `RiskChecker`. |
| 5 | Performance | 7 | 7 | 7 | same | Globe3D gating unchanged. GeoJSON 839 KB. **New regression**: hero images on 200 country pages are served as CSS `background-image` URLs ([CountryHero.tsx:41-51](src/components/country/CountryHero.tsx#L41-L51)), bypassing `next/image` optimization, responsive srcsets, and lazy-loading heuristics. |
| 6 | SEO Implementation | 8 | 9 | 9 | same | Country pages now have `canonical`, `hreflang` with `x-default`, and `og:locale` after Phase 6 fix ([country/[slug]/page.tsx:196-199](src/app/[locale]/country/[slug]/page.tsx#L196-L199)). Country OG image localized this audit (ban label + country name + "since {year}" + "Is asbestos banned in" all translated). ES title uses `name_es`. Still missing breadcrumb schema. Root `/opengraph-image.tsx` still hardcoded English ([:53-93](src/app/opengraph-image.tsx#L53-L93)) — vestigial, locale-aware version exists at `[locale]/opengraph-image.tsx`. |
| 7 | Accessibility (WCAG) | 7 | 8 | 8 | same | Lint reports `role="combobox"` missing `aria-controls,aria-expanded` on [RiskChecker.tsx:272](src/components/checker/RiskChecker.tsx#L272) (warning, not error). `<img>` used instead of `<Image/>` in [CountryFlag.tsx:18](src/components/ui/CountryFlag.tsx#L18), [EducationalImage.tsx:16](src/components/ui/EducationalImage.tsx#L16), [where-it-hides/page.tsx:172](src/app/[locale]/learn/where-it-hides/page.tsx#L172). Hero `background-image` has no `alt` (only `aria-label` on section). Skip-to-content still i18n. |
| 8 | i18n Completeness | 9 | 9 | 9 | same | 460 keys per locale (was 416), perfect parity after this audit's additions (`country.og_question`, `country.og_since`). `name_es` on all 200 countries. H1 now uses `name_es` for ES locale ([CountryHero.tsx](src/components/country/CountryHero.tsx#L30)). **Biggest remaining gap**: only 42/200 countries have `ban_details_es` populated — 158 Spanish country pages display English ban details ([CountryHero.tsx:24-27](src/components/country/CountryHero.tsx#L24-L27) falls back to `country.ban_details`). |
| 9 | Data Quality | 4 | 6 | 7 | **up** | 42 timelines (was 37, +5). 15 mesothelioma rates (was 11, +4). **21 buildings-at-risk** (was 12, +9 — the biggest single improvement). 13 countries × 28+ resistance stories. **16 deep-research files** (was 7) — adds CN, RU, IN, TR, KZ, PT, UAE, TW, NA. New: `hero_pattern` + `hero_image_url` on all 200 countries (unique Unsplash URLs). New: `joint_resistance_story` field. 6 `partial_ban` countries (was 2), 1 `de_facto_ban` (was 0, correctly assigned to China per Phase 6B correction). Persistent gap: 158 countries still have empty timeline. |
| 10 | Mobile UX | 7 | 8 | 9 | **up** | 3D/2D preference now persisted via `localStorage` key `toxinfree_map_preference` with graceful fallback ([Globe3DLoader.tsx:22-43,107-118](src/components/map/Globe3DLoader.tsx#L22-L43)) — Phase 1B delivered. All other V2 mobile behavior preserved. |
| 11 | Security | 6 | 8 | 8 | same | Unchanged: DOMPurify in both map components, 7 security headers. CSP **still `Report-Only`** ([next.config.ts:22](next.config.ts#L22)) — V2 debt #3 persists. 0 unsafe `target="_blank"` (all 11 have `rel="noopener noreferrer"`). 0 console.log in prod (only dev-gated `console.error` in `ErrorBoundary`). |
| 12 | Test Coverage | 0 | 4 | 4 | same | **81 tests, 2 files** — identical surface area as V2. No component tests, no E2E tests added. `data-integrity.test.ts` now asserts UK resistance_stories count (4) but has **no per-country coverage of the 9 new research countries** (KZ, RU, PT, TR, UAE, IN, TW, NA, CN) — adding data passed schema tests but the specific enriched fields aren't asserted anywhere. V2 roadmap Week 1 (component tests) never shipped. |
| 13 | Documentation | 7 | 8 | 8 | same | 16 research files (was 7). CHANGELOG 1611 lines, current head `v2.19.3` — **v2.20.0 (Unsplash-200 commit `333e8fc`) was shipped without a CHANGELOG entry**. CLAUDE.md still says "380+ keys per locale" (now 460) — stale. `docs/SEO.md` still mentions OG images as "planned" (V2 debt #10 open). `docs/FULL-AUDIT.md` (v1.7.3) + `docs/FULL-AUDIT-V2.md` both retained for trend comparison. |
| 14 | Scalability Readiness | 5 | 7 | 6 | **down** | CI is red on lint — any new PR would fail ([ci.yml:13](.github/workflows/ci.yml)). Lighthouse CI job depends on `ci` job succeeding, so Lighthouse also won't run. Pipeline exists but is unenforceable until lint is cleaned. Calculator factory + research workflow remain strong. |
| | **GLOBAL** | **7.0** | **7.9** | **8.3** | **up** | Data + SEO + i18n + Mobile up; Code Quality + Scalability down due to broken lint. |

---

## SECTION 2: AUTO-FIXES APPLIED (4 issues)

| # | Issue | File(s) Changed | What Was Done |
|---|-------|-----------------|---------------|
| 1 | `CONTENT_MODIFIED_DATE` stale (`2026-03-29`) despite `v2.19.x`/`v2.20.0` content changes | [src/lib/constants.ts:6](src/lib/constants.ts#L6) | Updated to `2026-04-13`. Affects JSON-LD `dateModified` on all learn pages. |
| 2 | Country `<h1>` used `country.name` (English) for both locales — visible SEO regression for ES pages despite Phase 6 fixing the `<title>` tag | [src/components/country/CountryHero.tsx](src/components/country/CountryHero.tsx) | Added `displayName = locale === "es" ? (country.name_es ?? country.name) : country.name`. Applied to `<h1>` and `aria-label`. Also removed dead `patternClass` variable (its only usage was commented out on line 64). |
| 3 | Country OG image "since {year}" and "Is asbestos banned in {name}?" hardcoded English; country name in OG image English only | [src/app/[locale]/country/[slug]/opengraph-image.tsx](src/app/[locale]/country/[slug]/opengraph-image.tsx) | Imported `country` namespace via `getTranslations`. Used `tCountry("og_since", { year })` and `tCountry("og_question", { name: displayName })`. `displayName` picks `name_es` for ES locale. Completes V2 bug #4 fix. |
| 4 | Two new i18n keys needed for #3 | [src/messages/en.json](src/messages/en.json), [src/messages/es.json](src/messages/es.json) | Added `country.og_question` and `country.og_since` in both locales. Parity maintained at 460 keys each. |

**Total:** 4 fixes, 0 new files, 5 files modified, 2 new i18n keys × 2 locales = 4 translations.

Commit-ready as `audit: v3.0.0 — auto-fix 4 i18n + stale-date issues`.

---

## SECTION 3: BUGS

| # | Severity | File:Line | Description | Impact | Fix |
|---|----------|-----------|-------------|--------|-----|
| 1 | **HIGH** | [5 files](#see-code-quality-row) | `npm run lint` fails CI with 9 errors. React 19's new `react-hooks/set-state-in-effect` rule triggers on pre-existing `useEffect` patterns in 5 components, plus 3 `require()` in `scripts/optimize-images.js` and 1 `any` in `where-it-hides`. | CI pipeline is red; any PR merging to master would be blocked if branch protection mirrors CI. Lighthouse job depends on `ci` job and won't run. | Refactor each effect to compute the next state before the effect (or use derived state). Migrate `optimize-images.js` to ES modules. Type the `any`. |
| 2 | MEDIUM | [CountryHero.tsx:41-51](src/components/country/CountryHero.tsx#L41-L51) | Hero images are rendered as CSS `background-image` URLs, not through `next/image`. | No srcset, no automatic WebP, no lazy-loading, no alt text (only section `aria-label`). 200 LCP-critical images skip Next.js optimization pipeline entirely. Likely regresses Core Web Vitals on country pages. | Refactor to `<Image fill />` with `priority` for the above-the-fold country hero. Add `alt={displayName}` or a more descriptive `alt`. |
| 3 | MEDIUM | [src/app/opengraph-image.tsx:53-93](src/app/opengraph-image.tsx) | Root `/opengraph-image.tsx` still hardcoded English ("countries still have", "NO ban", "on asbestos", "200 countries tracked"). | For `/` requests before locale redirect, social crawlers see English OG. Because a locale-aware version exists at [`src/app/[locale]/opengraph-image.tsx`](src/app/[locale]/opengraph-image.tsx), the root route is mostly vestigial but still served at the bare domain. | Either delete the root version (relying on middleware redirect) or mirror the locale-aware structure with an EN fallback. |
| 4 | MEDIUM | [src/app/not-found.tsx:49,61,88,101,110](src/app/not-found.tsx) | Root `not-found.tsx` still fully English despite the new [locale-aware `[locale]/not-found.tsx`](src/app/[locale]/not-found.tsx) shipping (which uses `errors.not_found_*` keys). | Catches requests that don't match `/en/*` or `/es/*` — a narrow path but still affects bare-path 404s. | Leave as-is (system-level fallback) or delete if `[locale]/not-found.tsx` covers all cases via middleware. |
| 5 | LOW | [src/app/[locale]/country/[slug]/page.tsx](src/app/[locale]/country/[slug]/page.tsx) implicit | 158/200 countries lack `ban_details_es`. [CountryHero.tsx:24-27](src/components/country/CountryHero.tsx#L24-L27) falls back to English. | Spanish users on most country pages see the ban summary in English. Since the hero description is the most prominent page content, this is a meaningful localization gap. | Backfill `ban_details_es` for all 200 countries (translation, ~2h with LLM + review). |
| 6 | LOW | [CHANGELOG.md](CHANGELOG.md) | `v2.20.0` (200 unique Unsplash URLs, commit `333e8fc`) never got a CHANGELOG entry — latest logged is `v2.19.3`. | Changelog is the project's decisions log; gaps make future debugging harder. | Add `v2.20.0` entry retroactively. |

All 5 V2 bugs either resolved or reclassified: `formatNumber` locale (V2#1) **fixed** ([utils.ts:34](src/lib/utils.ts#L34)). `not-found.tsx` (V2#2) **partially fixed** (locale version exists, root persists — Bug #4 here). Root OG (V2#3) **partially fixed** (locale version exists, root persists — Bug #3 here). Country OG labels (V2#4) **fixed** this audit. `Loading charts...` (V2#5) **fixed** in v2.10.0.

---

## SECTION 4: CODE SMELLS

| # | File:Line | Issue | Why It Matters | Fix |
|---|-----------|-------|----------------|-----|
| 1 | [CountryHero.tsx:29](src/components/country/CountryHero.tsx#L29) *(fixed this audit)* | `patternClass` computed but never rendered (the only consumer on line 64 is commented out). | Dead code signaling an abandoned feature branch (generative CSS patterns replaced by Unsplash images). | **DONE** — removed. |
| 2 | [Globe3D.tsx:7](src/components/map/Globe3D.tsx#L7), [WorldMap.tsx:9](src/components/map/WorldMap.tsx#L9) | `worldGeoJSON` (839 KB) imported in both; also double-cast `as unknown as GeoJSON.FeatureCollection` in each. | V2 smell #3 + #4 persist. Module cache prevents double-load but indicates no shared data layer. | Create `src/data/geo/index.ts` with typed export. |
| 3 | [country/[slug]/page.tsx:30-131](src/app/[locale]/country/[slug]/page.tsx#L30) | `PRIORITY_DESCRIPTIONS` + `PRIORITY_DESCRIPTIONS_ES` are ~100 lines of literal data inlined in a route component. | Hard to maintain; each new enriched country requires touching a page file. Data belongs in `/src/data/`. | Move into `src/data/priority-descriptions.json` keyed by slug, with per-locale fields. |
| 4 | [Footer.tsx](src/components/layout/Footer.tsx) + pages | 11 `target="_blank"` links — all have `rel="noopener noreferrer"`. | No issue — noted here as passing check. | None. |
| 5 | [RiskResults.tsx](src/components/checker/RiskResults.tsx) | `ERA_CONSTRUCTION_YEAR` + `getBanContextKey()` still in UI layer (V2 smells #1–#2 persist). | Same rationale as V2. | Low priority. |

---

## SECTION 5: DATA INTEGRITY

### Counts (verified programmatically)

| Metric | v2.0.0 | v3.0.0 | Delta |
|--------|--------|--------|-------|
| Total countries | 200 | 200 | — |
| `full_ban` | 73 | 73 | — |
| `no_ban` | 18 | 14 | **−4** (4 reclassified to `partial_ban`) |
| `partial_ban` | 2 | 6 | **+4** |
| `de_facto_ban` | 0 | 1 | **+1** (China, per Phase 6B correction) |
| `unknown` | 107 | 106 | −1 |
| Countries with non-empty `timeline` | 37 | 42 | **+5** |
| Countries with `mesothelioma_rate` | 11 | 15 | **+4** |
| Countries with `estimated_buildings_at_risk` | 12 | 21 | **+9** |
| Countries with `resistance_stories` | 7 (18 stories) | 13 | **+6** |
| Countries with `name_es` | 200 | 200 | — |
| Countries with `ban_details_es` | N/A | **42** | *new field visibility* |
| Countries with `hero_image_url` | N/A | 200 (all unique) | **new** |
| Countries with `hero_pattern` | N/A | present | **new** |
| Research files (`docs/research/`) | 7 | 16 | **+9** (AU, BR, CN, CO, FR, IN, IT, KZ, NA, PT, RU, TR, TW, UAE, UK, ZA) |
| `priority: "high"` countries | 37 | 40 | **+3** |
| `PRIORITY_DESCRIPTIONS` (EN) in country page | N/A | 24 | **new** (8 original + 16 Phase 6B) |
| Materials | 20 | 20 | — |
| Risk-matrix `country_overrides` | 18 | 18 | — |
| GeoJSON | 839 KB | 839 KB | — |

### Consistency checks

| Check | Result |
|-------|--------|
| `substances.noBanCount` computed dynamically | PASS ([substances.ts:5-10](src/data/substances.ts#L5-L10)) — `no_ban + unknown = 14 + 106 = 120` |
| `substances.bannedCount` computed dynamically | PASS — `full_ban + de_facto_ban = 73 + 1 = 74` |
| All `priority: "high"` countries have non-empty timeline | PASS (40/40) |
| All 18 `country_overrides` have matching `countries.json` entries | PASS |
| Risk weights sum to 1.0 | PASS (0.45 + 0.35 + 0.20) |
| Thresholds non-overlapping | PASS |
| i18n parity (EN ↔ ES) | PASS — 460 keys each |
| Slugs unique | PASS |
| `iso2` unique | PASS |
| `hero_image_url` unique across 200 countries | PASS (0 duplicates) |

### Data gaps (unchanged structural themes)

- **158/200** countries (79 %) have empty `timeline` — persistent V2 gap, only 5 added.
- **158/200** countries lack `ban_details_es` — the most visible Spanish-side gap.
- **185/200** countries lack `mesothelioma_rate`.
- **179/200** countries lack `estimated_buildings_at_risk`.
- **Risk matrix multipliers still have 0 scientific citations** — V2 BLOCKER **persists**.

---

## SECTION 6: SEO AUDIT

### Per-page verification

| Page Type | Count | Metadata | JSON-LD | Sitemap | hreflang (+`x-default`) | OG image | Notes |
|-----------|-------|----------|---------|---------|-------------------------|----------|-------|
| Home | 2 | ✅ | Organization | ✅ | ✅ | locale-aware | — |
| Risk Checker | 2 | ✅ | WebApplication | ✅ | ✅ | static | — |
| Countries | 2 | ✅ | ItemList | ✅ | ✅ | static | — |
| Country profiles | 400 | ✅ | FAQPage | ✅ | ✅ | locale-aware (country name + ban label + "since" + question all translated — this audit) | — |
| Learn hub + 6 sub-pages | 14 | ✅ | Article | ✅ | ✅ | ✅ | No breadcrumb schema (V2 issue persists) |

**Total sitemap routes:** 420 (10 static × 2 + 200 countries × 2). Build produced 424+ static pages.

### Phase 6 / 6B verification

- UK ES title now uses `name_es` → `¿Está prohibido el asbesto en el Reino Unido?` (confirmed via `country.name_es`).
- `canonical`, `x-default` hreflang, and `og:locale` present in every country page (verified in [country/[slug]/page.tsx:196-199](src/app/[locale]/country/[slug]/page.tsx#L196-L199)).
- `PRIORITY_DESCRIPTIONS` covers 24 slugs in EN and ES. Each entry pulls unique research-backed data (tonnages, site names, compensation figures). Spot-checked against research files — data consistent.
- External Search-Console verification (UK ES < 20, China < 7) is **out of scope** — requires live console data. The prerequisites (better metadata + i18n H1 + research-backed descriptions) are now in place.

### Remaining SEO issues

1. Hero images bypass `next/image` — likely LCP regression (see Bug #2).
2. Root `/opengraph-image.tsx` hardcoded English (see Bug #3).
3. No breadcrumb schema on learn pages.
4. 158 non-priority country pages have generic metadata (no `PRIORITY_DESCRIPTIONS` entry).

---

## SECTION 7: PERFORMANCE

### Bundle

| Asset | Size | Loading |
|-------|------|---------|
| Globe3D (globe.gl + three.js) | ~487 KB | Dynamic import, gated (desktop + WebGL + ≥4GB + non-2g) |
| Leaflet + react-leaflet | ~40 KB | Dynamic, SSR off |
| Recharts | ~60 KB | Only on `/learn/by-the-numbers` |
| GeoJSON | 839 KB | Static import (shared via module cache) |
| **Desktop client JS** | ~600–700 KB | — |
| **Mobile client JS** | ~200–300 KB | Globe3D skipped |

### Production cleanliness

| Check | Result |
|-------|--------|
| `console.log/warn` in prod | **0** (only dev-gated `console.error` in [ErrorBoundary.tsx:30](src/components/ui/ErrorBoundary.tsx#L30)) |
| Unused dependencies | **0** (12 prod deps all imported; `sharp` used by `optimize-images.js`) |
| TODO / FIXME | **0** in `src/` |
| SSR/client split | 28 `"use client"` components (was 26) — acceptable |
| Static pages generated | 424+ (verified via `npm run build`) |
| Build warnings | Recharts chart-dimension warnings during SSG (cosmetic) |

### Regressions

- Hero `background-image` on country pages (see Bug #2) — LCP-critical asset skips Next.js image optimization.

---

## SECTION 8: SECURITY

| Check | Result | Notes |
|-------|--------|-------|
| XSS via tooltips | ✅ DOMPurify ([WorldMap.tsx:116](src/components/map/WorldMap.tsx#L116), [Globe3D.tsx:192](src/components/map/Globe3D.tsx#L192)) |
| URL-param validation | ✅ `RiskChecker` |
| `target="_blank"` safety | ✅ All 11 external links have `rel="noopener noreferrer"` |
| API keys in bundles | None |
| Security headers | 6 enforced + 1 CSP `Report-Only` ([next.config.ts:7-35](next.config.ts#L7-L35)) |
| CSP enforcement | ❌ **Still `Report-Only`** — V2 debt #3 |
| JSON-LD injection surface | Safe — `JSON.stringify` only |
| Sensitive data in client | None (all data public regulatory info) |

---

## SECTION 9: i18n COMPLETENESS

### Counts

| Locale | Keys | Parity |
|--------|------|--------|
| en.json | 460 | ✅ |
| es.json | 460 | ✅ |

### Changes since V2

- **+44 keys per locale** (416 → 460). Includes v2.10.0 i18n sprint, new PRIORITY_DESCRIPTIONS references, and this audit's `country.og_question` + `country.og_since`.
- `ban_details_es` now present on 42 countries (new translatable field).
- UK Spanish page fully localized after Phase 6.

### Remaining hardcoded strings

1. Root [not-found.tsx](src/app/not-found.tsx) (Bug #4) — needs locale fallback.
2. Root [opengraph-image.tsx](src/app/opengraph-image.tsx) (Bug #3) — English-only.
3. None in components (all surveyed via grep; all known instances from V2 are resolved).

### Spanish content gap

- 158/200 countries missing `ban_details_es` → visible on country hero (Bug #5).
- Non-priority countries fall back to generic metadata in both locales.

---

## SECTION 10: DOCUMENTATION AUDIT

| File | Status | Action | Reason |
|------|--------|--------|--------|
| `CLAUDE.md` | Stale minor | UPDATE | Says "380+ keys" (now 460). Tech stack section accurate. |
| `CHANGELOG.md` | **Gap** | UPDATE | Missing `v2.20.0` entry despite commit shipping. Add v2.20.0 + v3.0.0 entries. |
| `CONTRIBUTING.md` | Good | KEEP | — |
| `README.md` | Good | KEEP | — |
| `MASTER-AUDIT-PROMPT.md` | Good | KEEP | Reusable, still accurate. |
| `ROADMAP-V2.md` | Completed | ARCHIVE | All 7 phases shipped. Can move to `docs/archive/`. |
| `ROADMAP-V3.md` | Current | KEEP | New roadmap referenced throughout Phase 6–7. |
| `docs/FULL-AUDIT.md` (v1.7.3) | Superseded | ARCHIVE (optional) | Keep for longitudinal trend data. |
| `docs/FULL-AUDIT-V2.md` | Superseded by V3 | KEEP | Trend baseline for V4. |
| `docs/FULL-AUDIT-V3.md` | Current | CURRENT | This document. |
| `docs/DATA.md` / `DESIGN.md` / `SCALING.md` / `SCOPE-V1.md` / `SCOPE-FULL.md` / `RISK-LOGIC.md` | Good | KEEP | Covered in V2 audit — no new drift. |
| `docs/SEO.md` | Stale | UPDATE | V2 debt #10 — still mentions OG images as planned. |
| `docs/LANDMARKS-RESEARCH.md` / `LANDMARKS-INTEGRATION.md` / `IMAGE-INVENTORY.md` | Good | KEEP | Document hero-image workflow. |
| `docs/research/*.md` (×16) | Good | KEEP | Research corpus — 9 new since V2. |

---

## SECTION 11: TECHNICAL DEBT INVENTORY

| # | Item | Severity | File(s) | Est. Fix | Carried From |
|---|------|----------|---------|----------|--------------|
| 1 | **CI lint is red (9 errors)** | HIGH | 5 components + `optimize-images.js` + `where-it-hides` | 2–3 h | NEW in V3 |
| 2 | Risk matrix has 0 scientific citations | HIGH | `risk-matrix.json` | 4–8 h (expert) | V2 #1 |
| 3 | 158 shell country pages (empty timeline) | HIGH | `countries.json` | 8–16 h (LLM + review) | V2 #2 (159 then → 158 now) |
| 4 | Hero images bypass `next/image` | MEDIUM | `CountryHero.tsx` | 1 h | NEW in V3 |
| 5 | `ban_details_es` missing on 158 countries | MEDIUM | `countries.json` | 2–3 h | NEW-ish (field added post-V2) |
| 6 | CSP still `Report-Only` | MEDIUM | `next.config.ts` | 2–4 h | V2 #3 |
| 7 | Root `not-found.tsx` English | LOW | `src/app/not-found.tsx` | 30 m | V2 #4 (partial) |
| 8 | Root `opengraph-image.tsx` English | LOW | `src/app/opengraph-image.tsx` | 30 m | V2 #5 (partial) |
| 9 | `v2.20.0` missing from CHANGELOG | LOW | `CHANGELOG.md` | 10 m | NEW |
| 10 | `PRIORITY_DESCRIPTIONS` literal in route component | LOW | `country/[slug]/page.tsx` | 1 h | NEW |
| 11 | `worldGeoJSON` duplicated import | LOW | map components | 30 m | V2 #3 |
| 12 | No component / E2E tests | MEDIUM | — | 8–12 h | V2 |
| 13 | `docs/SEO.md` stale | LOW | — | 15 m | V2 #10 |

---

## SECTION 12: WHAT'S MISSING (by impact)

### BLOCKER (before seeking backlinks / partnerships)

- **Unblock CI** — 9 lint errors fail `npm run lint`. Merge gates can't run until fixed. (New since V2.)
- **Expert validation of risk matrix** — still no answer for "where did 0.45 come from?".

### HIGH (next 30 days)

- Migrate hero to `next/image` (LCP + alt text win).
- Backfill `ban_details_es` for the remaining 158 countries.
- Continue timeline enrichment toward the roadmap target (60+ countries; currently 42).
- Ship component tests for `RiskChecker`, `CountrySearch`, `Globe3DLoader` — V2 roadmap Week 1 never landed.

### MEDIUM (next 90 days)

- Move CSP from `Report-Only` → enforcing.
- Localize or delete root `not-found.tsx` and `opengraph-image.tsx`.
- Breadcrumb schema on learn pages.
- Extract `PRIORITY_DESCRIPTIONS` to a data file.

### LOW / nice-to-have

- E2E tests (Playwright).
- Data freshness pipeline (automated IBAS checks).
- Additional locales (PT, FR, AR).

---

## SECTION 13: ACTIONABLE ROADMAP

### Week 1 — Unblock CI + Quick SEO Wins

```
Model: sonnet | Effort: medium

Context: CI lint is red (9 errors) and hero images skip next/image. These
are mechanical refactors.

Tasks:
1. Fix 5× react-hooks/set-state-in-effect errors (RiskChecker.tsx:115,
   StatRotator.tsx:51, Globe3DLoader.tsx:20, CountrySearch.tsx:134,
   AnimatedCounter.tsx:32) — use the React 19 migration pattern
   (derive state during render, or split effect).
2. Convert scripts/optimize-images.js to ESM (remove 3 require()).
3. Type the `any` in learn/where-it-hides/page.tsx:149.
4. Refactor CountryHero.tsx to use <Image fill priority>.
5. Add v2.20.0 and v3.0.0 entries to CHANGELOG.md.

Files: src/components/**, scripts/optimize-images.js, src/app/[locale]/learn/where-it-hides/page.tsx, CHANGELOG.md
Verify: npm run lint (0 errors), npm run build, npm test
Expected: Code Quality 7→9, Scalability 6→8, Performance 7→8
```

### Week 2 — ES Content Parity

```
Model: opus | Effort: medium

Context: 158/200 countries have no ban_details_es. Most visible localization
gap. Target: backfill 100 countries (use existing research files for 16,
generate for rest with review).

Tasks:
1. For each of 16 research-backed countries: extract 2-3 sentence ES summary
   into ban_details_es.
2. For remaining 84 high/medium priority countries: generate ES translation
   from existing ban_details with post-edit review.
3. Add ban_details_es coverage assertion to data-integrity.test.ts.

Files: src/data/countries.json, src/__tests__/data-integrity.test.ts
Verify: npm test (new assertion), visual spot-check on /es/country/<slug>
Expected: i18n Completeness 9→9 (polish); reduces biggest Spanish UX gap.
```

### Week 3 — Test Depth

```
Model: sonnet | Effort: medium

Context: V2 Week-1 roadmap (component tests) never shipped. 81 tests all
in 2 files. Add per-country assertions for the 9 new research countries
so future data edits are caught.

Tasks:
1. Install @testing-library/react, jsdom.
2. Component test for RiskChecker (form flow, URL param decoding).
3. Component test for CountrySearch (search, keyboard nav).
4. Expand data-integrity to assert timeline length/types for KZ, RU, PT,
   TR, UAE, IN, TW, NA, CN (mirror UK's "exactly 4 stories" pattern).

Files: src/__tests__/, package.json
Verify: npm test, CI green
Expected: Test Coverage 4→6
```

### Week 4 — Risk Matrix Credibility

```
Model: sonnet | Effort: low (writing) / dep on external expert

Context: V2 BLOCKER. Still unresolved after two audit cycles. Draft
outreach + add citation fields to risk-matrix.json schema so the data
structure is ready when citations land.

Tasks:
1. Extend RiskMatrix type with `citations?: Record<string, Source[]>`.
2. Draft expert outreach email (occupational health / industrial hygiene).
3. Update docs/RISK-LOGIC.md: add "methodology disclaimer" and "pending
   expert review" banner.
4. Move CSP from Report-Only to enforcing after auditing inline styles.

Files: src/lib/types.ts, src/data/risk-matrix.json, docs/RISK-LOGIC.md, next.config.ts
Verify: npm run build, manual CSP check
Expected: unblocks partnership / backlink outreach.
```

---

## SECTION 14: FINAL VERDICT

**Score: 8.3/10** (up from 7.9)

> "Phases 1B through 6B delivered real, measurable upgrades — 200 unique hero images, locale-aware OG and 404, UK Spanish SEO fixes, and 9 new research dossiers — but the score didn't reach the 8.5 target because a silent React 19 lint regression turned CI red and a third of country pages still ship English ban details to Spanish users."

### Target comparison

| Roadmap metric | V2 baseline | Target v3.0.0 | Actual v3.0.0 | Status |
|---|---|---|---|---|
| Countries with deep research | 7 files | 16+ | **16** | ✅ hit |
| Countries with timeline | 37 | ≥60 | **42** | ❌ short by 18 |
| Countries with unique hero image | 37 | 200 | **200** | ✅ hit |
| i18n bugs open | 5 LOW | 0 | **2 LOW + 1 MED** (root 404/OG + ban_details_es gap) | ⚠️ partial |
| 3D/2D mobile persistence | ❌ | ✅ | ✅ | ✅ hit |
| Global score | 7.9 | 8.5–9.0 | **8.3** | ⚠️ short |
| UK ES / China Search-Console rank | 71.5 / 10.65 | <20 / <7 | **not measurable locally** | ⬛ external |

### 3 risks that can kill this project

1. **Silent CI decay.** Lint has been red since (likely) the React 19 upgrade. If no one checks `npm run lint` locally, every PR inherits the failure state and the Lighthouse gate never runs. The next regression won't be caught.
2. **Uncited risk matrix** (unchanged from V2). Two audits, same answer. One expert reply would neutralize this permanently.
3. **Spanish-side data rot.** Spanish UX is worse than it looks: 158 country heroes display English `ban_details`, and the longer this persists, the more backlinks accumulate to pages that then need canonical rewrites.

### 3 opportunities that can make it succeed

1. **The research corpus is a moat.** 16 files totalling well over 300 KB of cited, cross-checked regulatory history is content nobody else has. Turn them into linkable assets (per-country PDFs, social quote cards).
2. **Unique hero images on 200 pages** — paired with `next/image` (one-hour fix), this is a real LCP + image-search win.
3. **`PRIORITY_DESCRIPTIONS` workflow** is now formalized (`**Used for:**` audit trail in each research file). It's a scalable SEO content pipeline — extending it from 24 → 50 countries is the highest ROI content work in the repo.

### The one thing that matters most right now

> **"Fix `npm run lint` before writing another feature."** The rest of the roadmap (Spanish parity, expert outreach, more research) is additive — but additive work on a red pipeline silently accumulates more regressions. Two hours of refactoring the 9 errors restores the safety net that makes every subsequent change lower-risk.

---

**Audit metadata**

- Performed: 2026-04-13 at `v2.20.0` (commit `98abd76`, master branch — clean)
- Auto-fixes: 4 issues across 5 files (0 new, 5 modified)
- Build verification: `type-check` ✅, `test` ✅ (81/81), `build` ✅ (424+ pages), `lint` ❌ (9 errors — pre-existing, flagged as Bug #1)
- Score trajectory: v1.7.3 = 7.0 → v2.0.0 = 7.9 → **v3.0.0 = 8.3**
- Next audit recommended: after Week-1 + Week-2 roadmap items land (target v3.5 / 9.0).
