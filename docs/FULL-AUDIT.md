# ToxinFree — Full Technical Audit Report

**Date**: 2026-03-23
**Version audited**: v1.7.3 (commit 9780cf4)
**Auditor**: Claude Code (Opus 4.6) — evidence-based
**Method**: Direct file reading, every finding references file:line
**Auto-fixes applied**: 8 issues fixed during this audit
**Previous audit**: `docs/AUDIT-VERDICT.md` — v1.2.0, scored 6.5/10 (2026-03-17)

---

## EXECUTIVE SUMMARY

ToxinFree is a well-engineered Next.js 16 platform with strong TypeScript discipline, comprehensive i18n, and correct SSG architecture. Since the last audit (v1.2.0 → v1.7.3), the home page was transformed from static to interactive (+3.2 UX points), risk logic was rewritten (v2.1 weighted average), and Spanish country page translations were added. **8 issues were auto-fixed during this audit**: shared map constants, 12 hardcoded i18n strings, centralized JSON-LD dates, security headers, and a project README. The project scores **7.0/10** globally — up from 6.5. The two anchors remain: **zero test coverage** (0/10) and **data quality** (4/10, 185/200 countries are shells with no timeline data). The single most important next step: write unit tests for `calculateRisk()` and get one asbestos professional to validate the risk matrix.

---

## SECTION 1: PROJECT HEALTH DASHBOARD

| Dimension | Score | Key Evidence | Trend vs v1.2.0 |
|-----------|-------|-------------|------------------|
| Code Quality | 8/10 | TS strict, 0 console.log, 0 TODO, small focused components | ↑ from 7 |
| TypeScript Strictness | 9/10 | `strict: true` in tsconfig.json:8, 1 justified `any` at Globe3D.tsx:208 | ↑ from 8 |
| Architecture | 7/10 | SSG correct, calculator factory (calculators/index.ts:7), server/client split clean | → same |
| Error Handling | 5/10 | No Error Boundaries, Globe3D catches silently (Globe3D.tsx:201), no URL param validation | → same |
| Performance | 7/10 | Globe gated on mobile (Globe3DLoader.tsx), 820KB GeoJSON, Leaflet fallback | ↑ from 6 |
| SEO Implementation | 8/10 | Metadata + OG + hreflang + JSON-LD on all pages, sitemap covers 424+ routes | ↑ from 7 |
| Accessibility (WCAG) | 7/10 | Semantic HTML, ARIA combobox in search, keyboard nav. Aria-labels fixed this audit | ↑ from 5 |
| i18n Completeness | 9/10 | 380+ keys, perfect en/es parity, hardcoded strings fixed this audit | ↑ from 7 |
| Data Quality | 4/10 | 200 countries but 185 shells, risk multipliers uncited, 96% mesothelioma nulls | ↑ from 3 |
| Mobile UX | 7/10 | Responsive layout, globe skipped on mobile, ticker/bento responsive | ↑ from 6 |
| Security | 6/10 | All external links safe, no secrets in code, 6 headers added this audit. XSS pattern in tooltips | ↑ from 4 |
| Test Coverage | 0/10 | Zero tests of any kind. No unit, integration, or e2e | → same |
| Documentation | 7/10 | CLAUDE.md, CHANGELOG (detailed v1.1–v1.7.3), 8 docs/ files, README added this audit | ↑ from 6 |
| Scalability Readiness | 5/10 | Calculator factory ready, i18n ready for locales. No CI/CD, no API layer | → same |
| **GLOBAL** | **7.0/10** | | **↑ from 6.5** |

---

## SECTION 2: AUTO-FIXES APPLIED

| # | Issue | File(s) Changed | What Was Done |
|---|-------|----------------|---------------|
| 1 | FILL_COLORS duplicated in Globe3D + WorldMap with color mismatch | Globe3D.tsx, WorldMap.tsx, **new** `src/lib/map-constants.ts` | Extracted to shared module with `FILL_COLORS`, `FILL_COLORS_GLOBE`, `STATUS_DOTS` |
| 2 | Hardcoded i18n strings in CountrySearch (statusLabel, result count, clear button) | CountrySearch.tsx, en.json, es.json | Replaced with `useTranslations("ban_status")` + 3 new i18n keys per locale |
| 3 | 5 hardcoded English aria-labels in Footer | Footer.tsx, en.json, es.json | Added 5 `aria_*` keys to footer namespace, replaced hardcoded strings |
| 4 | Hardcoded English aria-label in Globe3D | Globe3D.tsx, en.json, es.json | Added `globe_aria_label` key, replaced hardcoded string |
| 5 | `datePublished: "2026-03-14"` hardcoded in 6 learn pages | 6 learn `page.tsx` files, constants.ts | Created `CONTENT_PUBLISHED_DATE` / `CONTENT_MODIFIED_DATE` constants |
| 6 | Sitemap `lastModified` hardcoded as `"2026-03-17"` | sitemap.ts:32 | Replaced with `new Date()` (build-time value, correct for SSG) |
| 7 | Zero security headers configured | next.config.ts | Added 6 headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control, HSTS |
| 8 | No README.md at project root | **new** README.md | Created ~90 line README with description, tech stack, quick start, structure, data sources |

