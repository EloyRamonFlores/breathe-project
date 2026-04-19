"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import materials from "@/data/materials.json";
import type { Material } from "@/lib/types";
import {
  matchMaterialToId,
  getMaterialPatternClass,
  getRiskTailwindClass,
} from "@/lib/utils";

interface MaterialGuideProps {
  materialNames: string[];
  materialNamesEs?: string[];
}

const allMaterials = materials as Material[];

function getRiskLabel(
  level: string,
  t: ReturnType<typeof useTranslations>
): string {
  if (level === "high" || level === "critical") return t("material_risk_high");
  if (level === "moderate") return t("material_risk_moderate");
  return t("material_risk_low");
}

function getRiskBadgeClass(level: string): string {
  if (level === "high" || level === "critical")
    return "text-danger bg-danger/10 border border-danger/20";
  if (level === "moderate")
    return "text-warning bg-warning/10 border border-warning/20";
  return "text-safe bg-safe/10 border border-safe/20";
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MaterialGuide({
  materialNames,
  materialNamesEs,
}: MaterialGuideProps) {
  const t = useTranslations("country");
  const locale = useLocale();
  const [selectedMaterial, setSelectedMaterial] = useState<{
    material: Material;
    displayName: string;
  } | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const displayNames =
    locale === "es" && materialNamesEs?.length
      ? materialNamesEs
      : materialNames;

  type MatchedItem = { material: Material; displayName: string };
  type UnmatchedItem = { displayName: string };

  const matched: MatchedItem[] = [];
  const unmatched: UnmatchedItem[] = [];

  materialNames.forEach((enName, i) => {
    const id = matchMaterialToId(enName);
    const displayName = displayNames[i] ?? enName;
    if (id) {
      const material = allMaterials.find((m) => m.id === id);
      if (material) {
        matched.push({ material, displayName });
        return;
      }
    }
    unmatched.push({ displayName });
  });

  if (matched.length === 0 && unmatched.length === 0) return null;

  const hasDetail = (m: Material) =>
    !!(m.identification_tips?.length || m.danger_passive || m.danger_active);

  return (
    <div>
      {/* Matched materials — rich cards */}
      {matched.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {matched.map(({ material, displayName }) => {
            const patternClass = getMaterialPatternClass(material.id);
            const riskLevel = material.risk_when_damaged;
            const riskClass = getRiskTailwindClass(
              riskLevel === "critical" ? "critical" : riskLevel
            );
            const badgeClass = getRiskBadgeClass(riskLevel);
            const riskLabel = getRiskLabel(riskLevel, t);
            const eraRange = `${material.era_start}–${material.era_end}`;
            const clickable = hasDetail(material);

            return (
              <article
                key={material.id}
                className={`rounded-xl bg-bg-secondary border border-bg-tertiary overflow-hidden group ${clickable ? "cursor-pointer hover:border-warning/40 transition-colors" : ""}`}
                onClick={clickable ? () => setSelectedMaterial({ material, displayName }) : undefined}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                onKeyDown={clickable ? (e) => e.key === "Enter" && setSelectedMaterial({ material, displayName }) : undefined}
              >
                {/* Image or pattern strip */}
                {material.image_url && !failedImages.has(material.id) ? (
                  <div className="relative h-24 w-full overflow-hidden">
                    <Image
                      src={material.image_url}
                      alt={displayName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      onError={() =>
                        setFailedImages((prev) => new Set(prev).add(material.id))
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/60 to-transparent" />
                  </div>
                ) : (
                  <div className={patternClass} aria-hidden="true" />
                )}

                {/* Body */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-sans font-semibold text-sm text-text-primary leading-snug mb-2">
                    {displayName}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span
                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wide border ${badgeClass}`}
                    >
                      {riskLabel}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">
                      {material.friability === "friable"
                        ? t("material_friable")
                        : t("material_non_friable")}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-muted font-mono">
                    {eraRange}
                  </p>

                  <p className={`text-[11px] mt-1 leading-relaxed hidden group-hover:block ${riskClass}`}>
                    {material.recommendation_intact}
                  </p>

                  {clickable && (
                    <p className="text-[10px] mt-2 text-warning font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver guía completa →
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Unmatched materials — simple pills */}
      {unmatched.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {unmatched.map(({ displayName }) => (
            <span
              key={displayName}
              className="inline-flex items-center rounded-full bg-bg-secondary border border-bg-tertiary px-3 py-1.5 text-sm text-text-secondary"
            >
              {displayName}
            </span>
          ))}
        </div>
      )}

      {/* Learn more link */}
      <Link
        href="/learn/where-it-hides"
        className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
      >
        <span>↗</span>
        <span>{t("material_learn_more")}</span>
      </Link>

      {/* Detail Modal */}
      {selectedMaterial && (
        <MaterialDetailModalInner
          material={selectedMaterial.material}
          displayName={selectedMaterial.displayName}
          onClose={() => setSelectedMaterial(null)}
          riskLabelFn={(level) => getRiskLabel(level, t)}
        />
      )}
    </div>
  );
}

// ─── Inner Modal (hooks allowed here) ────────────────────────────────────────

function MaterialDetailModalInner({
  material,
  displayName,
  onClose,
  riskLabelFn,
}: {
  material: Material;
  displayName: string;
  onClose: () => void;
  riskLabelFn: (level: string) => string;
}) {
  const riskLevel = material.risk_when_damaged;
  const badgeClass = getRiskBadgeClass(riskLevel);
  const eraRange = `${material.era_start}–${material.era_end}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={displayName}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-bg-secondary border border-bg-tertiary shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        {/* Image */}
        {material.image_url && (
          <div className="relative h-52 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={material.image_url}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 512px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/20 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-sans font-bold text-xl text-text-primary leading-snug">
                {displayName}
              </h2>
              <p className="text-xs text-text-muted font-mono mt-1">{eraRange}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Risk badge */}
          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wide border ${badgeClass}`}>
            {riskLabelFn(riskLevel)}
          </span>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {material.description}
          </p>

          {/* Identification tips */}
          {material.identification_tips && material.identification_tips.length > 0 && (
            <section>
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted mb-2">
                ¿Cómo identificarlo?
              </h3>
              <ul className="space-y-1.5">
                {material.identification_tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-secondary">
                    <span className="mt-0.5 flex-shrink-0 text-warning" aria-hidden="true">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Danger levels */}
          {(material.danger_passive || material.danger_active) && (
            <section className="space-y-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted mb-2">
                Nivel de peligro
              </h3>
              {material.danger_passive && (
                <div className="flex gap-2.5 rounded-lg bg-safe/5 border border-safe/20 p-3">
                  <span className="flex-shrink-0 text-safe font-mono text-[10px] font-bold uppercase pt-0.5">PASIVO</span>
                  <p className="text-xs text-text-secondary leading-relaxed">{material.danger_passive}</p>
                </div>
              )}
              {material.danger_active && (
                <div className="flex gap-2.5 rounded-lg bg-danger/5 border border-danger/20 p-3">
                  <span className="flex-shrink-0 text-danger font-mono text-[10px] font-bold uppercase pt-0.5">ACTIVO</span>
                  <p className="text-xs text-text-secondary leading-relaxed">{material.danger_active}</p>
                </div>
              )}
            </section>
          )}

          {/* Recommendations */}
          <section>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-text-muted mb-2">
              Gestión y eliminación
            </h3>
            <div className="rounded-lg bg-bg-primary border border-bg-tertiary p-3 space-y-2.5">
              <p className="text-xs text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">Intacto: </span>
                {material.recommendation_intact}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">Dañado: </span>
                {material.recommendation_damaged}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">Reforma: </span>
                {material.recommendation_renovation}
              </p>
            </div>
            {material.management_note && (
              <p className="mt-2 text-xs text-text-muted leading-relaxed italic">{material.management_note}</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

