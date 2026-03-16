import { useTranslations } from "next-intl";

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
        <div className="grid gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg tracking-[0.15em] text-text-primary">
              BREATHE
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {t("about")}
            </p>
          </div>

          {/* Data Sources */}
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
                  IBAS — International Ban Asbestos Secretariat
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
                  EPA — U.S. Environmental Protection Agency
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
                  WHO — World Health Organization
                </a>
              </li>
            </ul>
          </div>

          {/* Built by */}
          <div>
            <p className="text-sm text-text-muted">
              {t("built_by")}{" "}
              <span className="font-medium text-text-secondary">
                Koku-Tech
              </span>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 border-t border-bg-tertiary pt-6">
          <p className="text-xs leading-relaxed text-text-secondary">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
