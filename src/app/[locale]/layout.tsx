import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SetHtmlLang from "@/components/ui/SetHtmlLang";
import PageTransition from "@/components/ui/PageTransition";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SetHtmlLang locale={locale} />
      <Header />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1"><PageTransition>{children}</PageTransition></div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
