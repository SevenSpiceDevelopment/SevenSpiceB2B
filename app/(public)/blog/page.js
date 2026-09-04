import Link from "next/link";
import Image from "next/image";
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
      <header className="text-center md:text-left max-w-3xl animate-fade-in-up">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
          The Seven Spice Blog
        </span>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mt-4 mb-stack-sm font-bold">
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
                className="reveal-on-scroll w-[85vw] max-w-[85vw] min-w-[85vw] xs:w-[280px] xs:max-w-[280px] xs:min-w-[280px] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] snap-start shrink-0 md:w-full md:max-w-none md:min-w-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(87,0,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-left outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none shadow-sm border border-on-surface/5 h-full"
              >
                <article className="flex flex-col justify-between h-full">
                  <div className="min-w-0 flex flex-col flex-grow">
                    {/* 1. SEAMLESS THUMBNAIL CANVAS (Proportional aspect ratio) */}
                    <div className="relative p-3.5 sm:p-4 pb-2">
                      <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-surface-container-high/40 flex items-center justify-center">
                        <Image
                          src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                          alt={post.title || "Blog post"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={90}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {post.category && (
                          <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-1 bg-black/65 backdrop-blur-md text-secondary-fixed text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full shadow-xs max-w-[80%] truncate">
                            <Tag size={10} className="text-secondary-fixed shrink-0" />
                            <span className="truncate">{post.category}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. BLOG CONTENT */}
                    <div className="p-4 sm:p-5 pt-2 flex-grow flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant/70 font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {dateStr}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} /> {post.author.split(",")[0]}
                          </span>
                        </div>

                        <h3 className="text-slate-900 font-bold text-base sm:text-lg md:text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                          {excerpt}
                        </p>
                      </div>

                      {/* 3. POLISHED ACTION PILL BUTTON */}
                      <div className="pt-2">
                        <div className="w-full bg-primary hover:bg-primary/90 text-white py-3 sm:py-3.5 px-4 rounded-full text-center text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-200">
                          <span>Read Full Article</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
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
