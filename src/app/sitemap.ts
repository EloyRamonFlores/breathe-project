import type { MetadataRoute } from "next";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://breathe.global";
const LOCALES = ["en", "es"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 },
    { path: "/check", priority: 0.9 },
    { path: "/learn", priority: 0.8 },
    { path: "/learn/what-is-asbestos", priority: 0.8 },
    { path: "/learn/where-it-hides", priority: 0.8 },
    { path: "/learn/history", priority: 0.7 },
    { path: "/learn/what-to-do", priority: 0.8 },
    { path: "/learn/by-the-numbers", priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map(({ path, priority }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date("2026-03-14"),
      changeFrequency: "monthly",
      priority,
    }))
  );

  const countryRoutes: MetadataRoute.Sitemap = (
    countries as Country[]
  ).flatMap((country) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/country/${country.slug}`,
      lastModified: new Date(country.last_updated),
      changeFrequency: "monthly",
      priority: country.priority === "high" ? 0.9 : 0.7,
    }))
  );

  return [...staticRoutes, ...countryRoutes];
}
