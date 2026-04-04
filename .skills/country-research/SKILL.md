---
name: country-research
description: "Deep investigative research on a country's asbestos history for ToxinFree. Use this skill whenever the user asks to research, investigate, or build a country profile — including regulatory timelines, activist stories, mortality data, corporate responsibility, exposure sources, and current status. Triggers on: 'research [country]', 'investigate [country]', 'country profile', 'historias de resistencia', 'build country page for', or any request to gather verified data about a specific country's toxic substance history. Also use when the user wants to verify, fact-check, or enrich existing country data."
---

# Country Research Skill — ToxinFree

You are a rigorous investigative researcher building country profiles for ToxinFree (toxinfree.global), a global platform documenting toxic substance regulations and the activists who fought for them. Your work will be read by the people who lived these stories — activists, families of victims, journalists. Accuracy is not optional; it is the entire point.

## Core Principles

1. **Every fact needs a source.** No URL, no inclusion. If you can't verify it, mark it as `[UNVERIFIED — needs source]` and move on.
2. **No invented quotes.** Quotes must be exact, from interviews, court documents, news articles, or published books. Attribute with source URL. If no real quote exists, don't fabricate one — write a factual summary instead.
3. **No dramatization.** Let the facts speak. "Romana Blasotti lost five family members to mesothelioma" is powerful enough without adjectives.
4. **Neutral language for corporate sections.** Use court records, regulatory findings, and investigative journalism. "Company X was found liable by [court] in [year]" — not "Company X poisoned people."
5. **Prefer primary sources.** IBAS > news articles > Wikipedia. WHO Mortality Database > blog estimates. Court rulings > secondhand accounts.

## Research Process

For each country, follow these steps in order:

### Step 1: Source Discovery
Search for information using multiple queries per section. Prioritize these source types:

**Tier 1 (Primary):**
- IBAS (ibasecretariat.org) — ban chronology, country reports
- WHO Mortality Database — mesothelioma deaths
- Government gazettes / official legislation text
- Court rulings and legal databases
- UN Comtrade — import/export data
- USGS Minerals Yearbook — production data

**Tier 2 (Verified Secondary):**
- Peer-reviewed journals (The Lancet, IJEH, JOEM)
- Major investigative journalism (BBC, Reuters, The Guardian, local newspapers of record)
- Published books by recognized experts
- NGO reports (ADAO, ABREA, national associations)

**Tier 3 (Use with caution):**
- Wikipedia (use only to find primary sources cited in references)
- General news outlets (verify claims independently)
- Advocacy websites (cross-reference claims)

### Step 2: Research Each Section

For each section below, conduct targeted web searches. Use at least 2-3 different search queries per section to ensure coverage. Cross-reference findings across sources.

### Step 3: Compile and Verify

Write the output in the structured Markdown format defined below. After writing, do a verification pass: re-read each factual claim and confirm it has a source URL.

## Output Format

Write one Markdown file per country. File name: `{country-slug}-research.md`

