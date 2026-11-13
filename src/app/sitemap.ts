import type { MetadataRoute } from "next";
import { districts } from "@/data/districts";
import { getPostSitemapEntries } from "@/lib/db/blog";
import { getAllDestinationParams } from "@/lib/db/destinations";
import { getGuideParams } from "@/lib/db/guides";
import { getTravelerParams } from "@/lib/db/travelers";
import { SITE_URL } from "@/lib/site";

// Rebuilt hourly, like the pages it lists, so newly published stories appear.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  const staticRoutes = ["", "/map", "/plan", "/blog", "/hidden-gems", "/guide-connect", "/privacy"].map(
    (path) => ({ url: url(path), lastModified: new Date() }),
  );

  const districtRoutes = districts.map((district) => ({
    url: url(`/districts/${district.slug}`),
    lastModified: new Date(),
  }));

  const [destinations, posts, travelers, guides] = await Promise.all([
    getAllDestinationParams(),
    getPostSitemapEntries(),
    getTravelerParams(),
    getGuideParams(),
  ]);

  const destinationRoutes = destinations.map((d) => ({
    url: url(`/districts/${d.slug}/${d.destination}`),
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: post.updatedAt,
  }));

  const travelerRoutes = travelers.map((t) => ({
    url: url(`/travelers/${t.id}`),
    lastModified: new Date(),
  }));

  const guideRoutes = guides.map((g) => ({
    url: url(`/guide-connect/${g.id}`),
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...districtRoutes,
    ...destinationRoutes,
    ...postRoutes,
    ...travelerRoutes,
    ...guideRoutes,
  ];
}
