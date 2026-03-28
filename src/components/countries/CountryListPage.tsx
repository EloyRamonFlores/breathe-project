"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Country } from "@/lib/types";
import { getFlag } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "Latin America",
  "Middle East",
  "North America",
  "Oceania",
] as const;

const REGION_KEYS: Record<string, string> = {
  Africa: "region_africa",
  Asia: "region_asia",
  Europe: "region_europe",
  "Latin America": "region_latin_america",
  "Middle East": "region_middle_east",
  "North America": "region_north_america",
  Oceania: "region_oceania",
};

const STATUS_FILTERS = ["all", "full_ban", "partial_ban", "no_ban", "unknown"] as const;

const PILL_CLASSES: Record<Country["ban_status"], string> = {
  full_ban: "text-safe bg-safe/10 border-safe/20",
  de_facto_ban: "text-safe bg-safe/10 border-safe/20",
  partial_ban: "text-warning bg-warning/10 border-warning/20",
  no_ban: "text-danger bg-danger/10 border-danger/20",
  unknown: "text-text-muted bg-bg-tertiary border-bg-tertiary",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CountryListPage({
  countries,
}: {
  countries: Country[];
}) {
  const t = useTranslations("countries");
  const tHome = useTranslations("home");
  const tBan = useTranslations("ban_status");
  const locale = useLocale();

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = countries.filter((c) => {
      if (query && !c.name.toLowerCase().includes(query) && !c.name_es.toLowerCase().includes(query) && !c.iso2.toLowerCase().includes(query)) {
        return false;
      }
      if (region !== "all" && c.region !== region) return false;
      if (status !== "all") {
        if (status === "full_ban") {
          if (c.ban_status !== "full_ban" && c.ban_status !== "de_facto_ban") return false;
        } else if (c.ban_status !== status) {
          return false;
        }
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      const nameCompare = (x: Country, y: Country) =>
        locale === "es"
          ? x.name_es.localeCompare(y.name_es, "es")
          : x.name.localeCompare(y.name);
      if (sort === "name") return nameCompare(a, b);
      if (sort === "ban_year") {
        if (a.ban_year && b.ban_year) return b.ban_year - a.ban_year;
        if (a.ban_year) return -1;
        if (b.ban_year) return 1;
        return nameCompare(a, b);
      }
      // sort by region
      const regionCmp = a.region.localeCompare(b.region);
      return regionCmp !== 0 ? regionCmp : nameCompare(a, b);
    });

    return result;
  }, [countries, search, region, status, sort, locale]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("heading")}
        </h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-bg-tertiary bg-bg-primary/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full rounded-lg border border-bg-tertiary bg-bg-secondary py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              aria-label={t("search_placeholder")}
            />
          </div>

          {/* Region dropdown */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-lg border border-bg-tertiary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label={t("filter_region")}
          >
            <option value="all">{t("filter_all")} — {t("filter_region")}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {tHome(REGION_KEYS[r] as Parameters<typeof tHome>[0])}
              </option>
            ))}
          </select>

          {/* Sort dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-bg-tertiary bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label={t("sort_label")}
          >
            <option value="name">{t("sort_name")}</option>
            <option value="ban_year">{t("sort_ban_year")}</option>
            <option value="region">{t("sort_region")}</option>
          </select>
        </div>

        {/* Ban status pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => {
            const isActive = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? s === "all"
                      ? "border-accent bg-accent/10 text-accent"
                      : `border ${PILL_CLASSES[s]}`
                    : "border-bg-tertiary text-text-muted hover:border-text-muted hover:text-text-secondary"
                }`}
                aria-pressed={isActive}
              >
                {s === "all" ? t("filter_all") : tBan(s)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <p className="mb-4 text-sm text-text-muted">
        {t("results_count", { count: filtered.length })}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => (
            <Link
              key={country.slug}
              href={`/country/${country.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-bg-tertiary bg-bg-secondary p-4 transition-colors hover:border-text-muted/30 hover:bg-bg-tertiary/50"
            >
              <span className="text-3xl" aria-hidden="true">
                {getFlag(country.iso2)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary group-hover:text-accent">
                  {locale === "es" ? country.name_es : country.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${PILL_CLASSES[country.ban_status]}`}
                  >
                    {tBan(country.ban_status)}
                  </span>
                  {country.ban_year && (
                    <span className="text-xs text-text-muted">
                      {t("banned_since", { year: country.ban_year })}
                    </span>
                  )}
                </div>
              </div>
              <svg
                className="h-4 w-4 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-bg-tertiary bg-bg-secondary px-6 py-16 text-center">
          <svg
            className="mb-4 h-12 w-12 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-lg font-medium text-text-primary">{t("no_results")}</p>
          <p className="mt-1 text-sm text-text-muted">{t("no_results_hint")}</p>
        </div>
      )}
    </main>
  );
}
