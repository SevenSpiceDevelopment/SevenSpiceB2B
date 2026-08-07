import Link from "next/link";
import { getSiteSettings, getProducts, getBlogPosts } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import AnimatedStat from "@/components/AnimatedStat";
import TrustSignals from "@/components/TrustSignals";
import { cookies } from "next/headers";
import { t, translateProducts, translateBlogPosts } from "@/lib/translations";
import FeaturedProductCard from "@/components/FeaturedProductCard";

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
      desc: t("home_trust_card1_desc", locale)
    },
    {
      title: t("home_trust_card2_title", locale),
      desc: t("home_trust_card2_desc", locale)
    },
    {
      title: t("home_trust_card3_title", locale),
      desc: t("home_trust_card3_desc", locale)
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
          <div className="max-w-3xl flex flex-col items-start gap-stack-md text-left">
            <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-secondary-fixed/20">
              {t("home_hero_span", locale)}
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white tracking-tight leading-tight">
              {heroTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-white/85 max-w-2xl">
              {heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link
                href={settings.hero_cta_link || "/contact"}
                className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                {heroCtaText}
                <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
              </Link>
              <Link
                href="/products"
                className="border border-white/40 text-white font-label-md text-label-md px-8 py-4 rounded hover:bg-white/10 transition-all text-center flex items-center justify-center"
              >
                {t("home_hero_browse", locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* 2. TRUST SIGNALS SECTION */}
      <section className="relative py-16 bg-surface-container-low border-b border-on-surface/5 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-95"
          style={{ backgroundImage: "url('/images/quality-logistics-background.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/68 to-white/82" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-transparent to-white/45" aria-hidden="true" />

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

          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <FeaturedProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  businessPhone={businessPhone}
                  businessEmail={businessEmail}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-on-surface-variant py-12">
                {t("home_featured_no_products", locale)}
              </p>
            )}
          </div>
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

            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter">
              {featuredBlogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="min-w-[85vw] sm:min-w-[320px] snap-align-center md:min-w-0 flex-shrink-0 bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-48 overflow-hidden relative bg-surface-container">
                    <img
                      src={post.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <h3 className="font-title-lg text-title-lg text-primary line-clamp-2 group-hover:text-primary transition-colors font-bold">{post.title}</h3>
                    <div className="border-t border-on-surface/5 pt-4 w-full flex justify-between items-center">
                      <span
                        className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 text-xs font-label-md"
                      >
                        {t("home_blog_read_post", locale)} <ArrowRight size={14} className={locale === "ur" ? "rotate-180" : ""} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
