"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";
import { getFlag } from "@/lib/utils";

const countries = countriesData as Country[];

export default function BanTicker() {
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Banned countries sorted chronologically
  const bannedCountries = useMemo(() => {
    return countries
      .filter((c) => c.ban_year !== null && (c.ban_status === "full_ban" || c.ban_status === "de_facto_ban"))
      .sort((a, b) => (a.ban_year ?? 0) - (b.ban_year ?? 0));
  }, []);

  // Top no-ban countries (high priority first, then by name)
  const noBanCountries = useMemo(() => {
    return countries
      .filter((c) => c.ban_status === "no_ban")
      .sort((a, b) => {
        if (a.priority === "high" && b.priority !== "high") return -1;
        if (a.priority !== "high" && b.priority === "high") return 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 15);
  }, []);

  // Interleave: every ~4 banned countries, insert 1 no-ban country
  const mixedItems = useMemo(() => {
    const result: { country: Country; type: "banned" | "no_ban" }[] = [];
    let noBanIdx = 0;

    bannedCountries.forEach((c, i) => {
      result.push({ country: c, type: "banned" });
      // Every 4 banned, insert a no-ban country
      if ((i + 1) % 4 === 0 && noBanIdx < noBanCountries.length) {
        result.push({ country: noBanCountries[noBanIdx], type: "no_ban" });
        noBanIdx++;
      }
    });

    return result;
  }, [bannedCountries, noBanCountries]);

  // Duplicate for seamless loop
  const items = useMemo(() => [...mixedItems, ...mixedItems], [mixedItems]);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Grab the CSS Animation object after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        const anims = scrollRef.current.getAnimations();
        if (anims[0]) animRef.current = anims[0];
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  function handleMouseEnter() {
    if (prefersReducedMotion) return;
    animRef.current?.pause();
  }

  function handleMouseLeave() {
    if (prefersReducedMotion) return;
    animRef.current?.play();
  }

  if (mixedItems.length === 0) return null;

  return (
    <div
      className="group relative overflow-hidden border-y border-slate-800/30 bg-[#080d18]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="marquee"
      aria-label={t("ticker_aria_label")}
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#080d18] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#080d18] to-transparent" />

      <div
        ref={scrollRef}
        className="flex items-center gap-3 py-2.5 whitespace-nowrap ticker-scroll"
        style={{ animationPlayState: prefersReducedMotion ? "paused" : "running" }}
      >
        {items.map((item, i) => (
          <Link
            key={`${item.country.slug}-${i}`}
            href={item.type === "no_ban" ? "/check" : `/country/${item.country.slug}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs shrink-0
              transition-all duration-200
              group-hover:opacity-30
              hover:!opacity-100 hover:scale-[1.08] hover:shadow-lg
              ${item.type === "no_ban"
                ? "border-red-500/30 bg-red-500/5 text-red-400 hover:border-red-400/60 hover:bg-red-500/15 hover:shadow-red-500/10"
                : "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-500/15 hover:shadow-emerald-500/10"
              }`}
          >
            <span aria-hidden="true">{getFlag(item.country.iso2)}</span>
            <span className="font-mono text-[9px] uppercase tracking-wider opacity-60">
              {item.type === "no_ban"
                ? t("top_countries_no_ban")
                : item.country.ban_year}
            </span>
            <span className="font-medium">{item.country.name}</span>
          </Link>
        ))}
      </div>

      {/* Reduced motion: static display */}
      {prefersReducedMotion && (
        <p className="sr-only">
          {mixedItems.map((item) =>
            `${item.type === "banned" ? item.country.ban_year : "No ban"} ${item.country.name}`
          ).join(", ")}
        </p>
      )}
    </div>
  );
}
