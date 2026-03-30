"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import CountryFlag from "@/components/ui/CountryFlag";

const countries = countriesData as Country[];

interface CountrySearchProps {
  locale: string;
  onSelect?: (country: Country) => void;
}

export default function CountrySearch({ locale, onSelect }: CountrySearchProps) {
  const t = useTranslations("home");
  const tBan = useTranslations("ban_status");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return countries
      .filter((c) => {
        const nameEn = c.name.toLowerCase();
        const nameEs = c.name_es.toLowerCase();
        const slug = c.slug.toLowerCase();
        // Search in both languages always
        return (
          nameEn.includes(q) ||
          nameEs.includes(q) ||
          slug.includes(q) ||
          c.iso2.toLowerCase() === q
        );
      })
      .slice(0, 8);
  }, [query]);

  const getDisplayName = useCallback(
    (country: Country) => {
      return locale === "es" ? country.name_es : country.name;
    },
    [locale]
  );

  const handleSelect = useCallback(
    (country: Country) => {
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
      if (onSelect) {
        onSelect(country);
      } else {
        router.push(`/country/${country.slug}`);
      }
    },
    [router, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filtered.length === 0) {
        if (e.key === "ArrowDown" && filtered.length > 0) {
          setIsOpen(true);
          setActiveIndex(0);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filtered.length) {
            handleSelect(filtered[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setActiveIndex(-1);
          break;
      }
    },
    [isOpen, filtered, activeIndex, handleSelect]
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    if (query.trim().length > 0 && filtered.length > 0) {
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [query, filtered.length]);

  const statusColor = (status: Country["ban_status"]) => {
    switch (status) {
      case "full_ban":
      case "de_facto_ban":
        return "text-emerald-400";
      case "partial_ban":
        return "text-amber-400";
      case "no_ban":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const statusLabel = (status: Country["ban_status"]) => {
    return tBan(status);
  };

  const listboxId = "country-search-listbox";

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `country-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-label={t("search_placeholder")}
          placeholder={t("search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0 && filtered.length > 0) {
              setIsOpen(true);
            }
          }}
          className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 outline-none backdrop-blur-sm transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-900/80"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={t("search_clear")}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-700/50 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl animate-[slide-down_0.15s_ease-out] overflow-hidden">
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={t("search_results_label")}
            className="max-h-[300px] overflow-y-auto"
          >
            <li className="sticky top-0 bg-slate-900/95 backdrop-blur-xl px-4 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 border-b border-slate-800/50">
              {filtered.length === 1
                ? t("search_result_count_one")
                : t("search_result_count_other", { count: filtered.length })}
            </li>
            {filtered.map((country, i) => (
              <li
                key={country.slug}
                id={`country-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => handleSelect(country)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-all duration-100 ${
                  i === activeIndex
                    ? "bg-slate-800/80"
                    : "hover:bg-slate-800/50"
                }`}
              >
                <CountryFlag iso2={country.iso2} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {getDisplayName(country)}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {country.region}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider shrink-0 ${statusColor(
                    country.ban_status
                  )}`}
                >
                  {statusLabel(country.ban_status)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim().length > 0 && filtered.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-700/50 bg-slate-900/95 px-4 py-6 text-center shadow-2xl backdrop-blur-xl animate-[slide-down_0.15s_ease-out]">
          <p className="text-sm text-slate-400">
            {t("search_no_results")}
          </p>
        </div>
      )}
    </div>
  );
}
