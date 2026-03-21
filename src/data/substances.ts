import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";

const countries = countriesData as Country[];
const computedNoBanCount = countries.filter(
  (c) => c.ban_status === "no_ban" || c.ban_status === "unknown"
).length;
const computedBannedCount = countries.filter(
  (c) => c.ban_status === "full_ban" || c.ban_status === "de_facto_ban"
).length;

export interface SubstanceStats {
  noBanCount: number;
  bannedCount: number;
  deathsPerYear: string;
  productionTons: string;
}

export interface Substance {
  id: string;
  active: boolean;
  color: string;
  stats: SubstanceStats | null;
}

export const substances: Substance[] = [
  {
    id: "asbestos",
    active: true,
    color: "#EF4444",
    stats: {
      noBanCount: computedNoBanCount,
      bannedCount: computedBannedCount,
      deathsPerYear: "~255,000",
      productionTons: "2.3M",
    },
  },
  {
    id: "pfas",
    active: false,
    color: "#3B82F6",
    stats: null,
  },
  {
    id: "lead",
    active: false,
    color: "#F59E0B",
    stats: null,
  },
  {
    id: "microplastics",
    active: false,
    color: "#8B5CF6",
    stats: null,
  },
];

export function getActiveSubstance(): Substance {
  return substances.find((s) => s.active)!;
}
