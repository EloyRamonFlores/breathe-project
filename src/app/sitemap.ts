import type { MetadataRoute } from "next";
import countries from "@/data/countries.json";
import type { Country } from "@/lib/types";
import { SITE_URL } from "@/lib/constants";

const BASE_URL = SITE_URL;
const LOCALES = ["en", "es"];

function getCountryPriority(country: Country): number {
  if (country.priority === "high") return 0.9;
  if (country.ban_status === "unknown") return 0.6;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] =
    [
      { path: "", priority: 1.0, changeFrequency: "weekly" },
      { path: "/check", priority: 0.9, changeFrequency: "monthly" },
      { path: "/learn", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/what-is-asbestos", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/where-it-hides", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/history", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/what-to-do", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/by-the-numbers", priority: 0.8, changeFrequency: "monthly" },
      { path: "/learn/methodology", priority: 0.7, changeFrequency: "monthly" },
    ];

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    staticPaths.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date("2026-03-17"),
      changeFrequency,
      priority,
    }))
  );

  const countryRoutes: MetadataRoute.Sitemap = (
    countries as Country[]
  ).flatMap((country) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/country/${country.slug}`,
      lastModified: new Date(country.last_updated),
      changeFrequency: "monthly" as const,
      priority: getCountryPriority(country),
    }))
  );

  return [...staticRoutes, ...countryRoutes];
}
