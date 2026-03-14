# BREATHE — Global Toxic Substance Awareness Platform
## Full Vision Scope Document

---

## 1. THE BIG PICTURE

### What This Actually Is
Not just an asbestos website. A **global early-warning system for invisible toxic threats** — starting with asbestos, designed to expand to PFOA/PFAS, lead, microplastics, and other substances where the pattern repeats: industry knew, governments delayed, citizens were left in the dark.

### The Pattern (Why This Matters)
| Substance | Industry Knew | Public Found Out | Gap |
|-----------|--------------|-----------------|-----|
| Asbestos | 1930s | 1970s-ongoing | 40+ years |
| PFOA/PFAS | 1960s (DuPont internal) | 2000s (Bilott lawsuit) | 40+ years |
| Lead Paint | 1920s | 1970s | 50+ years |
| Microplastics | 1990s (studies) | 2020s (mainstream) | 30+ years |

The platform's thesis: **technology can close this gap from decades to days.**

### Why Nobody Has Done This
- **Governments**: Data exists but is buried in PDFs, scattered across agencies, in incompatible formats, and politically inconvenient to centralize.
- **NGOs (IBAS, EWG, ADAO)**: Great advocacy, terrible UX. Their sites look like they were built in 2003 because they were. They serve policy experts, not citizens.
- **Law Firms (Mesothelioma.com, etc.)**: Beautiful sites, but exist to convert visitors into lawsuit clients. Information is a marketing funnel, not a public service.
- **WHO/ILO**: Publish recommendations. Don't build tools for citizens.

**The gap**: Nobody has built a modern, citizen-facing, multilingual, data-driven tool that makes toxic exposure information actionable for a normal person.

---

## 2. PLATFORM ARCHITECTURE — COMPLETE SCOPE

### 2.1 Core Module: The Global Risk Map

**What it does**: Interactive world map showing asbestos regulatory status by country, color-coded and clickable.

**Data layers**:
- Ban status (full ban / partial ban / no ban / unknown)
- Year of ban or most recent regulation
- Known exceptions and loopholes
- Estimated buildings at risk (where data exists)
- Mesothelioma mortality rates (WHO data, publicly available)

**Visual approach**:
- Globe/map visualization (Mapbox GL JS or Deck.gl for 3D globe, Leaflet for 2D fallback)
- Color gradient: deep green (banned + removal programs) → yellow (banned, no removal) → orange (partial restrictions) → red (no ban, active use) → dark red (major producer/consumer)
- Click any country → detailed country profile

**Country Profile Page** (for each of 195 countries):
- Regulatory timeline
- Common materials by construction era
- Local resources (labs, removal services, health authorities)
- News feed (automated — see Section 4)
- Community-submitted updates (moderated)

### 2.2 Core Module: The Risk Checker

**What it does**: Personal risk assessment tool.

**Inputs**:
- Country
- Property type (house, apartment, school, office, factory)
- Year of construction (or decade range)
- Known materials (optional: dropdown of common ones like ceiling tiles, pipe insulation, floor tiles, roofing sheets)
- Planned activity (living normally, renovating, demolishing)

