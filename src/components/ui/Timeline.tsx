import { getLocale, getTranslations } from "next-intl/server";
import type { TimelineEvent } from "@/lib/types";

interface TimelineProps {
  events: TimelineEvent[];
}

const TYPE_BADGE_CLASS: Record<TimelineEvent["type"], string> = {
  ban: "text-safe bg-safe/10 border-safe/20",
  partial_ban: "text-warning bg-warning/10 border-warning/20",
  regulation: "text-accent bg-accent/10 border-accent/20",
  court_ruling: "text-warning bg-warning/10 border-warning/20",
  other: "text-text-muted bg-bg-tertiary border-bg-tertiary",
};

const TYPE_BORDER_CLASS: Record<TimelineEvent["type"], string> = {
  ban: "border-l-safe",
  partial_ban: "border-l-warning",
  regulation: "border-l-accent",
  court_ruling: "border-l-warning",
  other: "border-l-text-muted",
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
  const [t, locale] = await Promise.all([
    getTranslations("country"),
    getLocale(),
  ]);

  const sorted = [...events].sort((a, b) => a.year - b.year);
  const currentYear = 2026;

  // Group by decade
  const decades = new Map<number, TimelineEvent[]>();
  for (const event of sorted) {
    const decade = Math.floor(event.year / 10) * 10;
    if (!decades.has(decade)) decades.set(decade, []);
    decades.get(decade)!.push(event);
  }

  const lastEvent = sorted[sorted.length - 1];

  return (
    <ol aria-label={t("timeline")} className="space-y-0">
      {Array.from(decades.entries()).map(([decade, decadeEvents]) => (
        <li key={decade}>
          {/* Decade header */}
          <h3 className="font-mono text-xs uppercase tracking-widest text-text-muted mt-6 mb-3 first:mt-0 pb-1 border-b border-bg-tertiary">
            {decade}s
          </h3>

          <ol className="space-y-2">
            {decadeEvents.map((event, i) => {
              const isLast = event === lastEvent;
              const isPulsing = isLast && event.year >= currentYear;
              const borderClass =
                TYPE_BORDER_CLASS[event.type] ?? "border-l-text-muted";
              const badgeClass =
                TYPE_BADGE_CLASS[event.type] ?? "text-text-muted bg-bg-tertiary border-bg-tertiary";

              return (
                <li key={i}>
                  <article
                    className={`rounded-lg bg-bg-secondary border border-bg-tertiary border-l-4 ${borderClass} p-4`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* Year */}
                      <span className="font-mono text-sm font-bold text-text-primary tabular-nums flex items-center gap-1.5">
                        {event.year}
                        {isPulsing && (
                          <span
                            className="inline-block w-2 h-2 rounded-full bg-safe animate-pulse"
                            aria-label="Ongoing"
                          />
                        )}
                      </span>

                      {/* Type badge */}
                      <span
                        className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${badgeClass}`}
                      >
                        {getTypeLabel(event.type, t)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {locale === "es" && event.event_es
                        ? event.event_es
                        : event.event}
                    </p>

                    {/* Source */}
                    {event.source_url && (
                      <a
                        href={event.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-block text-xs text-text-muted hover:text-accent transition-colors"
                        aria-label={`Source for ${event.year} event`}
                      >
                        {t("source_link_label")}
                      </a>
                    )}
                  </article>
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );
}
