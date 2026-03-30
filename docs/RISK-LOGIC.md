# RISK-LOGIC.md — Risk Assessment Algorithm v2.1

## Overview
The Risk Checker calculates a risk score (0.0 to 1.0) based on three inputs:
1. Country (regulatory status at time of construction)
2. Year/decade of construction
3. Property type

The score maps to a human-readable risk level and a list of likely materials.

## Calculation (v2.1 — Weighted Average)

```
final_score = min((country_factor × 0.45) + (era_factor × 0.35) + (building_factor × 0.20), 1.0)
```

**Why weighted average (v2.1)?** The previous multiplicative formula (`country × era × building`) diluted risk artificially by compounding decimals. Example: Germany 1985 apartment → 0.8 × 0.5 × 0.9 = 0.36 (LOW) — a false negative. Weighted average: (0.8×0.45) + (0.5×0.35) + (0.75×0.20) = 0.685 (HIGH) — correct.

**Weights** (from `risk-matrix.json`):
- Country: **0.45** (strongest signal — regulatory status is the primary determinant)
- Era: **0.35** (construction decade predicts material type)
- Building: **0.20** (building type affects quantity, not presence)

### Step 1: Country Factor (weight: 0.45)
Determines what regulations existed in the user's country at the time of construction.

**Per-country overrides** (18 countries with dynamic pre/post-ban factors):
```
Override logic:
  IF country has override AND ban_year is null → always use pre_ban factor
  IF country has override AND construction_year < ban_year → use pre_ban factor
  IF country has override AND construction_year >= ban_year → use post_ban factor
```

Examples from `risk-matrix.json`:
- Australia: pre_ban **0.95**, post_ban **0.05** (ban year 2003)
- India: pre_ban **0.95**, post_ban **0.95** (no ban — same factor always)
- United Kingdom: pre_ban **0.85**, post_ban **0.10** (ban year 1999)

**Generic fallback** (for countries without overrides):
```
no_ban_at_construction:    0.90
partial_ban_at_construction: 0.60
full_ban_at_construction:  0.10
unknown:                   0.55
```

### Step 2: Era Factor (weight: 0.35)
Based on the midpoint year of each construction era:
```
pre_1940:   0.70  (asbestos used but not yet mass-produced)
1940_1960:  0.90  (post-WWII construction boom, heavy asbestos use)
1960_1980:  1.00  (peak global asbestos consumption, 1973 was US peak)
1980_2000:  0.50  (bans starting, alternatives emerging)
post_2000:  0.20  (most developed countries banning, but some still using)
```

### Step 3: Building Factor (weight: 0.20)
Normalized to max 1.0 to prevent score overflow:
```
residential: 0.80
apartment:   0.75
school:      0.90  (higher concern: children more vulnerable)
office:      0.65
factory:     1.00  (heaviest industrial use of asbestos)
```

### Step 4: Score → Risk Level
```
0.00 - 0.29  →  LOW       (green)   — "Low likelihood of asbestos materials"
0.30 - 0.59  →  MODERATE  (amber)   — "Some asbestos materials may be present"
0.60 - 0.79  →  HIGH      (red)     — "Asbestos materials likely present"
0.80 - 1.00  →  CRITICAL  (dark red) — "High probability of multiple asbestos materials"
```

### Step 5: Material Matching
Based on era and country, filter `materials.json` to show relevant materials.

```
Show material IF:
  material.era_start <= construction_year <= material.era_end
  AND (material.prevalence_regions includes country.region OR "global")
  AND material.building_types includes selected building_type
```

Sort by: risk_when_damaged descending (show most dangerous first).

## Example Calculations (v2.1)

### Example 1: House in India, built 1970
- Country: India override → pre_ban = 0.95 (no ban)
- Era: 1960–1980 → era_factor = 1.00
- Building: Residential → building_factor = 0.80
- **Score: (0.95×0.45) + (1.00×0.35) + (0.80×0.20) = 0.4275 + 0.35 + 0.16 = 0.9375 → CRITICAL**

### Example 2: Apartment in Germany, built 1985
- Country: Germany override → pre_ban = 0.80 (ban in 1993, so 1985 is pre-ban)
- Era: 1980–2000 → era_factor = 0.50
- Building: Apartment → building_factor = 0.75
- **Score: (0.80×0.45) + (0.50×0.35) + (0.75×0.20) = 0.36 + 0.175 + 0.15 = 0.685 → HIGH**

### Example 3: School in Mexico, built 1955
- Country: Mexico override → pre_ban = 0.90 (no ban)
- Era: 1940–1960 → era_factor = 0.90
- Building: School → building_factor = 0.90
- **Score: (0.90×0.45) + (0.90×0.35) + (0.90×0.20) = 0.405 + 0.315 + 0.18 = 0.90 → CRITICAL**

### Example 4: Office in Australia, built 2010
- Country: Australia override → post_ban = 0.05 (ban in 2003, so 2010 is post-ban)
- Era: post_2000 → era_factor = 0.20
- Building: Office → building_factor = 0.65
- **Score: (0.05×0.45) + (0.20×0.35) + (0.65×0.20) = 0.0225 + 0.07 + 0.13 = 0.2225 → LOW**

## Disclaimers (displayed with every result)
1. "This assessment is based on general data about construction practices and regulations. It is NOT a substitute for professional asbestos inspection."
2. "The only way to confirm the presence of asbestos is through laboratory testing by a certified professional."
3. "Even in low-risk assessments, asbestos may still be present in individual buildings."
4. "If you plan to renovate or demolish, always consult a certified asbestos professional first."

## Source Files
- Algorithm: `src/lib/calculators/asbestos-risk-calculator.ts`
- Risk matrix data: `src/data/risk-matrix.json`
- Materials data: `src/data/materials.json`
- Tests: `src/__tests__/asbestos-risk-calculator.test.ts`

## Future Improvements (v2+)
- More granular country data (state/province level regulations)
- Street address → approximate construction year (using public property records where available)
- Photo-based material identification (AI vision model — user uploads photo of ceiling/floor)
- Integration with local testing lab databases for "find a lab near you"
- Scientific citations for risk matrix multipliers (expert validation)
