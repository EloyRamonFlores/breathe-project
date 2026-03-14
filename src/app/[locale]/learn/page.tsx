import { useTranslations } from "next-intl";

export default function LearnPage() {
  const t = useTranslations("learn");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-[Instrument_Serif] text-4xl">{t("title")}</h1>
    </main>
  );
}