**Outputs**:
- Risk level (Low / Moderate / High / Critical)
- List of materials likely present based on era + country regulations
- Specific recommendations (don't touch it vs. get it tested vs. hire removal)
- Local testing labs and certified removal companies (where data exists)
- Visual diagram of where in a house/building each material is typically found

**Why this is the viral product**: It's personal. It answers "am I safe?" — the most shareable type of content online.

### 2.3 Core Module: The Knowledge Base

**What it does**: The definitive educational resource on asbestos, designed for humans not experts.

**Content structure**:
- What is asbestos (visual explainer with illustrations, not stock photos)
- The health mechanism (simplified fagocitosis frustrada explanation)
- Types of asbestos and relative danger levels
- History: how industry covered it up (timeline)
- Where it hides (interactive house/building diagram)
- What to do if you find it
- Country-specific guides (regulatory landscape + practical steps)

**Content format**:
- Written in plain language (8th grade reading level)
- Heavy use of illustrations, diagrams, infographics
- Available in 10+ languages (see i18n strategy)
- Each page designed for SEO dominance in its language

### 2.4 Growth Module: The Monitoring Engine (AI-Powered)

**This is the technical differentiator. This is the "wow."**

An automated pipeline that continuously:

1. **Monitors sources** — RSS feeds, government gazette APIs, WHO/ILO publications, PubMed, news outlets, regulatory databases
2. **Processes new information** — Claude API reads new documents, extracts: new regulations, new research findings, product recalls, court decisions
3. **Updates the database** — New country regulations auto-flagged for review, new research summarized, news articles categorized
4. **Generates alerts** — Email/push notifications for users who subscribed to specific countries
5. **Translates** — New content auto-translated to supported languages via AI

**Technical flow**:
```
[Sources: RSS/APIs/Scrapers]
        ↓
[Ingestion Queue — n8n or custom Node.js cron]
        ↓
[Claude API — Classification + Extraction + Summary]
        ↓
[Review Queue — flagged for human verification if confidence < threshold]
        ↓
[Database Update + Alert Dispatch]
        ↓
[Frontend auto-updates via webhook/polling]
```

**Sources to monitor** (initial list):
- IBAS website (HTML scraping, they don't have RSS)
- WHO newsroom RSS
- EPA Federal Register (has API)
- PubMed API (search: asbestos, mesothelioma)
- Google Scholar alerts
- UN Comtrade Database (trade data for asbestos)
- National gazette/regulatory feeds per country (expand over time)
- Google News API (asbestos-related news)

**Why this matters**: IBAS is maintained by essentially one person (Laurie Kazan-Allen). If her site goes down or she retires, a massive portion of global asbestos ban tracking disappears. Your platform becomes the automated, resilient successor.

### 2.5 Growth Module: The Substance Expansion Framework

**Architecture designed from day 1 to support multiple substances.**

Database schema uses:
- `substances` table (asbestos, PFOA, lead, etc.)
- `regulations` table (country + substance + year + type + details)
- `materials` table (substance + product + era + risk_level)
- `health_effects` table (substance + condition + mechanism + latency)

When you add PFAS/PFOA:
- Same risk checker UI, different data
- Same monitoring engine, different sources (EPA PFAS database exists)
- Same country profiles, new regulatory layer
- The framework scales without rebuilding

**Expansion roadmap**:
- v1: Asbestos only
- v2: PFAS/PFOA (massive current relevance, "Dark Waters" awareness)
- v3: Lead (especially lead pipes — Flint Michigan pattern repeating globally)
- v4: Microplastics (emerging, less regulatory data but growing fast)

### 2.6 Community Module: Verified Contributions

**Not the open crowdsourcing Gemini proposed** (legal disaster). Instead:

- Users can submit updates about their country's regulations
- All submissions go through AI pre-screening + human moderation
- Verified contributors (journalists, researchers, health professionals) get badges
- Legal shield: platform clearly states all information is aggregated from public sources and community contributions are verified before publication

---

## 3. INTERNATIONALIZATION (i18n) STRATEGY

### Phase 1 — AI Translation + Community Verification
- Core content written in English
- Claude API translates to initial 10 languages
- Community volunteers verify translations (Wikipedia model)
- Languages prioritized by at-risk population:
  1. English (global)
  2. Hindi (India — largest asbestos consumer, no ban)
  3. Mandarin (China — largest exporter)
  4. Spanish (Latin America — mixed regulations)
  5. Portuguese (Brazil — recent ban, ongoing issues)
  6. Russian (Russia — major producer)
  7. Indonesian (Indonesia — active consumer)
  8. French (Africa — many Francophone countries still using)
  9. Arabic (Middle East — mixed regulations)
  10. Japanese (Japan — banned but legacy buildings)

### Phase 2 — Localization Beyond Language
- Date formats, measurement units
- Country-specific legal disclaimers
- Local resource databases (testing labs, removal companies, health authorities)
- Culturally appropriate imagery and examples

---

## 4. AI AUTOMATION — THE CURATION ENGINE

### What Gets Automated (and What Doesn't)

| Task | Automation Level | How |
|------|-----------------|-----|
| Monitoring new regulations | 95% automated | Scrapers + Claude API classification |
| Summarizing research papers | 90% automated | PubMed API + Claude API extraction |
| Translating content | 85% automated | Claude API + community verification |
| Updating country profiles | 70% automated | AI drafts update, human reviews |
| Writing educational content | 60% automated | AI drafts, human edits for tone/accuracy |
| Verifying community submissions | 50% automated | AI pre-screens, human approves |
| Legal review of claims | 0% automated | Always human (eventually, legal advisor) |
| Design and UX decisions | 0% automated | Always human |

### The Monitoring Pipeline (Detailed)

**Flow 1: Regulation Monitor**
```
Schedule: Daily
1. Scrape IBAS ban list page → diff against stored version
2. Scrape EPA Federal Register for asbestos-related entries
3. Query Google News API: "asbestos ban" OR "asbestos regulation" (per country)
4. For each new item → Claude API:
   - Classify: [new_ban | amendment | enforcement | court_ruling | other]
   - Extract: country, date, substance, scope, exceptions
   - Confidence score
5. If confidence > 0.85 → auto-update database, flag for review
6. If confidence < 0.85 → queue for human review
7. Generate alert for subscribed users
```

**Flow 2: Research Monitor**
```
Schedule: Weekly
1. Query PubMed API: recent papers on asbestos, mesothelioma, PFAS
2. For each new paper → Claude API:
   - Summarize in plain language (3-4 sentences)
   - Extract key findings relevant to citizens
   - Classify relevance: [high | medium | low]
3. High relevance → draft news update for Knowledge Base
4. Medium → add to country-specific research feed
5. Low → archive
```

**Flow 3: Content Translator**
```
Trigger: New or updated content in English
1. Detect changed content blocks
2. For each target language → Claude API translate
3. Run quality check (back-translate and compare)
4. Flag for community volunteer review
5. Publish with "machine-translated, verification pending" badge
6. Remove badge once verified
```

**Flow 4: Product/Recall Monitor**
```
Schedule: Weekly
1. Query FDA recall database (API exists)
2. Query CPSC recall database
3. Query EU RAPEX (rapid alert system)
4. Filter for asbestos-contaminated products
5. Claude API → extract product name, manufacturer, risk
6. Auto-publish to product alerts section
7. Notify subscribed users
```

### Tech Stack for Automation
- **Orchestration**: n8n (Koku already knows it) OR Node.js cron jobs
- **AI Processing**: Claude API (Sonnet for routine tasks, Opus for complex analysis)
- **Data Storage**: PostgreSQL (with JSON columns for flexible schema)
- **Queue**: Simple Redis queue or even a PostgreSQL-based queue
- **Deployment**: Railway or Render (affordable, auto-scaling)

---

## 5. GLOBAL SCALING STRATEGY

### Phase 1: SEO Dominance (Month 1-6)
The #1 growth channel for this type of content.

**Target keywords** (examples):
- "is asbestos banned in [country]" — 195 pages, one per country
- "asbestos in my house built in [decade]" — 6-8 pages by era
- "how to know if my house has asbestos" — 1 pillar page
- "[material name] asbestos" — floor tiles, ceiling, roofing, etc.
- Repeat all keywords in each supported language

**Why this works**: These searches happen daily. Current results are either legal firm marketing or government PDFs. A well-designed, fast, informative page will outrank both.

**Technical SEO**:
- Static site generation (Next.js or Astro) for instant load times
- Structured data (FAQ schema, HowTo schema)
- Programmatic page generation (one template → 195 country pages)
- Hreflang tags for multilingual SEO

### Phase 2: Social + Viral Mechanics (Month 3-12)
- Shareable risk checker results ("My house has a HIGH asbestos risk — check yours")
- Embeddable world map widget (let journalists and bloggers embed it)
- Annual "Global Asbestos Report" — automated data summary, designed beautifully, pitched to media
- Infographics designed for social sharing (Instagram, Twitter/X, Reddit)

### Phase 3: Partnerships (Month 6-18)
- Contact IBAS, ADAO, EWG — offer your platform as a data visualization layer for their data
- Contact journalists covering toxic substances (there's a whole beat for this)
- WHO collaborating centers (ADDRI in Australia is one)
- Academic partnerships for data verification

### Phase 4: Expansion to Other Substances (Month 12+)
- PFAS/PFOA: "Is my water contaminated?" checker using EPA PFAS data
- Lead: "Does my home have lead pipes?" using EPA lead service line inventory
- Each new substance = new viral moment, new press coverage, new traffic

---

## 6. MONETIZATION (Optional, For Sustainability)

**The site should be free and open.** But sustainability matters.

Options that don't compromise integrity:
- **Donations**: Patreon/Open Collective model (like Wikipedia)
- **Grants**: Environmental/health NGO grants (Ford Foundation, Bloomberg Philanthropies, etc.)
- **Verified Professional Directory**: Testing labs and removal companies pay for verified listings (clearly marked, like Yelp verified)
- **API Access**: Sell API access to the regulatory database for enterprise users (insurance companies, real estate platforms, construction firms)
- **White-label reports**: Automated risk reports for real estate transactions
- **No ads. Ever.** This is a trust product. Ads kill trust.

---

## 7. LEGAL CONSIDERATIONS

### What Protects You
- All data sourced from public/official sources (government records, WHO, peer-reviewed research)
- No user-generated claims about specific properties or companies
- Educational purpose with clear disclaimers
- No medical advice — always "consult a professional"

### What You Need
- Clear Terms of Service and disclaimers on every page
- "Information is aggregated from public sources and may not be current or complete"
- No specific property assessments (you say "houses built in X era typically contain Y" — not "YOUR house has asbestos")
- Eventually: consult with a lawyer familiar with health information platforms (can be deferred past v1)

---

## 8. NAMING CANDIDATES

| Name | Vibe | Domain Check Needed |
|------|------|-------------------|
| BREATHE | Emotional, universal, multilingual-friendly | breathe.org / breathesafe.org |
| ClearAir | Clean, scientific, trustworthy | clearair.org |
| ToxicMap | Direct, descriptive, SEO-friendly | toxicmap.org |
| Fibra | Spanish/Latin root for "fiber", unique | fibra.org |
| SafeGround | Expansion-ready (not just air, also soil/water) | safeground.org |
| Unveil | The mission: revealing hidden dangers | unveil.org |

**Recommendation**: Something that works across the substance expansion. "BREATHE" is strong for asbestos but limiting for PFAS/lead. "ToxicMap" or "SafeGround" or "Unveil" scale better.

---

## 9. FULL TECH STACK (FOR COMPLETE BUILD)

### Frontend
- **Framework**: Next.js (SSR/SSG for SEO, React-based so Koku's learning path)
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS (free tier: 50K loads/month) or Leaflet (100% free)
- **Charts**: D3.js or Recharts
- **i18n**: next-intl or i18next
- **Hosting**: Vercel (free tier is generous, perfect for Next.js)

### Backend
- **Runtime**: Node.js + Express (Koku's stack)
- **Database**: PostgreSQL on Supabase (free tier: 500MB)
- **ORM**: Prisma (on Koku's learning roadmap)
- **Auth**: NextAuth.js (for community contributors)
- **Hosting**: Railway or Render

### Automation Layer
- **Orchestration**: n8n (self-hosted) or Node.js cron jobs
- **AI**: Claude API (Sonnet for bulk processing)
- **Scraping**: Cheerio + Puppeteer (Node.js based)
- **Queue**: BullMQ (Redis-based, Node.js)

### Data Pipeline
- **Ingestion**: Custom Node.js scrapers for IBAS, EPA, WHO, PubMed
- **Processing**: Claude API for classification, extraction, translation
- **Storage**: PostgreSQL with JSONB for flexible document storage
- **Cache**: Redis or Vercel KV

---

## SUMMARY: THE VISION IN ONE PARAGRAPH

A global, multilingual, AI-powered platform that transforms scattered government data and buried research into actionable health information for every person on Earth. Starting with asbestos — where 72 countries have bans but billions still live with the substance in their homes — and expanding to PFAS, lead, and other toxic substances that follow the same pattern of corporate concealment and regulatory failure. The platform monitors, translates, and delivers this information automatically, 24/7, in 10+ languages, making it the first truly citizen-accessible toxic substance early warning system.
