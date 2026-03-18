"use client";

import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] w-full items-center justify-center bg-bg-secondary md:h-[60vh] lg:h-[70vh]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-text-muted border-t-accent" />
    </div>
  ),
});

export default function MapLoader() {
  return <WorldMap />;
}
