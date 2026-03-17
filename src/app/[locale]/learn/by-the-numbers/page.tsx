import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ByTheNumbersCharts from "@/components/ui/ByTheNumbersCharts";
import countriesData from "@/data/countries.json";
import type { Country, RegionBanData, DistributionEntry } from "@/lib/types";

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
    title: t("numbers_page.title"),
    description: t("numbers_page.meta_description"),
    openGraph: {
      title: t("numbers_page.title"),
      description: t("numbers_page.meta_description"),
      type: "article",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/learn/by-the-numbers`,
        es: `${BASE_URL}/es/learn/by-the-numbers`,
      },
    },
  };
}

// ─── Build-time data computation ──────────────────────────────────────────────

function computeRegionData(countries: Country[]): RegionBanData[] {
  const regionMap = new Map<string, RegionBanData>();
  for (const c of countries) {
    if (!regionMap.has(c.region)) {
      regionMap.set(c.region, {
        region: c.region,
        full_ban: 0,
        partial_ban: 0,
        no_ban: 0,
        unknown: 0,
      });
    }
    const entry = regionMap.get(c.region)!;
    if (c.ban_status === "full_ban" || c.ban_status === "de_facto_ban") {
      entry.full_ban++;
    } else if (c.ban_status === "partial_ban") {
      entry.partial_ban++;
    } else if (c.ban_status === "no_ban") {
      entry.no_ban++;
    } else {
      entry.unknown++;
    }
  }
  return Array.from(regionMap.values()).sort((a, b) =>
    a.region.localeCompare(b.region)
  );
}

function computeDistributionData(countries: Country[]): DistributionEntry[] {
  return [
    {
      status: "full_ban",
      count: countries.filter(
        (c) => c.ban_status === "full_ban" || c.ban_status === "de_facto_ban"
      ).length,
    },
    {
      status: "partial_ban",
      count: countries.filter((c) => c.ban_status === "partial_ban").length,
    },
    {
      status: "no_ban",
      count: countries.filter((c) => c.ban_status === "no_ban").length,
    },
    {
      status: "unknown",
      count: countries.filter((c) => c.ban_status === "unknown").length,
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ByTheNumbersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const countries = countriesData as Country[];
  const regionData = computeRegionData(countries);
  const distributionData = computeDistributionData(countries);
  const noBanCount = countries.filter(
    (c) => c.ban_status === "no_ban" || c.ban_status === "unknown" || c.ban_status === "partial_ban"
  ).length;

  const chartLabels = {
    banned: t("numbers_page.chart_legend_banned"),
    partial: t("numbers_page.chart_legend_partial"),
    noBan: t("numbers_page.chart_legend_no_ban"),
    unknown: t("numbers_page.chart_legend_unknown"),
    regionChartTitle: t("numbers_page.chart_region_heading"),
    regionChartDescription: t("numbers_page.chart_region_description"),
    distributionChartTitle: t("numbers_page.chart_distribution_heading"),
    distributionChartDescription: t("numbers_page.chart_distribution_description"),
  };

  const stats = [
    {
      target: 255000,
      label: t("numbers_page.stat_deaths_label"),
      source: t("numbers_page.stat_deaths_source"),
      color: "text-danger",
    },
    {
      target: 72,
      label: t("numbers_page.stat_banned_label"),
      source: t("numbers_page.stat_banned_source"),
      color: "text-safe",
    },
    {
      target: noBanCount,
      label: t("numbers_page.stat_no_ban_label"),
      source: t("numbers_page.stat_no_ban_source"),
      color: "text-warning",
    },
    {
      target: 125000,
      label: t("numbers_page.stat_roofing_label"),
      source: t("numbers_page.stat_roofing_source"),
      color: "text-text-primary",
      unit: t("numbers_page.stat_roofing_unit"),
    },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("numbers_page.title"),
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
          <span className="text-text-primary">{t("numbers_page.title")}</span>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-10">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            {t("numbers_page.title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {t("numbers_page.intro")}
          </p>
        </header>

        {/* ── Key Stats ── */}
        <section className="mb-12" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Key Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5"
              >
                <div className={`font-mono text-4xl font-bold tabular-nums mb-1 ${stat.color}`}>
                  <AnimatedCounter target={stat.target} duration={2000} />
                  {stat.unit && (
                    <span className="text-xl ml-1">{stat.unit}</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary leading-snug mb-2">
                  {stat.label}
                </p>
                <p className="text-xs text-text-muted">
                  {t("numbers_page.source_label")}: {stat.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Charts ── */}
        <section className="mb-12">
          <Suspense
            fallback={
              <div className="h-64 rounded-lg bg-bg-secondary border border-bg-tertiary flex items-center justify-center">
                <p className="text-sm text-text-muted">Loading charts...</p>
              </div>
            }
          >
            <ByTheNumbersCharts
              regionData={regionData}
              distributionData={distributionData}
              labels={chartLabels}
            />
          </Suspense>
        </section>

        {/* ── CTA ── */}
        <section
          className="mb-10 rounded-lg border border-warning/30 bg-warning/5 p-5 sm:p-6"
          aria-labelledby="cta-numbers-heading"
        >
          <h2
            id="cta-numbers-heading"
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
            {t("numbers_page.disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
