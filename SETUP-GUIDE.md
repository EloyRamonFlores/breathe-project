# 🚀 SETUP GUIDE — How to Bootstrap BREATHE with Claude Code

## What You Have
This kit contains everything Claude Code needs to build the project:

```
breathe-project-kit/
├── CLAUDE.md              ← Claude Code reads this first every session
├── CHANGELOG.md           ← Track progress and decisions
├── docs/
│   ├── SCOPE-FULL.md      ← Complete platform vision (for context)
│   ├── SCOPE-V1.md        ← V1 scope (what we're actually building)
│   ├── DESIGN.md          ← Design system, colors, typography
│   ├── DATA.md            ← Data schema, sources, curation methodology
│   ├── RISK-LOGIC.md      ← Risk assessment algorithm
│   └── SEO.md             ← SEO strategy and requirements
```

## Step-by-Step Setup

### Step 1: Create the project folder
```bash
mkdir breathe
cd breathe
```

### Step 2: Copy the kit files into the project
Copy CLAUDE.md to the root and docs/ folder into the project.
```bash
# Copy the files from wherever you downloaded them
cp path/to/breathe-project-kit/CLAUDE.md ./
cp path/to/breathe-project-kit/CHANGELOG.md ./
cp -r path/to/breathe-project-kit/docs ./
```

### Step 3: Open Claude Code
```bash
claude
```

### Step 4: First prompt — Initialize the project
Copy and paste this as your first message to Claude Code:

---

```
Read CLAUDE.md and all files in docs/ to understand the full project context.

Then initialize the project:
1. Create a Next.js 14+ project with App Router, TypeScript, and Tailwind CSS
2. Install dependencies: react-leaflet, leaflet, recharts, next-intl
3. Set up the folder structure exactly as defined in CLAUDE.md
4. Configure TypeScript strict mode
5. Set up Tailwind with the color palette from docs/DESIGN.md as CSS variables
6. Create the i18n configuration with next-intl for 'en' and 'es' locales
7. Create placeholder data files: countries.json, materials.json, risk-matrix.json with the TypeScript interfaces from docs/DATA.md
8. Add the Google Fonts from docs/DESIGN.md to the layout
9. Initialize git and make an initial commit

Do NOT build any pages yet. Just the foundation.
After you're done, update CHANGELOG.md with what you did.
```

---

### Step 5: Curate the data
This is the most important step. Before building any UI, the data must be solid.

Prompt:

---

```
Read docs/DATA.md for the data schema.

Now I need you to curate countries.json with REAL data:

1. Start by populating all 72 countries that have banned asbestos using the IBAS data. 
   For each, include: slug, name, iso2, iso3, region, ban_status ("full_ban"), ban_year, 
   and ban_details from the IBAS chronological list.

2. Add these countries that have NOT banned asbestos with ban_status "no_ban":
   India, China, Russia, Indonesia, Thailand, Philippines, Vietnam, Pakistan, 
   Bangladesh, Nigeria, Kenya, Zimbabwe, Kazakhstan, Kyrgyzstan, Myanmar

3. Mark the 15 priority countries (listed in docs/SCOPE-V1.md) with priority: "high"

4. For the 15 priority countries, add detailed timeline arrays with major regulatory events.

5. Fill remaining ~100 countries with ban_status "unknown" and basic info.

Every entry must have sources with URLs pointing to IBAS or other official sources.
Save to src/data/countries.json.

Then populate materials.json with 15-20 common asbestos-containing materials 
using the schema from docs/DATA.md. Source from EPA and the construction data 
we identified.

Then create risk-matrix.json with the exact scoring values from docs/RISK-LOGIC.md.

After done, update CHANGELOG.md.
```

---

### Step 6: Build the landing page + map
Prompt:

---

```
Read docs/DESIGN.md for the visual direction and docs/SCOPE-V1.md for what 
the landing page needs.

Build the landing page at src/app/[locale]/page.tsx:

1. Hero section: dark background, animated counter showing number of countries 
   with NO asbestos ban, death toll stat below it
2. Interactive world map using Leaflet + react-leaflet:
   - Load GeoJSON for country boundaries
   - Color each country based on ban_status from countries.json
   - Hover tooltip showing: country name, ban status, ban year
   - Click navigates to /country/[slug]
   - Use CartoDB dark tiles as base map layer
3. Below map: CTA to the Risk Checker
4. Navigation bar: Logo, Map, Check Risk, Learn, Language selector
5. Footer with disclaimer and source credits

Follow the design system exactly. This must look professional, not like a student project.
Dark theme, editorial feel, the map is the hero.

Mobile responsive. Keyboard accessible.
Update CHANGELOG.md when done.
```

---

### Step 7: Build the Risk Checker
Prompt:

---

