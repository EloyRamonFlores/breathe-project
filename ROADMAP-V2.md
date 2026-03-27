# ROADMAP V2 — Post-Audit Action Plan

**Created**: 2026-03-25
**Baseline**: v1.12.0 (4-week audit roadmap complete)
**Estimated global score**: ~7.5-8.0/10
**Target**: 9.0/10 + expert validation + Historias de Resistencia live

---

## PHASE 1: Doc Cleanup (30 min)
**Version**: v1.13.0
**Why first**: Zero-effort wins. Remove noise before adding features.

### Actions

| # | Action | File | Reason |
|---|--------|------|--------|
| 1 | DELETE | `AUDIT-HOME-VERDICT.md` | Superseded by FULL-AUDIT.md |
| 2 | DELETE | `docs/AUDIT-VERDICT.md` | Superseded by FULL-AUDIT.md |
| 3 | DELETE | `TOXINFREE-CONTEXTO.md` | Overlaps with CLAUDE.md; outdated (references v1.2.0, "score 4/10 home UX") |
| 4 | DELETE | `SETUP-GUIDE.md` | README.md covers Quick Start; this was bootstrapping guide, project is past that stage |
| 5 | UPDATE | `docs/SEO.md` | Reflect that OG images, sitemap, robots.txt, hreflang are all implemented. Update checklist. Still references "BREATHE" instead of "ToxinFree" |
| 6 | UPDATE | `CLAUDE.md` | Bump version references, add note about Vitest, update project structure to match v1.12.0 reality |

### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: File deletions and doc updates, no reasoning needed

1. Delete these files:
   - AUDIT-HOME-VERDICT.md
   - docs/AUDIT-VERDICT.md
   - TOXINFREE-CONTEXTO.md
   - SETUP-GUIDE.md

2. Update docs/SEO.md:
   - Replace all instances of "BREATHE" with "ToxinFree"
   - In the Technical SEO Checklist, mark these as completed [x]:
     - Sitemap.xml auto-generated at build time
     - robots.txt allows all crawling
     - hreflang tags for all language variants
     - No JavaScript-only content (SSG ensures HTML-first)
     - Mobile-first responsive design
     - HTTPS (automatic with Vercel)
     - Internal linking between country pages and educational content
   - In the Open Graph Images section, add note: "Implemented via @vercel/og in v1.1.0 for country pages and home page"
   - In the Launch Checklist, mark "Submit sitemap to Google Search Console" as [x]

3. Update CLAUDE.md:
   - Change "Next.js 14+" to "Next.js 16"
   - Add "Testing: Vitest" to Tech Stack section
   - Add "CI/CD: GitHub Actions" to Tech Stack section
   - Update Project Structure to include: __tests__/, components/ui/ErrorBoundary.tsx, .github/workflows/
   - Add to Commands section: npm test (Vitest unit + data integrity tests)

4. Update CHANGELOG.md with v1.13.0 entry documenting the cleanup.

5. Run: npm run type-check && npm run build
```

### Verification
- [ ] 4 files deleted
- [ ] docs/SEO.md references "ToxinFree", checklist updated
- [ ] CLAUDE.md reflects v1.12.0 reality
- [ ] Build passes

---

## PHASE 2: XSS Tooltip Fix (20 min)
**Version**: v1.13.1
**Why now**: Security debt flagged in both audits. Quick fix, eliminates a risk before adding new features.

### Problem
`WorldMap.tsx:118-128` and `Globe3D.tsx:187-193` use template literals to build HTML for Leaflet/globe.gl tooltips. Data comes from static JSON (low risk today), but the pattern is unsafe if data sources ever become user-contributed.

### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: Standard sanitization pattern

Read WorldMap.tsx and Globe3D.tsx. Find all tooltip HTML that uses template literals with ${name}, ${statusLine}, etc.

Fix the XSS-adjacent pattern in both files:

Option A (preferred): Replace HTML tooltips with Leaflet's native text-only tooltips where possible.
Option B (if HTML formatting is needed): Install DOMPurify (npm install dompurify @types/dompurify) and sanitize all tooltip HTML before rendering.

Whichever approach you use:
- The tooltip must still show: country name, ban status (colored dot), ban year
- Visual appearance should not change
- TypeScript must pass strict check

Run: npm run type-check && npm test && npm run build
Update CHANGELOG.md with v1.13.1 entry.
```

