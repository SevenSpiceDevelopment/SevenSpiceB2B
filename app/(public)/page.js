import Link from "next/link";
import { getSiteSettings, getProducts, getBlogPosts } from "@/lib/db";
import { ShieldCheck, Truck, Droplets, ArrowRight } from "lucide-react";
import AnimatedStat from "@/components/AnimatedStat";
import { cookies } from "next/headers";
import { t, translateProducts, translateBlogPosts } from "@/lib/translations";

export default async function HomePage() {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const [settings, rawProducts, rawBlogPosts] = await Promise.all([
    getSiteSettings(),
    getProducts(),
    getBlogPosts(),
  ]);

  // Translate database objects dynamically if locale is 'ur'
  const products = translateProducts(rawProducts, locale);
  const blogPosts = translateBlogPosts(rawBlogPosts, locale);

  // Get the single latest published blog post
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const featuredBlogPosts = blogPosts.slice(0, 3);

  // Show first 3 visible products as featured
  const featuredProducts = products.slice(0, 3);

  // Handle default site settings localizations
  const heroTitle = settings.hero_title === "Exquisite Spices sourced globally, delivered reliably."
    ? t("home_hero_title", locale)
    : settings.hero_title;

  const heroSubtitle = settings.hero_subtitle === "Partner with TheSevenSpice for premium bulk imports, custom formulations, and seamless international logistics."
    ? t("home_hero_subtitle", locale)
    : settings.hero_subtitle;

  const heroCtaText = settings.hero_cta_text === "Submit Wholesale Inquiry"
    ? t("home_hero_cta", locale)
    : settings.hero_cta_text;

  const trustSignals = [
    {
      icon: <ShieldCheck className="text-secondary w-8 h-8" />,
      title: t("home_trust_card1_title", locale),
      desc: t("home_trust_card1_desc", locale)
    },
    {
      icon: <Truck className="text-secondary w-8 h-8" />,
      title: t("home_trust_card2_title", locale),
      desc: t("home_trust_card2_desc", locale)
    },
    {
      icon: <Droplets className="text-secondary w-8 h-8" />,
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

      {/* HERITAGE & QUALITY SECTION */}
      <section className="py-16 md:py-24 bg-background border-b border-on-surface/10 overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-4">
                {t("home_heritage_span", locale)}
              </span>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-6 leading-tight">
                {t("home_heritage_title", locale)}
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                {t("home_heritage_p1", locale)}
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                {t("home_heritage_p2", locale)}
              </p>

              {/* Statistics Grid */}
              <div className="flex flex-row gap-12 sm:gap-16 pt-4 border-t border-on-surface/10">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    <AnimatedStat targetValue={0} startValue={0} suffix="%" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {t("home_stats_adulterants", locale)}
                  </div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    <AnimatedStat targetValue={100} startValue={0} suffix="%" />
                  </div>
                  <div className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    {t("home_stats_organic", locale)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image and Overlapping Card */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-12 mb-8 lg:mb-0 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none h-96">
                {/* Methi Featured Product Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl h-full w-full">
                  <img
                    src="/images/Methi%20Featured%20Product%20Image.jpg"
                    alt="Methi (Fenugreek) featured product representing premium quality spice standards"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping Promise Card */}
                <div className="absolute -bottom-8 left-6 md:-bottom-12 md:-left-12 bg-gradient-to-br from-white/90 via-white/80 to-white/50 backdrop-blur-lg p-6 rounded-xl border border-white/50 shadow-[0_20px_50px_rgba(87,0,19,0.15)] max-w-[280px] sm:max-w-xs transition-transform hover:scale-[1.02] duration-300 z-10">
                  <h3 className="font-serif text-lg font-bold text-primary mb-1.5">
                    {t("home_promise_title", locale)}
                  </h3>
                  <p className="font-serif italic text-on-surface-variant text-sm leading-relaxed">
                    {t("home_promise_desc", locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST SIGNALS SECTION */}
      <section className="py-16 bg-surface-container-low border-b border-on-surface/5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-4">
              {t("home_trust_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home_trust_subtitle", locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {trustSignals.map((signal, index) => (
              <div key={index} className="bg-surface-container-lowest border border-on-surface/10 rounded-lg p-8 hover:shadow-[0_8px_30px_rgba(26,26,26,0.03)] transition-all duration-300 flex flex-col gap-4">
                <div className="p-3 bg-surface rounded-lg w-fit">
                  {signal.icon}
                </div>
                <h3 className="font-title-lg text-title-lg text-primary">{signal.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{signal.desc}</p>
              </div>
            ))}
          </div>
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
                <Link
                  key={product.id}
                  href={`/products?quoteProduct=${encodeURIComponent(product.name)}&productId=${product.id}`}
                  className="min-w-[85vw] sm:min-w-[320px] snap-align-center md:min-w-0 flex-shrink-0 bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300 group cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative bg-surface-container">
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-on-secondary text-xs uppercase tracking-wider font-bold px-3 py-1 rounded">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-title-lg text-title-lg text-primary line-clamp-1 group-hover:text-primary transition-colors font-bold">{product.name}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3">{product.description}</p>
                    </div>
                    <div className="border-t border-on-surface/5 pt-4 w-full">
                      {(product.packaging_info || product.price_moq) && (
                        <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant/80 mb-4">
                          {product.packaging_info ? <span>{product.packaging_info}</span> : <span></span>}
                          {product.price_moq ? <span className="text-primary font-bold">{product.price_moq}</span> : <span></span>}
                        </div>
                      )}
                      <span
                        className="w-full bg-secondary-container text-on-secondary-container py-3 rounded text-center font-label-md hover:opacity-90 group-hover:opacity-90 transition-all block text-sm"
                      >
                        {t("home_featured_request_quote", locale)}
                      </span>
                    </div>
                  </div>
                </Link>
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
                    <div className="absolute top-4 left-4 bg-primary text-on-primary text-xs uppercase tracking-wider font-bold px-3 py-1 rounded">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-on-surface-variant/70 block">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString(locale === "ur" ? 'ur-PK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(post.created_at).toLocaleDateString(locale === "ur" ? 'ur-PK' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <h3 className="font-title-lg text-title-lg text-primary line-clamp-2 group-hover:text-primary transition-colors font-bold">{post.title}</h3>
                      <div
                        className="text-sm text-on-surface-variant line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                    <div className="border-t border-on-surface/5 pt-4 w-full flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-semibold text-on-surface-variant/80 uppercase tracking-widest">{t("home_blog_written_by", locale)}</p>
                        <p className="text-xs font-semibold text-primary mt-0.5">{post.author}</p>
                      </div>
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
