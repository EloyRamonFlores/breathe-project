"use client";

import { useState, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Globe3DLoader from "@/components/map/Globe3DLoader";

interface HeroSectionProps {
  noBanCount: number;
  counterPrefix: string;
  counterNo: string;
  counterSuffix: string;
  deaths: string;
  cta: string;
  sourceAttribution: string;
}

export default function HeroSection({
  noBanCount,
  counterPrefix,
  counterNo,
  counterSuffix,
  deaths,
  cta,
  sourceAttribution,
}: HeroSectionProps) {
  const [globeReady, setGlobeReady] = useState(false);

  const handleCounterComplete = useCallback(() => {
    setGlobeReady(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-center overflow-hidden">
      {/* Grain texture */}
      <div className="hero-noise" aria-hidden="true" />

      {/* Left: 3D Globe — full height on desktop, 50vh on mobile */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative order-1">
        <Globe3DLoader show={globeReady} />
      </div>

      {/* Right: Stats + CTA */}
      <div className="w-full lg:w-1/2 px-8 lg:px-16 py-12 lg:py-0 flex flex-col justify-center order-2 relative z-10">
        {/* Radial warning glow behind the counter */}
        <div
          className="pointer-events-none absolute -inset-x-8 inset-y-0 bg-[radial-gradient(ellipse_at_left,rgba(245,158,11,0.18)_0%,transparent_65%)]"
          aria-hidden="true"
        />

        {/* Big counter */}
        <AnimatedCounter
          target={noBanCount}
          className="relative font-mono text-[5.5rem] sm:text-[7rem] lg:text-[8.5rem] xl:text-[10rem] font-bold text-warning leading-none tabular-nums"
          duration={2500}
          onComplete={handleCounterComplete}
        />

        {/* Main headline — visible h1 */}
        <h1 className="relative mt-3 max-w-md font-serif text-xl sm:text-2xl lg:text-3xl text-text-primary leading-snug">
          {counterPrefix}{" "}
          <strong className="font-extrabold text-warning">{counterNo}</strong>{" "}
          {counterSuffix}
        </h1>

        {/* Deaths stat */}
        <p className="relative mt-3 font-mono text-sm sm:text-base text-text-muted">
          {deaths}
        </p>

        {/* CTA button */}
        <div className="relative mt-8">
          <Link
            href="/check"
            className="inline-block rounded-lg bg-gradient-to-r from-accent to-accent/80 px-10 py-5 text-lg font-medium text-white animate-[cta-pulse_2s_ease-in-out_infinite] transition-opacity hover:opacity-90"
          >
            {cta}
          </Link>
        </div>

        {/* Source attribution */}
        <p className="relative mt-4 text-xs text-text-muted">
          {sourceAttribution}
        </p>
      </div>
    </section>
  );
}