### Verification
- [ ] No raw template literal HTML in tooltip code
- [ ] Tooltips still display correctly (country name + status + year)
- [ ] All tests pass
- [ ] Build passes

---

## PHASE 3: `/countries` Listing Page (2-3h)
**Version**: v1.14.0
**Why now**: Best effort/impact ratio of remaining features. Converts 200 disconnected country pages into a navigable experience. SEO win (hub page linking to all country pages). Fixes the "View All 195 →" dead link.

### Spec
- Route: `/[locale]/countries/page.tsx`
- Filterable by: region (dropdown), ban status (pills), search by name
- Search must work in both English and Spanish (requires `name_es` field — see Phase 4)
- Display: card grid or table, each country shows flag, name, ban status pill, ban year
- Click → navigates to `/country/[slug]`
- Sort by: name (default), ban year, region
- Mobile: stack to single column, sticky filter bar
- SEO: generateMetadata with title "Countries | Asbestos Ban Status by Country | ToxinFree"
- JSON-LD: ItemList schema
- i18n: all labels through next-intl
- Link from home page "View All" → `/countries`

### Claude Code Prompt
```
Model: opus | Thinking: high | Reason: New page with filtering logic, search, i18n, SEO, and data integration

Read CLAUDE.md, docs/DESIGN.md, src/data/countries.json (first 50 lines for schema), src/components/search/CountrySearch.tsx (for existing search patterns).

Build a new page at src/app/[locale]/countries/page.tsx:

1. Server component that reads countries.json and passes data to a client component
2. Create src/components/countries/CountryListPage.tsx ("use client"):
   - Filter bar at top:
     - Region dropdown (7 regions from countries.json: europe, asia, africa, americas, oceania, middle_east, caribbean)
     - Ban status pills: All, Banned, Partial, No Ban, Unknown
     - Search input (searches name field; name_es if locale is "es")
     - Sort: A-Z, Ban Year (newest first), Region
   - Results grid:
     - Card for each country: flag emoji (from iso2), name (localized), ban status pill (colored like the map), ban year if applicable
     - Click navigates to /country/[slug]
     - Show result count: "142 countries" / "142 países"
   - Empty state if no results match filters
   - Mobile: single column cards, sticky filter bar

3. SEO:
   - generateMetadata with unique title/description per locale
   - JSON-LD ItemList schema listing all 200 countries
   - Add to sitemap.ts

4. i18n: add all new keys to en.json and es.json:
   - countries.page_title, countries.page_description
   - countries.filter_region, countries.filter_status, countries.filter_all
   - countries.sort_name, countries.sort_ban_year, countries.sort_region
   - countries.results_count (with interpolation)
   - countries.no_results

5. Update the "View All" link on the home page to point to /countries instead of /learn

6. Add link to /countries in the Header navigation

Run: npm run type-check && npm test && npm run build
Update CHANGELOG.md with v1.14.0 entry.
```

### Verification
- [ ] `/en/countries` and `/es/countries` render
- [ ] Filters work: region, ban status, search
- [ ] Search works in Spanish on /es/ route
- [ ] Cards link to correct country pages
- [ ] Mobile responsive
- [ ] JSON-LD present in page source
- [ ] "View All" from home links to /countries
- [ ] Build generates 426+ static pages (424 + 2 new)

---

## PHASE 4: Spanish Country Name Search (30 min)
**Version**: v1.14.1
**Why**: /es/ users can't find "Alemania" if the search only matches "Germany". Small fix, big UX win for half the audience.