**Total**: 8 fixes, 2 new files created, 13 files modified, 18 new i18n keys added.

Git-ready: all changes can be committed as `audit: auto-fix 8 issues found during full audit`

---

## SECTION 3: BUGS (break functionality)

| # | Severity | File:Line | Description | User Impact | Fix |
|---|----------|-----------|-------------|-------------|-----|
| 1 | LOW | WorldMap.tsx:118-128 | Tooltip HTML uses string interpolation with `${name}` without sanitization. Data comes from static JSON, so no current XSS risk, but pattern is unsafe if data source changes. | None currently. Potential XSS if data becomes user-contributed. | Use Leaflet native text tooltips, or sanitize with `DOMPurify` before rendering HTML. |
| 2 | LOW | Globe3D.tsx:187-193 | Same tooltip HTML pattern as WorldMap — `${name}` and `${statusLine}` interpolated into HTML string. | Same as above. | Same fix: sanitize or use safe rendering. |
| 3 | LOW | RiskChecker.tsx | URL params from query string (country slug, era, building type) are used to select values but not explicitly validated against allowed values before being passed to `calculateRisk()`. | If someone crafts a malicious URL, the calculator returns `undefined` era/building factors, producing NaN score. No crash, but misleading result. | Add validation: if `era` not in valid set, show error. |

No CRITICAL or HIGH severity bugs found.

---

## SECTION 4: CODE SMELLS

| # | File:Line | Issue | Why It Matters | Fix |
|---|-----------|-------|---------------|-----|
| 1 | Globe3D.tsx:7, WorldMap.tsx:9 | `worldGeoJSON` (820KB) imported separately in both components | Both are client-side, but Next.js module cache prevents double-loading. Still signals no shared data layer. | Low priority — module cache handles it. Could create `src/lib/map-data.ts` if a third consumer appears. |
| 2 | Globe3D.tsx:196 | `worldGeoJSON as unknown as GeoJSON.FeatureCollection` double cast | Silences a real type mismatch between JSON import and GeoJSON type. | Create a typed import helper or use `satisfies` pattern. |
| 3 | RiskResults.tsx | `getBanContextKey()` is business logic in a UI component | If another component needs the same logic, it'll be duplicated. | Move to `src/lib/utils.ts` if a second consumer appears. |
| 4 | RiskResults.tsx + calculator | `ERA_CONSTRUCTION_YEAR` mapping exists in both RiskResults and `getConstructionYearFromEra()` in the calculator | Same data, two locations. | Export from calculator, import in RiskResults. |

---

## SECTION 5: DATA INTEGRITY

### Counts (verified by reading JSON)
- **Total countries**: 200
- **full_ban**: 72 (matches IBAS count)
- **no_ban**: 16
- **unknown**: 112
- **partial_ban**: 0
- **de_facto_ban**: 0 (type defined but unused)
- **With timeline (non-empty)**: 15 countries
- **With mesothelioma_rate (non-null)**: 8 countries
- **With estimated_buildings_at_risk (non-null)**: 8 countries
- **Materials**: 20
- **GeoJSON**: 820KB (minified, 1 line)

### Consistency Checks
- [x] `noBanCount` in substances.ts:5-7 === dynamically computed from countries.json (16 no_ban + 112 unknown = 128)
- [x] All 15 priority countries have `priority: "high"`: united-states, india, china, russia, brazil, mexico, indonesia, united-kingdom, australia, japan, south-korea, germany, south-africa, canada, nigeria
- [x] All 15 priority countries have non-empty timeline arrays
- [x] Risk matrix weights sum to 1.0: country(0.45) + era(0.35) + building(0.20) = 1.00
- [x] All 18 country_overrides in risk-matrix.json exist in countries.json
- [x] Risk thresholds are non-overlapping: low [0, 0.29], moderate [0.30, 0.59], high [0.60, 0.79], critical [0.80, 1.0]
- [ ] Ban years match IBAS chronological list — **CANNOT FULLY VERIFY** without IBAS raw data. Spot-checked: Iceland 1983 ✓, UK 1999 ✓, Australia 2003 ✓, Brazil 2017 ✓

