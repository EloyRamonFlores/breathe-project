# AUDIT-VERDICT.md — ToxinFree Independent Code & Product Audit

**Auditor**: Senior technical review (AI-assisted, evidence-based)
**Date**: 2026-03-17
**Scope**: Full codebase audit post v1.2.0 — no assumptions, no flattery
**Method**: Direct file reading of all critical paths: page.tsx, RiskChecker.tsx, RiskResults.tsx, WorldMap.tsx, Globe3D.tsx, Globe3DLoader.tsx, MapLoader.tsx, countries.json, materials.json, risk-matrix.json, substances.ts, all learn pages, all country page logic, sitemap.ts, types.ts, calculators/, i18n files.

---

## 1. ESTADO ACTUAL DEL CÓDIGO

### Calidad general: **7/10**

The code is substantially better than the average side project. TypeScript is enforced strictly, components are small and focused, and the SSG pattern is correctly applied throughout. The conventions in CLAUDE.md are largely followed. This is the work of someone who has written production code before.

**What's genuinely good:**
- TypeScript strict mode with near-zero `any` usage. The one exception (`(GlobeLib as any)`) is necessary due to the globe.gl library's untyped API and is correctly annotated.
- Server/client component separation is correct and intentional. `"use client"` only appears where interactivity requires it.
- The risk calculator is cleanly separated from the UI — `calculateRisk()` is a pure function with no side effects.
- ESLint + tsc are both enforced as build gates. This is non-negotiable and it's there.
- The `next-intl` integration is done correctly — all user-facing strings externalized, proper async translations on server components.

**What's actually wrong, line by line:**

1. **`FILL_COLORS` duplicated.** Defined identically in `Globe3D.tsx` and `WorldMap.tsx`. When someone adds a `de_facto_ban` color variant, they'll update one and forget the other. Classic single-source-of-truth violation hiding in plain sight.

2. **`MapLoader.tsx` hardcodes English.** Line: `"Loading global map..."`. The entire CLAUDE.md rule says "All user-facing text must go through i18n (never hardcode strings in components)." This file violates it. Spanish users see English loading text.

3. **`output: "standalone"` in next.config.ts.** This directive is for Docker/self-hosted Node.js deployments. Vercel's build system ignores it and uses its own output format. It's not breaking anything — Vercel silently ignores it — but it signals confusion about the deployment target and will confuse any future collaborator.

4. **`worldGeoJSON` imported separately in Globe3D.tsx and WorldMap.tsx.** Both files do `import worldGeoJSON from "@/data/geo/world.json"`. Since Next.js bundles each module separately, Node will likely cache this, but it's redundant and signals that no shared data layer was planned for the map components.

5. **`worldGeoJSON as unknown as GeoJSON.FeatureCollection` double cast.** When you need `as unknown as T`, it means the actual type and the target type are incompatible in a way TypeScript can detect. This is a legitimate type mismatch being silenced. Minor, but it's technical debt that could surface as a runtime bug if the GeoJSON structure changes.

6. **`/learn/methodology` is not in `sitemap.ts`.** A new page was added in v1.2.0 but the sitemap was not updated. Google will eventually find it via crawl, but it won't be prioritized. For an SEO-first product this is an embarrassing oversight.

7. **Article JSON-LD uses `datePublished: "2026-03-14"` hardcoded** across learn pages. Not dynamic. Every page shows the same publish date regardless of when it was last actually updated. Structured data should reflect reality.

8. **`noBanCount: 128` in `substances.ts` is hardcoded**, not computed from `countries.json`. The actual count of countries without a ban in the JSON file may drift from this number as data is updated. These two sources of truth will diverge silently.

### Arquitectura: **7/10**

The SSG + static JSON approach is the right call for v1. It's fast, free to host, and survives traffic spikes. The calculator factory pattern added in v1.2.0 is forward-thinking.

What's weak: no tests of any kind. Zero. Not a single unit test for `calculateRisk()`, which is the core value proposition of the product. If someone changes a threshold in `risk-matrix.json`, nothing will catch a regression. For a health-adjacent product where wrong output could cause real panic or complacency, this is not optional — it's negligence.

No CI/CD pipeline. Deploys are manual. No automated check that `npm run build` passes before merging. No Lighthouse CI. No type-check on PR. Effectively: "it works on my machine" is the quality gate.

### TypeScript: **8/10**

Strong. Strict mode enforced. Interfaces are well-defined in `types.ts`. The `RiskLevel`, `Era`, `BuildingType` union types are used correctly throughout. The only real complaints are the `as unknown as` cast and the eslint-disable on globe.gl — both documented and justified.

### Separación de concerns: **7/10**

