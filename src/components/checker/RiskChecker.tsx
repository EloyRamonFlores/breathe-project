"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, type ReadonlyURLSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import countriesData from "@/data/countries.json";
import type { Country, Era, BuildingType, RiskResult } from "@/lib/types";
import { calculateRisk } from "@/lib/calculators";
import CountryFlag from "@/components/ui/CountryFlag";
import RiskResults from "./RiskResults";

const countries = (countriesData as Country[]).sort((a, b) =>
  a.name.localeCompare(b.name)
);

const ERA_TO_PARAM: Record<Era, string> = {
  pre_1940: "pre-1940",
  "1940_1960": "1940-1960",
  "1960_1980": "1960-1980",
  "1980_2000": "1980-2000",
  post_2000: "post-2000",
};

const PARAM_TO_ERA: Record<string, Era> = Object.fromEntries(
  Object.entries(ERA_TO_PARAM).map(([k, v]) => [v, k as Era])
);

const ERAS: Era[] = [
  "pre_1940",
  "1940_1960",
  "1960_1980",
  "1980_2000",
  "post_2000",
];

const ERA_RISK_COLOR: Record<Era, string> = {
  pre_1940: "bg-warning",
  "1940_1960": "bg-danger",
  "1960_1980": "bg-critical",
  "1980_2000": "bg-warning",
  post_2000: "bg-safe",
};

const ERA_HINTS: Record<Era, string> = {
  pre_1940: "era_hint_moderate",
  "1940_1960": "era_hint_high",
  "1960_1980": "era_hint_peak",
  "1980_2000": "era_hint_moderate",
  post_2000: "era_hint_minimal",
};

const ERA_BAR_WIDTH: Record<Era, string> = {
  pre_1940: "w-[70%]",
  "1940_1960": "w-[90%]",
  "1960_1980": "w-full",
  "1980_2000": "w-[50%]",
  post_2000: "w-[20%]",
};

const BUILDING_TYPES: { type: BuildingType; emoji: string }[] = [
  { type: "residential", emoji: "🏠" },
  { type: "apartment", emoji: "🏢" },
  { type: "school", emoji: "🏫" },
  { type: "office", emoji: "🏛️" },
  { type: "factory", emoji: "🏭" },
];

type Step = 1 | 2 | 3 | "results";

type ParsedUrlParams =
  | { valid: true; country: Country; era: Era; buildingType: BuildingType; result: RiskResult }
  | { valid: false; hasParams: boolean };

function parseUrlParams(searchParams: ReadonlyURLSearchParams): ParsedUrlParams {
  const countryParam = searchParams.get("country");
  const eraParam = searchParams.get("era");
  const typeParam = searchParams.get("type");
  if (!countryParam || !eraParam || !typeParam) return { valid: false, hasParams: false };
  const country = countries.find((c) => c.iso2.toLowerCase() === countryParam.toLowerCase());
  const era = PARAM_TO_ERA[eraParam];
  const buildingType = BUILDING_TYPES.find((b) => b.type === typeParam)?.type;
  if (!country || !era || !buildingType) return { valid: false, hasParams: true };
  return { valid: true, country, era, buildingType, result: calculateRisk(country, era, buildingType) };
}

