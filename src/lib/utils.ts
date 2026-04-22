import type { RiskLevel, Country, ResistanceStory } from "./types";

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

export function formatNumber(num: number, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function getFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

// ─── Country Page Utilities ──────────────────────────────────────────────────

export function getBanStatusPillClass(status: Country["ban_status"]): string {
  const classes: Record<Country["ban_status"], string> = {
    full_ban: "text-safe bg-safe/10 border border-safe/20",
    partial_ban: "text-warning bg-warning/10 border border-warning/20",
    no_ban: "text-danger bg-danger/10 border border-danger/20",
    de_facto_ban: "text-safe bg-safe/10 border border-safe/20",
    unknown: "text-text-muted bg-bg-tertiary border border-bg-tertiary",
  };
  return classes[status];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Material Matching ───────────────────────────────────────────────────────

const MATERIAL_KEYWORD_MAP: [string, string[]][] = [
  ["artex-textured-coating", ["artex"]],
  ["popcorn-ceiling", ["textured coat", "textured ceiling"]],
  ["asbestos-insulating-board-aib", ["insulating board", "aib"]],
  ["cement-roofing", ["cement roofing", "roofing sheet", "cement sheet"]],
  ["asbestos-cement-flat-sheets", ["flat sheet"]],
  ["asbestos-cement-corrugated-roofing", ["corrugated"]],
  ["pipe-insulation", ["pipe insulation", "lagging", "pipe and boiler", "boiler insulation"]],
  ["vinyl-floor-tiles-9x9", ["floor tile", "vinyl-asbestos", "vinyl asbestos"]],
  ["vinyl-floor-tiles-12x12", ["floor tile 12"]],
  ["floor-tile-adhesive-mastic", ["adhesive", "mastic"]],
  ["joint-compound", ["joint compound", "drywall"]],
  ["acoustic-ceiling-tiles", ["acoustic", "ceiling tile"]],
  ["thermal-insulation-board", ["thermal insulation", "marinite", "monokote"]],
  ["spray-applied-fireproofing", ["fireproofing", "spray-applied", "spray applied"]],
  ["asbestos-rope-gaskets", ["rope", "laminated gasket"]],
  ["brake-linings-friction", ["brake", "friction", "capasco", "pressure-vessel"]],
  ["roof-felt-underlayment", ["roof felt", "underlayment", "felt"]],
  ["expansion-joints-caulk", ["expansion joint", "caulk"]],
  ["laboratory-bench-tops", ["bench top", "laboratory"]],
  ["fire-blankets-textiles", ["fire blanket", "textile"]],
  ["brake-linings-friction", ["brake", "friction", "capasco"]],
  ["asbestos-cement-water-pipes", ["water pipe", "sewer pipe"]],
];

export function matchMaterialToId(materialName: string): string | null {
  const lower = materialName.toLowerCase();
  for (const [id, keywords] of MATERIAL_KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return id;
    }
  }
  return null;
}

export function getMaterialPatternClass(materialId: string): string {
  const map: Record<string, string> = {
    "cement-roofing": "material-pattern-diagonal",
    "asbestos-cement-flat-sheets": "material-pattern-diagonal",
    "asbestos-cement-corrugated-roofing": "material-pattern-diagonal",
    "artex-textured-coating": "material-pattern-dots",
    "popcorn-ceiling": "material-pattern-dots",
    "joint-compound": "material-pattern-dots",
    "spray-applied-fireproofing": "material-pattern-dots",
    "vinyl-floor-tiles-9x9": "material-pattern-crosshatch",
    "vinyl-floor-tiles-12x12": "material-pattern-crosshatch",
    "floor-tile-adhesive-mastic": "material-pattern-crosshatch",
    "acoustic-ceiling-tiles": "material-pattern-crosshatch",
    "thermal-insulation-board": "material-pattern-crosshatch",
    "asbestos-insulating-board-aib": "material-pattern-crosshatch",
    "pipe-insulation": "material-pattern-wavy",
    "asbestos-rope-gaskets": "material-pattern-wavy",
    "fire-blankets-textiles": "material-pattern-wavy",
  };
  return map[materialId] ?? "material-pattern-dots";
}

/**
 * Extracts a short summary from a long estimated_buildings_at_risk string.
 * Takes the first segment (before semicolon) and caps at ~30 chars for stat strip display.
 */
export function summarizeBuildingsAtRisk(value: string): string {
  if (value.length <= 28) return value;
  const firstSegment = value.split(";")[0].trim();
  if (firstSegment.length <= 28) return firstSegment;
  // Truncate to last space within 28 chars
  const truncated = firstSegment.slice(0, 28);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

export function getRoleTypeColor(roleType?: ResistanceStory["role_type"]): string {
  const map: Record<string, string> = {
    victim: "bg-danger/20 text-danger",
    advocate: "bg-warning/20 text-warning",
    legal: "bg-accent/20 text-accent",
    network: "bg-safe/20 text-safe",
    journalist: "bg-accent/20 text-accent",
    scientist: "bg-safe/20 text-safe",
  };
  return map[roleType ?? ""] ?? "bg-warning/20 text-warning";
}
