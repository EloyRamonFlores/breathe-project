import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

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
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
    },
    alternates: {
      languages: {
        en: `${BASE_URL}/en/learn`,
        es: `${BASE_URL}/es/learn`,
      },
    },
  };
}

interface LearnCard {
  title: string;
  description: string;
  cta: string;
}

const CARD_SLUGS = [
  "what-is-asbestos",
  "where-it-hides",
  "history",
  "what-to-do",
  "by-the-numbers",
] as const;

const CARD_KEYS = [
  "what_is",
  "where_hides",
  "history",
  "what_to_do",
  "numbers",
] as const;

const CARD_ICONS = ["🔬", "🏠", "📜", "✅", "📊"] as const;

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("learn");

  const cards = CARD_KEYS.map((key, i) => ({
    slug: CARD_SLUGS[i],
    icon: CARD_ICONS[i],
    card: t.raw(`cards.${key}`) as LearnCard,
  }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
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
      <div className="mx-auto max-w-4xl">

        {/* ── Header ── */}
        <header className="mb-12">
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-primary mb-3">
            {t("title")}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </header>

        {/* ── Card Grid ── */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Educational topics"
        >
          {cards.map(({ slug, icon, card }) => (
            <Link
              key={slug}
              href={`/learn/${slug}`}
              className="group flex flex-col rounded-lg bg-bg-secondary border border-bg-tertiary p-5 sm:p-6 transition-colors hover:border-warning/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-3xl mb-4" aria-hidden="true">
                {icon}
              </span>
              <h2 className="font-semibold text-text-primary text-base mb-2 group-hover:text-warning transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">
                {card.description}
              </p>
              <span className="text-sm text-accent font-medium">
                {card.cta}
              </span>
            </Link>
          ))}
        </section>

        {/* ── Disclaimer ── */}
        <div className="mt-10 rounded-lg bg-bg-secondary border border-bg-tertiary p-4">
          <p className="text-xs text-text-muted leading-relaxed">
            {t("page_description")}
          </p>
        </div>
      </div>
    </main>
  );
}