### Claude Code Prompt
```
Model: sonnet | Thinking: medium | Reason: Data transformation across 200 entries + search logic update

Read src/data/countries.json (look at existing fields per country).

1. Add a "name_es" field to every country in countries.json with the Spanish name.
   Use the official UN Spanish country names.
   Examples: "Germany" → "Alemania", "United States" → "Estados Unidos", "South Korea" → "Corea del Sur"

2. Update src/lib/types.ts — add name_es: string to the Country interface

3. Update src/components/search/CountrySearch.tsx:
   - When locale is "es", search against name_es in addition to name
   - Display name_es when locale is "es"

4. Update src/components/countries/CountryListPage.tsx (if it exists from Phase 3):
   - Use name_es for display and search when locale is "es"

5. Update src/__tests__/data-integrity.test.ts:
   - Add test: all 200 countries have non-empty name_es field

Run: npm run type-check && npm test && npm run build
Update CHANGELOG.md with v1.14.1 entry.
```

### Verification
- [ ] All 200 countries have name_es
- [ ] Searching "Alemania" on /es/ finds Germany
- [ ] Country cards show Spanish names on /es/
- [ ] Data integrity tests pass (new test included)
- [ ] Build passes

---

## PHASE 5: Historias de Resistencia — UI Component + UK (3-4h)
**Version**: v1.15.0
**Why**: This is the soul of ToxinFree. Converts country pages from data sheets into stories that connect emotionally. UK research already exists (44 sources). This phase builds the component and integrates the first story.

### Spec
- New section on country profile pages: "Stories of Resistance" / "Historias de Resistencia"
- Data source: `docs/research/[country]-research.md` → extracted into structured data in countries.json or a separate `stories.json`
- Each story card: activist name, role, quote (only if sourced), key achievement, photo placeholder, source link
- Timeline integration: activist milestones appear in the country timeline
- Design: editorial style, dark cards with amber accent borders, quote marks for sourced quotes
- i18n: full EN/ES

### Claude Code Prompt
```
Model: opus | Thinking: high | Reason: New feature architecture, data modeling, component design

Read docs/research/united-kingdom-research.md for the source material.
Read src/app/[locale]/country/[slug]/page.tsx for existing country page structure.
Read docs/DESIGN.md for visual direction.

1. Create a new data structure for activist stories. Add to countries.json under each country:
   "resistance_stories": [
     {
       "name": "Nellie Kershaw",
       "years": "1891-1924",
       "role": "First recognized asbestos death in the UK",
       "achievement": "Her death in 1924 led to the first medical recognition of asbestosis, though Turner & Newall denied responsibility",
       "achievement_es": "Su muerte en 1924 llevó al primer reconocimiento médico de la asbestosis...",
       "quote": null,
       "quote_source": null,
       "source_url": "https://..."
     },
     ...
   ]

   For UK, add these activists from the research doc (only facts that have source URLs):
   - Nellie Kershaw (1924 — first recognized death)
   - Nancy Tait (SPAID founder, 1978)
   - June Hancock (1993 landmark case against Cape plc)
   - Laurie Kazan-Allen (IBAS coordinator, 1999-present)

2. Create src/components/country/ResistanceStories.tsx ("use client"):
   - Section header: "Stories of Resistance" / "Historias de Resistencia" with fist/flame icon
   - Card layout: each activist gets a dark card with:
     - Name + years
     - Role line (one sentence)
     - Achievement paragraph
     - Sourced quote in blockquote style (only if quote exists and has source_url)
     - "Source" link at bottom
   - If no stories exist for a country, don't render the section
   - Responsive: 2 columns on desktop, 1 on mobile

3. Integrate into country/[slug]/page.tsx:
   - Add ResistanceStories section between the timeline and materials sections
   - Pass the resistance_stories array from country data

4. i18n: add keys:
   - country.resistance_title: "Stories of Resistance" / "Historias de Resistencia"
   - country.resistance_source: "Source" / "Fuente"
   - country.resistance_quote_unverified: (not used — we never show unverified quotes)

5. Update types.ts with ResistanceStory interface

Run: npm run type-check && npm test && npm run build
Update CHANGELOG.md with v1.15.0 entry.
```

