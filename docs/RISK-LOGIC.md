# RISK-LOGIC.md — Risk Assessment Algorithm

## Overview
The Risk Checker calculates a risk score (0.0 to 1.0) based on three inputs:
1. Country (regulatory status at time of construction)
2. Year/decade of construction
3. Property type

The score maps to a human-readable risk level and a list of likely materials.

## Calculation

```
final_score = country_factor × era_factor × building_factor
```

### Step 1: Country Factor
Determine what regulations existed in the user's country at the time of construction.

```
IF country had NO ban at construction year → 0.9
IF country had PARTIAL restrictions       → 0.6
IF country had FULL ban before construction → 0.2
IF unknown                                → 0.5
```

**Logic**: A country with no ban in 1965 gets 0.9. The same country that banned asbestos in 1990 still gets 0.9 for a building constructed in 1965 (ban came after construction).

### Step 2: Era Factor
```
Pre-1940:   0.7  (asbestos used but not yet mass-produced)
1940-1960:  0.9  (post-WWII construction boom, heavy asbestos use)
1960-1980:  1.0  (peak global asbestos consumption, 1973 was US peak)
1980-2000:  0.5  (bans starting, alternatives emerging)
Post-2000:  0.2  (most developed countries banning, but some still using)
```

### Step 3: Building Factor
```
Residential house:   1.0
Apartment building:  0.9
School:              1.1  (higher concern: children more vulnerable to exposure)
Office building:     0.8
Factory/industrial:  1.2  (heaviest industrial use of asbestos)
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

## Example Calculations

### Example 1: House in India, built 1970
- Country: India has NO ban (as of 2026) → country_factor = 0.9
- Era: 1960-1980 → era_factor = 1.0
- Building: Residential → building_factor = 1.0
- **Score: 0.9 × 1.0 × 1.0 = 0.90 → CRITICAL**
- Materials shown: cement roofing, floor tiles, pipe insulation, ceiling texture

### Example 2: Apartment in Germany, built 1985
- Country: Germany banned asbestos in 1993, so in 1985 it was partial → country_factor = 0.6
- Era: 1980-2000 → era_factor = 0.5
- Building: Apartment → building_factor = 0.9
- **Score: 0.6 × 0.5 × 0.9 = 0.27 → LOW**
- Materials shown: possibly some floor tiles, pipe lagging (fewer items)

### Example 3: School in Mexico, built 1955
- Country: Mexico has NO federal ban → country_factor = 0.9
- Era: 1940-1960 → era_factor = 0.9
- Building: School → building_factor = 1.1
- **Score: 0.9 × 0.9 × 1.1 = 0.89 → CRITICAL**
- Materials shown: cement roofing, ceiling tiles, pipe insulation, boiler insulation

## Disclaimers (displayed with every result)
1. "This assessment is based on general data about construction practices and regulations. It is NOT a substitute for professional asbestos inspection."
2. "The only way to confirm the presence of asbestos is through laboratory testing by a certified professional."
3. "Even in low-risk assessments, asbestos may still be present in individual buildings."
4. "If you plan to renovate or demolish, always consult a certified asbestos professional first."

## Future Improvements (v2+)
- More granular country data (state/province level regulations)
- Street address → approximate construction year (using public property records where available)
- Photo-based material identification (AI vision model — user uploads photo of ceiling/floor)
- Integration with local testing lab databases for "find a lab near you"
