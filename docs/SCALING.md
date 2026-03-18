# SCALING.md — Adding a New Substance to ToxinFree

This document describes how to add substance #2 (e.g. PFAS) or any subsequent substance to the platform. Follow these steps in order.

## Overview

ToxinFree is designed to expand from asbestos to other toxic substances (PFAS, lead, microplastics). The architecture separates:
- **Geographic/identity data** → `src/data/countries.json` (shared across all substances)
- **Regulatory data** → per-substance JSON files (e.g. `src/data/regulations/asbestos.json`)
- **Risk calculators** → per-substance calculators in `src/lib/calculators/`
- **UI/i18n** → substance-aware translations in `src/messages/`

---

## Step-by-Step: Adding Substance #2

### 1. Register the substance

Edit `src/data/substances.ts`. Set `active: true` for the new substance and fill in its `stats` object:

```typescript
{ id: "pfas", active: true, color: "#3B82F6", stats: { ... } }
```

---

### 2. Create the regulatory data file

Create `src/data/regulations/{substance}.json`.

For PFAS, this would be `src/data/regulations/pfas.json`. The schema should include:
- Country-level regulation status (`banned`, `restricted`, `no_ban`, `unknown`)
- Ban/restriction year
- Key timeline events with source URLs
- Regional prevalence notes

Reference `src/data/countries.json` for the base schema pattern. The `slug`, `iso2`, `iso3` fields must match the shared `countries.json` so data can be joined at runtime.

---

### 3. Create the risk calculator

Create `src/lib/calculators/{substance}-risk-calculator.ts`.

Copy `src/lib/calculators/asbestos-risk-calculator.ts` as a template. Implement:
- `calculateRisk(country, era, buildingType): RiskResult` — substance-specific scoring logic
- `getEraFromYear(year): Era` — if eras differ from asbestos (they may not)

Then register it in `src/lib/calculators/index.ts`:

```typescript
import { calculateRisk as calculatePfasRisk } from "./pfas-risk-calculator";

export function getCalculator(substanceId: string) {
  if (substanceId === "asbestos") return { calculateRisk };
  if (substanceId === "pfas") return { calculateRisk: calculatePfasRisk };
  throw new Error(`No calculator found for substance: ${substanceId}`);
}
```

---

### 4. Add i18n keys

In `src/messages/en.json` and `src/messages/es.json`, add substance-specific labels under the existing namespaces:

- `home.substance_{id}` — substance pill label (already structured)
- Any substance-specific UI strings (check page intro, learn page content, etc.)

---

### 5. Create educational content pages

Add learn pages under `src/app/[locale]/learn/` following the same pattern as `what-is-asbestos/page.tsx`:
- `what-is-{substance}/page.tsx`
- `where-{substance}-hides/page.tsx`
- (additional pages as needed)

---

### 6. Create country profile pages (if different route needed)

If the substance needs its own country pages (e.g. `/country/{slug}/pfas`), create:
- `src/app/[locale]/country/[slug]/pfas/page.tsx`

Otherwise, expand the existing country page template to show multi-substance data conditionally.

---

### 7. Update the sitemap

Edit `src/app/sitemap.ts` to include any new routes (learn pages, country substance pages).

---

### 8. Update the global map

The map in `src/components/map/` needs to be substance-aware. Pass the active substance as a prop and render the appropriate color scale from the substance's regulatory data.

---

### 9. Run build verification

```bash
npm run type-check   # must pass with 0 errors
npm run build        # must pass with 0 errors
```

---

## TypeScript Types

When adding a new substance, you may need to extend `src/lib/types.ts`:
- Add new types for the substance's specific data schema
- The `RiskLevel` type (`low | moderate | high | critical`) is shared across substances and should not change
- The `Era` type may be reused or extended as needed

---

## Data Sources for PFAS (v2 reference)

- **EPA PFAS Data**: https://www.epa.gov/pfas
- **EWG PFAS Map**: https://www.ewg.org/tapwater/
- **ECHA (EU)**: https://www.echa.europa.eu/hot-topics/perfluoroalkyl-chemicals-pfas
- **ITRC PFAS**: https://pfas-1.itrcweb.org/
