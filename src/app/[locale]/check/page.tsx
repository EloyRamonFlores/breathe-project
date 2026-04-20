import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import RiskChecker from "@/components/checker/RiskChecker";

import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Asbestos Risk Checker",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: `${BASE_URL}/check`,
  description:
    "Free tool to assess asbestos risk based on country and construction year.",
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
  const t = await getTranslations({ locale, namespace: "check" });
  const title = t("meta_title");
  const description = t("meta_description");
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: {
      canonical: `${BASE_URL}/${locale}/check`,
      languages: {
        en: `${BASE_URL}/en/check`,
        es: `${BASE_URL}/es/check`,
      },
    },
  };
}

export default function CheckPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-bg-tertiary border-t-accent" />
            </div>
          }
        >
          <RiskChecker />
        </Suspense>
      </div>
    </main>
  );
}
