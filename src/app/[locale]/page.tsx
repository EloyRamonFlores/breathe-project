import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import HeroSection from "@/components/layout/HeroSection";
import { substances, getActiveSubstance } from "@/data/substances";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SITE_URL } from "@/lib/constants";
import CountrySearchSection from "@/components/home/CountrySearchSection";
import BanTicker from "@/components/home/BanTicker";
import StatRotator from "@/components/home/StatRotator";
import RegionSummary from "@/components/home/RegionSummary";
import { getFlag } from "@/lib/utils";

const countries = countriesData as Country[];
const noBanCount = countries.filter(
  (c) => c.ban_status === "no_ban" || c.ban_status === "unknown"
).length;
const bannedCount = countries.filter(
  (c) => c.ban_status === "full_ban" || c.ban_status === "de_facto_ban"
).length;

const activeSubstance = getActiveSubstance();

const BASE_URL = SITE_URL;

// Top countries: high-priority no-ban first, then high-priority banned, sorted by priority
const topCountries = countries
  .filter((c) => c.priority === "high")
  .sort((a, b) => {
    // no_ban countries first (higher urgency), then by name
    const statusOrder = { no_ban: 0, partial_ban: 1, unknown: 2, de_facto_ban: 3, full_ban: 4 };
    const diff = statusOrder[a.ban_status] - statusOrder[b.ban_status];
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  })
  .slice(0, 8);

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ToxinFree",
  url: BASE_URL,
  description:
    "Citizen-powered awareness platform for asbestos and toxic substance exposure worldwide. Interactive global map, free risk checker, and educational resources.",
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HeroSection
        noBanCount={noBanCount}
        counterPrefix={t("counter_prefix")}
        counterNo={t("counter_no")}
        counterSuffix={t("counter_suffix")}
        cta={t("cta")}
        cta2={t("cta2")}
        sourceAttribution={t("source_attribution")}
        descBefore={t("hero_desc_before")}
        descBold={t("hero_desc_bold")}
        descAfter={t("hero_desc_after")}
        activeColor={activeSubstance.color}
        substancePills={substances.map((s) => ({
          id: s.id,
          label: t(`substance_${s.id}`),
          active: s.active,
          color: s.color,
        }))}
        comingSoonLabel={t("coming_soon")}
        statBannedValue={String(activeSubstance.stats?.bannedCount ?? bannedCount)}
        statBannedLabel={t("stat_banned_label")}
        statProductionValue={activeSubstance.stats?.productionTons ?? "—"}
        statProductionLabel={t("stat_production_label")}
        legendNoBan={t("legend_no_ban")}
        legendLimited={t("legend_limited")}
        legendFullBan={t("legend_full_ban")}
        heroTagline={t("hero_tagline")}
        searchSlot={<CountrySearchSection locale={locale} />}
      />

      {/* Ban Timeline Ticker */}
      <BanTicker />

      {/* Understand the Risk — Bento Grid */}
      <section className="bg-[#0a0f1a] px-4 py-16 sm:py-24 relative z-10">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-sans font-bold text-3xl text-text-primary mb-4 sm:text-4xl">
                {t("edu_section_heading")}
              </h2>
              <p className="text-slate-400 text-lg">
                {t("edu_section_subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 — Wide (2 cols) */}
            <ScrollReveal delay={0} className="md:col-span-2">
              <Link
                href="/learn/what-is-asbestos"
                className="h-full group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13a17.932 17.932 0 0 1-6.126 0l-.772-.13c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t("edu_card1_title")}</h3>
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                  {t("edu_card1_desc")}
                </p>
                <span className="inline-flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors mt-auto">
                  {t("edu_card1_cta")}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>

            {/* Card 2 — Square (1 col) */}
            <ScrollReveal delay={100} className="md:col-span-1">
              <Link
                href="/learn/where-it-hides"
                className="h-full group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t("edu_card2_title")}</h3>
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                  {t("edu_card2_desc")}
                </p>
                <span className="inline-flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors mt-auto">
                  {t("edu_card2_cta")}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>

            {/* Card 3 — What To Do (2 cols) */}
            <ScrollReveal delay={200} className="md:col-span-2">
              <Link
                href="/learn/what-to-do"
                className="h-full group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t("edu_card3_title")}</h3>
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                  {t("edu_card3_desc")}
                </p>
                <span className="inline-flex items-center text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors mt-auto">
                  {t("edu_card3_cta")}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </ScrollReveal>

            {/* Card 4 — Risk Checker CTA (1 col) */}
            <ScrollReveal delay={300} className="md:col-span-1">
              <Link
                href="/check"
                className="h-full group bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8 hover:from-red-500/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/20 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{t("cta_title")}</h3>
                <p className="text-slate-400 mb-8 flex-grow leading-relaxed">
                  {t("cta_description")}
                </p>
                <span className="inline-flex items-center text-red-400 font-medium group-hover:text-red-300 transition-colors mt-auto">
                  {t("cta")}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
                <p className="text-[11px] text-slate-500 mt-3">{t("cta_social_proof")}</p>
              </Link>
            </ScrollReveal>
            {/* Card 5 — Stat Rotator (1 col) */}
            <ScrollReveal delay={400} className="md:col-span-1">
              <div className="h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-3">
                  {t("stat_rotator_heading")}
                </p>
                <div className="flex-grow">
                  <StatRotator />
                </div>
              </div>
            </ScrollReveal>

            {/* Card 6 — Region Summary (2 col) */}
            <ScrollReveal delay={500} className="md:col-span-2">
              <div className="h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.97.633-3.794 1.708-5.276" />
                  </svg>
                </div>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">
                  {t("region_heading")}
                </p>
                <p className="text-slate-500 text-sm mb-6">
                  {t("region_subtitle")}
                </p>
                <div className="flex-grow">
                  <RegionSummary />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Most Viewed Country Profiles — Dynamic */}
      <section className="bg-[#060b14] border-t border-slate-800/50 px-4 py-10 relative z-10">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">
              {t("top_countries_label")}
            </p>
            <div className="flex flex-wrap gap-3">
              {topCountries.map((country) => (
                <Link
                  key={country.slug}
                  href={`/country/${country.slug}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:border-slate-600 hover:bg-slate-800/50 hover:-translate-y-0.5 ${
                    country.ban_status === "no_ban" || country.ban_status === "unknown"
                      ? "border-red-900/40 text-red-400/80"
                      : country.ban_status === "partial_ban"
                        ? "border-amber-900/40 text-amber-400/80"
                        : "border-emerald-900/40 text-emerald-400/80"
                  }`}
                >
                  <span aria-hidden="true">{getFlag(country.iso2)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                    {country.ban_status === "no_ban" || country.ban_status === "unknown"
                      ? t("top_countries_no_ban")
                      : t("top_countries_banned")}
                  </span>
                  {country.name}
                  <span aria-hidden="true" className="opacity-40">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/countries"
                className="text-sm text-slate-500 transition-colors hover:text-slate-300 underline-from-center"
              >
                {t("top_countries_view_all")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