```
Read docs/RISK-LOGIC.md for the scoring algorithm and docs/DESIGN.md for visual direction.

Build the Risk Checker at src/app/[locale]/check/page.tsx:

1. Multi-step form (3 steps with smooth transitions):
   Step 1: Country selector (dropdown with flag icons, searchable)
   Step 2: Construction decade (visual slider or selectable cards: Pre-1940, 1940-1960, etc.)
   Step 3: Property type (icon cards: House, Apartment, School, Office, Factory)

2. Implement the risk calculation in src/lib/risk-calculator.ts:
   - Use the three-factor formula from RISK-LOGIC.md
   - Determine country_factor by checking if ban existed at construction time
   - Return: score, risk_level, matched_materials, recommendations

3. Results page (designed to be screenshot-shareable):
   - Big visual risk level indicator (color-coded bar or gauge)
   - Context line: "[Country] · Built [decade] · [ban status at time]"
   - List of likely materials with individual risk indicators
   - "What to do" recommendations
   - Share button (copies link with OG metadata)
   - "Check another property" button
   - Legal disclaimer

4. All text through i18n. Add keys to en.json and es.json.
Update CHANGELOG.md when done.
```

---

### Step 8: Build country pages
Prompt:

---

```
Read docs/SCOPE-V1.md for the 15 priority countries and docs/DESIGN.md for styling.

Build the country profile page template at src/app/[locale]/country/[slug]/page.tsx:

1. Dynamic route that reads from countries.json based on slug
2. Generate static params for all countries (generateStaticParams)
3. Page layout:
   - Country header: flag + name + ban status pill (color-coded)
   - Key stats: ban year, mesothelioma rate, estimated buildings at risk
   - Regulatory timeline (vertical timeline component, visually engaging)
   - Common materials section (cards with risk indicators)
   - "What to do if you live here" recommendations
   - Sources section with all URLs
4. SEO: generateMetadata with unique title, description, OG tags per country
5. Structured data: FAQ schema for each country page
6. For countries with priority "low" or "unknown": show simplified page with available data
   and a note that more information is coming

Update CHANGELOG.md when done.
```

---

### Step 9: Build educational pages
Prompt:

---

```
Read docs/SCOPE-V1.md for the 5 educational pages needed.

Build these pages under src/app/[locale]/learn/:

1. /learn/what-is-asbestos — Visual explainer with types, dangers, history
2. /learn/where-it-hides — Interactive house diagram (SVG) showing common locations
3. /learn/history — Timeline of industry cover-up and regulatory battles
4. /learn/what-to-do — Step-by-step practical guide
5. /learn/by-the-numbers — Data visualization page with key global statistics

Each page must:
- Use content from i18n files (en.json, es.json)
- Have proper SEO metadata and structured data
- Be visually engaging (not walls of text — use diagrams, stats, callouts)
- Include source citations
- Cross-link to relevant country pages and risk checker

Update CHANGELOG.md when done.
```

---

### Step 10: Polish and deploy
Prompt:

---

```
Final polish pass:

1. Test all pages at mobile (375px), tablet (768px), desktop (1280px)
2. Run Lighthouse audit — target 90+ on all scores
3. Verify all internal links work
4. Verify i18n works for both en and es
5. Add sitemap.xml generation
6. Add robots.txt
7. Create OG images for key pages (landing, risk checker, top 5 countries)
8. Test risk checker with all example calculations from docs/RISK-LOGIC.md
9. Add Google Analytics or Plausible snippet
10. Prepare Vercel deployment config

Update CHANGELOG.md with final status.
```

---

## Tips for Working with Claude Code on This Project

### Context Management
- **Use /clear between major phases** (e.g., after finishing the map, before starting risk checker)
- **Don't let context exceed 50%** — if you notice Claude getting confused, /compact or /clear
- **Reference docs/ files by path** instead of pasting content. Claude Code can read them.

### If Claude Goes Off Track
- Hit Esc immediately
- Correct specifically: "No, use Leaflet not Mapbox" or "The colors should be from DESIGN.md"
- Don't re-explain the whole project — point to the relevant doc file

### Iterating on Design
- After each major component, ask: "Show me this in the dev server"
- Give specific design feedback: "The map needs more contrast" not "make it look better"
- Reference DESIGN.md for any visual decisions

### Keeping History
- After every session, Claude should update CHANGELOG.md
- Add a line in CLAUDE.md if you discover something Claude keeps getting wrong
- Commit frequently with descriptive messages

### Session Strategy
Best results come from **one major feature per session**:
- Session 1: Project init + data curation
- Session 2: Landing page + map
- Session 3: Risk checker
- Session 4: Country pages
- Session 5: Educational content
- Session 6: Polish + deploy

Start each session with: "Read CLAUDE.md and CHANGELOG.md to understand where we are."
