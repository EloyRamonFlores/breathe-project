import { getLocale, getTranslations } from "next-intl/server";
import type { ExposureZone } from "@/lib/types";

interface ExposureZonesProps {
  zones: ExposureZone[];
}

export default async function ExposureZones({ zones }: ExposureZonesProps) {
  const t = await getTranslations("country");
  const locale = await getLocale();
  const isEs = locale === "es";

  if (!zones || zones.length === 0) return null;

  return (
    <section aria-labelledby="exposure-zones-heading">
      <h2
        id="exposure-zones-heading"
        className="text-lg font-semibold text-text-primary mb-1"
      >
        {t("exposure_zones_title")}
      </h2>
      <p className="text-sm text-text-muted mb-4">
        {t("exposure_zones_subtitle")}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2" role="list">
        {zones.map((zone, i) => {
          const name = isEs && zone.name_es ? zone.name_es : zone.name;
          const region = isEs && zone.region_es ? zone.region_es : zone.region;
          const reason = isEs && zone.reason_es ? zone.reason_es : zone.reason;

          return (
            <li
              key={`${zone.name}-${i}`}
              className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4"
            >
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex-shrink-0 text-warning"
                  aria-hidden="true"
                >
                  ◉
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1">
                    <h3 className="font-semibold text-sm text-text-primary">
                      {name}
                    </h3>
                    <span className="font-mono text-[11px] text-text-muted">
                      {region}
                    </span>
                    {zone.period && (
                      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                        {zone.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-2">
                    {reason}
                  </p>
                  <a
                    href={zone.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-mono"
                  >
                    <span aria-hidden="true">↗</span>
                    <span>{t("exposure_zones_source")}</span>
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-text-muted mt-3 leading-relaxed">
        {t("exposure_zones_disclaimer")}
      </p>
    </section>
  );
}
