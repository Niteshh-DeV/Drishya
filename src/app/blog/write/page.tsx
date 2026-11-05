import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditor } from "@/components/blog/PostEditor";
import { WriteLayout } from "@/components/blog/WriteLayout";
import { getDestinationOptions } from "@/lib/db/destinations";

export const metadata: Metadata = {
  title: "Write a story",
  robots: { index: false },
};

export default async function WritePostPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/blog/write");

  const places = await getDestinationOptions();

  return (
    <WriteLayout
      title="Write a story"
      intro="A trek, a festival, a long bus ride to a quiet temple — share a trip from Sudurpaschim in your own words. Drafts save as you type, and our team reads every story before it goes live."
    >
      <PostEditor
        postId={null}
        places={places}
        initial={{
          title: "",
          excerpt: "",
          authorName: session.user.name ?? "",
          sections: [],
          destinationIds: [],
          tags: [],
        }}
      />
    </WriteLayout>
  );
}
