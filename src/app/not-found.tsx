import type { Metadata } from "next";
import { NotFoundView } from "@/components/site/NotFoundView";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <NotFoundView
      eyebrow="404 · Off the map"
      title="Lost the trail"
      body="This page isn't on our map. The link may be mistyped, or the page may have moved — every district and destination is still a click away."
      links={[
        { href: "/map", label: "Open the map" },
        { href: "/hidden-gems", label: "Hidden gems" },
        { href: "/blog", label: "Field Notes" },
      ]}
    />
  );
}
