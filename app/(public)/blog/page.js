import Link from "next/link";
import { getBlogPosts } from "@/lib/db";
import { Calendar, User, ArrowRight, BookOpen, Tag } from "lucide-react";
import MobileCardCarousel from "@/components/MobileCardCarousel";

export const metadata = {
  title: "Industry Insights & Global Trade Blog",
  description: "Read updates on spice trade logistics, crop yields, import standards, safety regulations, and wholesale purchasing playbooks."
};

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex-grow flex flex-col pt-stack-lg pb-stack-lg w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-stack-lg">
      {/* Header Section */}
      <header className="text-center md:text-left max-w-3xl">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
          The Seven Spice Blog
        </span>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mt-4 mb-stack-sm">
          Industry Insights & Sourcing Intelligence
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Stay informed with reports on spice logistics, regulatory shifts, market forecasts, and crop-sourcing compliance guidelines directly from our regional buyers.
        </p>
      </header>

      {/* Main Grid */}
      <MobileCardCarousel count={posts.length} className="mt-4 compact-cards md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => {
            // Strip HTML to make excerpt
            const plainText = post.content
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim();
            const excerpt = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;

            const dateStr = post.published_at 
              ? new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) 
              : "Draft";

            return (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className="w-[85vw] max-w-[85vw] min-w-[85vw] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] snap-start flex-shrink-0 md:w-auto md:max-w-none md:min-w-0 bg-surface-container-lowest border border-on-surface/10 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(26,26,26,0.04)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 h-full"
              >
                <article className="flex flex-col justify-between h-full">
                  <div className="min-w-0 flex flex-col flex-grow">
                    {/* Thumbnail */}
                    <div className="h-60 overflow-hidden relative bg-surface-container-high border-b border-on-surface/10 shrink-0">
                      <img 
                        src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
                          <Tag size={10} /> {post.category}
                        </span>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="min-w-0 p-6 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant/70 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} /> {post.author.split(",")[0]}
                          </span>
                        </div>

                        <h3 className="min-w-0 font-title-lg text-title-lg text-primary font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors break-words [overflow-wrap:anywhere]">
                          {post.title}
                        </h3>

                        <p className="min-w-0 text-on-surface-variant text-sm leading-relaxed line-clamp-3 break-words [overflow-wrap:anywhere]">
                          {excerpt}
                        </p>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary pt-2">
                        Read Full Article
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })
        ) : (
          <div className="w-full flex-shrink-0 col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-lg">
            <BookOpen size={40} className="text-on-surface-variant/40 mx-auto mb-2" />
            <p className="font-body-lg text-on-surface-variant">No blog posts published yet.</p>
          </div>
        )}
      </MobileCardCarousel>
    </div>
  );
}
