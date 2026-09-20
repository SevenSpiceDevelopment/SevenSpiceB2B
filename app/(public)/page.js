import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getProducts, getBlogPosts } from "@/lib/db";
import { ArrowRight, Tag } from "lucide-react";
import AnimatedStat from "@/components/AnimatedStat";
import TrustSignals from "@/components/TrustSignals";
import { cookies } from "next/headers";
import { t, translateProducts, translateBlogPosts } from "@/lib/translations";
import FeaturedProductCarousel from "@/components/FeaturedProductCarousel";
import MobileCardCarousel from "@/components/MobileCardCarousel";
import ProductApplicationsCollage from "@/components/ProductApplicationsCollage";
import StatsBanner from "@/components/StatsBanner";
import HeroSection from "@/components/HeroSection";
import CertificationsSection from "@/components/CertificationsSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Show first 6 visible products as featured
  const featuredProducts = products.slice(0, 6);

  // Handle default site settings localizations
  const heroTitle = locale === "ur"
    ? t("home_hero_title", "ur")
    : (settings.hero_title || t("home_hero_title", "en"));

  const heroSubtitle = locale === "ur"
    ? t("home_hero_subtitle", "ur")
    : (settings.hero_subtitle || t("home_hero_subtitle", "en"));

  const heroCtaText = locale === "ur"
    ? t("home_hero_cta", "ur")
    : (settings.hero_cta_text || t("home_hero_cta", "en"));

  const trustCards = [
    {
      title: t("home_trust_card1_title", locale),
      desc: t("home_trust_card1_desc", locale),
    },
    {
      title: t("home_trust_card2_title", locale),
      desc: t("home_trust_card2_desc", locale),
    },
    {
      title: t("home_trust_card3_title", locale),
      desc: t("home_trust_card3_desc", locale),
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
      {/* 1. HERO SECTION (MATCHING SAMPLE OVERHEAD FLAT-LAY DESIGN) */}
      <HeroSection
        locale={locale}
        heroSpan={t("home_hero_span", locale)}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroCtaText={heroCtaText}
        heroBrowseText={t("home_hero_browse", locale)}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
      />

      {/* 2. TRUST SIGNALS / OUR EXPORT CAPABILITIES (QUALITY ASSURANCE, LOGISTICS, PACKAGING) */}
      <section className="relative py-16 sm:py-24 bg-[#faf7f2] border-b border-[#ebdcc9]/60 overflow-hidden">
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <TrustSignals
            eyebrow={t("home_trust_eyebrow", locale)}
            title={t("home_trust_title", locale)}
            subtitle={t("home_trust_subtitle", locale)}
            cards={trustCards}
            locale={locale}
          />
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 reveal-on-scroll">
            <div>
              {/* Eyebrow in Gold with wide tracking */}
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#a67c2e] inline-block mb-1.5">
                {locale === "ur" ? "• مصنوعات کا انتخاب •" : "• GLOBAL SPICE PORTFOLIO •"}
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl md:text-[34px] font-extrabold text-primary tracking-tight leading-snug">
                {t("home_featured_title", locale)}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed mt-2 max-w-xl">
                {t("home_featured_subtitle", locale)}
              </p>
            </div>
            <Link href="/products" className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1.5 border-b-2 border-primary pb-1 font-sans text-sm tracking-wide shrink-0">
              <span>{t("home_featured_view_all", locale)}</span> <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="reveal-on-scroll delay-150">
              <FeaturedProductCarousel
                products={featuredProducts}
                locale={locale}
                businessPhone={businessPhone}
                businessEmail={businessEmail}
              />
            </div>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter">
              <p className="col-span-3 text-center text-on-surface-variant py-12">
                {t("home_featured_no_products", locale)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3.5. CERTIFICATIONS & EXPORT STANDARDS SHOWCASE */}
      <CertificationsSection locale={locale} />

      {/* LATEST BLOG SECTION */}
      {featuredBlogPosts.length > 0 && (
        <section className="py-20 bg-background border-b border-on-surface/10 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-12 reveal-on-scroll">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#a67c2e]">
                {t("home_blog_span", locale)}
              </span>
              {/* Minimalist Divider */}
              <div className="flex items-center justify-center my-3 sm:my-3.5">
                <span className="h-[1.5px] w-12 bg-[#d8c5a4]/80 rounded-full" />
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl md:text-[34px] font-extrabold text-primary tracking-tight leading-snug">
                {t("home_blog_title", locale)}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed mt-2.5 max-w-xl">
                {t("home_blog_subtitle", locale)}
              </p>
            </div>

            <div className="reveal-on-scroll delay-150">
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
                              <Image
                                src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                                alt={post.title || "Blog post"}
                                fill
                                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 320px, 380px"
                                quality={90}
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                              <h3 className="text-slate-900 font-bold text-lg sm:text-xl leading-snug line-clamp-2 group-hover:text-primary transition-colors tracking-tight">
                                {post.title}
                              </h3>
                              {excerpt && (
                                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2">
                                  {excerpt}
                                </p>
                              )}
                            </div>

                            {/* 3. POLISHED READ ARTICLE PILL BUTTON */}
                            <div className="pt-2">
                              <div className="w-full bg-primary hover:bg-primary/90 text-white py-3 sm:py-3.5 px-4 rounded-full text-center text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-200">
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
          </div>
        </section>
      )}

      {/* 4. COMMERCIAL RESULTS & PERFORMANCE STATS BANNER */}
      <section className="py-16 sm:py-24 bg-[#faf7f2] border-b border-[#ebdcc9]/60 overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <StatsBanner
            locale={locale}
            businessPhone={businessPhone}
            businessEmail={businessEmail}
          />
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
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

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10 flex flex-col items-center gap-6 reveal-on-scroll">
          <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-secondary-fixed/20">
            {t("home_cta_span", locale)}
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl md:text-[36px] font-extrabold text-on-primary max-w-2xl leading-snug">
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
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#a67c2e]">
              {locale === "ur" ? "اکثر پوچھے گئے سوالات" : "COMMON INQUIRIES"}
            </span>
            {/* Minimalist Divider */}
            <div className="flex items-center justify-center my-3 sm:my-3.5">
              <span className="h-[1.5px] w-12 bg-[#d8c5a4]/80 rounded-full" />
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl md:text-[34px] font-extrabold text-primary tracking-tight leading-snug mb-2">
              {t("home_faq_title", locale)}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed">
              {t("home_faq_subtitle", locale)}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqList.map((faq, index) => (
              <details key={index} className={`reveal-on-scroll ${index === 0 ? "delay-75" : index === 1 ? "delay-150" : index === 2 ? "delay-200" : "delay-300"} group bg-surface border border-on-surface/10 rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:shadow-md hover:border-primary/30`}>
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
