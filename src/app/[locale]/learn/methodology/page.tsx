import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { SITE_URL, CONTENT_PUBLISHED_DATE, CONTENT_MODIFIED_DATE } from "@/lib/constants";

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
    title: t("methodology_page.title"),
    description: t("methodology_page.meta_description"),
    openGraph: {
      title: t("methodology_page.title"),
      description: t("methodology_page.meta_description"),
      type: "article",
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/learn/methodology`,
      languages: {
        en: `${BASE_URL}/en/learn/methodology`,
        es: `${BASE_URL}/es/learn/methodology`,
      },
    },
  };
}

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "learn" });

  const sources = [
    {
      name: t("methodology_page.source_ibas_name"),
      desc: t("methodology_page.source_ibas_desc"),
      url: "https://www.ibasecretariat.org",
    },
    {
      name: t("methodology_page.source_who_name"),
      desc: t("methodology_page.source_who_desc"),
      url: "https://www.who.int/news-room/fact-sheets/detail/asbestos-elimination-of-asbestos-related-diseases",
    },
    {
      name: t("methodology_page.source_epa_name"),
      desc: t("methodology_page.source_epa_desc"),
      url: "https://www.epa.gov/asbestos",
    },
    {
      name: t("methodology_page.source_usgs_name"),
      desc: t("methodology_page.source_usgs_desc"),
      url: "https://www.usgs.gov/centers/national-minerals-information-center/asbestos-statistics-and-information",
    },
    {
      name: t("methodology_page.source_un_comtrade_name"),
      desc: t("methodology_page.source_un_comtrade_desc"),
      url: "https://comtradeplus.un.org",
    },
  ];

  const processSteps = t.raw("methodology_page.process_steps") as string[];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("methodology_page.title"),
    datePublished: CONTENT_PUBLISHED_DATE,
    dateModified: CONTENT_MODIFIED_DATE,
    author: { "@type": "Organization", name: "ToxinFree" },
    publisher: { "@type": "Organization", name: "ToxinFree" },
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Back link */}
      <Link
        href="/learn"
        className="mb-8 inline-flex items-center font-mono text-xs text-text-muted transition-colors hover:text-accent"
      >
        {t("methodology_page.back_to_learn")}
      </Link>

      {/* Title */}
      <h1 className="mt-4 font-sans text-3xl font-bold text-text-primary sm:text-4xl">
        {t("methodology_page.title")}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        {t("methodology_page.intro")}
      </p>

      {/* Sources */}
      <section className="mt-10" aria-labelledby="sources-heading">
        <h2
          id="sources-heading"
          className="mb-5 font-sans text-xl font-semibold text-text-primary"
        >
          {t("methodology_page.sources_heading")}
        </h2>
        <ul className="space-y-4">
          {sources.map((source) => (
            <li
              key={source.url}
              className="rounded-lg border border-bg-tertiary bg-bg-secondary px-5 py-4"
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:underline"
              >
                {source.name} ↗
              </a>
              <p className="mt-1 text-sm text-text-secondary">{source.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="mt-10" aria-labelledby="process-heading">
        <h2
          id="process-heading"
          className="mb-5 font-sans text-xl font-semibold text-text-primary"
        >
          {t("methodology_page.process_heading")}
        </h2>
        <ol className="space-y-3">
          {processSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Honest disclosure */}
      <section
        className="mt-10 rounded-lg border border-warning/30 bg-warning/5 px-5 py-5"
        aria-labelledby="disclosure-heading"
      >
        <h2
          id="disclosure-heading"
          className="mb-3 font-sans text-base font-semibold text-warning"
        >
          {t("methodology_page.disclaimer_heading")}
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary">
          {t("methodology_page.data_disclaimer")}
        </p>
      </section>

      {/* Error report */}
      <p className="mt-8 rounded-lg border border-bg-tertiary bg-bg-secondary px-5 py-4 text-sm text-text-secondary">
        {t("methodology_page.error_report")}
      </p>
    </main>
  );
}
