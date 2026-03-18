# DATA.md — Data Architecture, Schema & Sources

## Data Philosophy
All data in v1 is **static JSON**. No backend, no database, no API calls at runtime.
This is intentional: static data is fast, free to host, and easy to verify.
Data updates happen via git commits — edit JSON → deploy → live in minutes.

## Primary Data Sources

### 1. IBAS — International Ban Asbestos Secretariat
- **URL**: https://www.ibasecretariat.org/alpha_ban_list.php (alphabetical ban list)
- **URL**: https://www.ibasecretariat.org/chron_ban_list.php (chronological timeline)
- **What it provides**: Country-by-country ban status, year of ban, type of ban, exceptions, chronological history of regulatory events
- **Reliability**: Gold standard. Maintained since 1999. Referenced by WHO, ILO, academic papers.
- **Update frequency**: Updated periodically (last update: Feb 17, 2026)
- **License**: Public information, non-commercial educational use

### 2. USGS — United States Geological Survey
- **URL**: https://minerals.usgs.gov/minerals/pubs/commodity/asbestos/
- **What it provides**: Production and consumption data by country, historical usage statistics
- **Format**: Excel/CSV files downloadable

### 3. WHO Mortality Database
- **URL**: https://platform.who.int/mortality
- **What it provides**: Mesothelioma mortality rates by country (ICD-10 code C45)
- **Format**: CSV downloadable

### 4. EPA (US Environmental Protection Agency)
- **URL**: https://www.epa.gov/asbestos
- **What it provides**: US-specific regulations, banned products list, building material guidance
- **Format**: Web pages, PDFs

### 5. UN Comtrade Database
- **URL**: https://comtradeplus.un.org/
- **What it provides**: International trade data for asbestos and asbestos-containing materials
- **Format**: API available, CSV export

## Multi-Substance Data Architecture (Future)

> **Note for v2+ development:** When adding a second substance (e.g. PFAS), follow this pattern:
>
> - Create `src/data/regulations/pfas.json` using the same schema as `countries.json` but scoped to PFAS regulatory data.
> - The `src/data/regulations/` directory will become the canonical location for all per-substance regulatory data.
> - Keep `src/data/countries.json` as the shared geographic/identity dataset (name, iso2, iso3, region, slug).
> - Each substance's regulatory status and timelines live in its own `regulations/{substance}.json` file.
> - See `docs/SCALING.md` for the complete step-by-step guide to adding a new substance.

## Data Files Schema

### countries.json
The core data file. One entry per country (195 total for v1, 15 fully detailed).

```typescript
interface Country {
  // Identity
  slug: string;              // "india", "united-states", "south-korea"
  name: string;              // "India"
  iso2: string;              // "IN" (for flag icons and map matching)
  iso3: string;              // "IND" (for GeoJSON matching)
  region: string;            // "South Asia" | "North America" | etc.
  
  // Regulatory Status
  ban_status: "full_ban" | "partial_ban" | "no_ban" | "de_facto_ban" | "unknown";
  ban_year: number | null;   // Year ban was enacted, null if no ban
  ban_details: string;       // Brief description: "Banned all types effective 2012"
  exceptions: string[];      // ["Existing diaphragms in chlor-alkali plants"]
  
  // Regulatory Timeline (for detailed country pages)
  timeline: TimelineEvent[]; // Chronological list of regulatory events
  
  // Risk Context
  peak_usage_era: string;    // "1940s-1970s" — when asbestos was most used
  common_materials: string[];// ["cement roofing", "floor tiles", "pipe insulation"]
  estimated_buildings_at_risk: string | null; // "~30 million" or null if unknown
  
  // Health Data
  mesothelioma_rate: number | null; // Deaths per million per year, null if unknown
  mesothelioma_source_year: number | null; // Year of the mortality data
  
  // Metadata
  priority: "high" | "medium" | "low"; // Content detail level
  sources: Source[];          // All data sources with URLs
  last_updated: string;       // ISO date: "2026-03-13"
}

interface TimelineEvent {
  year: number;
  event: string;             // "Banned crocidolite and amosite"
  type: "ban" | "partial_ban" | "regulation" | "court_ruling" | "other";
  source_url: string;
}

interface Source {
  name: string;              // "IBAS Ban List"
  url: string;
  accessed: string;          // ISO date
}
```

