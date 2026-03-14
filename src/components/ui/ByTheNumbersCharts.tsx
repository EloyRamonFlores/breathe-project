"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { RegionBanData, DistributionEntry } from "@/lib/types";

const CHART_COLORS = {
  full_ban: "#10B981",
  partial_ban: "#F59E0B",
  no_ban: "#EF4444",
  unknown: "#4B5563",
};

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#111827",
    border: "1px solid #1F2937",
    borderRadius: "8px",
    color: "#F9FAFB",
    fontSize: "13px",
  },
  itemStyle: { color: "#9CA3AF" },
  labelStyle: { color: "#F9FAFB", fontWeight: 600, marginBottom: "4px" },
};

interface ChartLabels {
  banned: string;
  partial: string;
  noBan: string;
  unknown: string;
  regionChartTitle: string;
  regionChartDescription: string;
  distributionChartTitle: string;
  distributionChartDescription: string;
}

interface ByTheNumbersChartsProps {
  regionData: RegionBanData[];
  distributionData: DistributionEntry[];
  labels: ChartLabels;
}

export default function ByTheNumbersCharts({
  regionData,
  distributionData,
  labels,
}: ByTheNumbersChartsProps) {
  return (
    <div className="space-y-10">
      {/* ── Bar Chart: Region ── */}
      <section aria-labelledby="chart-region-heading">
        <h2
          id="chart-region-heading"
          className="text-xl font-semibold text-text-primary mb-2"
        >
          {labels.regionChartTitle}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {labels.regionChartDescription}
        </p>
        <div
          role="img"
          aria-label={labels.regionChartTitle}
          className="w-full"
          style={{ height: 300 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={regionData}
              margin={{ top: 5, right: 10, left: -10, bottom: 60 }}
            >
              <XAxis
                dataKey="region"
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#1F2937" }}
                angle={-35}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: "#6B7280", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                {...TOOLTIP_STYLE}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#9CA3AF", paddingTop: 16 }}
                formatter={(value) => {
                  const map: Record<string, string> = {
                    full_ban: labels.banned,
                    partial_ban: labels.partial,
                    no_ban: labels.noBan,
                    unknown: labels.unknown,
                  };
                  return map[value] ?? value;
                }}
              />
              <Bar
                dataKey="full_ban"
                stackId="a"
                fill={CHART_COLORS.full_ban}
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="partial_ban"
                stackId="a"
                fill={CHART_COLORS.partial_ban}
              />
              <Bar
                dataKey="no_ban"
                stackId="a"
                fill={CHART_COLORS.no_ban}
              />
              <Bar
                dataKey="unknown"
                stackId="a"
                fill={CHART_COLORS.unknown}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Pie Chart: Distribution ── */}
      <section aria-labelledby="chart-distribution-heading">
        <h2
          id="chart-distribution-heading"
          className="text-xl font-semibold text-text-primary mb-2"
        >
          {labels.distributionChartTitle}
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          {labels.distributionChartDescription}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div
            role="img"
            aria-label={labels.distributionChartTitle}
            style={{ width: 240, height: 240, flexShrink: 0 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={2}
                  stroke="#0A0F1C"
                >
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        CHART_COLORS[
                          entry.status as keyof typeof CHART_COLORS
                        ] ?? CHART_COLORS.unknown
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  {...TOOLTIP_STYLE}
                  formatter={(value) => [value ?? 0, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <ul className="space-y-2" role="list">
            {distributionData.map((entry) => {
              const labelMap: Record<string, string> = {
                full_ban: labels.banned,
                partial_ban: labels.partial,
                no_ban: labels.noBan,
                unknown: labels.unknown,
              };
              const color =
                CHART_COLORS[entry.status as keyof typeof CHART_COLORS] ??
                CHART_COLORS.unknown;
              return (
                <li
                  key={entry.status}
                  className="flex items-center gap-3 text-sm"
                >
                  <span
                    className="block h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  <span className="text-text-secondary">
                    {labelMap[entry.status] ?? entry.status}
                  </span>
                  <span className="font-mono text-text-primary font-bold ml-auto">
                    {entry.count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
