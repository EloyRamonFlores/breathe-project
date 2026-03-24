import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { HistoryEventData, HistoryEventType } from "@/lib/types";
import { SITE_URL, CONTENT_PUBLISHED_DATE, CONTENT_MODIFIED_DATE } from "@/lib/constants";

const BASE_URL = SITE_URL;

export async function generateStaticParams() {
  return ["en", "es"].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });
  return {
    title: t("history_page.title"),
    description: t("history_page.meta_description"),
    openGraph: {
      title: t("history_page.title"),
      description: t("history_page.meta_description"),
      type: "article",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/learn/history`,
        es: `${BASE_URL}/es/learn/history`,
      },
    },
  };
}

const HISTORY_DOT_CLASS: Record<HistoryEventType, string> = {
  discovery: "bg-accent",
  coverup: "bg-danger",
  regulation: "bg-safe",
  legal: "bg-warning",
  science: "bg-accent",
  tragedy: "bg-danger",
};

const HISTORY_BADGE_CLASS: Record<HistoryEventType, string> = {
  discovery: "text-accent bg-accent/10 border-accent/20",
  coverup: "text-danger bg-danger/10 border-danger/20",
  regulation: "text-safe bg-safe/10 border-safe/20",
  legal: "text-warning bg-warning/10 border-warning/20",
  science: "text-accent bg-accent/10 border-accent/20",
  tragedy: "text-danger bg-danger/10 border-danger/20",
};

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const events = t.raw("history_page.events") as HistoryEventData[];
  const typeLabels = t.raw("history_page.type_labels") as Record<
    HistoryEventType,
    string
  >;
  const sorted = [...events].sort((a, b) => a.year - b.year);

  const yearRange =
    sorted.length > 0
      ? `${sorted[0].year}–${sorted[sorted.length - 1].year}`
      : "";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("history_page.title"),
    datePublished: CONTENT_PUBLISHED_DATE,
    dateModified: CONTENT_MODIFIED_DATE,
    author: { "@type": "Organization", name: "ToxinFree" },
    publisher: { "@type": "Organization", name: "ToxinFree" },
  };

  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">

        {/* ── Breadcrumb ── */}
        <nav className="mb-8 text-sm text-text-muted" aria-label="Breadcrumb">
          <Link href="/learn" className="hover:text-text-secondary transition-colors">
            {t("title")}
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-text-primary">{t("history_page.title")}</span>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-10">
          <p className="font-mono text-sm text-text-muted mb-2">{yearRange}</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            {t("history_page.title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed border-l-2 border-danger/40 pl-4">
            {t("history_page.intro")}
          </p>
        </header>

        {/* ── Timeline ── */}
        <section aria-label={t("history_page.timeline_aria_label")} className="mb-12">
          <ol className="relative space-y-0">
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
                    className={`block h-3.5 w-3.5 rounded-full border-2 border-bg-primary ${HISTORY_DOT_CLASS[event.type] ?? "bg-text-muted"}`}
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
                      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-medium ${HISTORY_BADGE_CLASS[event.type] ?? "text-text-muted bg-bg-tertiary border-bg-tertiary"}`}
                    >
                      {typeLabels[event.type] ?? event.type}
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
                      aria-label={`${t("history_page.source_label")} ${event.year}`}
                    >
                      ↗ {t("history_page.source_label")}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Closing ── */}
        <section
          className="mb-10 rounded-lg bg-bg-secondary border border-bg-tertiary p-5 sm:p-6"
          aria-labelledby="history-closing-heading"
        >
          <h2
            id="history-closing-heading"
            className="text-lg font-semibold text-text-primary mb-3"
          >
            {t("history_page.closing_heading")}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            {t("history_page.closing_body")}
          </p>
        </section>

        {/* ── CTA ── */}
        <section
          className="mb-10 rounded-lg border border-warning/30 bg-warning/5 p-5 sm:p-6"
          aria-labelledby="cta-history-heading"
        >
          <h2
            id="cta-history-heading"
            className="text-lg font-semibold text-text-primary mb-1"
          >
            {t("what_is_page.cta_heading")}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {t("what_is_page.cta_body")}
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
          >
            {t("what_is_page.cta_button")}
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* ── Disclaimer ── */}
        <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            {t("history_page.disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
