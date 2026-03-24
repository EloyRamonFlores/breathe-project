/** Shared color constants for ban-status map visualizations (Globe3D + WorldMap) */

export const FILL_COLORS: Record<string, string> = {
  full_ban: "#059669",
  de_facto_ban: "#059669",
  partial_ban: "#F59E0B",
  no_ban: "#EF4444",
  unknown: "#374151",
};

/** Globe3D uses a transparent unknown color for 3D depth effect */
export const FILL_COLORS_GLOBE: Record<string, string> = {
  ...FILL_COLORS,
  unknown: "rgba(55, 65, 81, 0.35)",
};

export const STATUS_DOTS: Record<string, string> = {
  full_ban: "#059669",
  de_facto_ban: "#059669",
  partial_ban: "#F59E0B",
  no_ban: "#EF4444",
  unknown: "#4B5563",
};
