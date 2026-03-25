"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
        Error
      </p>
      <h1 className="text-3xl font-bold text-slate-100">{t("page_title")}</h1>
      <p className="max-w-sm text-slate-400">{t("page_message")}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
        >
          {t("page_retry")}
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:text-white"
        >
          {t("page_home")}
        </Link>
      </div>
    </div>
  );
}
