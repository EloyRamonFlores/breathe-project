"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import worldGeoJSON from "@/data/geo/world.json";
import type { Country } from "@/lib/types";

const countries = countriesData as Country[];

const FILL_COLORS: Record<string, string> = {
  full_ban: "#059669",
  de_facto_ban: "#059669",
  partial_ban: "#F59E0B",
  no_ban: "#EF4444",
  unknown: "#374151",
};

// Representative asbestos trade flows: major producers → no-ban consumer countries
interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

const TRADE_ARCS: ArcData[] = [
  // Russia (world's largest exporter of chrysotile)
  { startLat: 60, startLng: 90, endLat: 20, endLng: 78 },   // → India
  { startLat: 60, startLng: 90, endLat: 30, endLng: 70 },   // → Pakistan
  { startLat: 60, startLng: 90, endLat: -6, endLng: 107 },  // → Indonesia
  { startLat: 60, startLng: 90, endLat: 15, endLng: 101 },  // → Thailand
  { startLat: 60, startLng: 90, endLat: 37, endLng: 55 },   // → Iran
  { startLat: 60, startLng: 90, endLat: 44, endLng: 21 },   // → Serbia
  // Kazakhstan (second largest producer)
  { startLat: 48, startLng: 68, endLat: 20, endLng: 78 },   // → India
  { startLat: 48, startLng: 68, endLat: -6, endLng: 107 },  // → Indonesia
  { startLat: 48, startLng: 68, endLat: 30, endLng: 70 },   // → Pakistan
  // China (domestic use + some export)
  { startLat: 35, startLng: 105, endLat: 9, endLng: 40 },   // → Ethiopia
  { startLat: 35, startLng: 105, endLat: 8, endLng: 8 },    // → Nigeria
  { startLat: 35, startLng: 105, endLat: 1, endLng: 38 },   // → Kenya
];

interface GeoProps {
  ISO_A3: string;
  ISO_A3_EH: string;
  NAME: string;
  [key: string]: unknown;
}

interface PolygonGeometry {
  type: "Polygon";
  coordinates: number[][][];
}

interface MultiPolygonGeometry {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

interface GeoFeature {
  type: string;
  properties: GeoProps;
  geometry: PolygonGeometry | MultiPolygonGeometry | { type: string };
}

interface OrbitControls {
  autoRotate: boolean;
  autoRotateSpeed: number;
  addEventListener(type: string, listener: () => void): void;
}

interface GlobeRenderer {
  dispose(): void;
}

interface GlobeInstance {
  width(w: number): GlobeInstance;
  height(h: number): GlobeInstance;
  globeImageUrl(url: string): GlobeInstance;
  backgroundColor(color: string): GlobeInstance;
  atmosphereColor(color: string): GlobeInstance;
  atmosphereAltitude(alt: number): GlobeInstance;
  polygonsData(data: object[]): GlobeInstance;
  polygonCapColor(fn: (feat: object) => string): GlobeInstance;
  polygonSideColor(fn: () => string): GlobeInstance;
  polygonStrokeColor(fn: () => string): GlobeInstance;
  polygonAltitude(fn: number | ((feat: object) => number)): GlobeInstance;
  polygonLabel(fn: (feat: object) => string): GlobeInstance;
  onPolygonHover(fn: (polygon: object | null) => void): GlobeInstance;
  onPolygonClick(fn: (polygon: object) => void): GlobeInstance;
  arcsData(data: object[]): GlobeInstance;
  arcStartLat(fn: (d: object) => number): GlobeInstance;
  arcStartLng(fn: (d: object) => number): GlobeInstance;
  arcEndLat(fn: (d: object) => number): GlobeInstance;
  arcEndLng(fn: (d: object) => number): GlobeInstance;
  arcColor(fn: (d: object) => string[]): GlobeInstance;
  arcAltitude(val: number): GlobeInstance;
  arcStroke(val: number): GlobeInstance;
  arcDashLength(val: number): GlobeInstance;
  arcDashGap(val: number): GlobeInstance;
  arcDashAnimateTime(val: number): GlobeInstance;
  pointOfView(
    pov: { lat: number; lng: number; altitude: number },
    ms: number
  ): GlobeInstance;
  controls(): OrbitControls;
  renderer(): GlobeRenderer;
}

/** Approximate centroid of a GeoJSON polygon feature */
function getPolygonCenter(
  feature: GeoFeature
): { lat: number; lng: number } | null {
  const geo = feature.geometry;
  if (!geo) return null;

  let ring: number[][] | null = null;

  if (geo.type === "Polygon") {
    ring = (geo as PolygonGeometry).coordinates[0] ?? null;
  } else if (geo.type === "MultiPolygon") {
    const polys = (geo as MultiPolygonGeometry).coordinates;
    const largest = polys.reduce((a, b) =>
      a[0].length >= b[0].length ? a : b
    );
    ring = largest[0] ?? null;
  }

  if (!ring || ring.length === 0) return null;
  const lngs = ring.map((c) => c[0]);
  const lats = ring.map((c) => c[1]);
  return {
    lat: lats.reduce((a, b) => a + b, 0) / lats.length,
    lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
  };
}

/** 2×2 dark-navy canvas texture — replaces ocean image, only polygons visible */
function darkGlobeTexture(): string {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 2;
  const ctx = c.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0D1526";
    ctx.fillRect(0, 0, 2, 2);
  }
  return c.toDataURL();
}

