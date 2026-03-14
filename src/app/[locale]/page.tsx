import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-[Instrument_Serif] text-6xl">{t("title")}</h1>
      <p className="mt-4 text-text-secondary text-lg">{t("subtitle")}</p>
    </main>
  );
}
