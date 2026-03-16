import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Globe3DLoader from "@/components/map/Globe3DLoader";

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
      {/* Hero — split-screen: 3D globe left, stats + CTA right */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center overflow-hidden">
        {/* Grain texture */}
        <div className="hero-noise" aria-hidden="true" />

        {/* Left: 3D Globe — full height on desktop, 50vh on mobile */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative order-1">
          <Globe3DLoader />
        </div>

        {/* Right: Stats + CTA */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 py-12 lg:py-0 flex flex-col justify-center order-2 relative z-10">
          {/* Radial warning glow behind the counter */}
          <div
            className="pointer-events-none absolute -inset-x-8 inset-y-0 bg-[radial-gradient(ellipse_at_left,rgba(245,158,11,0.18)_0%,transparent_65%)]"
            aria-hidden="true"
          />

          {/* Big counter */}
          <AnimatedCounter
            target={noBanCount}
            className="relative font-mono text-[5.5rem] sm:text-[7rem] lg:text-[8.5rem] xl:text-[10rem] font-bold text-warning leading-none tabular-nums"
            duration={2500}
          />

          {/* Main headline — visible h1 */}
          <h1 className="relative mt-3 max-w-md font-serif text-xl sm:text-2xl lg:text-3xl text-text-primary leading-snug">
            {t("counter_prefix", { count: noBanCount })}{" "}
            <strong className="font-extrabold text-warning">
              {t("counter_no")}
            </strong>{" "}
            {t("counter_suffix")}
          </h1>

          {/* Deaths stat */}
          <p className="relative mt-3 font-mono text-sm sm:text-base text-text-muted">
            {t("deaths")}
          </p>

          {/* CTA button */}
          <div className="relative mt-8">
            <Link
              href="/check"
              className="inline-block rounded-lg bg-gradient-to-r from-accent to-accent/80 px-10 py-5 text-lg font-medium text-white animate-[cta-pulse_2s_ease-in-out_infinite] transition-opacity hover:opacity-90"
            >
              {t("cta")}
            </Link>
          </div>

          {/* Source attribution */}
          <p className="relative mt-4 text-xs text-text-muted">
            {t("source_attribution")}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg-secondary px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-xl rounded-r-lg border-l-4 border-danger pl-6">
          <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
            {t("cta_title")}
          </h2>
          <p className="mt-4 text-text-secondary">
            {t("cta_description")}
          </p>
          <div className="mt-8">
            <Link
              href="/check"
              className="inline-block rounded-lg bg-gradient-to-r from-accent to-accent/80 px-10 py-5 text-lg font-medium text-white animate-[cta-pulse_2s_ease-in-out_infinite] transition-opacity hover:opacity-90"
            >
              {t("cta")}
            </Link>
            <p className="mt-3 text-sm text-text-muted">
              {t("cta_social_proof")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
