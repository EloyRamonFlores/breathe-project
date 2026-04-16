import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import type { Country } from "@/lib/types";
import { getBanStatusColor, getBanStatusPillClass } from "@/lib/utils";
import CountryFlag from "@/components/ui/CountryFlag";

interface CountryHeroProps {
  country: Country;
  caseNumber: number;
  heroImageUrl?: string;
}

export default async function CountryHero({ country, caseNumber, heroImageUrl }: CountryHeroProps) {
  const [t, tBanStatus, locale] = await Promise.all([
    getTranslations("country"),
    getTranslations("ban_status"),
    getLocale(),
  ]);

  const banStatusColor = getBanStatusColor(country.ban_status);
  const pillClass = getBanStatusPillClass(country.ban_status);
  const caseLabel = t("case_number", { number: String(caseNumber).padStart(3, "0") });
  const archiveLabel = t("sentinel_archive");

  const banDetailsDisplay =
    locale === "es"
      ? (country.ban_details_es ?? country.ban_details)
      : country.ban_details;

  const displayName = locale === "es" ? (country.name_es ?? country.name) : country.name;

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "clamp(280px, 40vh, 500px)" }}
      aria-label={`${displayName} country profile`}
    >
      {/* Background image or gradient */}
      {heroImageUrl ? (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #060b14 0%, #0a0f1c 40%, #0d1424 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Dark overlay for text readability over image */}
      {heroImageUrl && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"
          aria-hidden="true"
        />
      )}

      {/* Generative CSS pattern — disabled while sourcing local images */}
      {/* <div className={patternClass} aria-hidden="true" /> */}

      {/* Noise texture — disabled while sourcing local images */}
      {/* <div className="hero-noise" aria-hidden="true" /> */}

      {/* Bottom fade for content transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bg-primary))",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[clamp(280px,40vh,500px)] sm:min-h-[60vh] flex-col justify-end">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
          <div className="flex-1 min-w-0">
            {/* Flag + archive label */}
            <div className="flex items-center gap-3 mb-3">
              <CountryFlag iso2={country.iso2} size="lg" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
                {archiveLabel} / {caseLabel}
              </span>
            </div>

            {/* Country name */}
            <h1 className="font-sans font-bold text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-none mb-4">
              {displayName}
            </h1>

            {/* Ban details */}
            {banDetailsDisplay && (
              <p className="text-text-secondary text-base sm:text-lg max-w-2xl leading-relaxed">
                {banDetailsDisplay}
              </p>
            )}

            {/* Mobile: ban year + status inline */}
            <div className="mt-4 flex items-center gap-3 sm:hidden">
              <span
                className="font-mono text-3xl font-bold tabular-nums"
                style={{ color: banStatusColor }}
              >
                {country.ban_year ?? "—"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${pillClass}`}
              >
                {tBanStatus(country.ban_status)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