Good overall. The calculator is a pure function. The types are centralized. The i18n is properly abstracted.

But: `getBanContextKey()` in `RiskResults.tsx` is business logic living in a UI component. The `ERA_CONSTRUCTION_YEAR` map is defined twice — once in `RiskResults.tsx` and once in the calculator as `getConstructionYearFromEra()`. That's the same data in two places.

### Manejo de errores: **5/10**

The Globe3D component catches import failures silently and shows nothing. There are no React Error Boundaries anywhere. If the `countries.json` import fails (hypothetically), the app crashes without a user-facing error. The `calculateRisk()` function doesn't validate its inputs — passing an invalid `era` string would produce `undefined` behavior since TypeScript types are erased at runtime. For server-side data, this is fine. For URL parameters (which are user-controlled), it's a gap: `?era=injected` is not sanitized in `RiskChecker.tsx`.

---

## 2. ESTADO DEL PRODUCTO

### ¿Resuelve un problema real? **9/10**

Yes. Asbestos kills approximately 255,000 people annually. The information that "buildings from 1960-1980 in countries with no ban are high risk" is genuinely hard to find in one place. The risk checker fills a real gap in public health information accessibility. The problem is not in question.

### ¿La UX es intuitiva? **7/10**

The risk checker 3-step flow is clean and well-designed. Country search with autocomplete works correctly. The results card is readable. The new awareness callout (v1.2.0) appropriately sets expectations.

What breaks the illusion:

The "Find a certified inspector" CTA added in v1.2.0 links to the country profile page. The country profile page has NO inspector listings. Not one. This is a broken promise at the most critical moment in the user journey — when they're scared and need to act. You tell them where to find help and then send them to an empty page. This is worse than not having the CTA at all, because it's a trust violation.

The educational content (learn pages) is good. The `what-to-do` page is particularly useful. The `by-the-numbers` page is visually impressive.

185 country pages for non-priority countries are functionally empty: no timeline, no mesothelioma rate, no buildings-at-risk stat. They have a flag, a ban status pill, and a CTA to the risk checker. A user landing from Google on the Nigeria page looking for regulatory context gets nothing. This is the majority of the site by page count.

### ¿Los datos son confiables? **3/10**

This is the most uncomfortable section of this audit. The product's entire credibility rests on data quality, and the data has serious problems:

**Problem 1: 185 out of 200 countries are shells.**
Only 15 countries have real timeline data. The other 185 have a ban status (which may be correct) and nothing else. The `estimated_buildings_at_risk` for most countries is an AI-generated estimate with no source. The `mesothelioma_rate` for most countries is null — shown as "Data not available." These pages exist primarily to generate SEO routes, not to inform users.

**Problem 2: The risk multipliers have no scientific basis.**
The risk matrix assigns:
- India (no ban, 1960-1980 construction, factory): `0.9 × 1.0 × 1.2 = 1.08 → capped at 1.0 → "Very High"`
- US (full ban 2024, 1960-1980, residential): `0.9 × 1.0 × 1.0 = 0.9 → "Very High"`

Wait — why is the US at 0.9? Because the construction was in 1970, before the 2024 ban. So the country factor becomes `no_ban_at_construction = 0.9`. Fine. But why is the era factor for 1960-1980 exactly `1.0`? Why is a factory exactly `1.2x` more dangerous than a house? Who decided `0.8` is the critical threshold and not `0.75` or `0.85`?

Answer: nobody did. These numbers were chosen arbitrarily during data curation. There is no EPA study, no WHO report, no academic paper cited for any of these multipliers. The risk score is a mathematical formula producing precise-seeming output from completely made-up inputs. The disclaimer added in v1.2.0 helps, but it doesn't fix the underlying problem: the quantitative output is pseudo-scientific.

**Problem 3: Data freshness has no mechanism.**
IBAS updates quarterly. Without an automated pipeline, this data will be stale in 6 months. The methodology page now honestly discloses the last reference date (Feb 2026) — which is good. But the decay is baked in.

### ¿El diseño es profesional? **8/10**

Yes. The dark theme, typography pairing (DM Sans + JetBrains Mono), color system, and editorial layout are genuinely well-executed. The globe with animated trade arcs is visually striking. The risk results card is clean. The brand identity (Toxin/Free split) is distinctive.

The design is probably the strongest asset of the product. It communicates credibility and seriousness better than any copy on the page.

### ¿Funciona en mobile? **6/10**

The layout is responsive. The risk checker works on mobile. The Leaflet map fallback is functional.

The 3D globe experience on mobile is problematic: it's loaded even on capable mobile devices (WebGL passes on modern phones with 4GB+ RAM and good connections). Rotating a 3D globe with a finger on a phone while also reading content is awkward. The globe was designed for a desktop split-screen layout and doesn't translate well to a stacked mobile view.

