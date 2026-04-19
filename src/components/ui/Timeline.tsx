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

const TYPE_ICON: Record<TimelineEvent["type"], string> = {
  ban: "\u2696\uFE0F",
  partial_ban: "\u26A0\uFE0F",
  regulation: "\u{1F4DC}",
  court_ruling: "\u{1F528}",
  other: "\u{1F4CD}",
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

  const decadeEntries = Array.from(decades.entries());
  const lastEvent = sorted[sorted.length - 1];
  const lastDecade = decadeEntries[decadeEntries.length - 1]?.[0];

  return (
    <ol aria-label={t("timeline")} className="space-y-2">
      {decadeEntries.map(([decade, decadeEvents]) => {
        // Most recent decade is open by default
        const isLastDecade = decade === lastDecade;

        return (
          <li key={decade}>
            <details
              open={isLastDecade}
              className="group rounded-lg border border-bg-tertiary overflow-hidden"
            >
              {/* Decade summary — clickable accordion header */}
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer bg-bg-secondary hover:bg-bg-tertiary/50 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-text-primary tabular-nums">
                    {decade}s
                  </span>
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                    {decadeEvents.length} {decadeEvents.length === 1 ? "event" : "events"}
                  </span>
                  {/* Type indicators — colored dots showing what kinds of events */}
                  <div className="hidden sm:flex items-center gap-1">
                    {decadeEvents.map((e, i) => {
                      const dotColor: Record<TimelineEvent["type"], string> = {
                        ban: "bg-safe",
                        partial_ban: "bg-warning",
                        regulation: "bg-accent",
                        court_ruling: "bg-warning",
                        other: "bg-text-muted",
                      };
                      return (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${dotColor[e.type]}`}
                          aria-hidden="true"
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Chevron */}
                <span className="text-text-muted transition-transform group-open:rotate-180" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>

              {/* Events inside decade */}
              <ol className="space-y-2 p-2 pt-0">
                {decadeEvents.map((event, i) => {
                  const isLast = event === lastEvent;
                  const isPulsing = isLast && event.year >= currentYear;
                  const borderClass = TYPE_BORDER_CLASS[event.type] ?? "border-l-text-muted";
                  const badgeClass = TYPE_BADGE_CLASS[event.type] ?? "text-text-muted bg-bg-tertiary border-bg-tertiary";
                  const icon = TYPE_ICON[event.type] ?? "\u{1F4CD}";

                  return (
                    <li key={i}>
                      <article
                        className={`rounded-lg bg-bg-primary border border-bg-tertiary border-l-4 ${borderClass} p-4`}
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-base" aria-hidden="true">{icon}</span>
                          <span className="font-mono text-lg font-bold text-text-primary tabular-nums leading-none flex items-center gap-1.5">
                            {event.year}
                            {isPulsing && (
                              <span
                                className="inline-block w-2 h-2 rounded-full bg-safe animate-pulse"
                                aria-label="Ongoing"
                              />
                            )}
                          </span>
                          <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                            {getTypeLabel(event.type, t)}
                          </span>
                        </div>

                        <p className="text-sm text-text-secondary leading-relaxed">
                          {locale === "es" && event.event_es ? event.event_es : event.event}
                        </p>

                        {event.source_url && (
                          <a
                            href={event.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 rounded bg-bg-tertiary/50 px-2.5 py-1 text-xs text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                            aria-label={`Source for ${event.year} event`}
                          >
                            <span aria-hidden="true">↗</span>
                            {t("source_link_label")}
                          </a>
                        )}
                      </article>
                    </li>
                  );
                })}
              </ol>
            </details>
          </li>
        );
      })}
    </ol>
  );
}
