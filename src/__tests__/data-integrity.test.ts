import { describe, it, expect } from "vitest";
import countriesRaw from "@/data/countries.json";
import materialsRaw from "@/data/materials.json";
import riskMatrixRaw from "@/data/risk-matrix.json";
import type { Country, Material, RiskMatrix } from "@/lib/types";

const countries = countriesRaw as Country[];
const materials = materialsRaw as Material[];
const riskMatrix = riskMatrixRaw as unknown as RiskMatrix;

const VALID_BAN_STATUSES = new Set([
  "full_ban",
  "partial_ban",
  "no_ban",
  "de_facto_ban",
  "unknown",
]);

const VALID_RISK_LEVELS = new Set(["low", "moderate", "high", "critical"]);

// ─── countries.json ───────────────────────────────────────────────────────────

describe("countries.json integrity", () => {
  it("has exactly 200 entries", () => {
    expect(countries).toHaveLength(200);
  });

  it("all entries have required fields: slug, name, iso2, iso3, ban_status", () => {
    const missing = countries.filter(
      (c) => !c.slug || !c.name || !c.iso2 || !c.iso3 || !c.ban_status
    );
    expect(missing).toHaveLength(0);
  });

  it("ban_status is always one of the valid enum values", () => {
    const invalid = countries.filter((c) => !VALID_BAN_STATUSES.has(c.ban_status));
    expect(invalid).toHaveLength(0);
  });

  it("all full_ban entries have a non-null ban_year", () => {
    const fullBanWithoutYear = countries.filter(
      (c) => c.ban_status === "full_ban" && c.ban_year === null
    );
    expect(fullBanWithoutYear).toHaveLength(0);
  });

  it("priority:high countries exist and have non-empty timelines", () => {
    const highPriority = countries.filter((c) => c.priority === "high");
    expect(highPriority.length).toBeGreaterThan(0);
    const highWithoutTimelines = highPriority.filter(
      (c) => !c.timeline || c.timeline.length === 0
    );
    expect(highWithoutTimelines).toHaveLength(0);
  });

  it("all entries have unique slugs", () => {
    const slugs = countries.map((c) => c.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(countries.length);
  });

  it("all entries have unique iso2 codes", () => {
    const iso2s = countries.map((c) => c.iso2);
    const unique = new Set(iso2s);
    expect(unique.size).toBe(countries.length);
  });
});

// ─── materials.json ───────────────────────────────────────────────────────────

describe("materials.json integrity", () => {
  it("has exactly 20 entries", () => {
    expect(materials).toHaveLength(20);
  });

  it("all entries have valid risk_when_damaged values", () => {
    const invalid = materials.filter(
      (m) => !VALID_RISK_LEVELS.has(m.risk_when_damaged)
    );
    expect(invalid).toHaveLength(0);
  });

  it("all entries have valid risk_when_intact values", () => {
    const invalid = materials.filter(
      (m) => !["low", "moderate", "high"].includes(m.risk_when_intact)
    );
    expect(invalid).toHaveLength(0);
  });

  it("all entries have era_start <= era_end", () => {
    const invalid = materials.filter((m) => m.era_start > m.era_end);
    expect(invalid).toHaveLength(0);
  });

  it("all entries have unique ids", () => {
    const ids = materials.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(materials.length);
  });
});

// ─── risk-matrix.json ─────────────────────────────────────────────────────────

describe("risk-matrix.json integrity", () => {
  it("weights sum to 1.0", () => {
    const sum = riskMatrix.weights.country + riskMatrix.weights.era + riskMatrix.weights.building;
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("has exactly 18 country_overrides", () => {
    expect(Object.keys(riskMatrix.country_overrides)).toHaveLength(18);
  });

  it("all override pre_ban and post_ban values are in (0, 1]", () => {
    const invalid = Object.entries(riskMatrix.country_overrides).filter(
      ([, o]) => o.pre_ban <= 0 || o.pre_ban > 1 || o.post_ban <= 0 || o.post_ban > 1
    );
    expect(invalid).toHaveLength(0);
  });

  it("risk level thresholds cover low, moderate, high, critical", () => {
    expect(riskMatrix.thresholds).toHaveProperty("low");
    expect(riskMatrix.thresholds).toHaveProperty("moderate");
    expect(riskMatrix.thresholds).toHaveProperty("high");
    expect(riskMatrix.thresholds).toHaveProperty("critical");
  });
});
