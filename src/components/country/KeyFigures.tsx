import { getTranslations } from "next-intl/server";
import type { Country } from "@/lib/types";
import { getBanStatusColor } from "@/lib/utils";

interface KeyFiguresProps {
  country: Country;
}

export default async function KeyFigures({ country }: KeyFiguresProps) {
  const t = await getTranslations("country");
  const banStatusColor = getBanStatusColor(country.ban_status);

  // Determine ban context text
  function getBanContext(): string {
    if (country.ban_status === "full_ban" && country.ban_year) {
      return t("key_figures_ban_full", { year: String(country.ban_year) });
    }
    if (country.ban_status === "partial_ban") return t("key_figures_ban_partial");
    if (country.ban_status === "no_ban") return t("key_figures_ban_none");
    if (country.ban_status === "de_facto_ban" && country.ban_year) {
      return t("key_figures_ban_full", { year: String(country.ban_year) });
    }
    return t("key_figures_ban_unknown");
  }

  // Determine mesothelioma context
  function getMesoContext(): string | null {
    if (country.mesothelioma_rate === null) return null;
    if (country.mesothelioma_rate > 20) return t("key_figures_meso_high");
    if (country.mesothelioma_rate > 5) return t("key_figures_meso_moderate");
    return t("key_figures_meso_low");
  }

  // Split buildings_at_risk into segments for detailed display
  const buildingsSegments = country.estimated_buildings_at_risk
    ? country.estimated_buildings_at_risk.split(";").map((s) => s.trim())
    : null;

  const mesoContext = getMesoContext();

  // Only render if there's meaningful data to expand on
  const hasMesoData = country.mesothelioma_rate !== null;
  const hasBuildingsData = buildingsSegments !== null;
  if (!hasMesoData && !hasBuildingsData) return null;

  return (
    <section aria-labelledby="key-figures-heading">
      <h2
        id="key-figures-heading"
        className="text-lg font-semibold text-text-primary mb-1"
      >
        {t("key_figures_title")}
      </h2>
      <p className="text-sm text-text-muted mb-4">
        {t("key_figures_subtitle")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Ban Year Card */}
        <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
          <div className="flex items-baseline gap-3 mb-2">
            <span
              className="font-mono text-3xl font-bold tabular-nums"
              style={{ color: banStatusColor }}
            >
              {country.ban_year ?? "—"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              {t("key_figures_ban_title")}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {getBanContext()}
          </p>
        </div>

        {/* Mesothelioma Rate Card */}
        {hasMesoData && (
          <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="font-mono text-3xl font-bold tabular-nums"
                style={{
                  color:
                    country.mesothelioma_rate! > 20
                      ? "var(--color-danger)"
                      : "var(--color-warning)",
                }}
              >
                {country.mesothelioma_rate!.toFixed(1)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                {t("key_figures_meso_title")}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("key_figures_meso_description", {
                rate: country.mesothelioma_rate!.toFixed(1),
              })}
            </p>
            {mesoContext && (
              <p className="text-sm text-text-muted mt-2 italic">
                {mesoContext}
              </p>
            )}
            {country.mesothelioma_source_year && (
              <p className="text-xs text-text-muted mt-2 font-mono">
                {t("key_figures_meso_source", {
                  year: String(country.mesothelioma_source_year),
                })}
              </p>
            )}
          </div>
        )}

        {/* Buildings at Risk Card — spans full width when data is long */}
        {hasBuildingsData && (
          <div
            className={`rounded-lg bg-bg-secondary border border-bg-tertiary p-5 ${
              buildingsSegments!.length > 1 ? "sm:col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                {t("key_figures_buildings_title")}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              {t("key_figures_buildings_description")}
            </p>
            {buildingsSegments!.length === 1 ? (
              <p className="text-base font-semibold text-text-primary">
                {buildingsSegments![0]}
              </p>
            ) : (
              <ul className="space-y-2" role="list">
                {buildingsSegments!.map((segment, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-text-primary"
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 text-warning"
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span className="font-medium">{segment}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Peak Usage Era Card */}
        {country.peak_usage_era && (
          <div
            className={`rounded-lg bg-bg-secondary border border-bg-tertiary p-5 ${
              hasBuildingsData && buildingsSegments!.length > 1
                ? ""
                : !hasMesoData
                  ? ""
                  : "sm:col-span-2"
            }`}
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-mono text-2xl font-bold text-text-primary">
                {country.peak_usage_era}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                {t("key_figures_peak_title")}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("key_figures_peak_description")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
