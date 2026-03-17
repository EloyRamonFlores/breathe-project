import { ImageResponse } from "next/og";
import countriesData from "@/data/countries.json";

export const alt = "ToxinFree — Global Asbestos Ban Map & Risk Checker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const noBanCount = (countriesData as { ban_status: string }[]).filter(
  (c) => c.ban_status === "no_ban" || c.ban_status === "unknown"
).length;

export default function Image() {
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
          <span style={{ fontSize: "30px", fontWeight: 400, color: "#F9FAFB", letterSpacing: "-0.5px" }}>
            Toxin
          </span>
          <span style={{ fontSize: "30px", fontWeight: 700, color: "#10B981", letterSpacing: "-0.5px" }}>
            Free
          </span>
        </div>

        {/* Main stat */}
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "auto", gap: "8px" }}>
          <span
            style={{
              fontSize: "180px",
              fontWeight: 700,
              color: "#F59E0B",
              lineHeight: 1,
              letterSpacing: "-6px",
            }}
          >
            {noBanCount}
          </span>

          {/* Multi-child text: split into separate flex children */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            <span style={{ fontSize: "38px", fontWeight: 600, color: "#E2E8F0", lineHeight: 1.25 }}>
              countries still have
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "42px", fontWeight: 800, color: "#EF4444", lineHeight: 1.2 }}>
                NO ban
              </span>
              <span style={{ fontSize: "38px", fontWeight: 600, color: "#E2E8F0", lineHeight: 1.2 }}>
                on asbestos
              </span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "22px", color: "#475569", fontWeight: 500 }}>
            toxinfree.global
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "10px 20px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#EF4444",
                display: "flex",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "18px", color: "#94A3B8" }}>
              200 countries tracked
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
