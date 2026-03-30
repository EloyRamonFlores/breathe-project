"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Country } from "@/lib/types";
import CountryFlag from "@/components/ui/CountryFlag";

interface CountryPreviewCardProps {
  country: Country;
  onDismiss: () => void;
}

export default function CountryPreviewCard({ country, onDismiss }: CountryPreviewCardProps) {
  const t = useTranslations("home");

  const statusConfig = {
    full_ban: { label: t("preview_banned"), color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    de_facto_ban: { label: t("preview_de_facto"), color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    partial_ban: { label: t("preview_partial"), color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
    no_ban: { label: t("preview_no_ban"), color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    unknown: { label: t("preview_unknown"), color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  };

  const status = statusConfig[country.ban_status];

  return (
    <div className="mt-4 animate-[slide-down_0.2s_ease-out] rounded-2xl border border-slate-700/50 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl shadow-black/30">
      {/* Header: flag + name + dismiss */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <CountryFlag iso2={country.iso2} size="lg" />
          <div>
            <h3 className="text-xl font-bold text-white">{country.name}</h3>
            <p className="text-xs text-slate-500">{country.region}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          aria-label={t("preview_dismiss")}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Ban Status */}
        <div className={`rounded-xl ${status.bg} border ${status.border} p-3`}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {t("preview_status_label")}
          </p>
          <p className={`mt-1 text-sm font-bold ${status.color}`}>
            {status.label}
          </p>
        </div>

        {/* Ban Year */}
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {t("preview_year_label")}
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {country.ban_year ?? "—"}
          </p>
        </div>

        {/* Mesothelioma Rate */}
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {t("preview_meso_label")}
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {country.mesothelioma_rate !== null
              ? `${country.mesothelioma_rate}/100k`
              : "—"}
          </p>
        </div>

        {/* Peak Usage */}
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/30 p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            {t("preview_peak_label")}
          </p>
          <p className="mt-1 text-sm font-bold text-white">
            {country.peak_usage_era || "—"}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-3">
        <Link
          href={`/country/${country.slug}`}
          className="flex-1 rounded-xl bg-blue-500/15 border border-blue-500/30 px-4 py-3 text-center text-sm font-semibold text-blue-400 transition-all duration-200 hover:bg-blue-500/25 hover:border-blue-500/50 hover:text-blue-300"
        >
          {t("preview_view_profile")}
        </Link>
        <Link
          href="/check"
          className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
        >
          {t("preview_check_risk")}
        </Link>
      </div>
    </div>
  );
}
