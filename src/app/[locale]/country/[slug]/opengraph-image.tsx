import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import countriesData from "@/data/countries.json";
import type { Country } from "@/lib/types";

export const alt = "Asbestos ban status";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BAN_COLORS: Record<Country["ban_status"], string> = {
  full_ban: "#10B981",
  de_facto_ban: "#10B981",
  partial_ban: "#F59E0B",
  no_ban: "#EF4444",
  unknown: "#64748B",
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tBan = await getTranslations({ locale, namespace: "ban_status" });
  const country = (countriesData as Country[]).find((c) => c.slug === slug);

  if (!country) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0A0F1C",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span style={{ color: "#64748B", fontSize: "32px" }}>Country not found</span>
        </div>
      ),
      { ...size }
    );
  }

  const banColor = BAN_COLORS[country.ban_status];
  const banLabel = tBan(country.ban_status);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0F1C",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Logo top-left */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "auto" }}>
          <span style={{ fontSize: "28px", fontWeight: 400, color: "#F9FAFB" }}>Toxin</span>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#10B981" }}>Free</span>
        </div>

        {/* Country name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "auto" }}>
          <div
            style={{
              fontSize: country.name.length > 14 ? "56px" : "72px",
              fontWeight: 700,
              color: "#F9FAFB",
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {country.name}
          </div>

          {/* Ban status badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "24px",
                fontWeight: 700,
                color: banColor,
                background: `${banColor}18`,
                border: `2px solid ${banColor}50`,
                padding: "10px 28px",
                borderRadius: "100px",
              }}
            >
              {banLabel}
            </div>
            {country.ban_year && (
              <span style={{ fontSize: "24px", color: "#94A3B8", fontWeight: 500 }}>
                since {country.ban_year}
              </span>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "20px", color: "#64748B", fontFamily: "monospace" }}>
            Is asbestos banned in {country.name}?
          </span>
          <span style={{ fontSize: "18px", color: "#475569" }}>toxinfree.global</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