The Recharts "by the numbers" page has a known SSR sizing issue (the `width(-1) height(-1)` warnings in the build log). On mobile, charts may not render correctly until JavaScript hydrates — users on slow connections see empty chart containers.

---

## 3. POTENCIAL DE IMPACTO

### ¿Puede generar tráfico orgánico real? **7/10**

The strategy is correct: 200 pages targeting "is asbestos banned in [country]" is a legitimate long-tail SEO play. The keyword intent matches the content. Countries like India, Indonesia, and Nigeria have high search volume for this type of information and almost no competition.

The execution has one critical flaw: **thin content.** Google's Helpful Content Update specifically penalizes pages that exist for SEO but deliver little value to users. The 185 empty-shell country pages are exactly what that update targets. They could generate initial index clicks but will likely be demoted over 3-6 months as Google measures bounce rates and engagement signals.

The risk checker is the viral mechanic — shareable results, URL parameters, screenshot-worthy output. This is the highest-leverage traffic driver if it gets seeded in the right communities (r/HomeImprovement, real estate Facebook groups, asbestos awareness NGOs).

### ¿Tiene moat (ventaja competitiva)? **4/10**

Painfully little. Every piece of data in this product is publicly available. The IBAS data, WHO mortality rates, EPA regulations — all public. A well-funded competitor (say, a law firm wanting to generate leads) could replicate the entire dataset in a weekend.

The moat would come from: (1) accumulated backlinks and domain authority, which takes 12-24 months, (2) community trust built over time, (3) a professional directory that aggregates certified inspectors — which is the only genuinely defensible position. None of these exist yet.

The brand is distinctive. The design is better than any current competitor. That's real, but it's not a moat — it's a head start.

### ¿Es escalable? **6/10**

The technical architecture scales fine. Static JSON + Vercel SSG handles any traffic level. The calculator factory pattern is ready for a second substance.

The human bottleneck is the real scaling problem. 185 country pages need to grow into real content. 10+ languages need translators. PFAS, lead, and microplastics need their own data curation pipelines. The `SCOPE-FULL.md` vision of "AI Monitoring Engine" reading IBAS and PubMed daily is the right answer — but that's a full-time engineering project, not a weekend sprint.

Without the automation layer, the product peaks at the current v1 state and decays as data gets stale.

### ¿Puede monetizarse sin comprometer la misión? **5/10**

There are clean paths: a verified professional directory (inspectors, abatement contractors) where professionals pay a listing fee. A B2B API for insurance companies, real estate platforms, or property management software. Grants from health-focused foundations (Bloomberg Philanthropies, Ford Foundation).

The problem is cold-start. A professional directory needs professionals to list AND users to search. With zero traffic, neither wants to commit. Grants require a track record of impact — at least 6-12 months of data showing real usage.

The monetization potential is real but it's 18+ months away under the best-case traffic scenario.

---

## 4. DEBILIDADES QUE NADIE TE DICE

**1. El core value proposition es pseudo-científico.**

The risk calculator is the product's main feature. It produces a qualitative assessment from numbers that nobody validated. `eraFactor["1960_1980"] = 1.0` — says who? The EPA? WHO? No. Someone made that up and put it in a JSON file. The risk of this is not just legal (already addressed by disclaimers) — it's epistemic. You're training users to trust a number that has no scientific basis. If someone gets a "Low" result and later finds asbestos in their home, they will correctly point out that your tool failed them. The tool's precision is theater.

The fix is not to remove the tool. It's to get an asbestos epidemiologist or certified industrial hygienist to validate and sign off on the risk matrix — even informally, via email, cited in the methodology page.

**2. 185 páginas vacías son una deuda, no un activo.**

The framing has been "421 static routes" as a success metric. But 185 of those routes are essentially empty pages with a ban status and a call-to-action. For SEO, a thin page with a bounce rate of 95% is worse than no page — it tells Google that your domain doesn't deliver on its promises. The decision to generate all 200 country pages at launch was defensible as a bet that the content would fill in. But without a plan to actually fill that content in the next 90 days, these pages are a liability masquerading as an asset.

**3. No hay ningún loop de retención.**

A user comes, checks their risk, gets "Very High," panics slightly, reads the disclaimer, and... leaves. There is no way to stay connected to ToxinFree. No newsletter, no bookmarkable alert ("notify me if [country] changes its ban status"), no community forum, no return visit trigger. The product is built for one-time use. The entire strategy depends on new users finding the site through search — forever. That's not a product, it's a brochure.

**4. El CTA de "Find a certified inspector" es un broken promise.**

