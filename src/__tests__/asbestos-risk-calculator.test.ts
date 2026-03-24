import { describe, it, expect } from "vitest";
import { calculateRisk, getEraFromYear } from "@/lib/calculators";
import type { Country } from "@/lib/types";
import riskMatrix from "@/data/risk-matrix.json";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCountry(
  overrides: Pick<Country, "slug" | "ban_status" | "ban_year" | "region">
): Country {
  return {
    name: "Test Country",
    iso2: "TC",
    iso3: "TCT",
    ban_details: "",
    exceptions: [],
    timeline: [],
    peak_usage_era: "1970s",
    common_materials: [],
    estimated_buildings_at_risk: null,
    mesothelioma_rate: null,
    mesothelioma_source_year: null,
    priority: "medium",
    sources: [],
    last_updated: "2026-01-01",
    ...overrides,
  };
}

// Countries used across multiple tests
const germany = makeCountry({ slug: "germany", ban_status: "full_ban", ban_year: 1993, region: "Europe" });
const india = makeCountry({ slug: "india", ban_status: "no_ban", ban_year: null, region: "South Asia" });
const uk = makeCountry({ slug: "united-kingdom", ban_status: "full_ban", ban_year: 1999, region: "Europe" });
const us = makeCountry({ slug: "united-states", ban_status: "full_ban", ban_year: 2024, region: "North America" });
const australia = makeCountry({ slug: "australia", ban_status: "full_ban", ban_year: 2003, region: "Oceania" });
const japan = makeCountry({ slug: "japan", ban_status: "full_ban", ban_year: 2006, region: "East Asia" });

// ─── getEraFromYear ───────────────────────────────────────────────────────────

describe("getEraFromYear", () => {
  it("returns pre_1940 for year < 1940", () => {
    expect(getEraFromYear(1939)).toBe("pre_1940");
    expect(getEraFromYear(1900)).toBe("pre_1940");
  });

  it("returns 1940_1960 for 1940–1959", () => {
    expect(getEraFromYear(1940)).toBe("1940_1960");
    expect(getEraFromYear(1950)).toBe("1940_1960");
    expect(getEraFromYear(1959)).toBe("1940_1960");
  });

  it("returns 1960_1980 for 1960–1979", () => {
    expect(getEraFromYear(1960)).toBe("1960_1980");
    expect(getEraFromYear(1970)).toBe("1960_1980");
    expect(getEraFromYear(1979)).toBe("1960_1980");
  });

  it("returns 1980_2000 for 1980–1999", () => {
    expect(getEraFromYear(1980)).toBe("1980_2000");
    expect(getEraFromYear(1990)).toBe("1980_2000");
    expect(getEraFromYear(1999)).toBe("1980_2000");
  });

  it("returns post_2000 for year >= 2000", () => {
    expect(getEraFromYear(2000)).toBe("post_2000");
    expect(getEraFromYear(2005)).toBe("post_2000");
    expect(getEraFromYear(2024)).toBe("post_2000");
  });
});

// ─── calculateRisk — documented scenario tests ───────────────────────────────

