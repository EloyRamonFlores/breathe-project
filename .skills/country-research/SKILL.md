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
6. **Resolve contradictions actively.** If two Tier 1/2 sources disagree on a fact (especially ban year or ban status), run 2+ additional targeted searches before choosing. Document the contradiction and your reasoning in Verification Notes.
7. **Stat discipline — presence vs. condition vs. protection.** When reporting that a substance is "present" in X% of buildings/products/locations, ALWAYS pair with: (a) condition data if available (damaged vs. intact), (b) regulatory/mitigation framework in place. Never publish "X% contains" as a standalone stat — it invites catastrophizing. This applies to both Markdown narrative and JSON fields that might feed UI directly. Example: "80% of pre-2000 schools contain asbestos" alone = alarmist; "80% contain + 71% audited items in poor condition + managed under Duty to Manage (CAR 2012)" = informative.

## Scope Parameter

Start every run by determining the scope:

- **`scope: full`** (default) — Full investigation from scratch. Use for countries without existing research in `docs/research/`.
- **`scope: audit`** — Re-verification of an existing research file. Before researching, read `docs/research/{country-slug}-research.md` and note what's already documented. Focus your searches on:
  1. Ban Status changes (any new legislation?)
  2. Current Status section (last 12 months of news)
  3. Any claims in the existing file that lack source URLs

  Output the same template, but flag every field that changed since the previous version with `[UPDATED YYYY-MM]`.

If the user doesn't specify, infer: existing file in `docs/research/` → `audit`; no file → `full`.

## Research Process

For each country, follow these steps in order:

### Step 1: Source Discovery

**You MUST invoke your web search tool for every query below. Do not answer from training data memory** — ban chronologies, mortality figures, and legislative details change over time and your training cutoff may be outdated.

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

Write one Markdown file per country.

