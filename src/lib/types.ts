export interface Source {
  name: string;
  url: string;
  accessed: string;
}

export interface TimelineEvent {
  year: number;
  event: string;
  type: "ban" | "partial_ban" | "regulation" | "court_ruling" | "other";
  source_url: string;
}

export interface Country {
  slug: string;
  name: string;
  iso2: string;
  iso3: string;
  region: string;
  ban_status: "full_ban" | "partial_ban" | "no_ban" | "de_facto_ban" | "unknown";
  ban_year: number | null;
  ban_details: string;
  exceptions: string[];
  timeline: TimelineEvent[];
  peak_usage_era: string;
  common_materials: string[];
  estimated_buildings_at_risk: string | null;
  mesothelioma_rate: number | null;
  mesothelioma_source_year: number | null;
  priority: "high" | "medium" | "low";
  sources: Source[];
  last_updated: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  era_start: number;
  era_end: number;
  peak_decade: string;
  risk_when_intact: "low" | "moderate" | "high";
  risk_when_damaged: "low" | "moderate" | "high" | "critical";
  risk_when_disturbed: "moderate" | "high" | "critical";
  friability: "friable" | "non-friable";
  location: string[];
  building_types: string[];
  recommendation_intact: string;
  recommendation_damaged: string;
  recommendation_renovation: string;
  prevalence_regions: string[];
  sources: Source[];
}

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type Era = "pre_1940" | "1940_1960" | "1960_1980" | "1980_2000" | "post_2000";

export type BuildingType = "residential" | "apartment" | "school" | "office" | "factory";

export interface CountryOverride {
  pre_ban: number;
  post_ban: number;
  ban_year: number | null;
}

export interface RiskMatrix {
  weights: {
    country: number;
    era: number;
    building: number;
  };
  country_factor: {
    no_ban_at_construction: number;
    partial_ban_at_construction: number;
    full_ban_at_construction: number;
    unknown: number;
  };
  country_overrides: Record<string, CountryOverride>;
  era_factor: Record<Era, number>;
  building_factor: Record<BuildingType, number>;
  thresholds: Record<RiskLevel, [number, number]>;
}

// ─── Learn Section Types ──────────────────────────────────────────────────────

export interface FiberTypeData {
  key: string;
  name: string;
  color_label: string;
  description: string;
  danger_level: "high" | "critical";
  source: string;
}

export interface DiseaseData {
  key: string;
  name: string;
  description: string;
  severity: "high" | "critical";
}

export type HistoryEventType =
  | "discovery"
  | "coverup"
  | "regulation"
  | "legal"
  | "science"
  | "tragedy";

export interface HistoryEventData {
  year: number;
  type: HistoryEventType;
  event: string;
  source_url: string;
}

export interface ScenarioData {
  title: string;
  steps: string[];
}

export interface RegionBanData {
  region: string;
  full_ban: number;
  partial_ban: number;
  no_ban: number;
  unknown: number;
}

export interface DistributionEntry {
  status: string;
  count: number;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  country: Country;
  era: Era;
  buildingType: BuildingType;
  materials: Material[];
}
