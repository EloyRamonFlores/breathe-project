"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface Stat {
  text: string;
  source: string;
  icon: React.ReactNode;
}

export default function StatRotator() {
  const t = useTranslations("home");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const stats: Stat[] = [
    {
      text: t("stat_rotator_1"),
      source: t("stat_rotator_source_1"),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      text: t("stat_rotator_2"),
      source: t("stat_rotator_source_2"),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.97.633-3.794 1.708-5.276" />
        </svg>
      ),
    },
    {
      text: t("stat_rotator_3"),
      source: t("stat_rotator_source_3"),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
    },
  ];

  // Keep reduced motion preference in sync with system changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex(index);
        setIsTransitioning(false);
      }, 300);
    },
    []
  );

  // Auto-rotate every 5 seconds (unless reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      goTo((activeIndex + 1) % stats.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, prefersReducedMotion, goTo, stats.length]);

  const currentStat = stats[activeIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/30 p-8 sm:p-10">
      {/* Stat content */}
      <div
        className={`flex flex-col items-center text-center transition-all duration-300 ${
          isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          {currentStat.icon}
        </div>
        <p className="text-xl font-bold text-white sm:text-2xl max-w-lg leading-tight">
          {currentStat.text}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {currentStat.source}
        </p>
      </div>

      {/* Navigation dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {stats.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-6 bg-red-400"
                : "w-1.5 bg-slate-600 hover:bg-slate-500"
            }`}
            aria-label={`${t("stat_rotator_go_to")} ${i + 1}`}
          />
        ))}
      </div>

      {/* Manual nav for reduced motion */}
      {prefersReducedMotion && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => goTo(activeIndex > 0 ? activeIndex - 1 : stats.length - 1)}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {t("stat_rotator_prev")}
          </button>
          <button
            onClick={() => goTo((activeIndex + 1) % stats.length)}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {t("stat_rotator_next")}
          </button>
        </div>
      )}
    </div>
  );
}
