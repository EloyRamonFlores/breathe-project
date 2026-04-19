import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";
import Timeline from "@/components/ui/Timeline";
import ResistanceStories from "@/components/country/ResistanceStories";
import JointStoryCard from "@/components/country/JointStoryCard";
import CountryHero from "@/components/country/CountryHero";
import StatStrip from "@/components/country/StatStrip";
import MaterialGuide from "@/components/country/MaterialGuide";
// KeyFigures removed — data already shown in StatStrip
import ExposureZones from "@/components/country/ExposureZones";
import ImplementationStatus from "@/components/country/ImplementationStatus";
import { SITE_URL } from "@/lib/constants";

// ─── Static Generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const locales = ["en", "es"];
  return (countries as Country[]).flatMap((country) =>
    locales.map((locale) => ({ locale, slug: country.slug }))
  );
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

const BASE_URL = SITE_URL;

// ─── Handcrafted descriptions for 24 priority countries ─────────────────────
const PRIORITY_DESCRIPTIONS: Record<string, string> = {
  "united-states":
    "Yes, the U.S. banned asbestos in 2024. Millions of pre-ban buildings still contain asbestos materials. Check if your home is at risk.",
  india:
    "India has no asbestos use ban. The world's largest importer in 2023 — 485,000 tonnes. An estimated 200 million people live under asbestos roofs. Assess your exposure risk.",
  china:
    "China banned asbestos from construction in 2011, but chrysotile remains legal. 194,000 tonnes consumed yearly. Check if your building contains asbestos.",
  russia:
    "Russia has no asbestos ban — home to Asbest city, 70,000 people built around the world's largest chrysotile mine. All-era buildings may contain asbestos.",
  brazil:
    "Brazil's Supreme Court banned asbestos in 2017, confirmed 2023. Millions of homes still have asbestos-cement roofing. Check your property's risk now.",
  mexico:
    "Mexico has no asbestos ban. Millions of homes and factories from 1960–2000 likely contain asbestos-cement materials. Check your risk now.",
  indonesia:
    "Indonesia has no asbestos ban. Widespread use in roofing and construction puts millions at risk. Assess your building with our free tool.",
  "united-kingdom":
    "Yes, the UK banned asbestos in 1999. Buildings built before 1999 may still contain it. Learn UK regulations and check your property's risk.",
  australia:
    "Australia banned all asbestos on January 1, 2004. 1 in 3 homes built before 1990 contain asbestos — 6 million tonnes remain in the built environment. Check your risk.",
  japan:
    "Yes, Japan banned asbestos in 2012. Buildings built before the ban may still contain asbestos-cement, floor tiles, and insulation materials.",
  "south-korea":
    "Yes, South Korea banned asbestos in 2009. Older buildings from the 1970–1990 construction boom may still contain asbestos materials.",
  germany:
    "Yes, Germany banned asbestos in 1993, one of the first countries to do so. Pre-1993 buildings remain a risk. Learn about German asbestos law.",
  "south-africa":
    "South Africa banned asbestos in 2008. Formerly the world's sole amosite supplier — 82+ mine dumps remain in the Northern Cape. Check your property risk.",
  canada:
    "Yes, Canada banned asbestos in 2018 — despite being a former top producer. Pre-2018 buildings, especially 1960–1980 era, may still contain it.",
  nigeria:
    "Nigeria has no asbestos ban. Asbestos-cement roofing is still widely used in construction. Check if your building contains hazardous materials.",
  italy:
    "Italy banned asbestos in 1992. Casale Monferrato (pop. 35,000) still records ~50 mesothelioma deaths/year from legacy exposure. Check your pre-1992 building's risk.",
  france:
    "France banned asbestos in 1997. FIVA has paid over €6.7 billion in compensation — including to 60 teachers/year who developed mesothelioma. Check your building's risk.",
  colombia:
    "Colombia banned asbestos in 2019 (Law 1968, effective January 2021). Sibaté has mesothelioma mortality 65× the national average — 38 vs 0.6 per 100,000. Check pre-ban buildings for asbestos risk.",
  kazakhstan:
    "Kazakhstan has no asbestos ban — 248,000 tonnes produced yearly. Mining city Zhitikara has a lung cancer rate of 32.5 per 100,000. Assess your building's asbestos risk.",
  portugal:
    "Portugal banned asbestos in 2005. Of 115,000 tonnes used 1930–2003, 97% of resulting mesothelioma cases were never recognized as occupational diseases. Check your building.",
  turkey:
    "Turkey banned asbestos in 2010. 379 villages — 158,068 people — faced environmental asbestos exposure. Mesothelioma occurs 10 years earlier than the European average here.",
  "united-arab-emirates":
    "UAE banned asbestos panels in 2006 — but asbestos-cement pipes remain legal. 500,000+ migrant workers were exposed with little protection. Assess your building's risk.",
  taiwan:
    "Taiwan banned asbestos in 2018. Male mesothelioma cases grew 9-fold from 1979–2013. 659 new cases are projected through 2046. Check if your pre-2018 building contains asbestos.",
  namibia:
    "Namibia has no confirmed asbestos ban. Asbestos-cement was listed as standard roofing in 1969 regulations and remains in many older buildings. Assess your building risk.",
};

