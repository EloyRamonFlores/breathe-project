import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-bg-secondary">
      {/* Gradient divider */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-bg-tertiary to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Col 1: Brand */}
          <div className="md:col-span-2">
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
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
              {t("tagline")}
            </p>
            <p className="mt-3 text-xs text-text-muted">
              {t("data_updated")}
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
              <li>
                <Link
                  href="/learn/methodology"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("nav_methodology")}
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
                  className="underline-from-center inline-flex items-center gap-1 transition-colors hover:text-text-primary"
                  aria-label="IBAS — International Ban Asbestos Secretariat (opens in new tab)"
                >
                  IBAS
                  <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.epa.gov/asbestos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center inline-flex items-center gap-1 transition-colors hover:text-text-primary"
                  aria-label="EPA — U.S. Environmental Protection Agency (opens in new tab)"
                >
                  EPA
                  <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/news-room/fact-sheets/detail/asbestos-elimination-of-asbestos-related-diseases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center inline-flex items-center gap-1 transition-colors hover:text-text-primary"
                  aria-label="WHO — World Health Organization (opens in new tab)"
                >
                  WHO
                  <svg className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </li>
            </ul>

            {/* Legal */}
            <h3 className="mt-6 text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("legal_heading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link
                  href="/learn/methodology"
                  className="underline-from-center transition-colors hover:text-text-primary"
                >
                  {t("legal_disclaimer_link")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("contact_heading")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <a
                  href="https://github.com/agencia-digital-koku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-from-center inline-flex items-center gap-2 transition-colors hover:text-text-primary"
                  aria-label="GitHub (opens in new tab)"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  {t("contact_github")}
                </a>
              </li>
              <li>
                <a
                  href="mailto:data@toxinfree.global"
                  className="underline-from-center inline-flex items-center gap-2 transition-colors hover:text-text-primary"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  {t("contact_email")}
                </a>
              </li>
            </ul>

            {/* Credibility */}
            <p className="mt-6 text-xs text-text-muted leading-relaxed">
              {t("credibility_stat")}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
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
