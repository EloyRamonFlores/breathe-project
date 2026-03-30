import { getTranslations } from "next-intl/server";
import type { Country } from "@/lib/types";
import { getBanStatusColor, summarizeBuildingsAtRisk } from "@/lib/utils";

interface StatStripProps {
  country: Country;
}

export default async function StatStrip({ country }: StatStripProps) {
  const t = await getTranslations("country");

  const banStatusColor = getBanStatusColor(country.ban_status);

  // Summarize buildings_at_risk for stat strip display
  const buildingsShort = country.estimated_buildings_at_risk
    ? summarizeBuildingsAtRisk(country.estimated_buildings_at_risk)
    : "—";

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
      value: buildingsShort,
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
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {stats.map((stat, i) => {
            // Border logic for 2-col mobile / 4-col desktop grid
            const borderClasses = [
              "border-r border-b border-bg-tertiary sm:border-b-0",                    // i=0: right always, bottom mobile only
              "border-b border-bg-tertiary sm:border-b-0 sm:border-r sm:border-bg-tertiary", // i=1: bottom mobile, right desktop only
              "border-r border-bg-tertiary",                                             // i=2: right always
              "",                                                                        // i=3: none
            ];
            return (
            <div
              key={i}
              className={`px-4 py-4 ${borderClasses[i]}`}
            >
              <div
                className="font-mono text-lg sm:text-2xl font-bold tabular-nums leading-tight mb-0.5 break-words"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