const PRIORITY_DESCRIPTIONS_ES: Record<string, string> = {
  "united-states":
    "Sí, EE.UU. prohibió el asbesto en 2024. Millones de edificios anteriores a la prohibición aún contienen materiales con asbesto. Verifica si tu hogar está en riesgo.",
  india:
    "India no tiene prohibición del uso de asbesto — mayor importador mundial en 2023 (485,000 toneladas). Unos 200 millones de personas viven bajo techos de cemento-asbesto. Evalúa tu riesgo.",
  china:
    "China prohibió el asbesto en construcción en 2011, pero el crisotilo sigue siendo legal. 194,000 toneladas consumidas al año. Evalúa el riesgo de tu edificio.",
  russia:
    "Rusia no tiene prohibición del asbesto. Sede de Asbest — 70,000 personas junto a la mayor mina de crisotilo del mundo. Edificios de todas las épocas pueden contenerlo.",
  brazil:
    "El Supremo de Brasil prohibió el asbesto en 2017, confirmado en 2023. Millones de hogares aún tienen techos de cemento-asbesto. Verifica el riesgo de tu propiedad.",
  mexico:
    "México no tiene una prohibición del asbesto. Millones de hogares y fábricas de 1960–2000 probablemente contienen materiales de cemento-asbesto. Verifica tu riesgo ahora.",
  indonesia:
    "Indonesia no tiene una prohibición del asbesto. Su uso generalizado en techos y construcción pone a millones en riesgo. Evalúa tu edificio con nuestra herramienta gratuita.",
  "united-kingdom":
    "El Reino Unido prohibió el asbesto en 1999. El 80–90% de edificios anteriores a 1999 pueden contenerlo — incluido el 90%+ de hospitales NHS. Consulta la normativa CAR 2012 y evalúa el riesgo de tu propiedad.",
  australia:
    "Australia prohibió el asbesto el 1 de enero de 2004. 1 de cada 3 viviendas anteriores a 1990 lo contienen. 6 millones de toneladas siguen en el entorno construido. Verifica tu riesgo.",
  japan:
    "Sí, Japón prohibió el asbesto en 2012. Los edificios construidos antes de la prohibición pueden contener cemento-asbesto, baldosas y materiales de aislamiento.",
  "south-korea":
    "Sí, Corea del Sur prohibió el asbesto en 2009. Los edificios más antiguos del boom constructivo de 1970–1990 pueden contener materiales con asbesto.",
  germany:
    "Sí, Alemania prohibió el asbesto en 1993, siendo uno de los primeros países en hacerlo. Los edificios anteriores a 1993 siguen siendo un riesgo. Conoce la ley alemana sobre asbesto.",
  "south-africa":
    "Sudáfrica prohibió el asbesto en 2008. Antiguo proveedor mundial de amosita — más de 82 vertederos mineros persisten en el Cabo Norte. Verifica el riesgo de tu propiedad.",
  canada:
    "Sí, Canadá prohibió el asbesto en 2018, a pesar de ser un antiguo gran productor. Los edificios anteriores a 2018, especialmente de la era 1960–1980, pueden contenerlo.",
  nigeria:
    "Nigeria no tiene una prohibición del asbesto. Las cubiertas de cemento-asbesto aún se usan ampliamente en la construcción. Verifica si tu edificio contiene materiales peligrosos.",
  italy:
    "Italia prohibió el asbesto en 1992. Casale Monferrato (35,000 hab.) registra ~50 muertes por mesotelioma al año por exposición heredada. Evalúa el riesgo de tu propiedad.",
  france:
    "Francia prohibió el asbesto en 1997. FIVA ha pagado más de €6.700 millones en compensaciones — 60 profesores/año desarrollaron mesotelioma. Evalúa el riesgo de tu edificio.",
  colombia:
    "Colombia prohibió el asbesto en 2019 (Ley 1968, vigente desde enero de 2021). Sibaté tiene mortalidad por mesotelioma 65 veces superior a la media nacional (38 vs 0,6 por 100,000). Evalúa tu edificio.",
  kazakhstan:
    "Kazajistán no tiene prohibición del asbesto — produce 248,000 toneladas al año. Zhitikara tiene una tasa de cáncer de pulmón de 32,5 por 100,000. Evalúa tu riesgo.",
  portugal:
    "Portugal prohibió el asbesto en 2005. El 97% de los casos de mesotelioma derivados de 115,000 toneladas usadas desde 1930 nunca fueron reconocidos oficialmente. Evalúa tu riesgo.",
  turkey:
    "Turquía prohibió el asbesto en 2010. 379 pueblos — 158,068 personas — sufrieron exposición ambiental. El mesotelioma se diagnostica 10 años antes que la media europea.",
  "united-arab-emirates":
    "Los EAU prohibieron paneles de asbesto en 2006, pero las tuberías de cemento-asbesto siguen siendo legales. 500,000+ trabajadores migrantes estuvieron expuestos. Evalúa tu riesgo.",
  taiwan:
    "Taiwán prohibió el asbesto en 2018. Los casos masculinos de mesotelioma crecieron 9 veces entre 1979 y 2013. Se proyectan 659 nuevos casos hasta 2046. Evalúa tu edificio.",
  namibia:
    "Namibia no tiene prohibición confirmada del asbesto. El cemento-asbesto fue estándar en regulaciones de 1969 y persiste en muchos edificios. Evalúa el riesgo de tu propiedad.",
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
    const displayName = country.name_es ?? country.name;
    if (country.ban_status === "full_ban" && country.ban_year) {
      return `¿Está prohibido el asbesto en ${displayName}? Prohibido en ${country.ban_year} | ToxinFree`;
    }
    if (country.ban_status === "no_ban") {
      return `¿Está prohibido el asbesto en ${displayName}? Sin prohibición nacional | ToxinFree`;
    }
    return `¿Está prohibido el asbesto en ${displayName}? | ToxinFree`;
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
    alternates: {
      canonical: `${BASE_URL}/${locale}/country/${slug}`,
      languages: {
        "x-default": `${BASE_URL}/en/country/${slug}`,
        en: `${BASE_URL}/en/country/${slug}`,
        es: `${BASE_URL}/es/country/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// JSON-LD structured data component — content is server-generated (not user
// input). JSON.stringify does NOT escape <, >, or & by default, so we manually
// replace them with their Unicode escape equivalents to prevent script injection
// if any country data value ever contains "</script>" or similar sequences.
function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const allCountries = countries as Country[];
  const country = allCountries.find((c) => c.slug === slug);
  if (!country) notFound();

  const t = await getTranslations("country");

  const isHighPriority = country.priority === "high";
  const whatToDoItems = t.raw(getWhatToDoKey(country.ban_status)) as string[];
  const caseNumber = allCountries.findIndex((c) => c.slug === slug) + 1;
  const heroImageUrl = country.hero_image_url;

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
    <>
      <JsonLd data={faqJsonLd} />

      {/* ── Full-width sections ── */}
      <CountryHero country={country} caseNumber={caseNumber} heroImageUrl={heroImageUrl} />
      <StatStrip country={country} />

      {/* ── Constrained content ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-14">

        {/* ── 1. Resistance Stories (prominent, full-width) ── */}
        <div className="space-y-6">
          {country.resistance_stories && country.resistance_stories.length > 0 && (
            <ResistanceStories stories={country.resistance_stories} />
          )}

          {country.joint_resistance_story && (
            <JointStoryCard story={country.joint_resistance_story} />
          )}
        </div>

        {/* ── 2. Material Identification Guide (actionable — moved up) ── */}
        {country.common_materials.length > 0 && (
          <section aria-labelledby="materials-heading">
            <h2
              id="materials-heading"
              className="text-xl font-bold text-text-primary mb-1"
            >
              {t("material_guide_title")}
            </h2>
            <p className="text-sm text-text-muted mb-5">
              {t("material_guide_subtitle")}
            </p>
            <MaterialGuide
              materialNames={country.common_materials}
              materialNamesEs={country.common_materials_es}
            />
          </section>
        )}

        {/* ── 3. Exposure Zones ── */}
        {country.exposure_zones && country.exposure_zones.length > 0 && (
          <ExposureZones zones={country.exposure_zones} />
        )}

        {/* ── 4. Law vs. Implementation ── */}
        {country.implementation_status && (
          <ImplementationStatus status={country.implementation_status} />
        )}

        {/* ── 5. What To Do + CTA — combined ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section
            className="rounded-xl bg-bg-secondary border border-bg-tertiary p-5 sm:p-6"
            aria-labelledby="what-to-do-heading"
          >
            <h2
              id="what-to-do-heading"
              className="text-lg font-bold text-text-primary mb-4"
            >
              {t("what_to_do")}
            </h2>
            <ul className="space-y-2" role="list">
              {whatToDoItems.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-text-secondary">
                  <span className="mt-0.5 flex-shrink-0 text-warning" aria-hidden="true">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-xl border border-warning/30 bg-warning/5 p-5 sm:p-6 flex flex-col justify-between"
            aria-labelledby="cta-heading"
          >
            <div>
              <h2
                id="cta-heading"
                className="text-lg font-bold text-text-primary mb-1"
              >
                {t("cta_title")}
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {t("cta_description")}
              </p>
            </div>
            <Link
              href={`/check?country=${country.iso2.toLowerCase()}`}
              className="inline-flex items-center gap-2 rounded-lg bg-warning px-4 py-2.5 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning self-start"
            >
              {t("cta_button")}
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>

        {/* ── 6. Regulatory Timeline (collapsible, moved down) ── */}
        <section aria-labelledby="timeline-heading">
          <h2
            id="timeline-heading"
            className="text-xl font-bold text-text-primary mb-4"
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

        {/* ── 7. Sources ── */}
        {country.sources.length > 0 && (
          <section aria-labelledby="sources-heading">
            <h2
              id="sources-heading"
              className="text-lg font-bold text-text-primary mb-3"
            >
              {t("sources")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {country.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-bg-secondary border border-bg-tertiary px-4 py-3 text-sm text-text-secondary hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-colors group"
                >
                  <span className="flex-shrink-0 text-text-muted group-hover:text-accent transition-colors" aria-hidden="true">↗</span>
                  <span className="flex-1 min-w-0 truncate">{source.name}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer meta ── */}
        <div className="space-y-3">
          {country.last_updated && (
            <p className="text-xs text-text-muted">
              {t("last_updated")}: {country.last_updated}
            </p>
          )}
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

      </div>
    </>
  );
}