This was added in v1.2.0 as a safety fix. It promises the user that visiting their country page will help them find a local professional. It won't. The country page has official source links (IBAS, EPA) and nothing else. There is no inspector directory. This CTA is better than not having it (because it correctly redirects the user away from treating the tool as a diagnosis), but it actively misleads users about what they'll find. A broken promise at the moment of highest user anxiety is a trust-destroying pattern.

**5. El globo 3D es el componente más costoso del stack y sirve a los usuarios menos en riesgo.**

Globe3D is approximately 500KB of JavaScript. It runs on WebGL. It's visually stunning. It also primarily benefits users in wealthy countries with fast connections and powerful devices — the exact users who are LEAST at risk because their countries have bans and their buildings have been remediated. The users most at risk (rural India, Nigeria, Indonesia) are on 2G connections, low-memory Android phones, and won't see the globe at all. You optimized the hero element for the wrong audience.

**6. La data freshness no tiene dueño.**

The methodology page now honestly states "last referenced February 2026." That's honest, but it doesn't solve the problem. IBAS updates quarterly. The US EPA updates constantly. Without an automated pipeline or a defined manual process with a schedule, the data will drift. In 12 months, this product could be showing incorrect ban status for multiple countries. In a health-adjacent product, stale data is not an inconvenience — it's a reputational catastrophe.

---

## 5. LO QUE HARÍAS DIFERENTE

### Si empezaras de cero con la misma misión:

**Forget the 3D globe.** Build a better 2D map with richer interactive country data. The globe is impressive in a demo but it's not a decision-making tool. A user doesn't need to see a spinning Earth to understand "India has no asbestos ban."

**Start with 15 countries, not 200.** The priority countries have real data. Build 15 country pages that are genuinely excellent — deep regulatory timeline, verified risk data, actual inspector directories, local NGO contacts, legal resources. Make each page the best possible answer to "is asbestos banned in [country]?" on the internet. Then expand. Thin coverage at scale loses to deep coverage at focus every time in SEO.

**Get data validation before launch.** Find one asbestos epidemiologist, one industrial hygienist, one IBAS contact who will look at the risk matrix and say "this is reasonable." Quote them on the methodology page. This costs $0 if you email the right people. It converts the risk calculator from pseudo-science to endorsed approximation.

**Build the email capture on day one.** A simple "Alert me when [country]'s regulation changes" input field. This turns one-time visitors into retained users. This is the single highest-leverage missing feature.

**Design the inspector directory before launching the inspector CTA.** Even with 5 real inspectors listed per priority country, the CTA becomes a promise you can keep.

### Si tuvieras que priorizar UNA sola cosa:

**Backlinks and credibility, not features.**

The product is technically complete enough. What it doesn't have is domain authority. Email 10 asbestos NGOs, 5 public health journalism outlets, 3 real estate information sites, and offer to be a data partner. One link from a well-established health advocacy site is worth more than 6 months of feature development. The SEO strategy is correct; the promotion strategy doesn't exist.

---

## 6. VEREDICTO FINAL

### Rating global: **6.5 / 10**

### Una frase que resuma el proyecto:

> "Un producto con diseño de 9/10 construido sobre datos de 3/10, dependiendo de tráfico de SEO que aún no existe."
>
> ("A 9/10 design product built on 3/10 data, dependent on SEO traffic that doesn't exist yet.")

### El consejo más importante para el creador:

**Deja de construir y empieza a distribuir.**

The product works. The code is good. The design is excellent. Building more features at this stage is procrastination with extra steps. The next 90 days should be:

1. Email IBAS, WHO, and 5 asbestos advocacy NGOs asking them to link to ToxinFree. One link from `ibasecretariat.org` changes your domain authority permanently.
2. Get one expert (industrial hygienist, epidemiologist, or environmental health professional) to review and publicly endorse the risk methodology.
3. Add email capture to the risk results page. Even 50 email subscribers is leverage.
4. Fill in 20 more country pages to the same depth as the priority 15. Focus on the highest-risk, highest-population countries: Pakistan, Vietnam, Bangladesh, Philippines, Egypt.
5. Fix the broken inspector CTA — either add real inspector resources to country pages or change the CTA to something you can actually deliver ("learn about asbestos inspection in [country] →").

The product has genuine potential to matter. Asbestos kills a city the size of Pittsburgh every year and most people in the world have never heard of IBAS. ToxinFree could be the resource that changes that. But "could be" requires users, and users require distribution, and distribution requires credibility, and credibility starts with one expert link that you don't have yet.

Stop shipping. Start talking to people.

---

*This audit reflects the state of the codebase at v1.2.0, commit post-vulnerability-fixes, 2026-03-17.*
*All findings are based on direct file reading — no assumptions made.*
