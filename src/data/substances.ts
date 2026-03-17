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
      noBanCount: 128,
      bannedCount: 72,
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
