import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/db";
import { Calendar, User, ArrowLeft, ArrowRight, Tag } from "lucide-react";

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.content.replace(/<[^>]+>/g, " ").substring(0, 160)
  };
}

// Revalidate this path every 60 seconds
export const revalidate = 60;

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  // Fetch all posts to select related ones
  const allPosts = await getBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Draft";

  return (
    <div className="bg-background pb-stack-lg">
      {/* Article Navigation & Header */}
      <section className="bg-surface border-b border-on-surface/10 py-12 bg-subtle-pattern">
        <div className="max-w-4xl mx-auto px-margin-mobile">
          <Link href="/blog" className="text-secondary font-label-md text-xs hover:text-primary flex items-center gap-1.5 w-fit mb-6">
            <ArrowLeft size={14} /> Back to Insights
          </Link>
          
          <span className="bg-secondary/15 text-primary text-xs uppercase font-bold px-3 py-1 rounded">
            {post.category}
          </span>
          
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-variant font-semibold">
            <span className="flex items-center gap-2">
              <Calendar size={15} className="text-secondary" /> {dateStr}
            </span>
            <span className="flex items-center gap-2">
              <User size={15} className="text-secondary" /> {post.author}
            </span>
          </div>
        </div>
      </section>

      {/* Featured Image Frame */}
      {post.featured_image && (
        <div className="max-w-4xl mx-auto px-margin-mobile -mt-8 relative z-10">
          <div className="h-[300px] md:h-[450px] rounded-lg border border-on-surface/10 overflow-hidden shadow-md">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto px-margin-mobile mt-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Article content (8 cols on desktop) */}
        <article className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className="prose prose-stone max-w-none text-on-surface-variant leading-relaxed font-body-md text-body-md space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="border-t border-on-surface/10 pt-6 mt-8 flex flex-wrap items-center gap-2">
              <Tag size={14} className="text-on-surface-variant/60" />
              <span className="text-xs text-on-surface-variant/60 font-semibold mr-2">TAGS:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-surface-container border border-on-surface/10 px-2.5 py-1 rounded text-xs text-on-surface-variant font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar / Related Posts (4 cols on desktop) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low border border-on-surface/10 rounded-lg p-6">
            <h3 className="font-title-lg text-title-lg text-primary border-b border-on-surface/10 pb-3 mb-4">
              Related Analysis
            </h3>
            
            {relatedPosts.length > 0 ? (
              <div className="space-y-4">
                {relatedPosts.map((rPost) => (
                  <Link 
                    key={rPost.id} 
                    href={`/blog/${rPost.slug}`}
                    className="group border-b border-on-surface/5 pb-4 last:border-b-0 last:pb-0 block cursor-pointer"
                  >
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block mb-1">
                      {rPost.category}
                    </span>
                    <span
                      className="font-semibold text-sm text-primary group-hover:text-secondary leading-tight block line-clamp-2 transition-colors"
                    >
                      {rPost.title}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant/80 font-semibold">No matching category logs found.</p>
            )}
          </div>

          {/* CTA Widget */}
          <div className="bg-primary text-on-primary rounded-lg p-6 relative overflow-hidden flex flex-col gap-4 shadow-sm">
            <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
            <h4 className="font-title-lg text-on-primary font-bold relative z-10 leading-tight">
              Sourcing Support
            </h4>
            <p className="text-xs text-on-primary/80 relative z-10 leading-relaxed">
              Connect with our procurement experts for specifications sheets and crop yield trends.
            </p>
            <Link 
              href="/contact" 
              className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-4 py-2.5 rounded hover:opacity-90 transition-all text-center relative z-10 block"
            >
              Consult Sourcing Specialist
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