### Data Gaps
- **185/200 countries** have empty timeline arrays (92.5%)
- **192/200 countries** have null mesothelioma_rate (96%)
- **192/200 countries** have null estimated_buildings_at_risk (96%)
- **0 countries** use `de_facto_ban` or `partial_ban` status — these types exist in the schema but have no data
- **Risk matrix multipliers** (era factors, building factors, country factors) have no cited scientific source. They produce reasonable-looking output but are not evidence-based.
- **Spanish translations** for ban_details, common_materials, and timeline events only exist for the 15 priority countries. 185 countries show English data to Spanish users.

---

## SECTION 6: SEO AUDIT

### Per-page verification:

| Page Type | Count | Has Metadata | Has JSON-LD | In Sitemap | Has hreflang | Has OG |
|-----------|-------|-------------|------------|-----------|-------------|--------|
| Home | 2 (en/es) | ✅ | ✅ Organization | ✅ | ✅ | ✅ (dynamic OG image) |
| Risk Checker | 2 | ✅ | ✅ WebApplication | ✅ | ✅ | ✅ |
| Country pages | 400 (200×2) | ✅ | ✅ FAQPage | ✅ | ✅ | ✅ (dynamic OG image) |
| Learn hub | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/what-is-asbestos | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/where-it-hides | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/history | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/what-to-do | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/by-the-numbers | 2 | ✅ | ✅ Article | ✅ | ✅ | ✅ |
| Learn/methodology | 2 | ✅ | ❌ No JSON-LD | ✅ | ✅ | ✅ |

### Pages failing SEO checks:
1. **Learn/methodology** — Missing JSON-LD structured data. All other learn pages have Article schema. File: `src/app/[locale]/learn/methodology/page.tsx`
2. **185 non-priority country pages** — Use generic template metadata with minimal SEO value. No unique meta descriptions, no timeline content for Google to index.
3. **datePublished/dateModified** — Was hardcoded "2026-03-14" across all learn pages. **FIXED** in this audit (centralized to constants).
4. **sitemap lastModified for static routes** — Was hardcoded "2026-03-17". **FIXED** in this audit (now `new Date()`).

---

## SECTION 7: PERFORMANCE

- **Globe3D bundle**: ~487KB (gated behind `window.innerWidth >= 1024` — never loads on mobile)
- **Leaflet bundle**: ~40KB (always available as fallback)
- **Recharts bundle**: ~60KB (only on `/learn/by-the-numbers`)
- **GeoJSON file**: 820KB (loaded by both Globe3D and WorldMap)
- **Total client JS estimate**: ~600-700KB on desktop (globe + leaflet + recharts + react)
- **Mobile client JS**: ~200-300KB (no globe)
- **Unused dependencies found**: 0 — all package.json dependencies are imported
- **Console.logs in production**: 0
- **SSR vs Client component split**:
  - Server components: all page.tsx files, Footer.tsx
  - Client components: Globe3D, WorldMap, Globe3DLoader, MapLoader, RiskChecker, RiskResults, Header, CountrySearch, CountrySearchSection, CountryPreviewCard, BanTicker, StatRotator, RegionSummary, AnimatedCounter, ScrollReveal, ByTheNumbersCharts, Timeline
  - **Assessment**: Split is correct. `"use client"` only where interactivity requires it.

---

## SECTION 8: SECURITY

- [x] URL params not directly rendered as HTML in RiskChecker — used as select values
- [x] No XSS vectors via user input (search query is used as filter, not rendered as HTML)
- [x] External links have `noopener noreferrer` — all 9/9 `target="_blank"` links verified
- [x] No API keys in code — confirmed via grep
- [x] No sensitive data in client bundles — all data is public
- [x] `next.config.ts` security headers configured — **ADDED THIS AUDIT** (6 headers)
- [ ] **XSS-adjacent pattern in map tooltips** — WorldMap.tsx:118-128 and Globe3D.tsx:187-193 use string template literals to build HTML for tooltips. Data comes from static JSON (low risk), but the pattern is unsafe. Severity: LOW.
- [ ] **No Content Security Policy** — CSP not added because the site uses inline styles in tooltips, `dangerouslySetInnerHTML` for JSON-LD, external CDN resources (tile servers, globe textures), and Vercel analytics scripts. Adding CSP requires report-only testing first.
- [ ] **No rate limiting** — Not applicable for static site, but relevant if API routes are added.

