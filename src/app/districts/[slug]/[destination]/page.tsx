import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDistrict } from "@/data/districts";
import { PlaceDetail } from "@/components/place/PlaceDetail";
import { getPostsForDestination } from "@/lib/db/blog";
import { getGuidesForDestination } from "@/lib/db/guides";
import { coverImageUrl, shareImageUrl } from "@/lib/images";
import {
  getAllDestinationParams,
  getDestination,
  getNextDestination,
  getSimilarDestinations,
} from "@/lib/db/destinations";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllDestinationParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; destination: string }>;
}): Promise<Metadata> {
  const { slug, destination: destinationSlug } = await params;
  const district = getDistrict(slug);
  if (!district) return { title: "Destination not found" };

  const destination = await getDestination(district.id, destinationSlug);
  if (!destination) return { title: "Destination not found" };

  const canonicalUrl = `/districts/${district.slug}/${destination.slug}`;
  // Places without a photo keep the site's default preview.
  const cover = coverImageUrl(destination);
  const images = cover
    ? [{ url: shareImageUrl(cover), width: 1200, height: 630, alt: destination.name }]
    : undefined;
  return {
    title: destination.name,
    description: destination.shortDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: destination.name,
      description: destination.shortDescription,
      type: "article",
      url: canonicalUrl,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: destination.name,
      description: destination.shortDescription,
      ...(images && { images }),
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string; destination: string }>;
}) {
  const { slug, destination: destinationSlug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const destination = await getDestination(district.id, destinationSlug);
  if (!destination) notFound();

  const [nextDestination, stories, guides, similar] = await Promise.all([
    getNextDestination(destination),
    getPostsForDestination(destination.id),
    getGuidesForDestination(destination.id),
    getSimilarDestinations(destination.id),
  ]);
  const nextDistrict = nextDestination
    ? getDistrict(nextDestination.districtId)
    : undefined;

  return (
    <PlaceDetail
      destination={destination}
      district={district}
      nextPlace={nextDestination ?? undefined}
      nextDistrict={nextDistrict}
      stories={stories}
      guides={guides}
      similar={similar}
    />
  );
}
