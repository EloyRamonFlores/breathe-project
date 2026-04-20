import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import materialsData from "@/data/materials.json";
import type { Material, RiskLevel } from "@/lib/types";
import { getRiskTailwindClass } from "@/lib/utils";
import { SITE_URL, CONTENT_PUBLISHED_DATE, CONTENT_MODIFIED_DATE } from "@/lib/constants";
import educationalAssets from "@/data/educational-assets.json";
import EducationalImage from "@/components/ui/EducationalImage";

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
    title: t("where_hides_page.title"),
    description: t("where_hides_page.meta_description"),
    openGraph: {
      title: t("where_hides_page.title"),
      description: t("where_hides_page.meta_description"),
      type: "article",
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/where-it-hides`,
      languages: {
        en: `${BASE_URL}/en/learn/where-it-hides`,
        es: `${BASE_URL}/es/learn/where-it-hides`,
      },
    },
  };
}

const LOCATION_ORDER = [
  "roof",
  "exterior_walls",
  "walls",
  "ceiling",
  "floor",
  "basement",
  "utility_room",
  "underground",
] as const;

type LocationKey = (typeof LOCATION_ORDER)[number];

function getRiskBadgeClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: "text-safe bg-safe/10 border border-safe/20",
    moderate: "text-warning bg-warning/10 border border-warning/20",
    high: "text-danger bg-danger/10 border border-danger/20",
    critical: "text-critical bg-critical/10 border border-critical/20",
  };
  return classes[level];
}

export default async function WhereItHidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const materials = materialsData as Material[];

  // Group materials by location
  const grouped: Record<LocationKey, Material[]> = {} as Record<
    LocationKey,
    Material[]
  >;
  for (const loc of LOCATION_ORDER) {
    const matches = materials.filter((m) => m.location.includes(loc));
    if (matches.length > 0) {
      grouped[loc] = matches;
    }
  }

  const activeLocations = LOCATION_ORDER.filter((loc) => grouped[loc]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("where_hides_page.title"),
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
          <span className="text-text-primary">{t("where_hides_page.title")}</span>
        </nav>

        {/* ── Page Header ── */}
        <header className="mb-10">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            {t("where_hides_page.title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {t("where_hides_page.intro")}
          </p>
        </header>

        {/* ── Friability note ── */}
        <div className="mb-8 flex gap-3 rounded-lg bg-warning/5 border border-warning/20 px-4 py-3">
          <span className="text-warning flex-shrink-0 mt-0.5" aria-hidden="true">⚠</span>
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-warning">{t("where_hides_page.friable_label")}: </span>
            {t("where_hides_page.friable_warning")}
          </p>
        </div>

        {/* ── Location Sections ── */}
        <div className="space-y-10">
          {activeLocations.map((loc) => (
            <section key={loc} aria-labelledby={`loc-${loc}-heading`}>
              <h2
                id={`loc-${loc}-heading`}
                className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"
              >
                <span className="text-text-muted" aria-hidden="true">▸</span>
                {t(`where_hides_page.location_labels.${loc}`)}
              </h2>

              {/* Location image(s) */}
              {(() => {
                const locImages = educationalAssets.filter((a) => a.location === loc);
                return locImages.length > 0 ? (
                  <div className={`mb-6 grid gap-4 ${locImages.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {locImages.map((asset) => (
                      <EducationalImage
                        key={asset.id}
                        url={asset.unsplash_url}
                        alt={asset.alt_text}
                      />
                    ))}
                  </div>
                ) : null;
              })()}

              <div className="space-y-3">
                {grouped[loc].map((material) => (
                  <div
                    key={material.id}
                    className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4 sm:p-5"
                  >
                    {/* Material header */}
                    <div className="flex gap-3 mb-3">
                      {material.image_url && (
                        <img
                          src={material.image_url}
                          alt={material.name}
                          className="w-20 h-20 rounded-md object-cover flex-shrink-0 hidden sm:block"
                          loading="lazy"
                        />
                      )}
                      <div className="flex flex-wrap items-start justify-between gap-3 flex-1">
                      <h3 className="font-medium text-text-primary text-sm sm:text-base">
                        {material.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {/* Risk badge */}
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${getRiskBadgeClass(material.risk_when_disturbed)}`}
                        >
                          {t("where_hides_page.risk_badge_label")}: {material.risk_when_disturbed}
                        </span>
                        {/* Friability badge */}
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                            material.friability === "friable"
                              ? "text-warning bg-warning/10 border-warning/20"
                              : "text-text-muted bg-bg-tertiary border-bg-tertiary"
                          }`}
                        >
                          {material.friability === "friable"
                            ? t("where_hides_page.friable_label")
                            : t("where_hides_page.non_friable_label")}
                        </span>
                      </div>
                      </div>
                    </div>

                    {/* Era */}
                    <p className="text-xs text-text-muted mb-3">
                      {t("where_hides_page.era_label")}:{" "}
                      <span className="font-mono text-text-secondary">
                        {t("where_hides_page.era_range", {
                          start: material.era_start,
                          end: material.era_end,
                        })}
                      </span>
                    </p>

                    {/* Recommendations grid */}
                    <div className="grid sm:grid-cols-3 gap-2">
                      <div className="rounded bg-bg-primary border border-bg-tertiary p-2.5">
                        <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                          {t("where_hides_page.intact_label")}
                        </p>
                        <p className={`text-xs leading-relaxed ${getRiskTailwindClass(material.risk_when_intact)}`}>
                          {material.recommendation_intact}
                        </p>
                      </div>
                      <div className="rounded bg-bg-primary border border-bg-tertiary p-2.5">
                        <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                          {t("where_hides_page.damaged_label")}
                        </p>
                        <p className={`text-xs leading-relaxed ${getRiskTailwindClass(material.risk_when_damaged)}`}>
                          {material.recommendation_damaged}
                        </p>
                      </div>
                      <div className="rounded bg-bg-primary border border-bg-tertiary p-2.5">
                        <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                          {t("where_hides_page.renovation_label")}
                        </p>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {material.recommendation_renovation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── CTA ── */}
        <section
          className="mt-12 rounded-lg border border-warning/30 bg-warning/5 p-5 sm:p-6"
          aria-labelledby="cta-where-heading"
        >
          <h2
            id="cta-where-heading"
            className="text-lg font-semibold text-text-primary mb-1"
          >
            {t("where_hides_page.cta_heading")}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {t("where_hides_page.cta_body")}
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
          >
            {t("where_hides_page.cta_button")}
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* ── Disclaimer ── */}
        <div className="mt-8 rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            {t("where_hides_page.disclaimer")}
          </p>
        </div>
      </div>
    </main>
  );
}