---

## SECTION 9: i18n COMPLETENESS

- **en.json total keys**: ~380 (371 original + 9 added this audit)
- **es.json total keys**: ~380 (371 original + 9 added this audit)
- **Missing in es.json**: 0
- **Missing in en.json**: 0
- **Key parity**: ✅ PERFECT — 100% match between locales

### Hardcoded strings found and FIXED this audit:
| # | File:Line | String | Fix |
|---|-----------|--------|-----|
| 1 | CountrySearch.tsx:170 | `"Banned"` / `"Prohibido"` | Replaced with `tBan("full_ban")` |
| 2 | CountrySearch.tsx:172 | `"De facto ban"` / `"Prohibido de facto"` | Replaced with `tBan("de_facto_ban")` |
| 3 | CountrySearch.tsx:174 | `"Partial"` / `"Parcial"` | Replaced with `tBan("partial_ban")` |
| 4 | CountrySearch.tsx:176 | `"No ban"` / `"Sin prohibicion"` | Replaced with `tBan("no_ban")` |
| 5 | CountrySearch.tsx:178 | `"Unknown"` / `"Desconocido"` | Replaced with `tBan("unknown")` |
| 6 | CountrySearch.tsx:234 | `"Clear search"` | Replaced with `t("search_clear")` |
| 7 | CountrySearch.tsx:255-256 | `"result"` / `"resultado"` | Replaced with i18n `search_result_count_*` keys |
| 8 | Footer.tsx:107 | `"IBAS — International..."` | Replaced with `t("aria_ibas")` |
| 9 | Footer.tsx:121 | `"EPA — U.S. Environmental..."` | Replaced with `t("aria_epa")` |
| 10 | Footer.tsx:135 | `"WHO — World Health..."` | Replaced with `t("aria_who")` |
| 11 | Footer.tsx:173 | `"GitHub (opens in new tab)"` | Replaced with `t("aria_github")` |
| 12 | Footer.tsx:216 | `"Koku (opens in new tab)"` | Replaced with `t("aria_koku")` |
| 13 | Globe3D.tsx:331 | `"Interactive 3D globe..."` | Replaced with `t("globe_aria_label")` |

- **Language toggle works on all routes**: Yes — next-intl middleware handles `/en/*` ↔ `/es/*` routing.

---

## SECTION 10: DOCUMENTATION AUDIT

| File | Status | Action | Reason |
|------|--------|--------|--------|
| CLAUDE.md | ✅ | KEEP | Essential project rules, accurate for v1.7.3 |
| CHANGELOG.md | ✅ | KEEP + UPDATE | Comprehensive v1.1→v1.7.3. Add v1.8.0 audit entry |
| CONTRIBUTING.md | ✅ | KEEP | Complete contributor guide with data standards |
| README.md | ✅ | KEEP (NEW) | Created this audit — GitHub-facing project overview |
| SETUP-GUIDE.md | ⚠️ | MERGE → README.md | Overlaps with README Quick Start section. Keep only if README is insufficient |
| MASTER-AUDIT-PROMPT.md | ✅ | KEEP | Reusable audit methodology — needed for future audits |
| AUDIT-HOME-UX-CLAUDE-CODE.md | ⚠️ | DELETE or ARCHIVE | Superseded by AUDIT-HOME-VERDICT.md and this audit |
| AUDIT-HOME-VERDICT.md | ⚠️ | ARCHIVE | Home UX specific, superseded by this comprehensive audit |
| INNOVACION-SUGERENCIAS.md | ⚠️ | DELETE | All 5 ideas implemented in v1.7.0, no longer actionable |
| TOXINFREE-CONTEXTO.md | ⚠️ | MERGE → CLAUDE.md or DELETE | Spanish project context — useful info but overlaps with CLAUDE.md |
| docs/AUDIT-VERDICT.md | ⚠️ | ARCHIVE | v1.2.0 audit, superseded by this FULL-AUDIT.md |
| docs/DATA.md | ✅ | KEEP | Data schema and source documentation |
| docs/DESIGN.md | ✅ | KEEP | Design system reference |
| docs/RISK-LOGIC.md | ✅ | KEEP | Risk algorithm documentation, matches v2.1 code |
| docs/SCALING.md | ✅ | KEEP | Multi-substance expansion guide |
| docs/SCOPE-FULL.md | ✅ | KEEP | Long-term product vision |
| docs/SCOPE-V1.md | ✅ | KEEP | V1 scope definition, still relevant as baseline |
| docs/SEO.md | ⚠️ | UPDATE | Spec mentions OG images as todo — they exist since v1.1.0 |
| docs/research/united-kingdom-research.md | ✅ | KEEP | Deep research artifact, reusable pattern |

