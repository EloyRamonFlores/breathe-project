# ToxinFree Research — Content Layering Model

This directory contains deep investigative research on each country's asbestos history, built via the `country-research` skill. Not all of this research goes to the public product directly — it's intentionally organized in **four layers**, each with a different audience and purpose.

## The 4-Layer Model

```
┌─────────────────────────────────────────────────────────┐
│ LAYER 1 — Essentials (country page, above the fold)     │
│ Audience: casual visitor asking "am I at risk?"         │
│ Content: ban year, status, mortality rate, 1 key story  │
│ Max read time: 30 seconds                               │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ LAYER 2 — Actionable Context (country page, scroll)     │
│ Audience: engaged user planning a decision              │
│ Content: exposure zones, timeline, law-vs-reality gap,  │
│          material guide, resistance figures             │
│ Max read time: 3–5 minutes                              │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ LAYER 3 — Archivo Centinela (future /country/X/archivo) │
│ Audience: journalist, researcher, family of victim      │
│ Content: corporate history, litigation, full mortality  │
│          context, verification notes, full sources      │
│ Max read time: 15–30 minutes                            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ LAYER 4 — Internal Notes (docs/research/*.md only)      │
│ Audience: Claude, future researchers, me                │
│ Content: [UNVERIFIED] tags, contradictions, TODOs,      │
│          "Suggested Improvements", working hypotheses   │
│ Never public.                                           │
└─────────────────────────────────────────────────────────┘
```

## Publication Criteria — What Goes Where

### Layer 1 (country page, hero)
- Ban year + ban status (always)
- Mortality rate (if verified, with source year)
- Peak usage era
- One defining sentence about the country's ban story
- Link to Risk Checker

### Layer 2 (country page, detailed sections)
- **Regulatory timeline** — verified, sourced
- **Resistance stories** — max 4 per country, one always a "joint story" if documented
- **Material identification guide** — items with HIGH confidence sourcing
- **Geographic hotspots ("Zonas de Exposición")** — specific named locations with documented contamination, sourced
- **Law vs. implementation indicator** — ONLY when Tier 1 source (IBAS, HSE, government report) explicitly documents a gap between formal ban and actual enforcement
- **Current status** — enforcement evidence, ongoing programs, source dated <24 months

### Layer 3 (future Archivo Centinela page)
- **Full regulatory timeline** — every SI/law/decree with full text links
- **Corporate responsibility** — companies, litigation, settlements, trust funds (cite court records only)
- **Complete local resources directory** — every NGO, support group, legal aid
- **Mortality deep-dive** — breakdown by disease, region, gender, temporal trends
- **Verification Notes section** — publicly visible data gaps and contradictions (this is a credibility feature, not a weakness)
- **Source index** — all URLs, accessed dates

### Layer 4 (internal only — stays in docs/research/*.md)
- `[UNVERIFIED — needs source]` claims
- "Suggested Improvements" section
- Working hypotheses not yet sourced
- Researcher-to-researcher notes
- Draft stories waiting for source confirmation
- Contradictions still being investigated

## Content Promotion Rules

**From Layer 4 → Layer 3:** requires at least 2 Tier 1/2 sources with URLs, no outstanding contradictions.

**From Layer 3 → Layer 2:** requires the information to be **actionable** by a user (they can do something with it) AND **non-alarmist** (see Principle #7 in the skill: presence + condition + protection framing).

**From Layer 2 → Layer 1:** requires the information to be **essential** (someone seeing only this should understand the country's core status) AND **readable in under 30 seconds**.

**Demotion is allowed.** If a Layer 2 claim turns out to be poorly sourced, move it back to Layer 4 (`[UNVERIFIED]`) until re-verified.

## Why This Model Exists

Before this model, there was a risk of two opposite failures:

1. **Alarmism** — dumping research scare-stats (e.g., "80% of schools contain asbestos") on country pages without condition/mitigation context, generating panic.
2. **Waste** — doing deep research on corporate liability, litigation, compensation schemes, and never exposing it publicly, defeating the platform's "dejar huella" mission.

The 4-layer model resolves both by giving every piece of research a **destination**. Nothing is wasted, nothing is alarmist.

## Related Files

- [.skills/country-research/SKILL.md](../../.skills/country-research/SKILL.md) — the research skill itself. Principle #7 governs stat discipline.
- [src/data/countries.json](../../src/data/countries.json) — Layer 1+2 data (what the product consumes)
- [docs/research/*.md](.) — Layer 3+4 raw research documents

## For Future Researchers (Human or LLM)

When researching a country, you fill in **all four layers** in a single research document. The skill's template includes sections for each. The promotion/demotion happens later at integration time, following the rules above.

If you find yourself unsure whether something belongs in Layer 2 or Layer 3, default to **Layer 3** (archivo). Layer 2 is a high bar: essential + actionable + non-alarmist.
