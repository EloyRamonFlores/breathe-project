"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { RiskResult, Era, Material } from "@/lib/types";
import { getRiskColor, getRiskTailwindClass } from "@/lib/utils";

const ERA_CONSTRUCTION_YEAR: Record<Era, number> = {
  pre_1940: 1930,
  "1940_1960": 1950,
  "1960_1980": 1970,
  "1980_2000": 1990,
  post_2000: 2010,
};

function getBanContextKey(result: RiskResult): string {
  const { country, era } = result;
  const constructionYear = ERA_CONSTRUCTION_YEAR[era];

  if (country.ban_status === "unknown") return "context_ban_unknown";
  if (country.ban_status === "no_ban") return "context_ban_no_ban";
  if (country.ban_year === null) return "context_ban_unknown";

  if (constructionYear < country.ban_year) {
    if (country.ban_status === "partial_ban") return "context_ban_partial";
    return "context_ban_no_ban";
  }

  if (country.ban_status === "full_ban" || country.ban_status === "de_facto_ban") {
    return "context_ban_full_ban";
  }
  return "context_ban_partial";
}

function RiskBadge({ level }: { level: Material["risk_when_damaged"] }) {
  const tLevels = useTranslations("risk_levels");
  const colorClass = getRiskTailwindClass(level);
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider ${colorClass} bg-current/10`}
      style={{ backgroundColor: `color-mix(in srgb, ${getRiskColor(level)} 15%, transparent)` }}
    >
      {tLevels(level)}
    </span>
  );
}

interface Props {
  result: RiskResult;
  onReset: () => void;
}

export default function RiskResults({ result, onReset }: Props) {
  const t = useTranslations("check");
  const tEras = useTranslations("eras");
  const tLevels = useTranslations("risk_levels");
  const [copied, setCopied] = useState(false);

  const { level, country, era, materials } = result;
  const riskColor = getRiskColor(level);
  const riskTextClass = getRiskTailwindClass(level);
  const banContextKey = getBanContextKey(result);
  const actions = t.raw(`actions_${level}`) as string[];
  const displayMaterials = materials.slice(0, 5);

  const handleShare = async () => {
    const shareText = `General risk assessment based on country and construction era — not a property inspection.\n${window.location.href}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select and copy via execCommand
      const input = document.createElement("input");
      input.value = shareText;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-400 space-y-4">
      {/* Awareness callout */}
      <div className="rounded-lg border border-warning/40 bg-warning/8 px-4 py-3 text-sm text-text-secondary">
        <span className="mr-1" aria-hidden="true">⚠️</span>
        {t("awareness_callout")}
      </div>

      {/* Main Risk Card */}
      <div
        className="overflow-hidden rounded-xl border bg-bg-secondary"
        style={{ borderColor: `color-mix(in srgb, ${riskColor} 40%, transparent)` }}
      >
        {/* Risk header */}
        <div
          className="px-6 py-5"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${riskColor} 12%, transparent) 0%, transparent 60%)`,
          }}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              {t("result_title")}
            </p>
            <h1
              className={`mt-1 font-sans text-4xl font-bold sm:text-5xl ${riskTextClass}`}
            >
              {tLevels(level)}
            </h1>
          </div>

          {/* Context line */}
          <p className="mt-3 font-mono text-xs text-text-muted">
            <Link
              href={`/country/${country.slug}`}
              className="text-text-secondary hover:text-accent hover:underline transition-colors"
            >
              {country.name}
            </Link>
            <span className="mx-2 opacity-40">·</span>
            <span className="text-text-secondary">
              {tEras(era as Parameters<typeof tEras>[0])}
            </span>
            <span className="mx-2 opacity-40">·</span>
            <span>
              {t(banContextKey as Parameters<typeof t>[0])}{" "}
              {t("context_at_construction")}
            </span>
          </p>
        </div>

        {/* Materials section */}
        <div className="border-t border-bg-tertiary px-6 py-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-secondary">
            {t("materials_title")}
          </h2>

          {displayMaterials.length === 0 ? (
            <p className="text-sm text-text-muted">{t("materials_none")}</p>
          ) : (
            <ul className="space-y-2">
              {displayMaterials.map((mat) => (
                <li
                  key={mat.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-bg-tertiary bg-bg-primary/50 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {mat.name}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {t("material_when_damaged")}{" "}
                      <span className={getRiskTailwindClass(mat.risk_when_damaged)}>
                        {mat.risk_when_damaged}
                      </span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <RiskBadge level={mat.risk_when_damaged} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* What to do */}
        <div
          className="border-t px-6 py-5"
          style={{ borderColor: `color-mix(in srgb, ${riskColor} 30%, #1F2937)` }}
        >
          <h2
            className={`mb-3 text-sm font-semibold uppercase tracking-wider ${riskTextClass}`}
          >
            {t("what_to_do")}
          </h2>
          <ul className="space-y-2">
            {actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span
                  className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                    level === "critical"
                      ? "bg-critical"
                      : level === "high"
                        ? "bg-danger"
                        : level === "moderate"
                          ? "bg-warning"
                          : "bg-safe"
                  }`}
                  aria-hidden="true"
                />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Country profile link */}
      <Link
        href={`/country/${country.slug}`}
        className="flex items-center justify-center gap-2 rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary"
      >
        {t("view_country_profile", { country: country.name })}
      </Link>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary"
        >
          <span aria-hidden="true">{copied ? "✓" : "📋"}</span>
          {copied ? t("share_copied") : t("share")}
        </button>
        <button
          onClick={onReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/85 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary"
        >
          <span aria-hidden="true">↩</span>
          {t("check_another")}
        </button>
      </div>

      {/* Find inspector CTA */}
      <Link
        href={`/country/${country.slug}`}
        className="flex flex-col gap-1 rounded-lg border border-warning/30 bg-warning/5 px-4 py-4 transition-colors hover:bg-warning/10"
      >
        <span className="text-sm font-semibold text-warning">
          {t("find_inspector_title")}
        </span>
        <span className="text-xs text-text-secondary">
          {t("find_inspector_desc")}
        </span>
      </Link>

      {/* Disclaimer */}
      <p className="rounded-lg border border-bg-tertiary bg-bg-secondary px-4 py-3 text-xs text-text-muted">
        <span className="mr-1 text-warning" aria-hidden="true">⚠</span>
        {t("disclaimer_note")}
      </p>
    </div>
  );
}
