import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PostEditor } from "@/components/blog/PostEditor";
import { WriteLayout } from "@/components/blog/WriteLayout";
import { getAuthorPost } from "@/lib/db/blog-authoring";
import { getDestinationOptions } from "@/lib/db/destinations";

export const metadata: Metadata = {
  title: "Edit story",
  robots: { index: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/signin?callbackUrl=/blog/write/${id}`);

  const [post, places] = await Promise.all([
    getAuthorPost(id, session.user.id),
    getDestinationOptions(),
  ]);
  // Someone else's post looks the same as a missing one.
  if (!post) notFound();

  return (
    <WriteLayout title="Edit story">
      <PostEditor
        postId={post.id}
        status={post.status}
        reviewNote={post.reviewNote}
        initial={post.input}
        places={places}
      />
    </WriteLayout>
  );
}