**File location:** Save as `docs/research/{country-slug}-research.md` (matches the project's existing convention).

```markdown
# {Country Name} — Asbestos Research Profile

**Researcher:** Claude (ToxinFree)
**Date:** {YYYY-MM-DD}
**Scope:** {full | audit}
**Status:** Draft — Pending human review
**Confidence:** {HIGH | MEDIUM | LOW} — {1-line justification: how many of the 6 ban-status checklist questions were answered with Tier 1/2 sources, and any major gaps}

---

## 1. Ban Status Verification (FOUNDATION — written first)

Determine and lock the `ban_status` before writing any other section. Every other field in the profile flows from this decision.

### Ban Status Categories — Exact Definitions

| Status | Meaning | Common mistake |
|--------|---------|----------------|
| `full_ban` | ALL forms prohibited by law — chrysotile, crocidolite, amosite, tremolite, actinolite, anthophyllite | Calling a country `full_ban` when only amphiboles are banned |
| `partial_ban` | Some forms banned, others legal (most often: amphiboles banned, chrysotile still allowed) | Calling this `no_ban` because "the main ban is not complete" |
| `no_ban` | **Verified** that NO national restriction exists on any form | Using this when you simply found no information — that's `unknown` |
| `de_facto_ban` | No formal law, but verified zero imports + zero domestic use for 10+ years | Only use with positive evidence of cessation, not assumption |
| `unknown` | Regulatory status genuinely unclear after research | Default when in doubt — never assume `no_ban` |

### ⚠️ The Chrysotile Trap (Most Common Error)

**Chrysotile (white asbestos)** accounts for ~95% of global asbestos use. Many countries banned **amphibole fibers** (crocidolite = blue, amosite = brown, tremolite, etc.) years or decades before banning chrysotile — or never banned chrysotile at all. This creates a dangerous classification error:

> "Country X banned asbestos in 1997" → might mean **only crocidolite** → `partial_ban`, not `full_ban`

**Always ask:** Does the ban explicitly cover chrysotile/white asbestos? If no or unclear → `partial_ban` or `unknown`.

Real cases discovered in ToxinFree data:
- **Sri Lanka**: ban_details said "crocidolite banned 1997, chrysotile legal" but ban_status was `no_ban` → corrected to `partial_ban`
- **Mexico**: shown as `no_ban` when crocidolite/amosite banned 2004 → corrected to `partial_ban`

### Verification Checklist

Answer ALL 6 questions with source URLs before assigning `ban_status`:

1. **Is this country on the IBAS full ban list?**
   - Check: [IBAS Chronological Ban List](https://ibasecretariat.org/alpha_ban_list.php)
   - If YES → likely `full_ban` (verify which forms)
   - If NO → continue to question 2

2. **What specific asbestos forms are banned?**
   - Amphiboles only (crocidolite, amosite) → `partial_ban`
   - All forms including chrysotile → `full_ban`
   - None confirmed → continue to question 3
   - Source required: legislation text or official government page

3. **Is chrysotile specifically addressed?**
   - Legal → `partial_ban` (if amphiboles banned) or `no_ban` (if nothing banned)
   - Banned → strengthens `full_ban` case
   - Not mentioned → likely `partial_ban` if anything else is banned
   - Check: UN Comtrade chrysotile import data for this country

4. **What year did each restriction take effect?**
   - Use the earliest restriction year for `ban_year` only if it's a `full_ban`
   - For `partial_ban`, `ban_year` = year of first restriction
   - Source: government gazette, law number/decree number

5. **Is there evidence of enforcement?**
   - Customs inspections? Factory closures? Prosecutions?
   - No enforcement evidence ≠ `de_facto_ban` by itself
   - Source: regulatory agency reports, news

6. **Internal consistency check (run LAST, before writing JSON):**
   - Does your `ban_status` match the `ban_details` text you wrote?
   - Does your `ban_status` match the `type` fields in your timeline events?
   - If a timeline event has `type: "partial_ban"` → `ban_status` cannot be `no_ban`
   - If `ban_details` says "chrysotile remains legal" → `ban_status` cannot be `full_ban`
   - Does `chrysotile_status` align? (`full_ban` requires `chrysotile_status: banned`; `chrysotile_status: legal` blocks `full_ban`)
   - **Any contradiction = stop and resolve before continuing**

### Decision Tree

```
Has ANY asbestos restriction been legally enacted?
├─ NO (verified via IBAS + gov sources) → no_ban
├─ UNCLEAR (couldn't confirm either way) → unknown  ← DEFAULT WHEN IN DOUBT
└─ YES → What forms?
    ├─ All forms including chrysotile → full_ban
    ├─ Only amphiboles / only some forms → partial_ban
    └─ Unclear which forms → partial_ban (conservative) + note in Verification Notes
```

### Ban Status Conclusion

- **ban_status:** `{full_ban | partial_ban | no_ban | de_facto_ban | unknown}`
- **chrysotile_status:** `{banned | legal | unclear}`
- **ban_year:** `{YYYY | null}`
- **Summary:** {1-2 sentence plain-English statement of what is and isn't banned, citing the legal instrument}

---

## 2. Regulatory Timeline

Chronological list of every regulatory action related to asbestos in this country. Each entry must include the legal instrument name/number if it exists.

| Year | Event | Legal Instrument | Source |
|------|-------|-----------------|--------|
| 1983 | First partial restriction on blue asbestos | Regulation No. XXX | [source](url) |
| 1999 | Total ban on all forms | Act/Law name | [source](url) |

### Context
{2-3 paragraphs explaining the regulatory journey — what drove each change, what resistance existed, how long the process took}

---

## 3. Historias de Resistencia (Activism Stories)

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

### Joint/Paired Resistance Stories
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

## 5. Corporate Responsibility

Document companies involved in asbestos production, import, or use in this country. Only include facts from court documents, regulatory findings, or investigative journalism.

### {Company Name}
- **Role:** {Producer / Importer / Manufacturer / Mine operator}
- **Period of activity:** {Years}
- **Legal outcomes:** {Lawsuits, convictions, settlements — with court/case references}
- **Current status:** {Still operating? Dissolved? Renamed?}
- **Source:** [source](url)

---

## 6. Mortality & Health Impact

| Metric | Value | Year | Source |
|--------|-------|------|--------|
| Mesothelioma deaths/year | X | 20XX | [source](url) |
| Asbestosis deaths/year | X | 20XX | [source](url) |
| Estimated exposed workers | X | 20XX | [source](url) |
| Estimated buildings at risk | X | 20XX | [source](url) |

### Context
{Interpretation of the data — trends, comparison to regional averages, data gaps}

---

## 7. Current Status (What's Happening NOW?)

- **Is the ban being enforced?** {Evidence of enforcement or lack thereof}
- **Ongoing removal programs?** {Government or private initiatives}
- **Pending legislation?** {Any bills or proposals in progress}
- **Active lawsuits?** {Major ongoing cases}
- **Recent news:** {Most recent developments, with dates}

Each point must have a source dated within the last 24 months if possible.

---

## 8. Local Resources

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

## 9. Data for countries.json (INTEGRATION GUIDE)

At the end of your research, extract these fields for integration into the website database. This makes the transition from research → live site seamless.

```json
{
  "slug": "country-slug-here",
  "name": "Official Country Name",
  "ban_status": "full_ban|partial_ban|no_ban|de_facto_ban|unknown",
  "chrysotile_status": "banned|legal|unclear",
  "ban_year": 2019,
  "ban_details": "Detailed description of what was banned and when",
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
      "achievement": "What they accomplished",
      "quote": "Exact verified quote",
      "quote_source": "Publication, date",
      "role_type": "journalist|advocate|victim|scientist|legal|network",
      "photo_url": "/images/countries/{slug}/resistance-stories/{name}.webp"
    }
  ],
  "joint_resistance_story": {
    "title": "English title for the joint story",
    "people": [
      {"name": "Person A", "role": "Role"},
      {"name": "Person B", "role": "Role"}
    ],
    "years": "2014–2019",
    "narrative": "Narrative of their joint work and impact",
    "photo_url": "/images/countries/{slug}/resistance-stories/{photo-filename}.webp",
    "source_url": "https://source-url-here"
  },
  "timeline": [
    {
      "year": 1999,
      "event": "English timeline event",
      "type": "ban|partial_ban|regulation|court_ruling|other",
      "source_url": "https://source-url"
    }
  ]
}
```

**Instructions:**
- Only include fields you have verified sources for. If a string field has no data, omit the key. If a numerical field (`ban_year`, `mesothelioma_rate`, `mesothelioma_source_year`) cannot be verified, use **`null`** — never `0`, never a string like `"Unknown"`, never omit the key.
- `chrysotile_status` must be internally consistent with `ban_status`: `full_ban` requires `chrysotile_status: "banned"`; `chrysotile_status: "legal"` blocks `full_ban` (must be `partial_ban`, `no_ban`, or `unknown`).
- For `role_type`, choose the primary role that best matches the person's main contribution.
- `priority` should be `"high"` if this is in ToxinFree's initial 15-country focus; `"medium"` or `"low"` otherwise.
- All URLs must be verified and accessible.
- **Do NOT generate Spanish (`_es`) fields.** Translation happens downstream via the project's i18n pipeline (`src/messages/en.json` / `es.json`). Adding `_es` fields here duplicates that work and risks drift.
```

