"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import MapLoader from "./MapLoader";

const Globe3DInner = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Globe3DLoader() {
  const [state, setState] = useState<"loading" | "globe" | "map">("loading");

  useEffect(() => {
    // Mobile / tablet → Leaflet only (globe.gl is ~500KB, unusable on small screens)
    if (window.innerWidth < 1024) {
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

  if (state === "globe") {
    return <Globe3DInner />;
  }

  // loading + map → show Leaflet (immediate useful content, no blank screen)
  return <MapLoader />;
}
