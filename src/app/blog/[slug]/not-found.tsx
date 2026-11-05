import { NotFoundView } from "@/components/site/NotFoundView";

export default function StoryNotFound() {
  return (
    <NotFoundView
      eyebrow="Field Notes"
      title="Story not found"
      body="This story may have been unpublished or moved. There are more from across Sudurpaschim in Field Notes."
      links={[{ href: "/blog", label: "All stories" }]}
    />
  );
}