### Verification
- [ ] UK country page shows 4 activist stories
- [ ] No fabricated quotes (only quotes with source_url render)
- [ ] Cards display correctly on mobile and desktop
- [ ] Other country pages (without stories) don't show empty section
- [ ] All tests pass
- [ ] Build passes

---

## PHASE 6: Deep Research — 6 Emblematic Countries (6-8h)
**Version**: v1.16.0
**Why**: These countries have the most powerful activist stories. They're the content that makes outreach to Laurie Kazan-Allen and IBAS worth doing.

### Countries and why
1. **Colombia** — Latin America's most public fight, Ana Cecilia Niño (Ban Asbestos Colombia)
2. **Italy** — Casale Monferrato, Eternit trial, Romana Blasotti Pavesi
3. **Brazil** — 2017 Supreme Court ban, ABREA, Fernanda Giannasi
4. **Australia** — Wittenoom, Bernie Banton, strongest ban enforcement
5. **South Africa** — Prieska/Kuruman mines, Cape plc litigation from UK
6. **France** — Jussieu University scandal, Andeva, 1997 ban

### Process per country
Use the country-research skill (`.skills/country-research/SKILL.md`) for each. Each produces:
- `docs/research/[country]-research.md` — full research document (44+ sources standard)
- Enriched `countries.json` entry — resistance_stories array
- Spanish translations for all story content

### Claude Code Prompt (run once per country, or batch 2-3)
```
Model: opus | Thinking: high | Reason: Investigative research requiring source verification

Read .skills/country-research/SKILL.md for the research methodology.
Read docs/research/united-kingdom-research.md as the quality standard.
Read src/data/countries.json — find the [COUNTRY] entry for current data.

Research [COUNTRY]'s asbestos history following the skill's 7-section template:
1. Regulatory Timeline (with legislation names, decree numbers, dates)
2. Key Activists and Organizations (names, roles, achievements — NO fabricated quotes)
3. Exposure Sources (industries, locations, scale)
4. Corporate Responsibility (companies, lawsuits, outcomes)
5. Mortality Data (mesothelioma rates, death counts, sources)
6. Current Status (enforcement, remaining risks, ongoing litigation)
7. Resources (organizations, hotlines, government contacts)

Then:
1. Save research to docs/research/[country]-research.md
2. Update the country's entry in countries.json:
   - Enrich timeline if new events found
   - Add resistance_stories array (2-5 activists per country)
   - Add event_es, achievement_es translations
   - Verify/correct ban_status and ban_year against IBAS
3. Run npm test to verify data integrity

Quality rules:
- Every fact needs a verifiable source URL
- NO fabricated quotes — mark quote as null if not found with source
- Use IBAS, WHO, PMC, government publications, court records only
- If data conflicts between sources, note the conflict in the research doc
```

### Verification per country
- [ ] Research doc has 30+ sources
- [ ] resistance_stories array has 2-5 entries
- [ ] No null source_urls in stories
- [ ] No fabricated quotes
- [ ] Spanish translations present
- [ ] npm test passes
- [ ] npm run build passes

---

## PHASE 7: Expert Validation Email (1h)
**Version**: N/A (not a code change)
**Why**: The audit's #1 blocker. The risk matrix numbers (0.45, 0.35, 0.20) have no scientific citation. One expert review converts ToxinFree from "some website" to "vetted tool."

### Targets (in order of priority)
1. **Laurie Kazan-Allen** — IBAS coordinator, UK-based, most connected person in global asbestos advocacy
2. **Dr. Jukka Takala** — former ILO SafeWork director, published on global asbestos mortality
3. **Dr. Arthur Frank** — Drexel University, environmental/occupational medicine
4. **ABREA (Brazil)** — Fernanda Giannasi's organization
5. **Any occupational hygienist** with asbestos exposure assessment experience

