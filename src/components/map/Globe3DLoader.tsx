"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import MapLoader from "./MapLoader";

const Globe3DInner = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Globe3DLoader() {
  const t = useTranslations("home");
  const [state, setState] = useState<"loading" | "globe" | "map">("loading");
  // isMobile: true when the initial render detected a small screen
  const [isMobile, setIsMobile] = useState(false);
  // userWantsGlobe: null = auto (not overridden), true/false = user explicitly toggled
  const [userWantsGlobe, setUserWantsGlobe] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);

    // Mobile / tablet → Leaflet by default (globe.gl is ~500KB, unusable on small screens)
    if (mobile) {
      setState("map");
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ??
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
      if (!gl) {
        setState("map");
        return;
      }
    } catch {
      setState("map");
      return;
    }

    // Check connection speed (non-standard API — not available in all browsers)
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };
    const effectiveType = nav.connection?.effectiveType;
    if (effectiveType === "2g" || effectiveType === "slow-2g") {
      setState("map");
      return;
    }

    // Check device memory — fall back to Leaflet on low-memory devices (<4 GB)
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      setState("map");
      return;
    }

    setState("globe");
  }, []);

  // Determine what to actually show:
  // - On desktop: respect auto-detection (state)
  // - On mobile: respect userWantsGlobe override, fall back to "map"
  const showGlobe =
    userWantsGlobe !== null
      ? userWantsGlobe
      : state === "globe";

  // The toggle button only appears on mobile (where we force 2D by default)
  const showToggle = isMobile && state !== "loading";

  return (
    <div className="relative h-full overflow-hidden">
      {showGlobe ? <Globe3DInner /> : <MapLoader />}

      {showToggle && (
        <button
          onClick={() =>
            setUserWantsGlobe((prev) => {
              // Cycle: null (auto=2D) → true (3D) → false (2D) → true ...
              if (prev === null) return true;
              return !prev;
            })
          }
          className="absolute bottom-4 right-4 z-[1000] flex items-center gap-1.5 rounded-full border border-bg-tertiary bg-bg-primary/90 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm transition-colors hover:bg-bg-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-primary"
          aria-label={showGlobe ? t("map_toggle_to_2d") : t("map_toggle_to_3d")}
        >
          <span aria-hidden="true">{showGlobe ? "🗺️" : "🌍"}</span>
          {showGlobe ? t("map_toggle_to_2d") : t("map_toggle_to_3d")}
        </button>
      )}
    </div>
  );
}