### Redundancies Found:
- `SETUP-GUIDE.md` duplicates Quick Start content now in `README.md`
- `TOXINFREE-CONTEXTO.md` duplicates project overview in `CLAUDE.md`
- `AUDIT-HOME-UX-CLAUDE-CODE.md` fully superseded by `AUDIT-HOME-VERDICT.md`
- `docs/AUDIT-VERDICT.md` superseded by this `docs/FULL-AUDIT.md`

### Proposed Final Structure:
```
proyecto/
├── CLAUDE.md              — Coding rules + project context (contributors)
├── CHANGELOG.md           — Version-by-version build log
├── CONTRIBUTING.md         — How to contribute data, translations, code
├── README.md              — Public-facing project overview (GitHub)
├── MASTER-AUDIT-PROMPT.md — Reusable audit methodology
├── docs/
│   ├── FULL-AUDIT.md      — This document (current state of truth)
│   ├── DATA.md            — Data schema and source documentation
│   ├── DESIGN.md          — Design system reference
│   ├── RISK-LOGIC.md      — Risk algorithm v2.1 documentation
│   ├── SCALING.md         — Multi-substance expansion guide
│   ├── SCOPE-FULL.md      — Long-term product vision
│   ├── SCOPE-V1.md        — V1 scope baseline
│   ├── SEO.md             — SEO strategy (needs update)
│   └── research/          — Per-country deep research
```

### Cleanup Actions:
```
Step 1 — DELETE: INNOVACION-SUGERENCIAS.md — all 5 ideas implemented, no longer actionable
Step 2 — DELETE: AUDIT-HOME-UX-CLAUDE-CODE.md — fully superseded
Step 3 — ARCHIVE: AUDIT-HOME-VERDICT.md — move to docs/archive/ or delete
Step 4 — ARCHIVE: docs/AUDIT-VERDICT.md — superseded by FULL-AUDIT.md
Step 5 — MERGE: TOXINFREE-CONTEXTO.md → relevant bits into CLAUDE.md, then delete
Step 6 — MERGE: SETUP-GUIDE.md → verify README covers it, then delete
Step 7 — UPDATE: docs/SEO.md — reflect OG images are implemented, update checklist
```

---

## SECTION 11: TECHNICAL DEBT INVENTORY

| # | Item | Severity | File(s) | Est. Fix Time | Impact If Ignored | Sprint |
|---|------|----------|---------|--------------|-------------------|--------|
| 1 | Zero test coverage for risk calculator | CRITICAL | new `__tests__/` | 2-3h | Regression in health-adjacent output goes undetected | Week 1 |
| 2 | No CI/CD pipeline | HIGH | new `.github/workflows/ci.yml` | 1h | "Works on my machine" is the only quality gate | Week 2 |
| 3 | No React Error Boundaries | HIGH | new ErrorBoundary component + page `error.tsx` files | 1h | Unhandled error crashes entire page instead of graceful fallback | Week 4 |
| 4 | 185 shell country pages | HIGH | countries.json | 10-20h | SEO thin content penalty, user trust erosion | Week 3+ |
| 5 | Risk matrix has no scientific citations | HIGH | risk-matrix.json, RISK-LOGIC.md | 4-8h (expert review) | Pseudo-scientific output presented as authoritative | Week 3 |
| 6 | XSS-adjacent tooltip pattern | MEDIUM | WorldMap.tsx, Globe3D.tsx | 30m | Low risk (static data), but bad pattern for future | Week 4 |
| 7 | No CSP header | MEDIUM | next.config.ts | 2h (with testing) | Missing defense-in-depth for XSS | Week 2 |
| 8 | Learn/methodology missing JSON-LD | LOW | methodology/page.tsx | 15m | One page without structured data | Week 1 |
| 9 | `de_facto_ban` type unused | LOW | types.ts, countries.json | 10m | Dead code / type definition | Week 4 |
| 10 | `ERA_CONSTRUCTION_YEAR` duplicated | LOW | RiskResults.tsx, calculator | 15m | Maintenance risk | Week 4 |
| 11 | Documentation redundancy (5 files) | LOW | various .md files | 30m | Confuses new contributors | Week 1 |

---

## SECTION 12: WHAT'S MISSING (by impact)

