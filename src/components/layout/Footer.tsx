import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-bg-secondary">
      {/* Gradient divider — replaces solid border-t */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-bg-tertiary to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1: Brand — shield+check icon + "Toxin" (light) / "Free" (bold green) */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 transition-opacity duration-300 hover:opacity-80">
              <svg
                className="h-5 w-5 shrink-0 text-safe"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3L4.5 6.5V12c0 4.7 3.3 9.1 7.5 10.5 4.2-1.4 7.5-5.8 7.5-10.5V6.5L12 3z" />
                <path d="M9 12l2.5 2.5L15 9" />
              </svg>
              <span className="font-sans text-lg tracking-[0.15em]">
                <span className="font-normal text-text-primary">Toxin</span>
                <span className="font-bold text-safe">Free</span>
              </span>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {t("tagline")}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("nav_heading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href="/"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("nav_home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/check"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("nav_check")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#map"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("nav_map")}
                </Link>
              </li>
              <li>
                <Link
                  href="/learn"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("nav_learn")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Sources */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("sources")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <a
                  href="https://ibasecretariat.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center transition-colors hover:text-text-primary"
                  aria-label="IBAS — International Ban Asbestos Secretariat (opens in new tab)"
                >
                  IBAS
                </a>
              </li>
              <li>
                <a
                  href="https://www.epa.gov/asbestos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center transition-colors hover:text-text-primary"
                  aria-label="EPA — U.S. Environmental Protection Agency (opens in new tab)"
                >
                  EPA
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/asbestos-elimination-of-asbestos-related-diseases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center transition-colors hover:text-text-primary"
                  aria-label="WHO — World Health Organization (opens in new tab)"
                >
                  WHO
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Credibility */}
          <div>
            <p className="text-sm text-text-muted leading-relaxed">
              {t("credibility_stat")}
            </p>
          </div>
        </div>

        {/* Bottom bar: disclaimer + Koku credit */}
        <div className="mt-12 border-t border-bg-tertiary pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs leading-relaxed text-text-secondary">
            {t("disclaimer")}
          </p>
          <div className="flex items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] font-medium tracking-widest uppercase text-text-muted">
              {t("built_by")}
            </span>
            <a
              href="https://github.com/agencia-digital-koku"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline hover:scale-105 transition-transform duration-300"
              style={{ letterSpacing: "-0.06em" }}
              aria-label="Koku (opens in new tab)"
            >
              <span className="text-xl font-black text-text-primary">K</span>
              <span className="text-lg font-black text-amber-500">o</span>
              <span className="text-lg font-black text-slate-400">k</span>
              <span className="text-xl font-black text-text-primary">u</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
