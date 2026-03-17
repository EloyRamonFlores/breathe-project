import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { ScenarioData } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toxinfree.global";

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
    title: t("what_to_do_page.title"),
    description: t("what_to_do_page.meta_description"),
    openGraph: {
      title: t("what_to_do_page.title"),
      description: t("what_to_do_page.meta_description"),
      type: "article",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/learn/what-to-do`,
        es: `${BASE_URL}/es/learn/what-to-do`,
      },
    },
  };
}

const SCENARIO_KEYS = [
  "scenario_suspect",
  "scenario_professional",
  "scenario_confirmed",
] as const;

const SCENARIO_COLORS = [
  "border-warning/30 bg-warning/5",
  "border-accent/30 bg-accent/5",
  "border-safe/30 bg-safe/5",
] as const;

const SCENARIO_NUM_COLORS = [
  "bg-warning/10 text-warning",
  "bg-accent/10 text-accent",
  "bg-safe/10 text-safe",
] as const;

export default async function WhatToDoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const scenarios = SCENARIO_KEYS.map(
    (key) => t.raw(`what_to_do_page.${key}`) as ScenarioData
  );
  const doNotItems = t.raw("what_to_do_page.do_not_items") as string[];
  const whenToCallItems = t.raw(
    "what_to_do_page.when_to_call_items"
  ) as string[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("what_to_do_page.title"),
    datePublished: "2026-03-14",
    dateModified: "2026-03-14",
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
          <span className="text-text-primary">{t("what_to_do_page.title")}</span>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-10">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            {t("what_to_do_page.title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed border-l-2 border-safe/40 pl-4">
            {t("what_to_do_page.intro")}
          </p>
        </header>

        {/* ── Three Scenarios ── */}
        <section className="mb-12" aria-labelledby="scenarios-heading">
          <h2
            id="scenarios-heading"
            className="text-xl font-semibold text-text-primary mb-6"
          >
            {t("what_to_do_page.scenarios_heading")}
          </h2>
          <div className="space-y-6">
            {scenarios.map((scenario, i) => (
              <div
                key={i}
                className={`rounded-lg border p-5 sm:p-6 ${SCENARIO_COLORS[i]}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${SCENARIO_NUM_COLORS[i]}`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-text-primary">
                    {scenario.title}
                  </h3>
                </div>
                <ol className="space-y-3" role="list">
                  {scenario.steps.map((step, j) => (
                    <li key={j} className="flex gap-3">
                      <span
                        className="font-mono text-xs text-text-muted mt-0.5 flex-shrink-0 w-4 text-right"
                        aria-hidden="true"
                      >
                        {j + 1}.
                      </span>
                      <span className="text-sm text-text-secondary leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* ── Do NOT List ── */}
        <section className="mb-12" aria-labelledby="do-not-heading">
          <h2
            id="do-not-heading"
            className="text-xl font-semibold text-text-primary mb-4"
          >
            {t("what_to_do_page.do_not_heading")}
          </h2>
          <ul className="space-y-2" role="list">
            {doNotItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg bg-danger/10 border border-danger/20 px-4 py-3"
              >
                <span
                  className="mt-0.5 flex-shrink-0 text-danger font-bold text-base"
                  aria-hidden="true"
                >
                  ✕
                </span>
                <span className="text-sm text-text-secondary leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── When To Call ── */}
        <section
          className="mb-12 rounded-lg bg-bg-secondary border border-bg-tertiary p-5 sm:p-6"
          aria-labelledby="when-to-call-heading"
        >
          <h2
            id="when-to-call-heading"
            className="text-lg font-semibold text-text-primary mb-4"
          >
            {t("what_to_do_page.when_to_call_heading")}
          </h2>
          <ul className="space-y-2" role="list">
            {whenToCallItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-secondary">
                <span
                  className="mt-0.5 flex-shrink-0 text-warning"
                  aria-hidden="true"
                >
                  ›
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── CTA ── */}
        <section
          className="mb-10 rounded-lg border border-warning/30 bg-warning/5 p-5 sm:p-6"
          aria-labelledby="cta-what-to-do-heading"
        >
          <h2
            id="cta-what-to-do-heading"
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
            {t("what_to_do_page.disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