### BLOCKER (before seeking backlinks or institutional partnerships)
- [ ] **Unit tests for `calculateRisk()`** — A health-adjacent tool with zero tests is a liability. Minimum: 12 test cases from RISK-LOGIC.md + edge cases (unknown country, post-ban construction, NaN inputs).
- [ ] **Expert validation of risk matrix** — The numbers in risk-matrix.json need sign-off from an occupational health professional or environmental engineer. One letter from one expert changes this from "some website" to "vetted tool."

### HIGH (next 30 days)
- [ ] **CI/CD pipeline** — GitHub Actions: `npm run type-check`, `npm run lint`, `npm run build`, `npm test` on every PR
- [ ] **CSP header in report-only mode** — `Content-Security-Policy-Report-Only` to identify issues before enforcement
- [ ] **Error boundaries** — `error.tsx` files for `/check`, `/country/[slug]`, `/learn/*`
- [ ] **Fill 20 more country profiles** — Pakistan, Vietnam, Bangladesh, Philippines, Egypt, Thailand, Turkey, Iran, Colombia, Argentina, Algeria, Morocco, Peru, Ukraine, Malaysia, Myanmar, Sri Lanka, Chile, Venezuela, Kenya

### MEDIUM (next 90 days)
- [ ] **Spanish country name search** — CountrySearch only matches English `name` field. Add `name_es` to countries.json for search in Spanish.
- [ ] **`/countries` listing page** — Filterable list of all 200 countries. "View All 195 →" link in Most Viewed currently points to `/learn`.
- [ ] **Email capture** — Newsletter or update subscription for data freshness notifications
- [ ] **Skip-to-content link** — Missing WCAG 2.1 bypass block (success criterion 2.4.1)
- [ ] **Focus-visible styles** — Some interactive elements (popular chips in CountrySearchSection) lack visible focus indicators
- [ ] **Lighthouse CI** — Add to CI pipeline, enforce score thresholds

### LOW (nice to have)
- [ ] **Compare two countries** — Idea #3 from innovation suggestions, deferred from v1.7.0
- [ ] **Analytics events** — Track risk checker completions, country profile views, search queries
- [ ] **Data freshness pipeline** — Automated check against IBAS quarterly updates
- [ ] **PWA support** — Service worker for offline access in low-connectivity regions
- [ ] **Additional locales** — Portuguese, French, Arabic would cover significant at-risk populations

---

## SECTION 13: ACTIONABLE ROADMAP

### Week 1: Testing Foundation + Quick Wins

**Claude Code Config:**
- Model: `sonnet` — REASON: Test generation is pattern-based, doesn't need deep reasoning
- Effort: `high` — REASON: Need comprehensive test cases
- Context to read first: `docs/RISK-LOGIC.md`, `src/lib/calculators/asbestos-risk-calculator.ts`, `src/data/risk-matrix.json`
- Pre-requisite: Read CHANGELOG.md section v1.5.0 (risk logic v2.1)

**Prompt (copy-paste ready):**
```
Read docs/RISK-LOGIC.md and src/lib/calculators/asbestos-risk-calculator.ts.

1. Set up Vitest: npm install -D vitest, add "test": "vitest run" to package.json scripts, create vitest.config.ts.

2. Create src/__tests__/asbestos-risk-calculator.test.ts with these test cases:
   - Germany 1985 apartment (post-ban) → MODERATE (~0.37)
   - India 1970 residential (no ban) → CRITICAL (~0.94)
   - UK 1975 school (post-ban) → should be HIGH
   - US 2010 office (post-ban 2024, but constructed before ban) → MODERATE/HIGH
   - Australia 2010 residential (post-ban 2003) → LOW
   - Japan 1965 factory → CRITICAL
   - Unknown country, unknown era → should not crash
   - Score is always between 0 and 1
   - scoreToLevel thresholds: 0.29→low, 0.30→moderate, 0.60→high, 0.80→critical
   - All 18 country overrides produce valid factors
   - Material matching: 1970 residential global → returns materials
   - Material matching: 2020 residential → returns few/no materials

3. Create src/__tests__/data-integrity.test.ts:
   - countries.json has exactly 200 entries
   - All entries have required fields (slug, name, iso2, iso3, ban_status)
   - Ban status is always one of the valid enum values
   - 15 priority:high countries exist and have timelines
   - materials.json has 20 entries with valid risk levels
   - risk-matrix.json weights sum to 1.0

4. Add learn/methodology JSON-LD Article schema (same pattern as other learn pages).

5. Run all tests, ensure they pass.
```

**Files that will be modified:**
- `package.json` — add vitest devDependency + test script
- **new** `vitest.config.ts`
- **new** `src/__tests__/asbestos-risk-calculator.test.ts`
- **new** `src/__tests__/data-integrity.test.ts`
- `src/app/[locale]/learn/methodology/page.tsx` — add JSON-LD

