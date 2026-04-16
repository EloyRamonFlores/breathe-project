import { getLocale, getTranslations } from "next-intl/server";
import type {
  ImplementationStatus as ImplementationStatusData,
  ImplementationStatusLevel,
} from "@/lib/types";

interface ImplementationStatusProps {
  status: ImplementationStatusData;
}

function getStatusStyling(level: ImplementationStatusLevel): {
  labelKey: string;
  badgeClass: string;
  dotColor: string;
} {
  switch (level) {
    case "enforced":
      return {
        labelKey: "impl_status_enforced",
        badgeClass: "text-safe bg-safe/10 border-safe/20",
        dotColor: "var(--color-safe)",
      };
    case "partial":
      return {
        labelKey: "impl_status_partial",
        badgeClass: "text-warning bg-warning/10 border-warning/20",
        dotColor: "var(--color-warning)",
      };
    case "ban_in_name_only":
      return {
        labelKey: "impl_status_ban_in_name_only",
        badgeClass: "text-danger bg-danger/10 border-danger/20",
        dotColor: "var(--color-danger)",
      };
    case "unknown":
    default:
      return {
        labelKey: "impl_status_unknown",
        badgeClass: "text-text-muted bg-bg-tertiary border-bg-tertiary",
        dotColor: "var(--color-text-muted)",
      };
  }
}

export default async function ImplementationStatus({
  status,
}: ImplementationStatusProps) {
  const t = await getTranslations("country");
  const locale = await getLocale();
  const isEs = locale === "es";

  const summary = isEs && status.summary_es ? status.summary_es : status.summary;
  const styling = getStatusStyling(status.status);

  return (
    <section aria-labelledby="implementation-heading">
      <h2
        id="implementation-heading"
        className="text-lg font-semibold text-text-primary mb-1"
      >
        {t("impl_title")}
      </h2>
      <p className="text-sm text-text-muted mb-4">
        {t("impl_subtitle")}
      </p>

      <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="mt-1.5 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: styling.dotColor }}
            aria-hidden="true"
          />
          <div className="flex-1">
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wide border ${styling.badgeClass}`}
            >
              {t(styling.labelKey)}
            </span>
          </div>
        </div>

        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          {summary}
        </p>

        <a
          href={status.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
        >
          <span aria-hidden="true">↗</span>
          <span>
            {status.source_name}
            {status.source_date && ` · ${status.source_date}`}
          </span>
        </a>
      </div>
    </section>
  );
}
