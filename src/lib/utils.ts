import type { RiskLevel } from "./types";

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    low: "var(--color-safe)",
    moderate: "var(--color-warning)",
    high: "var(--color-danger)",
    critical: "var(--color-critical)",
  };
  return colors[level];
}

export function getRiskTailwindClass(level: RiskLevel): string {
  const classes: Record<RiskLevel, string> = {
    low: "text-safe",
    moderate: "text-warning",
    high: "text-danger",
    critical: "text-critical",
  };
  return classes[level];
}

export function getBanStatusColor(status: string): string {
  const colors: Record<string, string> = {
    full_ban: "var(--color-safe)",
    partial_ban: "var(--color-warning)",
    no_ban: "var(--color-danger)",
    de_facto_ban: "var(--color-safe)",
    unknown: "var(--color-unknown)",
  };
  return colors[status] ?? colors.unknown;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
