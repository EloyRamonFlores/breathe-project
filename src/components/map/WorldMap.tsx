"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { Layer, LeafletMouseEvent, PathOptions } from "leaflet";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import countriesData from "@/data/countries.json";
import worldGeoJSON from "@/data/geo/world.json";
import type { Country } from "@/lib/types";
import DOMPurify from "dompurify";
import { FILL_COLORS, STATUS_DOTS } from "@/lib/map-constants";
import "leaflet/dist/leaflet.css";

interface GeoFeatureProperties {
  ISO_A3: string;
  ISO_A3_EH: string;
  NAME: string;
  [key: string]: unknown;
}

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoFeatureProperties>;

/** Controls Leaflet dragging imperatively from inside the MapContainer tree */
function MapInteractionController({ interactive }: { interactive: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (interactive) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  }, [interactive, map]);
  return null;
}

export default function WorldMap() {
  const t = useTranslations("ban_status");
  const tHome = useTranslations("home");
  const router = useRouter();
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const [isInteractive, setIsInteractive] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Deactivate map interaction when user clicks outside the map
  useEffect(() => {
    if (!isInteractive) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        mapContainerRef.current &&
        !mapContainerRef.current.contains(e.target as Node)
      ) {
        setIsInteractive(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isInteractive]);

  const countryMap = useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countriesData as Country[]) {
      map.set(c.iso3, c);
    }
    return map;
  }, []);

  const findCountry = useCallback(
    (feature: GeoFeature): Country | undefined => {
      return (
        countryMap.get(feature.properties.ISO_A3) ??
        countryMap.get(feature.properties.ISO_A3_EH)
      );
    },
    [countryMap]
  );

  const style = useCallback(
    (feature: GeoFeature | undefined): PathOptions => {
      if (!feature) return {};
      const country = findCountry(feature);
      const status = country?.ban_status ?? "unknown";
      return {
        fillColor: FILL_COLORS[status] ?? FILL_COLORS.unknown,
        weight: 0.8,
        color: "#1F2937",
        fillOpacity: 0.75,
      };
    },
    [findCountry]
  );

  const onEachFeature = useCallback(
    (feature: GeoFeature, layer: Layer) => {
      const country = findCountry(feature);
      const name = country?.name ?? feature.properties.NAME ?? "Unknown";
      const status = country?.ban_status ?? "unknown";
      const statusLabel = t(status);
      const banYear = country?.ban_year;
      const dotColor = STATUS_DOTS[status] ?? STATUS_DOTS.unknown;

      const tooltipHtml = `
        <div style="font-family: 'DM Sans', system-ui, sans-serif; min-width: 160px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px; color: #F9FAFB;">
            ${name}
          </div>
          <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9CA3AF;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${dotColor};"></span>
            ${statusLabel}${banYear ? ` (${banYear})` : ""}
          </div>
        </div>
      `;

      layer.bindTooltip(DOMPurify.sanitize(tooltipHtml), {
        sticky: true,
        direction: "top",
        offset: [0, -10],
        className: "breathe-tooltip",
      });

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          target.setStyle({
            fillOpacity: 0.95,
            weight: 1.5,
            color: "#F9FAFB",
          });
          target.bringToFront();
        },
        mouseout: () => {
          geoJsonRef.current?.resetStyle();
        },
        click: () => {
          if (country?.slug) {
            router.push(`/country/${country.slug}`);
          }
        },
      });
    },
    [findCountry, t, router]
  );

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]"
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        dragging={false}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#0A0F1C" }}
        maxBounds={[
          [-85, -200],
          [85, 200],
        ]}
        maxBoundsViscosity={1.0}
      >
        <MapInteractionController interactive={isInteractive} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <GeoJSON
          ref={geoJsonRef}
          data={worldGeoJSON as unknown as GeoJSON.FeatureCollection}
          style={style as (feature?: GeoJSON.Feature) => PathOptions}
          onEachFeature={
            onEachFeature as (feature: GeoJSON.Feature, layer: Layer) => void
          }
        />
      </MapContainer>

      {/* Tap-to-interact overlay — prevents scroll capture on mobile */}
      {!isInteractive && (
        <div
          className="absolute inset-0 z-[999] flex cursor-pointer items-center justify-center"
          onClick={() => setIsInteractive(true)}
          role="button"
          aria-label={tHome("map_interact")}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsInteractive(true);
          }}
        >
          <span className="rounded-full border border-bg-tertiary/50 bg-bg-primary/80 px-4 py-2 text-sm font-medium text-text-secondary backdrop-blur-sm">
            {tHome("map_interact")}
          </span>
        </div>
      )}

      {/* Legend — collapsible on mobile, always open on desktop */}
      <div className="absolute bottom-4 left-4 z-[1001] rounded-lg border border-bg-tertiary/50 bg-bg-primary/90 px-4 py-3 backdrop-blur-sm">
        {/* Mobile toggle pill */}
        <button
          className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-text-muted md:hidden"
          onClick={() => setIsLegendOpen((prev) => !prev)}
          aria-expanded={isLegendOpen}
          aria-label={tHome("map_legend_toggle")}
        >
          🗺 {tHome("map_legend_toggle")}
        </button>

        {/* Desktop title */}
        <p className="mb-2 hidden text-[10px] font-medium uppercase tracking-wider text-text-muted md:block sm:text-xs">
          {tHome("map_legend_title")}
        </p>

        {/* Legend body: hidden on mobile unless toggled; always visible on desktop */}
        <div
          className={`${isLegendOpen ? "block animate-[slide-down_0.2s_ease-out]" : "hidden"} mt-2 md:mt-0 md:block`}
        >
          <div className="flex flex-col gap-1.5">
            {(
              [
                ["full_ban", "#059669"],
                ["partial_ban", "#F59E0B"],
                ["no_ban", "#EF4444"],
                ["unknown", "#374151"],
              ] as const
            ).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ background: color }}
                />
                <span className="text-[10px] text-text-secondary sm:text-xs">
                  {t(status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
