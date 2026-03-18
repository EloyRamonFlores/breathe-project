import type { Country, Material, Era, BuildingType, RiskLevel, RiskResult, RiskMatrix } from "@/lib/types";
import riskMatrixData from "@/data/risk-matrix.json";
import materialsData from "@/data/materials.json";

const buildingTypeForMaterials: Record<BuildingType, string> = {
  residential: "residential",
  apartment: "apartment",
  school: "school",
  office: "office",
  factory: "industrial",
};

const riskMatrix = riskMatrixData as RiskMatrix;
const materials = materialsData as Material[];

function getCountryFactor(country: Country, constructionYear: number): number {
  if (country.ban_status === "unknown") return riskMatrix.country_factor.unknown;
  if (country.ban_status === "no_ban") return riskMatrix.country_factor.no_ban_at_construction;
  if (country.ban_year === null) return riskMatrix.country_factor.unknown;

  if (constructionYear < country.ban_year) {
    if (country.ban_status === "partial_ban") {
      return riskMatrix.country_factor.partial_ban_at_construction;
    }
    return riskMatrix.country_factor.no_ban_at_construction;
  }

  return riskMatrix.country_factor.full_ban_at_construction;
}

export function getEraFromYear(year: number): Era {
  if (year < 1940) return "pre_1940";
  if (year < 1960) return "1940_1960";
  if (year < 1980) return "1960_1980";
  if (year < 2000) return "1980_2000";
  return "post_2000";
}

function getConstructionYearFromEra(era: Era): number {
  const midpoints: Record<Era, number> = {
    pre_1940: 1930,
    "1940_1960": 1950,
    "1960_1980": 1970,
    "1980_2000": 1990,
    post_2000: 2010,
  };
  return midpoints[era];
}

function scoreToLevel(score: number): RiskLevel {
  if (score >= riskMatrix.thresholds.critical[0]) return "critical";
  if (score >= riskMatrix.thresholds.high[0]) return "high";
  if (score >= riskMatrix.thresholds.moderate[0]) return "moderate";
  return "low";
}

function getMatchingMaterials(
  constructionYear: number,
  buildingType: BuildingType,
  countryRegion: string
): Material[] {
  return materials
    .filter((m) => {
      const inEra = m.era_start <= constructionYear && constructionYear <= m.era_end;
      const materialBuildingType = buildingTypeForMaterials[buildingType];
      const inBuilding = m.building_types.includes(materialBuildingType);
      const inRegion =
        m.prevalence_regions.includes("global") ||
        m.prevalence_regions.some((r) => countryRegion.toLowerCase().includes(r));
      return inEra && inBuilding && inRegion;
    })
    .sort((a, b) => {
      const riskOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
      return (riskOrder[b.risk_when_damaged] ?? 0) - (riskOrder[a.risk_when_damaged] ?? 0);
    });
}

export function calculateRisk(
  country: Country,
  era: Era,
  buildingType: BuildingType
): RiskResult {
  const constructionYear = getConstructionYearFromEra(era);

  const countryFactor = getCountryFactor(country, constructionYear);
  const eraFactor = riskMatrix.era_factor[era];
  const buildingFactor = riskMatrix.building_factor[buildingType];

  const score = Math.min(countryFactor * eraFactor * buildingFactor, 1.0);
  const level = scoreToLevel(score);
  const matchedMaterials = getMatchingMaterials(constructionYear, buildingType, country.region);

  return {
    score,
    level,
    country,
    era,
    buildingType,
    materials: matchedMaterials,
  };
}