describe("calculateRisk — v2.1 weighted average scenarios", () => {
  it("Germany 1985 apartment → HIGH (~0.685)", () => {
    // era midpoint 1990 < ban_year 1993 → pre_ban 0.80
    // score = (0.80×0.45) + (0.50×0.35) + (0.75×0.20) = 0.685
    const result = calculateRisk(germany, getEraFromYear(1985), "apartment");
    expect(result.level).toBe("high");
    expect(result.score).toBeCloseTo(0.685, 3);
  });

  it("India 1970 residential → CRITICAL (~0.9375)", () => {
    // no ban → factor 0.95 always
    // score = (0.95×0.45) + (1.00×0.35) + (0.80×0.20) = 0.9375
    const result = calculateRisk(india, getEraFromYear(1970), "residential");
    expect(result.level).toBe("critical");
    expect(result.score).toBeCloseTo(0.9375, 3);
  });

  it("UK 1975 school → CRITICAL (~0.9125)", () => {
    // era midpoint 1970 < ban_year 1999 → pre_ban 0.85
    // score = (0.85×0.45) + (1.00×0.35) + (0.90×0.20) = 0.9125
    const result = calculateRisk(uk, getEraFromYear(1975), "school");
    expect(result.level).toBe("critical");
    expect(result.score).toBeCloseTo(0.9125, 3);
  });

  it("US 2010 office → MODERATE (~0.560)", () => {
    // US has no ban override (ban_year: null → pre_ban 0.80 always)
    // score = (0.80×0.45) + (0.20×0.35) + (0.65×0.20) = 0.560
    const result = calculateRisk(us, getEraFromYear(2010), "office");
    expect(result.level).toBe("moderate");
    expect(result.score).toBeCloseTo(0.56, 3);
  });

  it("Australia 2010 residential → LOW (~0.2525)", () => {
    // era midpoint 2010 >= ban_year 2003 → post_ban 0.05
    // score = (0.05×0.45) + (0.20×0.35) + (0.80×0.20) = 0.2525
    const result = calculateRisk(australia, getEraFromYear(2010), "residential");
    expect(result.level).toBe("low");
    expect(result.score).toBeCloseTo(0.2525, 3);
  });

  it("Japan 1965 factory → CRITICAL (~0.820)", () => {
    // era midpoint 1970 < ban_year 2006 → pre_ban 0.60
    // score = (0.60×0.45) + (1.00×0.35) + (1.00×0.20) = 0.820
    const result = calculateRisk(japan, getEraFromYear(1965), "factory");
    expect(result.level).toBe("critical");
    expect(result.score).toBeCloseTo(0.82, 3);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("calculateRisk — edge cases", () => {
  it("unknown country + unknown-status does not throw", () => {
    const unknown = makeCountry({
      slug: "unknown-country-xyz",
      ban_status: "unknown",
      ban_year: null,
      region: "Unknown",
    });
    expect(() => calculateRisk(unknown, "pre_1940", "residential")).not.toThrow();
  });

  it("unknown country returns a valid RiskResult shape", () => {
    const unknown = makeCountry({
      slug: "unknown-country-xyz",
      ban_status: "unknown",
      ban_year: null,
      region: "Unknown",
    });
    const result = calculateRisk(unknown, "pre_1940", "residential");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("level");
    expect(result).toHaveProperty("materials");
    expect(Array.isArray(result.materials)).toBe(true);
  });
});

// ─── Score bounds ─────────────────────────────────────────────────────────────

describe("calculateRisk — score is always in [0, 1]", () => {
  const cases: Array<[Country, ReturnType<typeof getEraFromYear>, Parameters<typeof calculateRisk>[2]]> = [
    [germany, "1980_2000", "apartment"],
    [india, "1960_1980", "residential"],
    [uk, "1960_1980", "school"],
    [us, "post_2000", "office"],
    [australia, "post_2000", "residential"],
    [japan, "1960_1980", "factory"],
  ];

  cases.forEach(([country, era, building]) => {
    it(`${country.slug} / ${era} / ${building}: score in [0, 1]`, () => {
      const { score } = calculateRisk(country, era, building);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});

// ─── scoreToLevel thresholds ──────────────────────────────────────────────────

describe("risk level thresholds via calculateRisk output", () => {
  it("score 0.2525 (Australia post-2003 post_2000 residential) → low", () => {
    const { level } = calculateRisk(australia, "post_2000", "residential");
    expect(level).toBe("low");
  });

  it("score 0.560 (US post_2000 office) → moderate", () => {
    const { level } = calculateRisk(us, "post_2000", "office");
    expect(level).toBe("moderate");
  });

  it("score 0.685 (Germany 1980_2000 apartment) → high", () => {
    const { level } = calculateRisk(germany, "1980_2000", "apartment");
    expect(level).toBe("high");
  });

  it("score 0.820 (Japan 1960_1980 factory) → critical", () => {
    const { level } = calculateRisk(japan, "1960_1980", "factory");
    expect(level).toBe("critical");
  });
});

// ─── Country overrides ────────────────────────────────────────────────────────

describe("risk-matrix.json country_overrides", () => {
  const overrides = (riskMatrix as { country_overrides: Record<string, { pre_ban: number; post_ban: number; ban_year: number | null }> }).country_overrides;

  it("has exactly 18 country overrides", () => {
    expect(Object.keys(overrides)).toHaveLength(18);
  });

  Object.entries(overrides).forEach(([slug, override]) => {
    it(`${slug}: pre_ban and post_ban are in (0, 1]`, () => {
      expect(override.pre_ban).toBeGreaterThan(0);
      expect(override.pre_ban).toBeLessThanOrEqual(1);
      expect(override.post_ban).toBeGreaterThan(0);
      expect(override.post_ban).toBeLessThanOrEqual(1);
    });

    it(`${slug}: ban_year is a number or null`, () => {
      expect(
        override.ban_year === null || typeof override.ban_year === "number"
      ).toBe(true);
    });
  });
});

// ─── Material matching ────────────────────────────────────────────────────────

describe("calculateRisk — material matching", () => {
  it("India 1970 residential returns at least 1 matched material", () => {
    const result = calculateRisk(india, "1960_1980", "residential");
    expect(result.materials.length).toBeGreaterThan(0);
  });

  it("post_2000 era (midpoint 2010) returns no materials (all era_end ≤ 2000)", () => {
    const result = calculateRisk(australia, "post_2000", "residential");
    expect(result.materials).toHaveLength(0);
  });
});
