"use client";

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

export default function MaterialGuide({
  materialNames,
  materialNamesEs,
}: MaterialGuideProps) {
  const t = useTranslations("country");
  const locale = useLocale();

  const displayNames =
    locale === "es" && materialNamesEs?.length
      ? materialNamesEs
      : materialNames;

  // Build matched + unmatched lists (using EN names for matching)
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

            return (
              <article
                key={material.id}
                className="rounded-xl bg-bg-secondary border border-bg-tertiary overflow-hidden group"
              >
                {/* Pattern strip */}
                <div className={patternClass} aria-hidden="true" />

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
                      {t("material_friable") === "Friable" && material.friability === "friable"
                        ? t("material_friable")
                        : material.friability === "non-friable"
                        ? t("material_non_friable")
                        : t("material_friable")}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-muted font-mono">
                    {eraRange}
                  </p>

                  <p className={`text-[11px] mt-1 leading-relaxed hidden group-hover:block ${riskClass}`}>
                    {material.recommendation_intact}
                  </p>
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
    </div>
  );
}
