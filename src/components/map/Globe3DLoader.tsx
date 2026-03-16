"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import MapLoader from "./MapLoader";

const Globe3DInner = dynamic(() => import("./Globe3D"), { ssr: false });

interface Globe3DLoaderProps {
  show?: boolean;
}

export default function Globe3DLoader({ show = true }: Globe3DLoaderProps) {
  const t = useTranslations("home");
  const [state, setState] = useState<"loading" | "webgl" | "no-webgl">(
    "loading"
  );

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ??
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
      setState(gl ? "webgl" : "no-webgl");
    } catch {
      setState("no-webgl");
    }
  }, []);

  if (state === "loading") {
    return null;
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

  if (!show) {
    return null;
  }

  return <Globe3DInner />;
}