export default function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("home");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.opacity = "0";

    const countryMap = new Map<string, Country>();
    for (const c of countries) countryMap.set(c.iso3, c);

    const getCountry = (feat: GeoFeature): Country | undefined =>
      countryMap.get(feat.properties.ISO_A3) ??
      countryMap.get(feat.properties.ISO_A3_EH);

    const getCapColor = (feat: object): string => {
      const country = getCountry(feat as GeoFeature);
      return FILL_COLORS[country?.ban_status ?? "unknown"] ?? FILL_COLORS.unknown;
    };

    const tooltipBanned = (year: string) => t("globe_tooltip_banned", { year });
    const tooltipNoBan = t("globe_tooltip_no_ban");
    const tooltipUnknown = t("globe_tooltip_unknown");

    const buildLabel = (feat: object): string => {
      const f = feat as GeoFeature;
      const country = getCountry(f);
      const name =
        country?.name ??
        (typeof f.properties.NAME === "string" ? f.properties.NAME : "Unknown");
      const status = country?.ban_status ?? "unknown";
      let statusLine =
        (status === "full_ban" ||
          status === "de_facto_ban" ||
          status === "partial_ban") &&
        country?.ban_year
          ? tooltipBanned(String(country.ban_year))
          : status === "no_ban"
          ? tooltipNoBan
          : tooltipUnknown;
      const color = getCapColor(feat);
      return (
        `<div style="font-family:'DM Sans',system-ui,sans-serif;padding:8px 12px;` +
        `background:#111827;border:1px solid #1F2937;border-radius:8px;min-width:140px;pointer-events:none;">` +
        `<div style="font-weight:700;font-size:14px;color:#F9FAFB;margin-bottom:4px;">${name}</div>` +
        `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#9CA3AF;">` +
        `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>` +
        `${statusLine}</div></div>`
      );
    };

    const features = (worldGeoJSON as unknown as GeoJSON.FeatureCollection).features;

    let disposed = false;
    let cleanupFn: (() => void) | undefined;

    import("globe.gl").then(({ default: GlobeLib }) => {
      if (disposed || !containerRef.current) return;

      // Mutable ref — populated after chain, used inside hover callback
      const controlsHolder: { ref: OrbitControls | null } = { ref: null };
      let resumeTimer: ReturnType<typeof setTimeout> | null = null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globe = (GlobeLib as any)(
        { rendererConfig: { antialias: true, alpha: true } }
      )(container) as GlobeInstance;

      globe
        .width(container.offsetWidth)
        .height(container.offsetHeight)
        // ── Globe appearance: no ocean, dark navy sphere ──
        .globeImageUrl(darkGlobeTexture())
        .backgroundColor("rgba(0,0,0,0)")
        .atmosphereColor("rgba(59, 130, 246, 0.6)")
        .atmosphereAltitude(0.15)
        // ── Country polygons ──
        .polygonsData(features)
        .polygonCapColor(getCapColor)
        .polygonSideColor(() => "rgba(30,41,59,0.5)")
        .polygonStrokeColor(() => "#1F2937")
        .polygonAltitude(0.006)
        .polygonLabel(buildLabel)
        .onPolygonHover((hoverPolygon: object | null) => {
          // Lift hovered country
          globe.polygonAltitude((feat: object) =>
            feat === hoverPolygon ? 0.025 : 0.006
          );
          container.style.cursor = hoverPolygon ? "pointer" : "default";
          // Pause rotation on hover, resume smoothly on leave
          if (hoverPolygon) {
            if (resumeTimer) clearTimeout(resumeTimer);
            if (controlsHolder.ref) controlsHolder.ref.autoRotate = false;
          } else {
            resumeTimer = setTimeout(() => {
              if (controlsHolder.ref) controlsHolder.ref.autoRotate = true;
            }, 800);
          }
        })
        .onPolygonClick((polygon: object) => {
          const f = polygon as GeoFeature;
          const country = getCountry(f);
          const center = getPolygonCenter(f);
          // Zoom into country then navigate
          if (center) {
            globe.pointOfView(
              { lat: center.lat, lng: center.lng, altitude: 1.2 },
              800
            );
            setTimeout(() => {
              if (country?.slug) router.push(`/country/${country.slug}`);
            }, 900);
          } else if (country?.slug) {
            router.push(`/country/${country.slug}`);
          }
        })
        // ── Trade arcs: major producers → no-ban consumers ──
        .arcsData(TRADE_ARCS)
        .arcStartLat((d) => (d as ArcData).startLat)
        .arcStartLng((d) => (d as ArcData).startLng)
        .arcEndLat((d) => (d as ArcData).endLat)
        .arcEndLng((d) => (d as ArcData).endLng)
        .arcColor(() => ["rgba(239,68,68,0.05)", "rgba(239,68,68,0.75)"])
        .arcAltitude(0.25)
        .arcStroke(0.4)
        .arcDashLength(0.3)
        .arcDashGap(0.15)
        .arcDashAnimateTime(2200);

      // Initial camera — Asia/Africa (highest density of no-ban countries)
      globe.pointOfView({ lat: 10, lng: 60, altitude: 2 }, 0);

      // Auto-rotation
      const controls = globe.controls();
      controlsHolder.ref = controls;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;

      // Also pause on manual drag
      const pauseOnDrag = () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        if (controlsHolder.ref) controlsHolder.ref.autoRotate = false;
      };
      const resumeAfterDrag = () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          if (controlsHolder.ref) controlsHolder.ref.autoRotate = true;
        }, 2000);
      };
      controls.addEventListener("start", pauseOnDrag);
      controls.addEventListener("end", resumeAfterDrag);

      // Fade in
      container.style.transition = "opacity 2s ease-in";
      container.style.opacity = "1";

      // Responsive resize
      const resizeObserver = new ResizeObserver(() => {
        if (containerRef.current) {
          globe
            .width(containerRef.current.offsetWidth)
            .height(containerRef.current.offsetHeight);
        }
      });
      resizeObserver.observe(container);

      cleanupFn = () => {
        resizeObserver.disconnect();
        if (resumeTimer) clearTimeout(resumeTimer);
        try { globe.renderer().dispose(); } catch { /* ignore */ }
        if (container) container.innerHTML = "";
      };
    });

    return () => {
      disposed = true;
      cleanupFn?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      role="img"
      aria-label="Interactive 3D globe showing global asbestos ban status and trade routes"
    />
  );
}
