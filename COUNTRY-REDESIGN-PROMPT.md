# Country Page Redesign — Claude Code Prompt

**Model**: opus | **Thinking**: high | **Plugins**: frontend-design, typescript-lsp, context7, security-guidance

## Context

Read these files first:
- `CLAUDE.md` (project rules)
- `docs/DESIGN.md` (design system — dark theme, editorial feel, Bloomberg terminal meets Our World in Data)
- `src/app/[locale]/country/[slug]/page.tsx` (current country page — 499 lines)
- `src/components/country/ResistanceStories.tsx` (current activist cards)
- `src/components/ui/Timeline.tsx` (current timeline)
- `src/data/countries.json` (search for "united-kingdom" to see data schema)
- `docs/research/united-kingdom-research.md` (deep research with sources)

## Vision

Transform the country profile page from a **data sheet** into an **editorial experience**. Think: a documentary opening credits sequence meets a Bloomberg country report. The page should make you feel the weight of the country's asbestos history — not just list facts.

**Key reference**: The current page is `max-w-3xl` centered text. The redesign should be **full-width hero** + **structured editorial sections** while keeping the dark theme and data-forward identity.

## Design Spec

### 1. Hero Section (full-width, cinematic)

Replace the current emoji flag + h1 header with a full-width hero:

```
┌──────────────────────────────────────────────────────┐
│  [Full-width background image — dark overlay]         │
│                                                       │
│  🇬🇧 SENTINEL ARCHIVE / CASE #044                     │
│                                                       │
│  United Kingdom                                       │
│                                                       │
│  Despite being among the first to acknowledge...      │
│                                                       │
│  ┌─────────────────────┐                              │
│  │ AÑO DE PROHIBICIÓN  │                              │
│  │ 1999                │                              │
│  │ Total ban on...     │                              │
│  └─────────────────────┘                              │
└──────────────────────────────────────────────────────┘
```