### materials.json
Asbestos-containing materials by construction era and risk level.

```typescript
interface Material {
  id: string;                // "cement-roofing", "vinyl-floor-tiles-9x9"
  name: string;              // "Asbestos-Cement Roofing Sheets"
  description: string;       // Plain language: what it looks like, where it's found
  
  // When it was used
  era_start: number;         // 1930
  era_end: number;           // 1980
  peak_decade: string;       // "1950s-1960s"
  
  // Risk assessment
  risk_when_intact: "low" | "moderate" | "high";
  risk_when_damaged: "low" | "moderate" | "high" | "critical";
  risk_when_disturbed: "moderate" | "high" | "critical";
  friability: "friable" | "non-friable"; // Friable = crumbles easily = more dangerous
  
  // Where in a building
  location: string[];        // ["roof", "exterior_walls"]
  building_types: string[];  // ["residential", "commercial", "industrial", "school"]
  
  // What to do
  recommendation_intact: string;     // "Monitor condition annually"
  recommendation_damaged: string;    // "Do not touch. Contact certified removal company."
  recommendation_renovation: string; // "Professional inspection required before ANY work."
  
  // Geography - where this material was most common
  prevalence_regions: string[]; // ["global", "north_america", "europe", "latin_america"]
  
  sources: Source[];
}
```

### risk-matrix.json
The scoring logic that powers the Risk Checker.

```typescript
interface RiskMatrix {
  // Base risk by country ban status at time of construction
  country_factor: {
    "no_ban_at_construction": number;      // 0.9
    "partial_ban_at_construction": number;  // 0.6
    "full_ban_at_construction": number;     // 0.2
    "unknown": number;                      // 0.5
  };
  
  // Risk multiplier by construction era
  era_factor: {
    "pre_1940": number;     // 0.7 (asbestos used but less common)
    "1940_1960": number;    // 0.9 (peak usage era begins)
    "1960_1980": number;    // 1.0 (absolute peak usage)
    "1980_2000": number;    // 0.5 (bans starting globally)
    "post_2000": number;    // 0.2 (most countries banning)
  };
  
  // Building type modifier
  building_factor: {
    "residential": number;   // 1.0
    "apartment": number;     // 0.9
    "school": number;        // 1.1 (children more vulnerable)
    "office": number;        // 0.8
    "factory": number;       // 1.2 (industrial use was heaviest)
  };
  
  // Final score thresholds
  thresholds: {
    "low": [0, 0.3];
    "moderate": [0.3, 0.6];
    "high": [0.6, 0.8];
    "critical": [0.8, 1.0];
  };
}
```

## GeoJSON
World country boundaries for the Leaflet map.

- **Source**: Natural Earth Data (public domain)
- **URL**: https://geojson-maps.kyd.au/ (simplified, web-optimized)
- **File**: `src/data/geo/countries.geo.json`
- **Matching key**: ISO 3166-1 alpha-3 code (matches `iso3` in countries.json)
- **IMPORTANT**: Use a simplified/low-resolution version. Full-res GeoJSON is 20MB+. 
  Simplified should be ~2MB or less for fast loading.

## Data Curation Process

### Initial Curation (v1)
1. Scrape IBAS alphabetical ban list → extract all 72 banned countries + years
2. Scrape IBAS chronological list → extract timeline events per country
3. Cross-reference with Wikipedia "Asbestos and the law" for additional context
4. For the 15 priority countries: manually verify and enrich with:
   - Local regulation details
   - Common materials specific to that country
   - Mesothelioma mortality from WHO database
   - Estimated buildings at risk (where data exists)
5. All 195 countries get basic entry (ban_status + ban_year + common_materials)
6. 15 priority countries get full profiles with timelines and enriched data

### Ongoing Updates (v2+)
Automated monitoring pipeline (see SCOPE-FULL.md section 4) will:
- Daily: check IBAS for ban list changes
- Weekly: scan PubMed for new research
- Weekly: check EPA/FDA for product recalls
- Auto-flag changes for human review before publishing

## Data Integrity Rules
- Every fact must have a `source` with URL
- No claims without official/academic backing
- "Unknown" is always preferable to guessing
- When sources conflict, note the conflict and cite both
- Last updated date on every data entry
