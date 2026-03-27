import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";
import CountryListPage from "@/components/countries/CountryListPage";

const BASE_URL = SITE_URL;

// ─── Static Generation ────────────────────────────────────────────────────────

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "countries" });

  const title = t("meta_title");
  const description = t("meta_description");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/countries`,
        es: `${BASE_URL}/es/countries`,
      },
    },
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

function buildJsonLd(locale: string) {
  const allCountries = countries as Country[];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "es"
      ? "Estado de Prohibición del Asbesto por País"
      : "Asbestos Ban Status by Country",
    numberOfItems: allCountries.length,
    itemListElement: allCountries.map((country, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: country.name,
      url: `${BASE_URL}/${locale}/country/${country.slug}`,
    })),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = buildJsonLd(locale);

  return (
    <>
      {/* JSON-LD: static data from countries.json, no user input — safe to inline */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CountryListPage countries={countries as Country[]} />
    </>
  );
}
