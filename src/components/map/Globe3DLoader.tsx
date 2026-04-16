"use client";

import { useReducer, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import MapLoader from "./MapLoader";

const Globe3DInner = dynamic(() => import("./Globe3D"), { ssr: false });

type MapView = "loading" | "globe" | "map";

type MapState = {
  view: MapView;
  userWantsGlobe: boolean | null;
};

type MapAction =
  | { type: "DETECTED"; view: MapView; userWantsGlobe: boolean | null }
  | { type: "TOGGLE" };

function mapReducer(current: MapState, action: MapAction): MapState {
  if (action.type === "DETECTED") {
    return { view: action.view, userWantsGlobe: action.userWantsGlobe };
  }
  // TOGGLE: flip the user preference
  const next = current.userWantsGlobe === null ? true : !current.userWantsGlobe;
  return { ...current, userWantsGlobe: next };
}

export default function Globe3DLoader() {
  const t = useTranslations("home");
  // isMobile: true when the initial render detected a small screen
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  const [{ view, userWantsGlobe }, dispatch] = useReducer(mapReducer, {
    view: "loading",
    userWantsGlobe: null,
  });

  useEffect(() => {
    const mobile = window.innerWidth < 1024;

    // Check for saved user preference first
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("toxinfree_map_preference");
    } catch {
      // localStorage may be unavailable (private mode, etc.)
    }

    if (saved === "3d") {
      dispatch({ type: "DETECTED", view: mobile ? "map" : "globe", userWantsGlobe: true });
      return;
    }
    if (saved === "2d") {
      dispatch({ type: "DETECTED", view: "map", userWantsGlobe: false });
      return;
    }

    // No saved preference → auto-detect

    // Mobile / tablet → Leaflet by default (globe.gl is ~500KB, unusable on small screens)
    if (mobile) {
      dispatch({ type: "DETECTED", view: "map", userWantsGlobe: null });
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
        dispatch({ type: "DETECTED", view: "map", userWantsGlobe: null });
        return;
      }
    } catch {
      dispatch({ type: "DETECTED", view: "map", userWantsGlobe: null });
      return;
    }

    // Check connection speed (non-standard API — not available in all browsers)
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };
    const effectiveType = nav.connection?.effectiveType;
    if (effectiveType === "2g" || effectiveType === "slow-2g") {
      dispatch({ type: "DETECTED", view: "map", userWantsGlobe: null });
      return;
    }

    // Check device memory — fall back to Leaflet on low-memory devices (<4 GB)
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      dispatch({ type: "DETECTED", view: "map", userWantsGlobe: null });
      return;
    }

    dispatch({ type: "DETECTED", view: "globe", userWantsGlobe: null });
  }, []);

  // Determine what to actually show:
  // - On desktop: respect auto-detection (view)
  // - On mobile: respect userWantsGlobe override, fall back to "map"
  const showGlobe =
    userWantsGlobe !== null
      ? userWantsGlobe
      : view === "globe";

  // The toggle button only appears on mobile (where we force 2D by default)
  const showToggle = isMobile && view !== "loading";

  return (
    <div className="relative h-full overflow-hidden">
      {showGlobe ? <Globe3DInner /> : <MapLoader />}

      {showToggle && (
        <button
          onClick={() => {
            dispatch({ type: "TOGGLE" });
            const next = userWantsGlobe === null ? true : !userWantsGlobe;
            try {
              localStorage.setItem(
                "toxinfree_map_preference",
                next ? "3d" : "2d"
              );
            } catch {
              // localStorage may be unavailable (private mode, etc.)
            }
          }}
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
