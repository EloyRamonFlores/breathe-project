"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function Header() {
  const t = useTranslations("nav");
  const tAria = useTranslations("nav_aria");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isMenuOpen]);

  function switchLocale() {
    const nextLocale = locale === "en" ? "es" : "en";
    router.replace(pathname, { locale: nextLocale });
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  const navLinks = [
    { href: "/#map", label: t("map") },
    { href: "/check", label: t("check") },
    { href: "/learn", label: t("learn") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-bg-tertiary/50 bg-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo — shield+check icon + "Toxin" (light) / "Free" (bold green) */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-80"
        >
          <svg
            className="h-6 w-6 shrink-0 text-safe"
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
          <span className="font-sans text-2xl tracking-wide">
            <span className="font-normal text-text-primary">Toxin</span>
            <span className="font-bold text-safe">Free</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={tAria("main_nav")}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="underline-from-center text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}

          {/* Language toggle */}
          <button
            onClick={switchLocale}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            aria-label={t("language")}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.97.633-3.794 1.708-5.276"
              />
            </svg>
            {locale.toUpperCase()}
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-md p-2 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? tAria("menu_close") : tAria("menu_open")}
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="animate-[slide-down_0.2s_ease-out] border-t border-bg-tertiary/50 bg-bg-secondary px-4 pb-4 pt-2 md:hidden"
          aria-label={tAria("main_nav")}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                switchLocale();
                closeMenu();
              }}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.97.633-3.794 1.708-5.276"
                />
              </svg>
              {locale === "en" ? "Español" : "English"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
