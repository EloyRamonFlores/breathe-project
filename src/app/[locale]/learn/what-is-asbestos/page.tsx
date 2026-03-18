import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import type { FiberTypeData, DiseaseData } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";

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
    title: t("what_is_page.title"),
    description: t("what_is_page.meta_description"),
    openGraph: {
      title: t("what_is_page.title"),
      description: t("what_is_page.meta_description"),
      type: "article",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/learn/what-is-asbestos`,
        es: `${BASE_URL}/es/learn/what-is-asbestos`,
      },
    },
  };
}

function getDangerClass(level: FiberTypeData["danger_level"]): string {
  return level === "critical"
    ? "text-danger bg-danger/10 border border-danger/20"
    : "text-warning bg-warning/10 border border-warning/20";
}

function getSeverityClass(severity: DiseaseData["severity"]): string {
  return severity === "critical"
    ? "text-danger"
    : "text-warning";
}

export default async function WhatIsAsbestosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const fiberTypes = t.raw("what_is_page.fiber_types") as FiberTypeData[];
  const diseases = t.raw("what_is_page.diseases") as DiseaseData[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("what_is_page.title"),
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
          <span className="text-text-primary">{t("what_is_page.title")}</span>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-10">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            {t("what_is_page.title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {t("what_is_page.intro")}
          </p>
        </header>

        {/* ── Fiber Types ── */}
        <section className="mb-12" aria-labelledby="fiber-types-heading">
          <h2
            id="fiber-types-heading"
            className="text-xl font-semibold text-text-primary mb-6"
          >
            {t("what_is_page.fiber_types_heading")}
          </h2>
          <div className="space-y-4">
            {fiberTypes.map((fiber) => (
              <div
                key={fiber.key}
                className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="font-semibold text-text-primary">
                    {fiber.name}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getDangerClass(fiber.danger_level)}`}
                  >
                    {fiber.danger_level === "critical" ? "⚠ Critical" : "⚠ High"}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-2">
                  {fiber.description}
                </p>
                <p className="text-xs text-text-muted">
                  {fiber.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why Dangerous ── */}
        <section className="mb-12" aria-labelledby="why-dangerous-heading">
          <h2
            id="why-dangerous-heading"
            className="text-xl font-semibold text-text-primary mb-3"
          >
            {t("what_is_page.why_dangerous_heading")}
          </h2>
          <p className="text-text-secondary mb-6">
            {t("what_is_page.why_dangerous_intro")}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Friability */}
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/10 text-warning text-sm font-bold"
                  aria-hidden="true"
                >
                  1
                </span>
                <h3 className="font-semibold text-text-primary">
                  {t("what_is_page.friability_heading")}
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("what_is_page.friability_body")}
              </p>
            </div>

            {/* Biopersistence */}
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/10 text-danger text-sm font-bold"
                  aria-hidden="true"
                >
                  2
                </span>
                <h3 className="font-semibold text-text-primary">
                  {t("what_is_page.biopersistence_heading")}
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {t("what_is_page.biopersistence_body")}
              </p>
            </div>
          </div>
        </section>

        {/* ── Health Mechanism ── */}
        <section
          className="mb-12 rounded-lg bg-bg-secondary border border-bg-tertiary p-5 sm:p-6"
          aria-labelledby="mechanism-heading"
        >
          <h2
            id="mechanism-heading"
            className="text-xl font-semibold text-text-primary mb-3"
          >
            {t("what_is_page.mechanism_heading")}
          </h2>
          <p className="text-text-secondary leading-relaxed">
            {t("what_is_page.mechanism_body")}
          </p>
        </section>

        {/* ── Diseases ── */}
        <section className="mb-12" aria-labelledby="diseases-heading">
          <h2
            id="diseases-heading"
            className="text-xl font-semibold text-text-primary mb-6"
          >
            {t("what_is_page.diseases_heading")}
          </h2>
          <div className="space-y-3">
            {diseases.map((disease) => (
              <div
                key={disease.key}
                className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-lg font-bold ${getSeverityClass(disease.severity)}`}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                  <h3 className="font-semibold text-text-primary">
                    {disease.name}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed pl-7">
                  {disease.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Countries Still Using Asbestos ── */}
        <section className="mb-10" aria-labelledby="no-ban-countries-heading">
          <h2
            id="no-ban-countries-heading"
            className="text-lg font-semibold text-text-primary mb-2"
          >
            {t("what_is_page.no_ban_countries_heading")}
          </h2>
          <p className="text-sm text-text-muted mb-4">
            {t("what_is_page.no_ban_countries_body")}
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { slug: "india", name: "India" },
                { slug: "china", name: "China" },
                { slug: "russia", name: "Russia" },
                { slug: "indonesia", name: "Indonesia" },
                { slug: "mexico", name: "Mexico" },
                { slug: "nigeria", name: "Nigeria" },
              ] as const
            ).map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/country/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-900/40 bg-red-950/20 px-3 py-1.5 text-sm text-red-400/90 transition-colors hover:border-red-700/50 hover:bg-red-950/40"
              >
                {name}
                <span aria-hidden="true" className="opacity-50">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="mb-10 rounded-lg border border-warning/30 bg-warning/5 p-5 sm:p-6"
          aria-labelledby="cta-what-is-heading"
        >
          <h2
            id="cta-what-is-heading"
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
            {t("what_is_page.disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
