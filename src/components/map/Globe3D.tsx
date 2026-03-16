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

interface GeoProps {
  ISO_A3: string;
  ISO_A3_EH: string;
  NAME: string;
  [key: string]: unknown;
}

interface GeoFeature {
  type: string;
  properties: GeoProps;
  geometry: object;
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
  pointOfView(
    pov: { lat: number; lng: number; altitude: number },
    ms: number
  ): GlobeInstance;
  controls(): OrbitControls;
  renderer(): GlobeRenderer;
}

export default function Globe3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations("home");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build country lookup map
    const countryMap = new Map<string, Country>();
    for (const c of countries) {
      countryMap.set(c.iso3, c);
    }

    const getCountry = (feat: GeoFeature): Country | undefined =>
      countryMap.get(feat.properties.ISO_A3) ??
      countryMap.get(feat.properties.ISO_A3_EH);

    const getCapColor = (feat: object): string => {
      const f = feat as GeoFeature;
      const country = getCountry(f);
      return FILL_COLORS[country?.ban_status ?? "unknown"] ?? FILL_COLORS.unknown;
    };

    // Capture translation strings before async import
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

      let statusLine: string;
      if (
        (status === "full_ban" ||
          status === "de_facto_ban" ||
          status === "partial_ban") &&
        country?.ban_year
      ) {
        statusLine = tooltipBanned(String(country.ban_year));
      } else if (status === "no_ban") {
        statusLine = tooltipNoBan;
      } else {
        statusLine = tooltipUnknown;
      }

      const color = getCapColor(feat);
      return (
        `<div style="font-family:'DM Sans',system-ui,sans-serif;` +
        `padding:8px 12px;background:#111827;border:1px solid #1F2937;` +
        `border-radius:8px;min-width:140px;pointer-events:none;">` +
        `<div style="font-weight:700;font-size:14px;color:#F9FAFB;margin-bottom:4px;">${name}</div>` +
        `<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#9CA3AF;">` +
        `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;` +
        `background:${color};flex-shrink:0;"></span>${statusLine}</div></div>`
      );
    };

    const features = (worldGeoJSON as unknown as GeoJSON.FeatureCollection)
      .features;

    let disposed = false;
    let cleanupFn: (() => void) | undefined;

    // Start invisible — will fade in after initialization
    container.style.opacity = "0";

    import("globe.gl").then(({ default: GlobeLib }) => {
      if (disposed || !containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globe = (GlobeLib as any)(
        { rendererConfig: { antialias: true, alpha: true } }
      )(container) as GlobeInstance;

      globe
        .width(container.offsetWidth)
        .height(container.offsetHeight)
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-night.jpg"
        )
        .backgroundColor("rgba(0,0,0,0)")
        .atmosphereColor("rgba(59, 130, 246, 0.6)")
        .atmosphereAltitude(0.15)
        .polygonsData(features)
        .polygonCapColor(getCapColor)
        .polygonSideColor(() => "rgba(30,41,59,0.5)")
        .polygonStrokeColor(() => "#1F2937")
        .polygonAltitude(0.006)
        .polygonLabel(buildLabel)
        .onPolygonHover((hoverPolygon: object | null) => {
          globe.polygonAltitude((feat: object) =>
            feat === hoverPolygon ? 0.025 : 0.006
          );
          container.style.cursor = hoverPolygon ? "pointer" : "default";
        })
        .onPolygonClick((polygon: object) => {
          const f = polygon as GeoFeature;
          const country = getCountry(f);
          if (country?.slug) {
            router.push(`/country/${country.slug}`);
          }
        });

      // Focus on Asia/Africa where most no-ban countries are
      globe.pointOfView({ lat: 10, lng: 60, altitude: 2 }, 0);

      // Auto-rotation
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;

      let resumeTimer: ReturnType<typeof setTimeout> | null = null;
      const pauseRotation = () => {
        controls.autoRotate = false;
      };
      const resumeRotation = () => {
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          controls.autoRotate = true;
        }, 2000);
      };
      controls.addEventListener("start", pauseRotation);
      controls.addEventListener("end", resumeRotation);

      // Fade the globe in now that it's fully initialized
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
        try {
          globe.renderer().dispose();
        } catch {
          // ignore dispose errors
        }
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
      aria-label="Interactive 3D globe showing global asbestos ban status by country"
    />
  );
}
