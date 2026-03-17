import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import HeroSection from "@/components/layout/HeroSection";
import { substances, getActiveSubstance } from "@/data/substances";

const countries = countriesData as Country[];
const noBanCount = countries.filter(
  (c) => c.ban_status === "no_ban" || c.ban_status === "unknown"
).length;
const bannedCount = countries.filter(
  (c) => c.ban_status === "full_ban" || c.ban_status === "de_facto_ban"
).length;

const activeSubstance = getActiveSubstance();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toxinfree.global";

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
      />

      {/* Understand the Risk — Bento Grid */}
      <section className="bg-[#0a0f1a] px-4 py-16 sm:py-24 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans font-bold text-3xl text-text-primary mb-4 sm:text-4xl">
              {t("edu_section_heading")}
            </h2>
            <p className="text-slate-400 text-lg">
              {t("edu_section_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 — Wide (2 cols) */}
            <Link
              href="/learn/what-is-asbestos"
              className="md:col-span-2 group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
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

            {/* Card 2 — Square (1 col) */}
            <Link
              href="/learn/where-it-hides"
              className="md:col-span-1 group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
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

            {/* Card 3 — What To Do (2 cols) */}
            <Link
              href="/learn/what-to-do"
              className="md:col-span-2 group bg-slate-900/40 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col"
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

            {/* Card 4 — Risk Checker CTA (1 col) */}
            <Link
              href="/check"
              className="md:col-span-1 group bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-8 hover:from-red-500/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-900/20 flex flex-col"
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
          </div>
        </div>
      </section>

      {/* Most Viewed Country Profiles */}
      <section className="bg-[#060b14] border-t border-slate-800/50 px-4 py-10 relative z-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">
            {t("top_countries_label")}
          </p>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { slug: "india", name: "India", status: "no_ban" },
                { slug: "china", name: "China", status: "no_ban" },
                { slug: "russia", name: "Russia", status: "no_ban" },
                { slug: "united-states", name: "United States", status: "full_ban" },
                { slug: "mexico", name: "Mexico", status: "no_ban" },
                { slug: "indonesia", name: "Indonesia", status: "no_ban" },
                { slug: "brazil", name: "Brazil", status: "full_ban" },
                { slug: "united-kingdom", name: "United Kingdom", status: "full_ban" },
              ] as const
            ).map(({ slug, name, status }) => (
              <Link
                key={slug}
                href={`/country/${slug}`}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-slate-600 hover:bg-slate-800/50 ${
                  status === "no_ban"
                    ? "border-red-900/40 text-red-400/80"
                    : "border-emerald-900/40 text-emerald-400/80"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">
                  {status === "no_ban" ? t("top_countries_no_ban") : t("top_countries_banned")}
                </span>
                {name}
                <span aria-hidden="true" className="opacity-40">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
