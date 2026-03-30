"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import CountrySearch from "@/components/search/CountrySearch";
import CountryPreviewCard from "./CountryPreviewCard";
import type { Country } from "@/lib/types";
import CountryFlag from "@/components/ui/CountryFlag";

const popularCountries = [
  { slug: "india", name: "India", iso2: "IN" },
  { slug: "mexico", name: "Mexico", iso2: "MX" },
  { slug: "indonesia", name: "Indonesia", iso2: "ID" },
  { slug: "united-states", name: "United States", iso2: "US" },
  { slug: "japan", name: "Japan", iso2: "JP" },
];

interface CountrySearchSectionProps {
  locale: string;
}

export default function CountrySearchSection({ locale }: CountrySearchSectionProps) {
  const t = useTranslations("home");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <>
      <CountrySearch
        locale={locale}
        onSelect={(country) => setSelectedCountry(country)}
      />

      {/* Preview Card (Idea 1) */}
      {selectedCountry && (
        <CountryPreviewCard
          country={selectedCountry}
          onDismiss={() => setSelectedCountry(null)}
        />
      )}

      {/* Popular searches chips */}
      {!selectedCountry && (
        <div className="mt-6 text-center">
          <p className="mb-3 text-xs font-mono uppercase tracking-widest text-slate-500">
            {t("search_popular")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularCountries.map((c) => (
              <Link
                key={c.slug}
                href={`/country/${c.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-900/40 px-3 py-1.5 text-sm text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <CountryFlag iso2={c.iso2} size="sm" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
