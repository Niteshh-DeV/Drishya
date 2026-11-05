import type { MetadataRoute } from "next";

/** Lets phones save Drishya to the home screen with its own icon and colours. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Drishya — Explore Sudurpaschim",
    short_name: "Drishya",
    description:
      "Districts, destinations and traveler stories from Nepal's Sudurpaschim Province.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5f2",
    theme_color: "#1f3d2b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