```markdown
# {Country Name} — Asbestos Research Profile

**Researcher:** Claude (ToxinFree)
**Date:** {YYYY-MM-DD}
**Status:** Draft — Pending human review
**Confidence:** {HIGH | MEDIUM | LOW} — based on source availability

---

## 1. Regulatory Timeline

Chronological list of every regulatory action related to asbestos in this country. Each entry must include the legal instrument name/number if it exists.

| Year | Event | Legal Instrument | Source |
|------|-------|-----------------|--------|
| 1983 | First partial restriction on blue asbestos | Regulation No. XXX | [source](url) |
| 1999 | Total ban on all forms | Act/Law name | [source](url) |

### Context
{2-3 paragraphs explaining the regulatory journey — what drove each change, what resistance existed, how long the process took}

---

## 2. Historias de Resistencia (Activism Stories)

### Individual Stories
For each key figure or movement:

#### {Person/Movement Name}
- **Who:** {Brief bio — occupation, connection to asbestos}
- **The catalyst:** {What triggered their activism — specific event, diagnosis, discovery}
- **What they did:** {Concrete actions — lawsuits filed, organizations founded, legislation pushed}
- **Impact:** {Measurable outcomes — laws passed, compensation funds created, bans achieved}
- **Verified quote:** "{Exact quote}" — Source: [publication name, date](url)
  - If no verified quote exists, write: *No verified direct quote found in public sources.*
- **Sources:** [source1](url1), [source2](url2)

### Joint/Paired Resistance Stories (NEW)
Look for pairs of activists who worked together on the same campaign (spouses, partners, co-founders). If found:

#### {Couple/Partnership Name}
- **People:** {Person A} + {Person B} (relationship — spouses, co-founders, etc.)
- **Years active together:** {Start–End}
- **Joint narrative:** {2–3 sentences on their shared story — what they accomplished together before/if one passed away}
- **Key achievement:** {One major win they achieved jointly}
- **Joint photo:** {If available, note location — this will be used for visual display}
- **Sources:** [source1](url1), [source2](url2)

*Note: Only include if there is verified evidence of significant joint collaboration. Do not invent partnerships.*

---

## 3. Ban Status Verification (NEW — CRITICAL)

Before writing any other sections, **verify and document the EXACT ban status** of the country:

### Ban Status Categories

- **full_ban**: All forms of asbestos (chrysotile, crocidolite, amosite, etc.) prohibited by law
- **partial_ban**: Some forms banned (e.g., crocidolite & amosite) but chrysotile still legal
- **no_ban**: No national asbestos ban in force
- **de_facto_ban**: No official law, but market has ceased (no imports, no use in 10+ years)
- **unknown**: Regulatory status unclear from available sources

### Verification Checklist

For EVERY country, answer these questions with sources:

1. **What forms are banned?** (crocidolite, amosite, chrysotile, all, none?)
   - Source: [IBAS page for {country}](https://www.ibasecretariat.org/alpha_ban_list.php)
   
2. **What year did the ban take effect?** (if applicable)
   - Source: Government gazette or law text
   
3. **Is there evidence of enforcement?** (inspections, removals, prosecutions?)
   - Source: Recent news, regulatory agency reports
   
4. **Are any forms still in use?** (check UN Comtrade imports if ban is partial or missing)
   - Source: UN Comtrade data or trade data
   
5. **Does legislation match current practice?**
   - Source: Cross-reference government claims vs. recent reports

**Write this section BEFORE researching other topics — it determines the entire country profile.**

---

## 4. Exposure Sources ("Where Was It?")

### Common asbestos-containing materials in {country}
{What specific products, brands, or building materials were prevalent. Regional specifics — not generic global info.}

### Key locations of exposure
- **Mines:** {Names and locations of asbestos mines, if any}
- **Factories:** {Major manufacturing facilities — cement, textiles, shipyards}
- **Products:** {Brand names and product types specific to this country}
- **Buildings:** {Types of buildings most affected — era, construction style}

Each item must cite a source.

---

## 4. Corporate Responsibility

Document companies involved in asbestos production, import, or use in this country. Only include facts from court documents, regulatory findings, or investigative journalism.

### {Company Name}
- **Role:** {Producer / Importer / Manufacturer / Mine operator}
- **Period of activity:** {Years}
- **Legal outcomes:** {Lawsuits, convictions, settlements — with court/case references}
- **Current status:** {Still operating? Dissolved? Renamed?}
- **Source:** [source](url)

---

## 5. Mortality & Health Impact

| Metric | Value | Year | Source |
|--------|-------|------|--------|
| Mesothelioma deaths/year | X | 20XX | [source](url) |
| Asbestosis deaths/year | X | 20XX | [source](url) |
| Estimated exposed workers | X | 20XX | [source](url) |
| Estimated buildings at risk | X | 20XX | [source](url) |

### Context
{Interpretation of the data — trends, comparison to regional averages, data gaps}

---

## 6. Current Status (What's Happening NOW?)

- **Is the ban being enforced?** {Evidence of enforcement or lack thereof}
- **Ongoing removal programs?** {Government or private initiatives}
- **Pending legislation?** {Any bills or proposals in progress}
- **Active lawsuits?** {Major ongoing cases}
- **Recent news:** {Most recent developments, with dates}

Each point must have a source dated within the last 2 years if possible.

---

## 7. Local Resources

- **Government agency:** {Name + URL of the relevant regulatory body}
- **NGOs/Advocacy groups:** {Name + URL + brief description}
- **Where to get testing:** {Labs, inspection services — if findable}
- **Official legislation text:** {Direct link to the law/regulation}
- **Emergency contacts:** {If applicable — health hotlines, reporting mechanisms}

---

## Source Index

All sources used in this document, numbered for reference:

1. [Source title](url) — accessed {date}
2. [Source title](url) — accessed {date}
...

## Verification Notes

{List any claims that could not be fully verified, contradictions found between sources, or data gaps that need human follow-up}

## Suggested Improvements

{What additional research would strengthen this profile — specific people to contact, documents to obtain, data to request via FOI}

---

## 8. Data for countries.json (NEW — INTEGRATION GUIDE)

At the end of your research, extract these fields for integration into the website database. This makes the transition from research → live site seamless.

```json
{
  "slug": "country-slug-here",
  "name": "Official Country Name",
  "name_es": "Nombre oficial en español",
  "ban_status": "full_ban|partial_ban|no_ban|de_facto_ban|unknown",
  "ban_year": 2019,
  "ban_details": "Detailed description of what was banned and when",
  "ban_details_es": "Descripción detallada en español",
  "peak_usage_era": "1960–1980",
  "mesothelioma_rate": 0.6,
  "mesothelioma_source_year": 2022,
  "estimated_buildings_at_risk": "Description of at-risk buildings",
  "priority": "high|medium|low",
  "resistance_stories": [
    {
      "name": "Person Name",
      "years": "2014–2017",
      "role": "English role description",
      "role_es": "Descripción del rol en español",
      "achievement": "What they accomplished",
      "achievement_es": "Lo que lograron",
      "quote": "Exact verified quote",
      "quote_es": "Cita traducida exacta",
      "quote_source": "Publication, date",
      "quote_source_es": "Publicación, fecha",
      "role_type": "journalist|advocate|victim|scientist|legal|network",
      "photo_url": "/images/countries/{slug}/resistance-stories/{name}.webp"
    }
  ],
  "joint_resistance_story": {
    "title": "English title for the joint story",
    "title_es": "Título en español",
    "people": [
      {"name": "Person A", "role": "Role", "role_es": "Rol"},
      {"name": "Person B", "role": "Role", "role_es": "Rol"}
    ],
    "years": "2014–2019",
    "narrative": "Narrative of their joint work and impact",
    "narrative_es": "Narrativa de su trabajo conjunto",
    "photo_url": "/images/countries/{slug}/resistance-stories/{photo-filename}.webp",
    "source_url": "https://source-url-here"
  },
  "timeline": [
    {
      "year": 1999,
      "event": "English timeline event",
      "event_es": "Evento de cronología en español",
      "type": "ban|partial_ban|regulation|court_ruling|other",
      "source_url": "https://source-url"
    }
  ]
}
```

**Instructions:**
- Only include fields you have verified sources for
- Omit `_es` fields if Spanish translation is not yet available (translator will fill later)
- For `role_type`, choose the primary role that best matches the person's main contribution
- `priority` should be "high" if this is in ToxinFree's initial 15-country focus; "medium" or "low" otherwise
- All URLs must be verified and accessible
```

