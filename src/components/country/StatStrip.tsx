import { getTranslations } from "next-intl/server";
import type { Country } from "@/lib/types";
import { getBanStatusColor } from "@/lib/utils";

interface StatStripProps {
  country: Country;
}

export default async function StatStrip({ country }: StatStripProps) {
  const t = await getTranslations("country");

  const banStatusColor = getBanStatusColor(country.ban_status);

  const stats = [
    {
      value: country.ban_year ? String(country.ban_year) : "—",
      label: country.ban_year ? t("ban_year_label") : t("no_ban_year"),
      color: banStatusColor,
    },
    {
      value:
        country.mesothelioma_rate !== null
          ? country.mesothelioma_rate.toFixed(1)
          : "—",
      sublabel:
        country.mesothelioma_rate !== null
          ? t("stat_per_million")
          : undefined,
      label: t("mesothelioma_rate"),
      color:
        country.mesothelioma_rate !== null
          ? country.mesothelioma_rate > 20
            ? "var(--color-danger)"
            : "var(--color-warning)"
          : undefined,
    },
    {
      value: country.estimated_buildings_at_risk ?? "—",
      label: country.estimated_buildings_at_risk
        ? t("buildings_at_risk")
        : t("stat_unknown"),
    },
    {
      value: country.peak_usage_era || "—",
      label: t("peak_usage"),
    },
  ];

  return (
    <section
      className="w-full bg-bg-secondary border-y border-bg-tertiary"
      aria-label={t("stats_heading")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-none">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex-shrink-0 min-w-[150px] px-5 py-4 border-r border-bg-tertiary last:border-r-0 first:pl-0 last:pr-0"
            >
              <div
                className="font-mono text-xl sm:text-2xl font-bold tabular-nums leading-tight mb-0.5 truncate"
                style={stat.color ? { color: stat.color } : undefined}
              >
                {stat.value}
              </div>
              {stat.sublabel && (
                <div className="font-mono text-[9px] uppercase tracking-wider text-text-muted leading-none mb-0.5">
                  {stat.sublabel}
                </div>
              )}
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