**After completion, update:**
- CHANGELOG.md → add entry v1.9.0

**Verification:**
- [ ] `npm test` passes (all test cases green)
- [ ] `npm run build` still passes (0 errors)
- [ ] methodology page has JSON-LD in page source

**Expected result:**
- Risk calculator has 12+ unit tests covering documented cases
- Data integrity is automatically verified
- Test Coverage dimension goes from 0/10 to 4/10

---

### Week 2: CI/CD + Security Hardening

**Claude Code Config:**
- Model: `sonnet` — REASON: CI config is templated, CSP needs careful enumeration
- Effort: `medium`
- Context to read first: `next.config.ts`, `package.json`, `.github/`

**Prompt (copy-paste ready):**
```
1. Create .github/workflows/ci.yml:
   - Trigger on: push to master, pull_request to master
   - Steps: checkout, setup Node 20, npm ci, npm run type-check, npm run lint, npm run test, npm run build
   - Fail fast on any step

2. Add Content-Security-Policy-Report-Only header to next.config.ts:
   - Allow: self, inline styles (for map tooltips), inline scripts (for JSON-LD)
   - Allow external: *.basemaps.cartocdn.com (Leaflet tiles), cdn.jsdelivr.net (globe texture), va.vercel-scripts.com (analytics), vitals.vercel-insights.com (speed insights)
   - Allow: blob: (globe.gl WebGL), data: (base64 images)
   - Report-Only mode first — do NOT enforce yet

3. Create .github/pull_request_template.md with sections: Description, Changes, Testing, Checklist

4. Verify: push a test branch, confirm CI runs and passes
```

**Files that will be modified:**
- **new** `.github/workflows/ci.yml`
- **new** `.github/pull_request_template.md`
- `next.config.ts` — add CSP-Report-Only header

**After completion, update:**
- CHANGELOG.md → add entry v1.10.0

**Verification:**
- [ ] CI workflow runs on push
- [ ] All CI steps pass (type-check, lint, test, build)
- [ ] CSP-Report-Only header present in response headers (check via browser DevTools)
- [ ] No CSP violations in console for main pages

**Expected result:**
- Every PR is automatically validated
- Security posture improved with CSP monitoring

---

### Week 3: Data Quality Sprint

**Claude Code Config:**
- Model: `opus` — REASON: Research-intensive, needs reasoning about regulatory data
- Effort: `high`
- Context to read first: `src/data/countries.json` (schema of priority countries), `docs/DATA.md`, `docs/research/united-kingdom-research.md` (template)
- Pre-requisite: Identify 20 target countries

**Prompt (copy-paste ready):**
```
Read the UK entry in countries.json as the quality standard, and docs/research/united-kingdom-research.md for research depth.

Add detailed data for these 20 countries (next priority tier):
Pakistan, Vietnam, Bangladesh, Philippines, Egypt, Thailand, Turkey, Iran, Colombia, Argentina, Algeria, Morocco, Peru, Ukraine, Malaysia, Myanmar, Sri Lanka, Chile, Venezuela, Kenya

For each country:
1. Verify and correct ban_status against IBAS current list
2. Add 3-8 timeline events with dates, event descriptions, and source URLs
3. Add ban_details with specific legislation names and years
4. Add common_materials relevant to the country's construction era
5. Add mesothelioma_rate if data exists (WHO, national cancer registries)
6. Add estimated_buildings_at_risk if data exists
7. Add ban_details_es, common_materials_es, and event_es for all timeline entries
8. Update sources array with all references used

Quality rules:
- Every fact needs a verifiable source URL
- Use official government publications, WHO, IBAS, academic papers only
- Mark uncertain data with qualifiers
- If no reliable mesothelioma data exists, leave null (do NOT estimate)

After data changes, run npm test to verify data integrity tests still pass.
```

**Files that will be modified:**
- `src/data/countries.json` — 20 country entries enriched

**After completion, update:**
- CHANGELOG.md → add entry v1.11.0

**Verification:**
- [ ] `npm test` passes (data integrity checks)
- [ ] `npm run build` passes
- [ ] 35 countries now have non-empty timelines (up from 15)
- [ ] Spanish translations present for all 20 new countries

**Expected result:**
- Data Quality score improves from 4/10 to 5-6/10
- 35 countries with real content (17.5% → critical mass for credibility)

---

### Week 4: Error Handling + Polish

