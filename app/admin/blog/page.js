import { getBlogPosts } from "@/lib/db";
import BlogManager from "@/components/admin/BlogManager";

export const revalidate = 0; // Disable cache for admin routes

export default async function AdminBlogPage() {
  const posts = await getBlogPosts(true); // include drafts

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-headline-md-mobile text-primary font-semibold">Blog Article Registry</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Publish industry insights, sourcing guides, crop reports, and company updates. Manage draft status and tags in real time.
        </p>
      </div>

      <BlogManager initialPosts={posts} />
    </div>
  );
}
