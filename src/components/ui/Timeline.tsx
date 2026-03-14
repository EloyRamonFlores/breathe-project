import { getTranslations } from "next-intl/server";
import type { TimelineEvent } from "@/lib/types";

interface TimelineProps {
  events: TimelineEvent[];
}

const TYPE_DOT_CLASS: Record<TimelineEvent["type"], string> = {
  ban: "bg-safe",
  partial_ban: "bg-warning",
  regulation: "bg-accent",
  court_ruling: "bg-warning",
  other: "bg-text-muted",
};

const TYPE_BADGE_CLASS: Record<TimelineEvent["type"], string> = {
  ban: "text-safe bg-safe/10 border-safe/20",
  partial_ban: "text-warning bg-warning/10 border-warning/20",
  regulation: "text-accent bg-accent/10 border-accent/20",
  court_ruling: "text-warning bg-warning/10 border-warning/20",
  other: "text-text-muted bg-bg-tertiary border-bg-tertiary",
};

function getTypeLabel(
  type: TimelineEvent["type"],
  t: Awaited<ReturnType<typeof getTranslations<"country">>>
): string {
  const map: Record<TimelineEvent["type"], string> = {
    ban: t("timeline_type_ban"),
    partial_ban: t("timeline_type_ban"),
    regulation: t("timeline_type_regulation"),
    court_ruling: t("timeline_type_court_ruling"),
    other: t("timeline_type_other"),
  };
  return map[type];
}

export default async function Timeline({ events }: TimelineProps) {
  const t = await getTranslations("country");

  const sorted = [...events].sort((a, b) => a.year - b.year);

  return (
    <ol className="relative space-y-0" aria-label={t("timeline")}>
      {/* Vertical line */}
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px bg-bg-tertiary"
        aria-hidden="true"
      />

      {sorted.map((event, i) => (
        <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Dot */}
          <div className="relative z-10 mt-1.5 flex-shrink-0">
            <span
              className={`block h-3.5 w-3.5 rounded-full border-2 border-bg-primary ${TYPE_DOT_CLASS[event.type] ?? "bg-text-muted"}`}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-text-primary tabular-nums">
                {event.year}
              </span>
              <span
                className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASS[event.type] ?? "text-text-muted bg-bg-tertiary border-bg-tertiary"}`}
              >
                {getTypeLabel(event.type, t)}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {event.event}
            </p>
            {event.source_url && (
              <a
                href={event.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-text-muted hover:text-accent transition-colors"
                aria-label={`Source for ${event.year} event`}
              >
                ↗ Source
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
