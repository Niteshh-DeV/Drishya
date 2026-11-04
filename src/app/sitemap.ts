import type { MetadataRoute } from "next";
import { districts } from "@/data/districts";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/guide-connect",
    "/hidden-gems",
  ].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: new Date(),
  }));

  const districtRoutes = districts.map((district) => ({
    url: new URL(`/districts/${district.slug}`, SITE_URL).toString(),
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...districtRoutes];
}
