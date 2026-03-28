import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";
import Timeline from "@/components/ui/Timeline";
import ResistanceStories from "@/components/country/ResistanceStories";
import { getBanStatusColor } from "@/lib/utils";

// ─── Static Generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const locales = ["en", "es"];
  return (countries as Country[]).flatMap((country) =>
    locales.map((locale) => ({ locale, slug: country.slug }))
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;

// ─── Handcrafted descriptions for 15 priority countries ─────────────────────
const PRIORITY_DESCRIPTIONS: Record<string, string> = {
  "united-states":
    "Yes, the U.S. banned asbestos in 2024. Millions of pre-ban buildings still contain asbestos materials. Check if your home is at risk.",
  india:
    "India has no national asbestos ban. The world's second-largest user, with millions exposed in construction and manufacturing. Check your building.",
  china:
    "China has no asbestos ban and is the world's largest asbestos producer. Millions of buildings contain asbestos materials. Assess your exposure risk.",
  russia:
    "Russia has no asbestos ban and mines over 700,000 tons annually. Buildings across all eras contain asbestos materials. Use our free risk checker.",
  brazil:
    "Yes, Brazil banned asbestos in 2023 after a decades-long fight. Pre-ban buildings may still contain materials. Check your property's risk now.",
  mexico:
    "Mexico has no asbestos ban. Millions of homes and factories from 1960–2000 likely contain asbestos-cement materials. Check your risk now.",
  indonesia:
    "Indonesia has no asbestos ban. Widespread use in roofing and construction puts millions at risk. Assess your building with our free tool.",
  "united-kingdom":
    "Yes, the UK banned asbestos in 1999. Buildings built before 1999 may still contain it. Learn UK regulations and check your property's risk.",
  australia:
    "Yes, Australia banned asbestos in 2003. Pre-2003 buildings from the 1960–1980 peak era may still contain asbestos materials. Check your risk.",
  japan:
    "Yes, Japan banned asbestos in 2012. Buildings built before the ban may still contain asbestos-cement, floor tiles, and insulation materials.",
  "south-korea":
    "Yes, South Korea banned asbestos in 2009. Older buildings from the 1970–1990 construction boom may still contain asbestos materials.",
  germany:
    "Yes, Germany banned asbestos in 1993, one of the first countries to do so. Pre-1993 buildings remain a risk. Learn about German asbestos law.",
  "south-africa":
    "Yes, South Africa banned asbestos in 2008. Once a major producer, the country has a legacy of contaminated buildings and sites. Check your risk.",
  canada:
    "Yes, Canada banned asbestos in 2018 — despite being a former top producer. Pre-2018 buildings, especially 1960–1980 era, may still contain it.",
  nigeria:
    "Nigeria has no asbestos ban. Asbestos-cement roofing is still widely used in construction. Check if your building contains hazardous materials.",
};

const PRIORITY_DESCRIPTIONS_ES: Record<string, string> = {
  "united-states":
    "Sí, EE.UU. prohibió el asbesto en 2024. Millones de edificios anteriores a la prohibición aún contienen materiales con asbesto. Verifica si tu hogar está en riesgo.",
  india:
    "India no tiene una prohibición nacional del asbesto. Es el segundo mayor usuario mundial, con millones expuestos en la construcción y manufactura. Evalúa tu edificio.",
  china:
    "China no tiene prohibición de asbesto y es el mayor productor mundial. Millones de edificios contienen materiales con asbesto. Evalúa tu riesgo de exposición.",
  russia:
    "Rusia no tiene prohibición de asbesto y extrae más de 700,000 toneladas anuales. Los edificios de todas las épocas contienen materiales con asbesto. Usa nuestra herramienta gratuita.",
  brazil:
    "Sí, Brasil prohibió el asbesto en 2023 tras décadas de lucha. Los edificios anteriores a la prohibición pueden contener materiales. Verifica el riesgo de tu propiedad.",
  mexico:
    "México no tiene una prohibición del asbesto. Millones de hogares y fábricas de 1960–2000 probablemente contienen materiales de cemento-asbesto. Verifica tu riesgo ahora.",
  indonesia:
    "Indonesia no tiene una prohibición del asbesto. Su uso generalizado en techos y construcción pone a millones en riesgo. Evalúa tu edificio con nuestra herramienta gratuita.",
  "united-kingdom":
    "Sí, el Reino Unido prohibió el asbesto en 1999. Los edificios construidos antes de 1999 pueden contenerlo. Conoce la normativa del Reino Unido y verifica el riesgo de tu propiedad.",
  australia:
    "Sí, Australia prohibió el asbesto en 2003. Los edificios anteriores a 2003 de la era de máximo uso (1960–1980) pueden contener materiales con asbesto. Verifica tu riesgo.",
  japan:
    "Sí, Japón prohibió el asbesto en 2012. Los edificios construidos antes de la prohibición pueden contener cemento-asbesto, baldosas y materiales de aislamiento.",
  "south-korea":
    "Sí, Corea del Sur prohibió el asbesto en 2009. Los edificios más antiguos del boom constructivo de 1970–1990 pueden contener materiales con asbesto.",
  germany:
    "Sí, Alemania prohibió el asbesto en 1993, siendo uno de los primeros países en hacerlo. Los edificios anteriores a 1993 siguen siendo un riesgo. Conoce la ley alemana sobre asbesto.",
  "south-africa":
    "Sí, Sudáfrica prohibió el asbesto en 2008. Como antiguo gran productor, el país tiene un legado de edificios y sitios contaminados. Verifica tu riesgo.",
  canada:
    "Sí, Canadá prohibió el asbesto en 2018, a pesar de ser un antiguo gran productor. Los edificios anteriores a 2018, especialmente de la era 1960–1980, pueden contenerlo.",
  nigeria:
    "Nigeria no tiene una prohibición del asbesto. Las cubiertas de cemento-asbesto aún se usan ampliamente en la construcción. Verifica si tu edificio contiene materiales peligrosos.",
};

function getBanDescription(country: Country, locale: string): string {
  const priorityMap =
    locale === "es" ? PRIORITY_DESCRIPTIONS_ES : PRIORITY_DESCRIPTIONS;
  if (priorityMap[country.slug]) {
    return priorityMap[country.slug];
  }
  if (locale === "es") {
    const banText: Record<Country["ban_status"], string> = {
      full_ban: `${country.name} prohibió el asbesto en ${country.ban_year}. Los edificios más antiguos pueden contener materiales con asbesto. Usa nuestra herramienta gratuita para evaluar tu propiedad.`,
      partial_ban: `El asbesto está parcialmente regulado en ${country.name}. Algunos usos aún están permitidos. Conoce la normativa y verifica el riesgo de tu edificio.`,
      no_ban: `No existe una prohibición nacional del asbesto en ${country.name}. Los edificios de todas las épocas pueden contener materiales con asbesto. Usa nuestra herramienta gratuita para evaluar tu propiedad.`,
      de_facto_ban: `El uso del asbesto ha cesado efectivamente en ${country.name}. Los materiales legados en edificios antiguos pueden representar un riesgo. Verifica tu propiedad ahora.`,
      unknown: `El estado regulatorio del asbesto en ${country.name} no está claro. Actúa con precaución en edificios más antiguos y utiliza nuestra herramienta de evaluación.`,
    };
    return banText[country.ban_status];
  }
  const banText: Record<Country["ban_status"], string> = {
    full_ban: `${country.name} banned asbestos in ${country.ban_year}. Older buildings may still contain asbestos materials. Use our free risk checker to assess your property.`,
    partial_ban: `Asbestos is partially regulated in ${country.name}. Some uses are still permitted. Learn about regulations and check your building's asbestos risk.`,
    no_ban: `There is no national asbestos ban in ${country.name}. Buildings of all ages may contain asbestos materials. Use our free risk checker to assess your property.`,
    de_facto_ban: `Asbestos use has effectively ceased in ${country.name}. Legacy materials in older buildings may still pose a risk. Check your property now.`,
    unknown: `Asbestos regulatory status in ${country.name} is unclear. Exercise caution with older buildings and use our risk checker to assess your property.`,
  };
  return banText[country.ban_status];
}

function getCountryTitle(country: Country, locale: string): string {
  if (locale === "es") {
    if (country.ban_status === "full_ban" && country.ban_year) {
      return `¿Está prohibido el asbesto en ${country.name}? Prohibido en ${country.ban_year} | ToxinFree`;
    }
    if (country.ban_status === "no_ban") {
      return `¿Está prohibido el asbesto en ${country.name}? Sin prohibición nacional | ToxinFree`;
    }
    return `¿Está prohibido el asbesto en ${country.name}? | ToxinFree`;
  }
  if (country.ban_status === "full_ban" && country.ban_year) {
    return `Is Asbestos Banned in ${country.name}? Banned ${country.ban_year} | ToxinFree`;
  }
  if (country.ban_status === "no_ban") {
    return `Is Asbestos Banned in ${country.name}? No National Ban | ToxinFree`;
  }
  return `Is Asbestos Banned in ${country.name}? | ToxinFree`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const country = (countries as Country[]).find((c) => c.slug === slug);

  if (!country) {
    return { title: "Country Not Found | ToxinFree" };
  }

  const title = getCountryTitle(country, locale);
  const description = getBanDescription(country, locale);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/country/${slug}`,
        es: `${BASE_URL}/es/country/${slug}`,
      },
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

function getBanStatusPillClass(status: Country["ban_status"]): string {
  const classes: Record<Country["ban_status"], string> = {
    full_ban: "text-safe bg-safe/10 border border-safe/20",
    partial_ban: "text-warning bg-warning/10 border border-warning/20",
    no_ban: "text-danger bg-danger/10 border border-danger/20",
    de_facto_ban: "text-safe bg-safe/10 border border-safe/20",
    unknown: "text-text-muted bg-bg-tertiary border border-bg-tertiary",
  };
  return classes[status];
}

type WhatToDoKey =
  | "what_to_do_full_ban"
  | "what_to_do_partial_ban"
  | "what_to_do_no_ban"
  | "what_to_do_unknown";

function getWhatToDoKey(status: Country["ban_status"]): WhatToDoKey {
  const map: Record<Country["ban_status"], WhatToDoKey> = {
    full_ban: "what_to_do_full_ban",
    partial_ban: "what_to_do_partial_ban",
    no_ban: "what_to_do_no_ban",
    de_facto_ban: "what_to_do_full_ban",
    unknown: "what_to_do_unknown",
  };
  return map[status];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const country = (countries as Country[]).find((c) => c.slug === slug);
  if (!country) notFound();

  const t = await getTranslations("country");
  const tBanStatus = await getTranslations("ban_status");

  const isHighPriority = country.priority === "high";
  const flag = getFlag(country.iso2);
  const pillClass = getBanStatusPillClass(country.ban_status);
  const whatToDoItems = t.raw(getWhatToDoKey(country.ban_status)) as string[];

  const banDisplayDetails =
    locale === "es"
      ? (country.ban_details_es ?? country.ban_details)
      : country.ban_details;

  const displayMaterials =
    locale === "es"
      ? (country.common_materials_es ?? country.common_materials)
      : country.common_materials;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          locale === "es"
            ? `¿Está prohibido el asbesto en ${country.name}?`
            : `Is asbestos banned in ${country.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: getBanDescription(country, locale),
        },
      },
    ],
  };

  return (
    <main className="min-h-screen px-4 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">

        {/* ── Country Header ── */}
        <header className="mb-10">
          <div className="flex flex-wrap items-start gap-4 mb-3">
            <span className="text-5xl sm:text-6xl leading-none" aria-hidden="true">
              {flag}
            </span>
            <div className="flex-1 min-w-0">
              <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary leading-tight mb-2">
                {country.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${pillClass}`}
                >
                  {tBanStatus(country.ban_status)}
                </span>
                <span className="text-sm text-text-muted">{country.region}</span>
              </div>
            </div>
          </div>

          {banDisplayDetails && (
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mt-4 border-l-2 border-bg-tertiary pl-4">
              {banDisplayDetails}
            </p>
          )}
        </header>

        {/* ── Stats Grid ── */}
        <section className="mb-10" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            Key Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Ban Year */}
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
              <div
                className="font-mono text-2xl font-bold tabular-nums mb-1"
                style={{ color: getBanStatusColor(country.ban_status) }}
              >
                {country.ban_year ?? "—"}
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wide">
                {country.ban_year ? t("ban_year_label") : t("no_ban_year")}
              </div>
            </div>

            {/* Mesothelioma Rate */}
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
              <div className="font-mono text-2xl font-bold text-text-primary tabular-nums mb-1">
                {country.mesothelioma_rate !== null
                  ? country.mesothelioma_rate.toFixed(1)
                  : "—"}
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wide">
                {country.mesothelioma_rate !== null
                  ? t("mesothelioma_rate")
                  : t("stat_unknown")}
              </div>
              {country.mesothelioma_rate !== null &&
                country.mesothelioma_source_year && (
                  <div className="text-xs text-text-muted mt-0.5">
                    per million ({country.mesothelioma_source_year})
                  </div>
                )}
            </div>

            {/* Buildings at Risk */}
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4 col-span-2 sm:col-span-1">
              <div className="font-mono text-xl font-bold text-text-primary tabular-nums mb-1 truncate">
                {country.estimated_buildings_at_risk ?? "—"}
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wide">
                {country.estimated_buildings_at_risk
                  ? t("buildings_at_risk")
                  : t("stat_unknown")}
              </div>
            </div>
          </div>

          {/* Peak Usage Era */}
          {country.peak_usage_era && (
            <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
              <span className="text-text-muted">{t("peak_usage")}:</span>
              <span className="font-mono text-text-primary">
                {country.peak_usage_era}
              </span>
            </div>
          )}
        </section>

        {/* ── Regulatory Timeline ── */}
        <section className="mb-10" aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="text-lg font-semibold text-text-primary mb-4"
          >
            {t("timeline")}
          </h2>

          {isHighPriority && country.timeline.length > 0 ? (
            <Timeline events={country.timeline} />
          ) : (
            <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-5">
              <p className="text-sm text-text-muted">{t("timeline_empty")}</p>
              {!isHighPriority && (
                <p className="text-sm text-text-muted mt-2">
                  {t("more_info_coming")}
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Stories of Resistance ── */}
        {country.resistance_stories && country.resistance_stories.length > 0 && (
          <ResistanceStories stories={country.resistance_stories} />
        )}

        {/* ── Common Materials ── */}
        {displayMaterials.length > 0 && (
          <section className="mb-10" aria-labelledby="materials-heading">
            <h2
              id="materials-heading"
              className="text-lg font-semibold text-text-primary mb-1"
            >
              {t("materials")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("common_materials_intro")}
            </p>
            <div className="flex flex-wrap gap-2">
              {displayMaterials.map((material) => (
                <span
                  key={material}
                  className="inline-flex items-center rounded-full bg-bg-secondary border border-bg-tertiary px-3 py-1.5 text-sm text-text-secondary"
                >
                  {material}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── What To Do ── */}
        <section
          className="mb-10 rounded-lg bg-bg-secondary border border-bg-tertiary p-5 sm:p-6"
          aria-labelledby="what-to-do-heading"
        >
          <h2
            id="what-to-do-heading"
            className="text-lg font-semibold text-text-primary mb-4"
          >
            {t("what_to_do")}
          </h2>
          <ul className="space-y-2" role="list">
            {whatToDoItems.map((item, i) => (
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
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            className="text-lg font-semibold text-text-primary mb-1"
          >
            {t("cta_title")}
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            {t("cta_description")}
          </p>
          <Link
            href={`/check?country=${country.iso2.toLowerCase()}`}
            className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
          >
            {t("cta_button")}
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* ── Sources ── */}
        {country.sources.length > 0 && (
          <section className="mb-8" aria-labelledby="sources-heading">
            <h2
              id="sources-heading"
              className="text-lg font-semibold text-text-primary mb-3"
            >
              {t("sources")}
            </h2>
            <ul className="space-y-1.5" role="list">
              {country.sources.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                  >
                    <span>↗</span>
                    <span>{source.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Last Updated ── */}
        {country.last_updated && (
          <p className="text-xs text-text-muted mb-6">
            {t("last_updated")}: {country.last_updated}
          </p>
        )}

        {/* ── Disclaimer ── */}
        <div className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            {t("page_disclaimer")}
          </p>
          <Link
            href="/learn/methodology"
            className="mt-2 inline-flex items-center font-mono text-xs text-accent hover:underline"
          >
            {t("data_source_link")}
          </Link>
        </div>
      </div>
    </main>
  );
}
