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

  it("all entries have a non-empty name_es field", () => {
    const missing = countries.filter(
      (c) => !c.name_es || c.name_es.trim() === ""
    );
    expect(missing).toHaveLength(0);
  });

  it("resistance_stories entries have required fields and valid quote pairing", () => {
    const withStories = countries.filter(
      (c) => c.resistance_stories && c.resistance_stories.length > 0
    );
    for (const country of withStories) {
      for (const story of country.resistance_stories!) {
        expect(story.name).toBeTruthy();
        expect(story.years).toBeTruthy();
        expect(story.role).toBeTruthy();
        expect(story.achievement).toBeTruthy();
        expect(story.source_url).toBeTruthy();
        if (story.quote) {
          expect(story.quote_source).toBeTruthy();
        }
      }
    }
  });

  it("united-kingdom has exactly 4 resistance stories", () => {
    const uk = countries.find((c) => c.slug === "united-kingdom");
    expect(uk).toBeDefined();
    expect(uk!.resistance_stories).toBeDefined();
    expect(uk!.resistance_stories).toHaveLength(4);
  });
});

// ─── Research-country timeline pins (Phase 6B additions) ──────────────────────

const VALID_TIMELINE_TYPES = new Set([
  "ban", "partial_ban", "regulation", "court_ruling", "other",
]);

/** Assert a country has an exact timeline length, valid entry types, and each
 *  entry has the required fields (year, event, type, source_url). */
function assertTimeline(slug: string, expectedLength: number) {
  const country = countries.find((c) => c.slug === slug);
  expect(country, `${slug} not found`).toBeDefined();
  const tl = country!.timeline;
  expect(tl, `${slug} timeline missing`).toBeDefined();
  expect(tl).toHaveLength(expectedLength);
  for (const entry of tl) {
    expect(typeof entry.year, `${slug} entry.year`).toBe("number");
    expect(entry.event, `${slug} entry.event`).toBeTruthy();
    expect(
      VALID_TIMELINE_TYPES.has(entry.type),
      `${slug} invalid type: ${entry.type}`
    ).toBe(true);
    expect(entry.source_url, `${slug} entry.source_url`).toBeTruthy();
  }
}

function assertStories(slug: string, expectedCount: number) {
  const country = countries.find((c) => c.slug === slug);
  expect(country, `${slug} not found`).toBeDefined();
  expect(
    country!.resistance_stories ?? [],
    `${slug} resistance_stories`
  ).toHaveLength(expectedCount);
}

describe("Phase 6B research-country data pins", () => {
  it("kazakhstan has 7 timeline events and 2 resistance stories", () => {
    assertTimeline("kazakhstan", 7);
    assertStories("kazakhstan", 2);
  });

  it("russia has 13 timeline events and 1 resistance story", () => {
    assertTimeline("russia", 13);
    assertStories("russia", 1);
  });

  it("portugal has 12 timeline events and 2 resistance stories", () => {
    assertTimeline("portugal", 12);
    assertStories("portugal", 2);
  });

  it("turkey has 10 timeline events and 2 resistance stories", () => {
    assertTimeline("turkey", 10);
    assertStories("turkey", 2);
  });

  it("united-arab-emirates has 3 timeline events", () => {
    assertTimeline("united-arab-emirates", 3);
  });

  it("india has 5 timeline events and 1 resistance story", () => {
    assertTimeline("india", 5);
    assertStories("india", 1);
  });

  it("taiwan has 9 timeline events and 2 resistance stories", () => {
    assertTimeline("taiwan", 9);
    assertStories("taiwan", 2);
  });

  it("namibia has 4 timeline events", () => {
    assertTimeline("namibia", 4);
  });

  it("china has 6 timeline events", () => {
    assertTimeline("china", 6);
  });
});

// ─── materials.json ───────────────────────────────────────────────────────────

describe("materials.json integrity", () => {
  it("has exactly 21 entries", () => {
    expect(materials).toHaveLength(21);
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
