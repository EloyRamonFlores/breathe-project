"use client";

import { type ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import Globe3DLoader from "@/components/map/Globe3DLoader";
import SubstanceSelector from "@/components/ui/SubstanceSelector";
import { formatNumber } from "@/lib/utils";

interface SubstancePill {
  id: string;
  label: string;
  active: boolean;
  color: string;
}

interface HeroSectionProps {
  noBanCount: number;
  counterPrefix: string;
  counterNo: string;
  counterSuffix: string;
  cta: string;
  cta2: string;
  sourceAttribution: string;
  descBefore: string;
  descBold: string;
  descAfter: string;
  activeColor: string;
  substancePills: SubstancePill[];
  comingSoonLabel: string;
  statBannedValue: string;
  statBannedLabel: string;
  statProductionValue: string;
  statProductionLabel: string;
  legendNoBan: string;
  legendPartialBan: string;
  legendLimited: string;
  legendFullBan: string;
  heroTagline: string;
  searchSlot?: ReactNode;
}

export default function HeroSection({
  noBanCount,
  counterPrefix,
  counterNo,
  counterSuffix,
  cta,
  cta2,
  sourceAttribution,
  descBefore,
  descBold,
  descAfter,
  activeColor,
  substancePills,
  comingSoonLabel,
  statBannedValue,
  statBannedLabel,
  statProductionValue,
  statProductionLabel,
  legendNoBan,
  legendPartialBan,
  legendLimited,
  legendFullBan,
  heroTagline,
  searchSlot,
}: HeroSectionProps) {
  return (
    <section className="relative bg-[#0F172A]">
      {/* Decorative elements — isolated overflow so dropdown can escape */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Diagonal background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0F172A] to-transparent z-20" />

        {/* Ambient glow — left side */}
        <div
          className="absolute z-0"
          style={{
            left: "-10%",
            top: "10%",
            width: "60%",
            height: "80%",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(30, 58, 138, 0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:pt-8 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-6 lg:gap-10 items-center">

          {/* Left: Globe + legend */}
          <div className="order-2 lg:order-1 flex flex-col">
            {/* Substance selector — centered above the globe */}
            <div className="mb-4 flex justify-center">
              <SubstanceSelector substances={substancePills} comingSoonLabel={comingSoonLabel} />
            </div>
            {/* Globe — fixed height to prevent layout shift */}
            <div className="w-full h-[min(55vh,480px)] relative">
              <Globe3DLoader />
            </div>

            {/* Legend */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs bg-slate-900/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <span className="text-slate-300">{legendNoBan}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="text-slate-300">{legendPartialBan}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#4B5563]" />
                <span className="text-slate-300">{legendLimited}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-slate-300">{legendFullBan}</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">

            {/* Eyebrow — contextual label above the counter */}
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
              {heroTagline}
            </p>

            {/* Big number */}
            <div className="mb-2">
              <span
                className="block font-mono text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] font-bold leading-none tabular-nums"
                style={{ color: activeColor }}
              >
                {formatNumber(noBanCount)}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight mb-4">
              {counterPrefix}{" "}
              <strong style={{ color: activeColor }}>{counterNo}</strong>{" "}
              {counterSuffix}
            </h1>

            {/* Description — short italic tagline when descBold is empty */}
            <p className="text-sm text-slate-400 mb-5 max-w-xl mx-auto lg:mx-0 leading-relaxed italic">
              {descBefore}
              {descBold && (
                <>{" "}<strong className="text-white font-semibold not-italic">{descBold}</strong></>
              )}
              {descAfter && <>{" "}{descAfter}</>}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/check"
                className="inline-block rounded-full text-white font-semibold px-6 py-2.5 text-sm transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: activeColor,
                  boxShadow: `0 0 20px ${activeColor}4D`,
                }}
              >
                {cta}
              </Link>
              <Link
                href="/learn/by-the-numbers"
                className="inline-block rounded-full border border-slate-700 text-white hover:bg-slate-800 font-semibold px-6 py-2.5 text-sm transition-all duration-200 active:scale-[0.98]"
              >
                {cta2}
              </Link>
            </div>

            {/* Source attribution */}
            <p className="mt-1.5 text-[11px] text-slate-500 text-center lg:text-left">
              {sourceAttribution}
            </p>

            {/* Stat cards */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-slate-900/50 p-3 rounded-xl backdrop-blur-sm border border-slate-800 text-center lg:text-left">
                <div className="font-mono text-xl font-bold text-[#10B981] mb-0.5 tabular-nums">
                  {statBannedValue}
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  {statBannedLabel}
                </p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl backdrop-blur-sm border border-slate-800 text-center lg:text-left">
                <div className="font-mono text-xl font-bold text-[#EF4444] mb-0.5 tabular-nums">
                  {statProductionValue}
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  {statProductionLabel}
                </p>
              </div>
            </div>

            {/* Search slot — injected from page */}
            {searchSlot && (
              <div className="mt-5">
                {searchSlot}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
