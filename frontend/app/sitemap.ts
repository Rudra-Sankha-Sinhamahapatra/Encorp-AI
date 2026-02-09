import type { MetadataRoute } from "next";

const SITE_URL = "https://encorp.rudrasankha.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${SITE_URL}/auth/signup`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/create`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/auth/login`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];
}
