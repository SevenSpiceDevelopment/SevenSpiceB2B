import Link from "next/link";
import { getSiteSettings, getProducts, getBlogPosts } from "@/lib/db";
import { ArrowRight, Tag } from "lucide-react";
import AnimatedStat from "@/components/AnimatedStat";
import TrustSignals from "@/components/TrustSignals";
import { cookies } from "next/headers";
import { t, translateProducts, translateBlogPosts } from "@/lib/translations";
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel";
import MobileCardCarousel from "@/components/MobileCardCarousel";
import ProductApplicationsCollage from "@/components/ProductApplicationsCollage";

export default async function HomePage() {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [settings, rawProducts, rawBlogPosts] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getBlogPosts(),
  ]);
  const businessPhone = settings?.business_phone || "+1 (800) 555-SPICE";
  const businessEmail = settings?.business_email || "sales@thesevenspice.com";

  // Translate database objects dynamically if locale is 'ur'
  const products = translateProducts(rawProducts, locale);
  const blogPosts = translateBlogPosts(rawBlogPosts, locale);

  // Get the single latest published blog post
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const featuredBlogPosts = blogPosts.slice(0, 3);

  // Show first 3 visible products as featured
  const featuredProducts = products.slice(0, 3);

  // Handle default site settings localizations
  const heroTitle = settings.hero_title === "Experience the Finest Fenugreek (Methi)"
    ? t("home_hero_title", locale)
    : settings.hero_title;

  const heroSubtitle = settings.hero_subtitle === "TheSevenSpice offers premium Fenugreek (Methi) seeds and powder, expertly sourced for exceptional freshness, rich aroma, and consistent quality—trusted by customers across local and global markets."
    ? t("home_hero_subtitle", locale)
    : settings.hero_subtitle;

  const heroCtaText = settings.hero_cta_text === "Submit Wholesale Inquiry"
    ? t("home_hero_cta", locale)
    : settings.hero_cta_text;

  const trustCards = [
    {
      title: t("home_trust_card1_title", locale),
      desc: t("home_trust_card1_desc", locale),
      pill: locale === "ur" ? "تصدیق شدہ کوالٹی" : "ISO 3632 Sourcing"
    },
    {
      title: t("home_trust_card2_title", locale),
      desc: t("home_trust_card2_desc", locale),
      pill: locale === "ur" ? "عالمی لاجسٹکس" : "Global Logistics"
    },
    {
      title: t("home_trust_card3_title", locale),
      desc: t("home_trust_card3_desc", locale),
      pill: locale === "ur" ? "کسٹم پروسیسنگ" : "Custom Processing"
    }
  ];

  const faqList = [
    { q: t("home_faq_q1", locale), a: t("home_faq_a1", locale) },
    { q: t("home_faq_q2", locale), a: t("home_faq_a2", locale) },
    { q: t("home_faq_q3", locale), a: t("home_faq_a3", locale) },
    { q: t("home_faq_q4", locale), a: t("home_faq_a4", locale) }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section
        className="relative overflow-hidden py-20 md:py-32 bg-cover bg-center border-b border-on-surface/10"
        style={{ backgroundImage: `url('/images/remove_the_smoke_202604271432.jpeg')` }}
      >
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="max-w-3xl flex flex-col items-start gap-4 sm:gap-stack-md text-left">
            <span className="font-label-md text-[10px] xs:text-xs md:text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded border border-secondary-fixed/20">
              {t("home_hero_span", locale)}
            </span>
            <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-display-lg font-bold text-white tracking-tight leading-tight [overflow-wrap:anywhere] break-words">
              {heroTitle}
            </h1>
            <p className="text-xs sm:text-base md:text-body-lg text-white/85 max-w-2xl leading-relaxed">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <Link
                href={settings.hero_cta_link || "/contact"}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs sm:text-label-md px-6 py-3.5 sm:px-8 sm:py-4 rounded hover:opacity-90 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                {heroCtaText}
                <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
              </Link>
              <Link
                href="/products"
                className="border border-white/40 text-white font-label-md text-xs sm:text-label-md px-6 py-3.5 sm:px-8 sm:py-4 rounded hover:bg-white/10 transition-all text-center flex items-center justify-center"
              >
                {t("home_hero_browse", locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 2. TRUST SIGNALS SECTION */}
      <section className="relative py-16 sm:py-20 bg-surface-container-low border-b border-on-surface/5 overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-4">
              {t("home_trust_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home_trust_subtitle", locale)}
            </p>
          </div>

          <TrustSignals cards={trustCards} />
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-2">
                {t("home_featured_title", locale)}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                {t("home_featured_subtitle", locale)}
              </p>
            </div>
            <Link href="/products" className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 border-b border-primary pb-1 font-label-md">
              {t("home_featured_view_all", locale)} <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <FeaturedProductCarousel
              products={featuredProducts}
              locale={locale}
              businessPhone={businessPhone}
              businessEmail={businessEmail}
            />
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter">
              <p className="col-span-3 text-center text-on-surface-variant py-12">
                {t("home_featured_no_products", locale)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST BLOG SECTION */}
      {featuredBlogPosts.length > 0 && (
        <section className="py-20 bg-background border-b border-on-surface/10 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
                {t("home_blog_span", locale)}
              </span>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mt-4 mb-2">
                {t("home_blog_title", locale)}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("home_blog_subtitle", locale)}
              </p>
            </div>

            <MobileCardCarousel count={featuredBlogPosts.length} className="home-blog-cards">
              {featuredBlogPosts.map((post) => {
                const plainText = post.content
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();
                const excerpt = plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;

                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="w-[85vw] max-w-[85vw] min-w-[85vw] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] snap-start shrink-0 md:w-auto md:max-w-none md:min-w-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(87,0,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-left outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none min-h-[440px] shadow-sm"
                  >
                    <article className="flex flex-col justify-between h-full">
                      <div className="min-w-0 flex flex-col flex-grow">
                        {/* 1. SEAMLESS IMAGE CANVAS (Zero image border) */}
                        <div className="relative p-4 sm:p-5 pb-2">
                          <div className="relative w-full h-44 sm:h-50 rounded-xl sm:rounded-2xl overflow-hidden bg-surface-container-high/40 flex items-center justify-center">
                            <img
                              src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            {post.category && (
                              <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-secondary-fixed text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                                <Tag size={10} className="text-secondary-fixed" />
                                <span>{post.category}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 2. BLOG CONTENT */}
                        <div className="p-5 sm:p-6 pt-3 flex-grow flex flex-col justify-between gap-4">
                          <div className="space-y-2">
                            <h3 className="font-title-lg text-lg sm:text-xl font-bold text-primary leading-snug line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                              {post.title}
                            </h3>
                            {excerpt && (
                              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                                {excerpt}
                              </p>
                            )}
                          </div>

                          {/* 3. POLISHED READ ARTICLE BUTTON */}
                          <div className="pt-2">
                            <div className="w-full bg-primary text-on-primary group-hover:bg-primary/90 py-3 px-4 rounded-xl text-center font-label-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md transition-all duration-200">
                              <span>{t("home_blog_read_post", locale)}</span>
                              <ArrowRight size={14} className={locale === "ur" ? "rotate-180" : "group-hover:translate-x-1 transition-transform"} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </MobileCardCarousel>
          </div>
        </section>
      )}

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-20 bg-surface-container-low border-t border-b border-on-surface/10 relative overflow-hidden bg-subtle-pattern">
        <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
          <span className="text-secondary font-bold text-5xl font-serif">“</span>
          <p className="font-headline-md-mobile md:font-headline-md text-primary italic mb-8 -mt-2 leading-relaxed">
            {t("home_testimonial_text", locale)}
          </p>
          <div>
            <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">{t("home_testimonial_author", locale)}</h4>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mt-1.5">
              {t("home_testimonial_role", locale)}
            </p>
          </div>
        </div>
      </section>

      {/* 4.5. WHERE OUR PRODUCTS ARE USED (INDUSTRIES & APPLICATIONS COLLAGE) */}
      <ProductApplicationsCollage
        locale={locale}
        translations={{
          home_applications_span: t("home_applications_span", locale),
          home_applications_title: t("home_applications_title", locale),
          home_applications_subtitle: t("home_applications_subtitle", locale),
          home_app1_title: t("home_app1_title", locale),
          home_app1_desc: t("home_app1_desc", locale),
          home_app1_pill: t("home_app1_pill", locale),
          home_app2_title: t("home_app2_title", locale),
          home_app2_desc: t("home_app2_desc", locale),
          home_app2_pill: t("home_app2_pill", locale),
          home_app3_title: t("home_app3_title", locale),
          home_app3_desc: t("home_app3_desc", locale),
          home_app3_pill: t("home_app3_pill", locale),
          home_app4_title: t("home_app4_title", locale),
          home_app4_desc: t("home_app4_desc", locale),
          home_app4_pill: t("home_app4_pill", locale),
          home_app5_title: t("home_app5_title", locale),
          home_app5_desc: t("home_app5_desc", locale),
          home_app5_pill: t("home_app5_pill", locale),
        }}
      />

      {/* 5. CTA SECTION */}
      <section
        className="py-24 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGs7PSssUtW3maoaQQQ10GCm2EfzCCJxZWGMdIi_UYtw&s=10')` }}
      >
        {/* Deep brand overlay for rich contrast and legibility */}
        <div className="absolute inset-0 bg-primary/70 z-0"></div>
        <div className="absolute inset-0 bg-subtle-pattern opacity-10 z-0"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10 flex flex-col items-center gap-6">
          <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-secondary-fixed/20">
            {t("home_cta_span", locale)}
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary max-w-3xl leading-tight">
            {t("home_cta_title", locale)}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl">
            {t("home_cta_desc", locale)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {t("home_cta_sales", locale)}
              <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
            </Link>
            <a
              href={`tel:${settings.business_phone}`}
              className="border border-on-primary/30 text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-on-primary/10 transition-all flex items-center justify-center gap-2"
            >
              {t("home_cta_call", locale)} {settings.business_phone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-surface-container-low border-t border-b border-on-surface/5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-4">
              {t("home_faq_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home_faq_subtitle", locale)}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqList.map((faq, index) => (
              <details key={index} className="group bg-surface border border-on-surface/10 rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:shadow-md">
                <summary className="flex justify-between items-center font-bold text-primary cursor-pointer list-none select-none">
                  <span className="font-title-lg text-sm sm:text-base pr-4 text-left">{faq.q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180 shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-on-surface/5 text-sm sm:text-base text-on-surface-variant leading-relaxed text-left">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