### What we need from them
- Review of `risk-matrix.json` weights and factors
- Confirmation that the scoring produces "reasonable" relative risk rankings
- Any obvious errors in country override factors
- Permission to cite: "Risk methodology reviewed by [name/org]"

### Email will be drafted in this session
I'll write the email in English (formal but warm), with:
- Who you are and what ToxinFree is (2 sentences)
- Link to live site
- Specific ask: review one JSON file (~50 lines)
- Time commitment: 15-30 minutes
- What they get: credit on methodology page, a tool that helps their cause

---

## PHASE 8: Lighthouse CI + SEO Doc Update (1h)
**Version**: v1.17.0

### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: CI config is templated

1. Add Lighthouse CI to the GitHub Actions workflow:
   - Install @lhci/cli
   - Add a "lighthouse" step after "build" in ci.yml
   - Configure .lighthouserc.js:
     - Test URLs: /en, /en/check, /en/country/united-states, /en/countries, /en/learn
     - Assert: performance >= 85, accessibility >= 90, best-practices >= 85, seo >= 90
   - Upload results as CI artifact

2. Verify: npm run build passes, CI config is valid YAML

Update CHANGELOG.md with v1.17.0 entry.
```

---

## PHASE 9: Re-Audit (1h)
**Version**: v2.0.0
**Why**: Full-circle. Run the same audit methodology against the final state to get an updated score and identify any remaining gaps before the next major push.

### Claude Code Prompt
```
Model: opus | Thinking: high | Reason: Comprehensive audit requires deep file reading and analysis

Read MASTER-AUDIT-PROMPT.md and follow its methodology exactly.
Audit the current state of the codebase.
Save results to docs/FULL-AUDIT-V2.md.
Compare scores against docs/FULL-AUDIT.md (v1.7.3 baseline).
```

### Expected score improvements
| Dimension | v1.7.3 | v1.12.0 (est.) | v2.0.0 (target) |
|-----------|--------|----------------|-----------------|
| Code Quality | 8 | 8 | 8 |
| TypeScript | 9 | 9 | 9 |
| Architecture | 7 | 7 | 8 |
| Error Handling | 5 | 7 | 7 |
| Performance | 7 | 7 | 7 |
| SEO | 8 | 8 | 9 |
| Accessibility | 7 | 8 | 8 |
| i18n | 9 | 9 | 9 |
| Data Quality | 4 | 5-6 | 7-8 |
| Mobile UX | 7 | 7 | 8 |
| Security | 6 | 7 | 8 |
| Test Coverage | 0 | 4 | 5 |
| Documentation | 7 | 7 | 8 |
| Scalability | 5 | 6 | 7 |
| **GLOBAL** | **7.0** | **~7.5** | **8.0-8.5** |

---

## EXECUTION ORDER

| Phase | Version | Est. Time | Dependencies |
|-------|---------|-----------|-------------|
| 1. Doc Cleanup | v1.13.0 | 30 min | None |
| 2. XSS Tooltip Fix | v1.13.1 | 20 min | None |
| 3. /countries Page | v1.14.0 | 2-3h | None |
| 4. Spanish Names | v1.14.1 | 30 min | Phase 3 |
| 5. Historias UI + UK | v1.15.0 | 3-4h | None |
| 6. Deep Research ×6 | v1.16.0 | 6-8h | Phase 5 |
| 7. Expert Email | — | 1h | Phase 5 or 6 |
| 8. Lighthouse CI | v1.17.0 | 1h | Phase 3 |
| 9. Re-Audit | v2.0.0 | 1h | All above |

**Total estimated**: ~16-20 hours of Claude Code work
**Total versions**: v1.13.0 → v2.0.0

---

*Created 2026-03-25. This roadmap supersedes the 4-week plan in FULL-AUDIT.md (Section 13), which is now 100% complete.*
