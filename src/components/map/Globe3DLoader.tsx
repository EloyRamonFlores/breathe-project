"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import MapLoader from "./MapLoader";

const Globe3DInner = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Globe3DLoader() {
  const t = useTranslations("home");
  const [state, setState] = useState<"loading" | "webgl" | "no-webgl">(
    "loading"
  );

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ??
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
      if (!gl) {
        setState("no-webgl");
        return;
      }
    } catch {
      setState("no-webgl");
      return;
    }

    // Check connection speed (non-standard API — not available in all browsers)
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      deviceMemory?: number;
    };
    const effectiveType = nav.connection?.effectiveType;
    if (effectiveType === "2g" || effectiveType === "slow-2g") {
      setState("no-webgl");
      return;
    }

    // Check device memory — fall back to Leaflet on low-memory devices (<4 GB)
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) {
      setState("no-webgl");
      return;
    }

    setState("webgl");
  }, []);

  if (state === "loading") {
    return <MapLoader />;
  }

  if (state === "no-webgl") {
    return (
      <div className="flex w-full h-full flex-col items-center justify-center gap-4 p-4">
        <p className="font-mono text-sm text-text-muted text-center">
          {t("globe_fallback")}
        </p>
        <MapLoader />
      </div>
    );
  }

  return <Globe3DInner />;
}
