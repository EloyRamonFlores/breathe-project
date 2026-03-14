import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MapLoader from "@/components/map/MapLoader";

const countries = countriesData as Country[];
const noBanCount = countries.filter(
  (c) => c.ban_status === "no_ban" || c.ban_status === "unknown"
).length;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://breathe.global";

export async function generateStaticParams() {
  return ["en", "es"].map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const title = t("meta_title");
  const description = t("meta_description");
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: {
      languages: {
        en: `${BASE_URL}/en`,
        es: `${BASE_URL}/es`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main>
      {/* Hero Section */}
      <section className="flex flex-col items-center px-4 pb-12 pt-24 text-center sm:pt-32">
        <AnimatedCounter
          target={noBanCount}
          className="font-mono text-5xl font-bold text-warning sm:text-7xl lg:text-[8rem]"
          duration={2500}
        />
        <p className="mt-4 max-w-2xl font-serif text-xl text-text-primary sm:text-2xl">
          {t("counter", { count: noBanCount })}
        </p>
        <p className="mt-3 font-mono text-sm text-text-muted sm:text-base">
          {t("deaths")}
        </p>
      </section>

      {/* Interactive World Map */}
      <section id="map" className="w-full">
        <MapLoader />
      </section>

      {/* CTA Section */}
      <section className="bg-bg-secondary px-4 py-16 text-center sm:py-24">
        <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
          {t("cta_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          {t("cta_description")}
        </p>
        <Link
          href="/check"
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-accent/85"
        >
          {t("cta")}
        </Link>
      </section>
    </main>
  );
}