## Search Strategy by Section

When researching, use these search patterns (adapt to each country):

**Ban Status (run ALL — the chrysotile trap requires specific queries):**
- `"{country}" site:ibasecretariat.org` (check if on IBAS ban list)
- `"{country}" chrysotile asbestos legal banned`
- `"{country}" crocidolite amosite ban`
- `"{country}" asbestos legislation decree law number year`
- `site:comtrade.un.org "{country}" asbestos` (import data to detect ongoing use)

**Timeline:**
- `"{country}" asbestos ban regulation history`
- `"{country}" asbestos legislation chronology`
- `"{country}" asbestos ban law year`

**Activism:**
- `"{country}" asbestos activist victim movement`
- `"{country}" asbestos ban campaign who fought`
- `"{country}" mesothelioma victim advocacy`
- `"{country}" asbestos couple family activism` (joint/paired stories)

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
- `"{country}" asbestos removal program` (add current year)
- `"{country}" asbestos policy update recent`

## Quality Checklist (Run Before Finishing)

Before marking the research as complete, verify every item:

### 🔴 Ban Status Consistency (non-negotiable)
- [ ] `ban_status` field matches what `ban_details` text says — if text says "chrysotile remains legal", status cannot be `full_ban`
- [ ] `ban_status` field matches all `type` fields in timeline events — if any event has `type: "partial_ban"`, status cannot be `no_ban`
- [ ] `chrysotile_status` aligns with `ban_status` (see coherence rules in Section 1, Q6)
- [ ] `no_ban` was assigned because no restriction was **positively verified** — NOT because no information was found (that's `unknown`)
- [ ] Chrysotile specifically addressed — confirmed banned (→ `full_ban`) or confirmed legal (→ `partial_ban`/`no_ban`) or unclear (→ `partial_ban` conservatively)
- [ ] `ban_year` corresponds to the ban event listed in the timeline

### 🟡 Data Integrity
- [ ] Every factual claim has a source URL
- [ ] No quotes are fabricated — all are from published sources with URL
- [ ] Dates are specific (year minimum, month if known)
- [ ] Names are spelled correctly (cross-referenced across 2+ sources)
- [ ] Legal instrument names and decree/law numbers included where they exist
- [ ] Mortality data cites specific year and database (WHO, national registry)
- [ ] Corporate section uses only court records, regulatory findings, or journalism — no assumptions
- [ ] Unverified numerical values in the JSON are `null` (never `0` or `"Unknown"`)

### 🟢 Coverage
- [ ] Section 1 (Ban Status Verification) completed FIRST with all 6 questions answered
- [ ] Joint/Paired stories section checked — is there a couple or co-founders worth documenting?
- [ ] "Current Status" section has at least one source dated within the last 24 months
- [ ] All URLs verified accessible at time of research
- [ ] Verification Notes section honestly lists every gap and unresolved contradiction
- [ ] The document could be read by the activists named in it without finding errors
- [ ] Section 9 JSON block filled out and cross-checked against the narrative
- [ ] File saved to `docs/research/{country-slug}-research.md`

## Language

Write the research output in English. The translation to Spanish will happen separately during integration into the website via the project's i18n pipeline (`src/messages/`). Use clear, factual prose at an 8th-grade reading level (the ToxinFree standard for global accessibility).