**Claude Code Config:**
- Model: `sonnet` — REASON: Error boundaries are standard patterns
- Effort: `medium`
- Context to read first: `src/app/[locale]/layout.tsx`, `src/components/checker/RiskChecker.tsx`

**Prompt (copy-paste ready):**
```
1. Create src/components/ui/ErrorBoundary.tsx:
   - Class component wrapping children
   - On error: show user-friendly message with "Try refreshing" CTA
   - Log error to console in development only
   - Use i18n for error message text

2. Add error.tsx files to:
   - src/app/[locale]/check/error.tsx
   - src/app/[locale]/country/[slug]/error.tsx
   - src/app/[locale]/learn/error.tsx
   Each should show a styled error page matching the dark theme, with link back to home.

3. Add input validation to RiskChecker.tsx:
   - Validate that selected country slug exists in countries.json
   - Validate that era is one of the 5 valid values
   - Validate that buildingType is one of the 5 valid values
   - If invalid, show clear error message instead of submitting to calculator

4. Add skip-to-content link in src/app/[locale]/layout.tsx:
   - Visually hidden, appears on Tab focus
   - Links to #main-content
   - Add id="main-content" to the <main> tag

5. Add focus-visible styles to popular search chips in CountrySearchSection.tsx

6. Delete documentation files per cleanup actions:
   - INNOVACION-SUGERENCIAS.md
   - AUDIT-HOME-UX-CLAUDE-CODE.md

7. Run full verification: npm run type-check && npm run lint && npm test && npm run build
```

**Files that will be modified:**
- **new** `src/components/ui/ErrorBoundary.tsx`
- **new** `src/app/[locale]/check/error.tsx`
- **new** `src/app/[locale]/country/[slug]/error.tsx`
- **new** `src/app/[locale]/learn/error.tsx`
- `src/components/checker/RiskChecker.tsx` — input validation
- `src/app/[locale]/layout.tsx` — skip-to-content link + main id
- `src/components/home/CountrySearchSection.tsx` — focus styles
- `src/messages/en.json` — error messages
- `src/messages/es.json` — error messages

**After completion, update:**
- CHANGELOG.md → add entry v1.12.0

**Verification:**
- [ ] Error boundaries catch simulated errors
- [ ] Skip-to-content link visible on Tab, navigates to main
- [ ] Invalid URL params show error instead of broken result
- [ ] All tests pass
- [ ] Build succeeds

**Expected result:**
- Error Handling score improves from 5/10 to 7/10
- Accessibility score improves from 7/10 to 8/10

---

## SECTION 14: FINAL VERDICT

### Score: 7.0/10

### One sentence:
> "ToxinFree is a well-engineered platform with strong code quality and comprehensive i18n, held back by zero test coverage and shell data for 92% of its country pages — fix those two things and this becomes a credible public health tool."

### 3 risks that can kill this project:
1. **Zero test coverage** — A single regression in `calculateRisk()` could tell someone in India their 1970 factory is "Low Risk." For a health-adjacent tool, untested output is negligent. One bad result shared on social media could destroy credibility permanently.
2. **Pseudo-scientific risk matrix** — The era/building/country multipliers produce precise numbers from arbitrary inputs. If a journalist, academic, or regulator asks "where did 0.45 come from?", there is no answer. This is the difference between "awareness tool" and "misinformation."
3. **185 shell country pages** — Google indexes thin content poorly. A user landing from search on `/country/nigeria` finds a flag and a CTA — not the regulatory context they searched for. This erodes trust and SEO simultaneously.

### 3 opportunities that can make it succeed:
1. **SEO long-tail is correct** — "Is asbestos banned in [country]" queries have low competition and high intent. With 200 country pages and good structured data, ToxinFree can own this niche. The technical foundation is solid.
2. **Design creates credibility** — The dark theme, data-forward presentation, Globe3D visualization, and editorial BanTicker communicate "serious tool" not "nonprofit blog." This is a genuine competitive advantage.
3. **Risk Checker is genuinely useful** — The 3-step flow (country → era → building) is intuitive and the results page with matched materials is actionable. If validated by an expert, this becomes shareable and linkable — the core growth driver.

### The one thing that matters most right now:
**Write 12 unit tests for `calculateRisk()` and email one asbestos professional asking them to review the risk matrix.** Everything else — CI/CD, more countries, CSP headers — is optimization. Tests and expert validation are the foundation that makes everything else credible.

---

*This audit was performed on 2026-03-23 at version v1.7.3.
Auto-fixes applied: 8 issues.
Next audit recommended: After Week 4 roadmap completion, or at v2.0.0, whichever comes first.*