## Search Strategy by Section

When researching, use these search patterns (adapt to each country):

**Timeline:**
- `"{country}" asbestos ban regulation history`
- `"{country}" asbestos legislation chronology site:ibasecretariat.org`
- `"{country}" asbestos ban law year`

**Activism:**
- `"{country}" asbestos activist victim movement`
- `"{country}" asbestos ban campaign who fought`
- `"{country}" mesothelioma victim advocacy`

**Exposure sources:**
- `"{country}" asbestos cement factory mine location`
- `"{country}" asbestos containing materials buildings`
- `"{country}" asbestos products brand names`

**Corporate:**
- `"{country}" asbestos company lawsuit court ruling`
- `"{country}" asbestos manufacturer liability`

**Mortality:**
- `"{country}" mesothelioma mortality rate WHO`
- `"{country}" asbestos deaths statistics`

**Current status:**
- `"{country}" asbestos removal program 2024 2025 2026`
- `"{country}" asbestos policy update recent`

## Quality Checklist (Run Before Finishing)

Before marking the research as complete, verify:

- [ ] Every factual claim has a source URL
- [ ] No quotes are fabricated — all are from published sources
- [ ] Dates are specific (year minimum, month if available)
- [ ] Names are spelled correctly (cross-referenced across sources)
- [ ] Legal instrument names/numbers are included where they exist
- [ ] Mortality data cites the specific year and database
- [ ] Corporate section uses only court/regulatory/journalistic sources
- [ ] "Current Status" section has sources from the last 2 years
- [ ] All URLs are functional (at time of research)
- [ ] Verification Notes section lists any gaps honestly
- [ ] The document could be read by the activists named in it without finding errors

## Language

Write the research output in English. The translation to Spanish will happen separately during integration into the website. Use clear, factual prose at an 8th-grade reading level (the ToxinFree standard for global accessibility).
