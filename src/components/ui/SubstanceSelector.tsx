"use client";

interface SubstancePill {
  id: string;
  label: string;
  active: boolean;
  color: string;
}

interface SubstanceSelectorProps {
  substances: SubstancePill[];
  comingSoonLabel: string;
}

export default function SubstanceSelector({
  substances,
  comingSoonLabel,
}: SubstanceSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {substances.map((s) => (
        <div key={s.id} className="relative group">
          <span
            className={
              s.active
                ? "inline-block rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-opacity"
                : "inline-block rounded-full px-4 py-1.5 text-sm font-medium cursor-not-allowed border transition-all duration-200 group-hover:opacity-80"
            }
            style={
              s.active
                ? { backgroundColor: s.color }
                : {
                    borderColor: `${s.color}55`,
                    color: `${s.color}99`,
                    backgroundColor: `${s.color}0D`,
                  }
            }
          >
            {s.label}
          </span>
          {!s.active && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg-tertiary px-2 py-1 text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
              {comingSoonLabel}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
