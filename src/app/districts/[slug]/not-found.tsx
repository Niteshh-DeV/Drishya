import { NotFoundView } from "@/components/site/NotFoundView";

export default function DistrictNotFound() {
  return (
    <NotFoundView
      eyebrow="Sudurpaschim Province"
      title="No such district"
      body="We don't have a page for that district. Sudurpaschim has nine, from Darchula in the far north-west to Kanchanpur on the plains — pick one from the map."
      links={[
        { href: "/", label: "Back to the map" },
        { href: "/map", label: "Every place" },
      ]}
    />
  );
}