**Implementation:**
- Full viewport width (`w-full`), min-height `60vh` on desktop, `40vh` on mobile
- Background: CSS gradient overlay (from-black/70 via-black/50 to-transparent) over a placeholder div with a subtle pattern or darkened texture. Do NOT hardcode real photos — instead use a **generative CSS pattern** (diagonal lines, grid dots, or noise texture) that varies by region. This keeps the cinematic feel without requiring images.
- Flag emoji large (text-4xl), "SENTINEL ARCHIVE / CASE #XXX" in uppercase mono tracking-widest (case number = country's index in the dataset)
- Country name: `text-5xl sm:text-6xl lg:text-7xl font-serif font-bold` (use Instrument Serif)
- Ban details paragraph: max-w-xl, text-lg, text-text-secondary
- Stats card: positioned absolutely bottom-right on desktop, stacked below on mobile. Glass-morphism effect (`bg-bg-secondary/80 backdrop-blur-sm border border-bg-tertiary/50`). Shows ban year (large mono number in status color) + one-line ban description.

**Data needed in countries.json (new optional fields):**
```typescript
hero_pattern?: "parliament" | "industry" | "urban" | "mining" | "coastal" | "default"
// Maps to CSS background patterns. No actual images needed.
```

### 2. Key Statistics (redesigned)

Move from the current 3-column grid to a horizontal **stat strip** below the hero:

```
┌──────────┬──────────┬──────────┬──────────┐
│ Ban Year │ Meso Rate│ Buildings│ Peak Era │
│ 1999     │ 36.2     │ 6M+      │ 1950-1980│
└──────────┴──────────┴──────────┴──────────┘
```

- Full-width bar, `bg-bg-secondary border-y border-bg-tertiary`
- 4 stats in a row (scrollable on mobile if needed)
- Each stat: value in large mono font + label in small caps below
- Values use status-appropriate colors (ban year green, meso rate red/amber)

### 3. Regulatory Timeline (redesign from vertical dots to horizontal)

Replace the current vertical dot timeline with a **horizontal scrollable timeline** that feels more like a documentary sequence:

```
──●────────●────────●────────●────────●────────●──►
  1924     1969     1985     1999     2012     2024
  First    Regs     Import   Full     Control  HSE
  death    Intro    ban      ban      of Asb.  Report
```

**Implementation:**
- Horizontal scroll container with snap points
- Each event is a card: year (large mono), event type badge, description
- Color-coded dots by event type (same colors as current: ban=green, regulation=blue, court=amber)
- On mobile: stays horizontal, swipeable
- On desktop: shows all events if they fit, scrollable if not
- Each card ~200px wide, with the connecting line between them
- The final event should have a pulsing dot if the country has ongoing activity

**Alternative if horizontal is too complex**: Keep vertical but make it more visual:
- Wider timeline cards with more padding
- Add a subtle colored left border per event type (not just a dot)
- Group events by decade with decade headers
- Add expand/collapse for events with long descriptions

### 4. Stories of Resistance (redesign with photo placeholders)

Transform from the current 2-column card grid to a more **editorial layout**:

```
┌─────────────────────────────────────────────┐
│  HISTORIAS DE RESISTENCIA                    │
│  The pioneers who fought for justice         │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────┐  Nellie Kershaw                   │
│  │ foto │  PIONEER VICTIM · 1891-1924        │
│  │ or   │                                    │
│  │ init │  The textile worker whose death...  │
│  └──────┘                                    │
│                                              │
│  ─────────────────────────────────────────── │
│                                              │
│  ┌──────┐  Nancy Tait                        │
│  │ foto │  ADVOCACY LEADER · 1978-present    │
│  │ or   │                                    │
│  │ init │  Founded SPAID after her...         │
│  └──────┘                                    │
└─────────────────────────────────────────────┘
```

**Implementation:**
- Each story is a full-width row (not a card grid)
- Left: avatar placeholder — a **circle with the person's initials** in a colored background (warm amber for activists). Use the first letters of first and last name. If we later add real photos, the `photo_url` field will override this.
- Right: name (h3, bold), role badge (mono, uppercase, colored by type: "PIONEER VICTIM" in red, "ADVOCACY LEADER" in amber, "LEGAL WARRIOR" in blue, "GLOBAL NETWORK" in emerald), years, achievement text, quote if available
- Separator line between stories
- Mobile: stack vertically, avatar above text
- Add amber left border to the section (2px solid warning color)

**Data needed in countries.json (new optional fields on ResistanceStory):**
```typescript
photo_url?: string  // Optional — Wikimedia/CC image URL. If null, show initials.
role_type?: "victim" | "advocate" | "legal" | "network" | "journalist" | "scientist"
// Maps to color and badge label
```

### 5. Material Identification Guide (new visual section)

Replace the current plain pill tags with a **visual material guide**:

```
┌──────────────────────────────────────────────┐
│  MATERIAL IDENTIFICATION GUIDE               │
│  Common materials still present in UK buildings│
├──────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ pattern │  │ pattern │  │ pattern │      │
│  │ texture │  │ texture │  │ texture │      │
│  ├─────────┤  ├─────────┤  ├─────────┤      │
│  │ Artex   │  │ Floor   │  │ Roofing │      │
│  │ Coatings│  │ Tiles   │  │ Sheets  │      │
│  │ ⚠ HIGH  │  │ ⚠ MOD   │  │ ⚠ HIGH  │      │
│  └─────────┘  └─────────┘  └─────────┘      │
└──────────────────────────────────────────────┘
```

**Implementation:**
- Grid of cards (3 on desktop, 2 on mobile)
- Each card: a colored **abstract pattern** at top representing the material texture (CSS-only: diagonal lines for corrugated, dots for artex, cross-hatch for tiles — no real images needed), material name, risk level badge
- The patterns are purely CSS (`background-image: repeating-linear-gradient(...)` etc.)
- Risk levels from `materials.json` matched by name
- Cards link to `/learn/where-it-hides` for more info

**Data integration:**
- Match `common_materials` strings from the country to entries in `materials.json` to get risk levels
- Use `materials.json` `risk_level` field for the badge color

### 6. Keep Everything Else

The following sections should remain largely the same (just inheriting the new spacing and typography):
- What To Do (keep as-is, maybe add an icon per recommendation)
- CTA to Risk Checker (keep as-is)
- Sources (keep as-is)
- Disclaimer (keep as-is)

## Technical Requirements

- TypeScript strict — no `any` types
- All new text through i18n (`en.json` + `es.json`)
- Server components where possible; `"use client"` only for interactive parts (timeline scroll, material hover)
- Mobile-first responsive design
- Semantic HTML + ARIA labels
- Must pass: `npm run type-check && npm test && npm run build`
- Must generate 426+ static pages without errors
- Performance: no new external dependencies for images. CSS-only patterns.
- The hero section and stat strip should be full-width, but text content below should remain `max-w-4xl` (bumped from 3xl for the wider layout)

## New i18n Keys Needed

```
country.sentinel_archive: "SENTINEL ARCHIVE" / "ARCHIVO CENTINELA"
country.case_number: "CASE" / "CASO"
country.material_guide_title: "Material Identification Guide" / "Guía de Identificación de Materiales"
country.material_guide_subtitle: "Common domestic and industrial applications still present in {country} buildings" / "Aplicaciones domésticas e industriales comunes aún presentes en edificios de {country}"
country.material_risk_high: "HIGH RISK" / "RIESGO ALTO"
country.material_risk_moderate: "MODERATE" / "MODERADO"
country.material_risk_low: "LOW" / "BAJO"
country.material_learn_more: "Learn more" / "Saber más"
country.resistance_role_victim: "PIONEER VICTIM" / "VÍCTIMA PIONERA"
country.resistance_role_advocate: "ADVOCACY LEADER" / "LÍDER DE DEFENSA"
country.resistance_role_legal: "LEGAL WARRIOR" / "GUERRERO LEGAL"
country.resistance_role_network: "GLOBAL NETWORK" / "RED GLOBAL"
country.resistance_role_journalist: "JOURNALIST" / "PERIODISTA"
country.resistance_role_scientist: "SCIENTIST" / "CIENTÍFICO"
```

## Files to Modify

1. `src/app/[locale]/country/[slug]/page.tsx` — Major rewrite of layout
2. `src/components/country/ResistanceStories.tsx` — Redesign to editorial rows with initials
3. `src/components/ui/Timeline.tsx` — Redesign to horizontal or enhanced vertical
4. **NEW** `src/components/country/CountryHero.tsx` — Hero section (can be server component)
5. **NEW** `src/components/country/StatStrip.tsx` — Horizontal stat bar
6. **NEW** `src/components/country/MaterialGuide.tsx` — Visual material cards (`"use client"`)
7. `src/lib/types.ts` — Add optional fields: `hero_pattern`, `photo_url`, `role_type`
8. `src/data/countries.json` — Add `hero_pattern` and `role_type` to existing entries
9. `src/messages/en.json` + `es.json` — New keys
10. `src/styles/globals.css` — CSS patterns for hero backgrounds and material textures (if needed)

## Verification

- [ ] UK country page renders with cinematic hero
- [ ] Stats display in horizontal strip
- [ ] Timeline is more visual (horizontal or enhanced vertical)
- [ ] Activist stories show initials in colored circles
- [ ] Material guide shows CSS patterns with risk levels
- [ ] Mobile responsive at 375px, 768px, 1280px
- [ ] Spanish version renders correctly at /es/country/united-kingdom
- [ ] Country pages WITHOUT resistance_stories or timelines still render (graceful fallback)
- [ ] `npm run type-check` passes
- [ ] `npm test` passes (81 tests)
- [ ] `npm run build` produces 426+ pages
- [ ] No new external image dependencies

## Update After Completion

- `CHANGELOG.md` — Add v1.18.0 entry with "Country page editorial redesign"