export default function RiskChecker() {
  const t = useTranslations("check");
  const tEras = useTranslations("eras");
  const tBuilding = useTranslations("building_types");
  const tErrors = useTranslations("errors");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lazy-init all URL-param-driven state on first render (no effect needed)
  const [step, setStep] = useState<Step>(() => {
    const p = parseUrlParams(searchParams);
    return p.valid ? "results" : 1;
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(() => {
    const p = parseUrlParams(searchParams);
    return p.valid ? p.country : null;
  });
  const [selectedEra, setSelectedEra] = useState<Era | null>(() => {
    const p = parseUrlParams(searchParams);
    return p.valid ? p.era : null;
  });
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType | null>(() => {
    const p = parseUrlParams(searchParams);
    return p.valid ? p.buildingType : null;
  });
  const [countryQuery, setCountryQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [result, setResult] = useState<RiskResult | null>(() => {
    const p = parseUrlParams(searchParams);
    return p.valid ? p.result : null;
  });
  const [visible, setVisible] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(() => {
    const p = parseUrlParams(searchParams);
    return !p.valid && p.hasParams ? tErrors("invalid_params") : null;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const handleSelectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
    setCountryQuery(country.name);
    setDropdownOpen(false);
    setActiveIndex(-1);
    setTimeout(() => setStep(2), 150);
  }, []);

  const handleSelectEra = useCallback((era: Era) => {
    setSelectedEra(era);
    setTimeout(() => setStep(3), 150);
  }, []);

  const handleSelectBuilding = useCallback(
    (buildingType: BuildingType) => {
      if (!selectedCountry || !selectedEra) return;
      setSelectedBuilding(buildingType);
      const calc = calculateRisk(selectedCountry, selectedEra, buildingType);
      setResult(calc);

      const params = new URLSearchParams({
        country: selectedCountry.iso2.toLowerCase(),
        era: ERA_TO_PARAM[selectedEra],
        type: buildingType,
      });
      router.push(`?${params.toString()}`, { scroll: false });
      setTimeout(() => setStep("results"), 200);
    },
    [selectedCountry, selectedEra, router]
  );

  const handleReset = useCallback(() => {
    setStep(1);
    setSelectedCountry(null);
    setSelectedEra(null);
    setSelectedBuilding(null);
    setCountryQuery("");
    setResult(null);
    setDropdownOpen(false);
    setValidationError(null);
    router.push("?", { scroll: false });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [router]);

  const handleCountryKeyDown = (e: React.KeyboardEvent) => {
    if (!dropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setDropdownOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredCountries.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectCountry(filteredCountries[activeIndex]);
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const stepNum = step === "results" ? 3 : (step as number);
  const isResults = step === "results";

  return (
    <div
      className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      {/* Header */}
      {!isResults && (
        <div className="mb-8 text-center">
          <h1 className="font-sans font-bold text-3xl text-text-primary sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-mono text-sm text-text-muted">
            {t("step_counter", { current: stepNum, total: 3 })}
          </p>
        </div>
      )}

      {/* Step indicator */}
      {!isResults && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  n < stepNum
                    ? "bg-safe scale-100"
                    : n === stepNum
                      ? "bg-accent scale-125"
                      : "bg-bg-tertiary scale-100"
                }`}
              />
              {n < 3 && (
                <div
                  className={`h-px w-8 transition-colors duration-300 ${n < stepNum ? "bg-safe" : "bg-bg-tertiary"}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Validation error banner */}
      {validationError && step === 1 && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-amber-700/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-300"
        >
          {validationError}
        </div>
      )}

      {/* Step 1: Country */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-text-primary">
              {t("step1_label")}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {t("step1_description")}
            </p>
          </div>

          <div className="relative">
            <div
              role="combobox"
              aria-expanded={dropdownOpen}
              aria-haspopup="listbox"
              aria-owns="country-list"
            >
              <input
                ref={inputRef}
                type="text"
                value={countryQuery}
                onChange={(e) => {
                  setCountryQuery(e.target.value);
                  setDropdownOpen(true);
                  setActiveIndex(0);
                }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={handleCountryKeyDown}
                placeholder={t("country_placeholder")}
                aria-label={t("search_country")}
                aria-autocomplete="list"
                aria-controls="country-list"
                aria-activedescendant={
                  activeIndex >= 0 ? `country-option-${activeIndex}` : undefined
                }
                className="w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-3 text-text-primary placeholder-text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            {dropdownOpen && filteredCountries.length > 0 && (
              <ul
                id="country-list"
                ref={listRef}
                role="listbox"
                className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-bg-tertiary bg-bg-secondary shadow-xl"
              >
                {filteredCountries.map((country, i) => (
                  <li
                    key={country.slug}
                    id={`country-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onMouseDown={() => handleSelectCountry(country)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      i === activeIndex
                        ? "bg-bg-tertiary text-text-primary"
                        : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                    }`}
                  >
                    <CountryFlag iso2={country.iso2} size="sm" />
                    <span>{country.name}</span>
                  </li>
                ))}
              </ul>
            )}

            {dropdownOpen &&
              countryQuery.length > 0 &&
              filteredCountries.length === 0 && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-3 text-sm text-text-muted">
                  {t("no_country_found")}
                </div>
              )}
          </div>
        </div>
      )}

      {/* Step 2: Era */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-text-primary">
              {t("step2_label")}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {t("step2_description")}
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            role="group"
            aria-label={t("step2_description")}
          >
            {ERAS.map((era) => (
              <button
                key={era}
                onClick={() => handleSelectEra(era)}
                aria-pressed={selectedEra === era}
                className={`group relative overflow-hidden rounded-lg border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary ${
                  selectedEra === era
                    ? "border-accent bg-accent/10"
                    : "border-bg-tertiary bg-bg-secondary hover:border-bg-tertiary/80 hover:bg-bg-tertiary"
                }`}
              >
                {era === "1960_1980" && (
                  <span className="absolute right-2 top-2 rounded bg-critical/20 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-critical">
                    {t("era_peak")}
                  </span>
                )}
                <p className="font-medium text-text-primary">
                  {tEras(era as Parameters<typeof tEras>[0])}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {t(ERA_HINTS[era] as Parameters<typeof t>[0])}
                </p>
                {/* Risk bar */}
                <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${ERA_RISK_COLOR[era]} ${ERA_BAR_WIDTH[era]}`}
                  />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(1)}
            className="mt-6 flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <span aria-hidden="true">←</span> {t("back")}
          </button>
        </div>
      )}

      {/* Step 3: Building Type */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="mb-6 text-center">
            <p className="text-lg font-medium text-text-primary">
              {t("step3_label")}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {t("step3_description")}
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            role="group"
            aria-label={t("step3_description")}
          >
            {BUILDING_TYPES.map(({ type, emoji }) => (
              <button
                key={type}
                onClick={() => handleSelectBuilding(type)}
                aria-pressed={selectedBuilding === type}
                className={`flex flex-col items-center gap-3 rounded-lg border p-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary ${
                  selectedBuilding === type
                    ? "border-accent bg-accent/10"
                    : "border-bg-tertiary bg-bg-secondary hover:border-bg-tertiary/80 hover:bg-bg-tertiary"
                }`}
              >
                <span className="text-4xl leading-none" aria-hidden="true">
                  {emoji}
                </span>
                <span className="text-sm font-medium text-text-primary">
                  {tBuilding(type as Parameters<typeof tBuilding>[0])}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-6 flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-secondary"
          >
            <span aria-hidden="true">←</span> {t("back")}
          </button>
        </div>
      )}

      {/* Results */}
      {step === "results" && result && (
        <RiskResults result={result} onReset={handleReset} />
      )}
    </div>
  );
}
