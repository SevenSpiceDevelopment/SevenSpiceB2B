import Link from "next/link";
import { getSiteSettings, getProducts, getBlogPosts } from "@/lib/db";
import { ShieldCheck, Truck, Droplets, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const products = await getProducts();
  const blogPosts = await getBlogPosts();
  
  // Get the single latest published blog post
  const latestPost = blogPosts.length > 0 ? blogPosts[0] : null;
  
  // Show first 3 visible products as featured
  const featuredProducts = products.slice(0, 3);

  const trustSignals = [
    {
      icon: <ShieldCheck className="text-secondary w-8 h-8" />,
      title: "Grade-A Certified Sourcing",
      desc: "All spices undergo thorough ISO 3632 testing for purity, coloring strength, and oil content. Direct origin verification protocols protect your brand."
    },
    {
      icon: <Truck className="text-secondary w-8 h-8" />,
      title: "Logistical Precision",
      desc: "Temperature-controlled cargo configurations and specialized moisture-barrier containers safeguard products during long transit cycles."
    },
    {
      icon: <Droplets className="text-secondary w-8 h-8" />,
      title: "Custom Formulation",
      desc: "From specific volatile oil concentrations to custom spice grinds and private-label packaging, our food scientists deliver precisely to your specs."
    }
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
              Global Wholesale Supplier
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white tracking-tight leading-tight">
              {settings.hero_title || "Exquisite Spices sourced globally, delivered reliably."}
            </h1>
            <p className="font-body-lg text-body-lg text-white/85 max-w-2xl">
              {settings.hero_subtitle || "Partner with TheSevenSpice for premium bulk imports, custom formulations, and seamless international logistics."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link 
                href={settings.hero_cta_link || "/contact"} 
                className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-primary/90 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
              >
                {settings.hero_cta_text || "Submit Wholesale Inquiry"}
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/products" 
                className="border border-white/40 text-white font-label-md text-label-md px-8 py-4 rounded hover:bg-white/10 transition-all text-center flex items-center justify-center"
              >
                Browse Catalog
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
                Our Heritage & Standards
              </span>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-6 leading-tight">
                Bridging Ancient Alchemy with Modern Purity
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                At TheSevenSpice, we believe spices are more than ingredients—they are the soul of the kitchen. Our journey begins in the remote spice gardens of the Malabar Coast and the high valleys of Kashmir.
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                We combine traditional stone-grinding techniques that preserve essential oils with cutting-edge lab testing for 100% purity. No fillers, no artificial colors—just the raw, vibrant power of nature.
              </p>

              {/* Statistics Grid */}
              <div className="flex flex-row gap-12 sm:gap-16 pt-4 border-t border-on-surface/10">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    0%
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    Adulterants
                  </div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    100%
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-on-surface-variant font-bold">
                    Organic Sourcing
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Image and Overlapping Card */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-12 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Turmeric Mortar Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[5/4] w-full">
                  <img
                    src="/images/turmeric_mortar.png"
                    alt="Turmeric powder in a stone mortar and pestle representing ancient spice purity standards"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping Promise Card */}
                <div className="absolute -bottom-8 left-6 md:-bottom-12 md:-left-12 bg-gradient-to-br from-white/90 via-white/80 to-white/50 backdrop-blur-lg p-6 rounded-xl border border-white/50 shadow-[0_20px_50px_rgba(87,0,19,0.15)] max-w-[280px] sm:max-w-xs transition-transform hover:scale-[1.02] duration-300">
                  <h3 className="font-serif text-lg font-bold text-primary mb-1.5">
                    Our Promise
                  </h3>
                  <p className="font-serif italic text-on-surface-variant text-sm leading-relaxed">
                    'From the earth to your hearth, we ensure every grain tells a story of integrity.'
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
              Enterprise-Grade Quality & Logistics
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We close the gap between agricultural producers and global food distributors through strict quality-control layers.
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
      <section className="py-20 bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-2">
                Featured Product Catalog
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Sourced from certified growers, cleaned and packed under high sanitary standards.
              </p>
            </div>
            <Link href="/products" className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 border-b border-primary pb-1 font-label-md">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products?quoteProduct=${encodeURIComponent(product.name)}&productId=${product.id}`}
                  className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300 group cursor-pointer"
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
                      <h3 className="font-title-lg text-title-lg text-primary line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3">{product.description}</p>
                    </div>
                    <div className="border-t border-on-surface/5 pt-4 w-full">
                      {(product.packaging_info || product.price_moq) && (
                        <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant/80 mb-4">
                          {product.packaging_info ? <span>Pack: {product.packaging_info}</span> : <span></span>}
                          {product.price_moq ? <span className="text-primary font-bold">{product.price_moq}</span> : <span></span>}
                        </div>
                      )}
                      <span 
                        className="w-full bg-primary text-on-primary py-3 rounded text-center font-label-md group-hover:bg-primary/90 transition-colors block text-sm"
                      >
                        Request Quote
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-on-surface-variant py-12">No products loaded yet. Create them in the Admin Dashboard!</p>
            )}
          </div>
        </div>
      </section>

      {/* LATEST BLOG SECTION */}
      {latestPost && (
        <section className="py-20 bg-background border-b border-on-surface/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded">
                Supply Chain Journal
              </span>
              <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mt-4 mb-2">
                Latest Logistics & Industry Update
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Stay informed with direct sourcing reports, regulatory updates, and global market analyses.
              </p>
            </div>

            <div className="bg-surface border border-on-surface/10 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="h-64 md:h-auto min-h-[280px] overflow-hidden relative bg-surface-container">
                  <img
                    src={latestPost.featured_image || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                    alt={latestPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-primary text-on-primary text-xs uppercase tracking-wider font-bold px-3 py-1 rounded">
                    {latestPost.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-on-surface-variant/70 block">
                      Published: {latestPost.published_at ? new Date(latestPost.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(latestPost.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <h3 className="font-title-lg text-xl md:text-2xl text-primary font-bold line-clamp-2 leading-tight group-hover:text-primary/90 transition-colors">
                      {latestPost.title}
                    </h3>
                    <div 
                      className="text-on-surface-variant text-sm md:text-base line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: latestPost.content }}
                    />
                  </div>

                  <div className="border-t border-on-surface/5 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs font-mono text-on-surface-variant/80 uppercase tracking-widest">Written By</p>
                      <p className="text-sm font-semibold text-primary mt-0.5">{latestPost.author}</p>
                    </div>
                    <Link
                      href={`/blog/${latestPost.slug}`}
                      className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 border-b border-primary pb-1 text-sm font-label-md shrink-0"
                    >
                      Read Full Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-20 bg-surface-container-low border-t border-b border-on-surface/10 relative overflow-hidden bg-subtle-pattern">
        <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
          <span className="text-secondary font-bold text-5xl font-serif">“</span>
          <p className="font-headline-md-mobile md:font-headline-md text-primary italic mb-8 -mt-2 leading-relaxed">
            TheSevenSpice has transformed our procurement. Their shipping compliance verification and consistent grade profiles mean zero delays at customs and absolute flavor stability.
          </p>
          <div>
            <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">David Jenkins</h4>
            <p className="text-sm text-on-surface-variant font-mono uppercase tracking-widest mt-1">
              VP of Operations, Global Seasoning Ltd (London)
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
            Global Bulk Distribution
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary max-w-3xl leading-tight">
            Ready to secure your global spice supply chains?
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/80 max-w-2xl">
            Get in touch with our B2B account managers today to establish bulk pricing, custom product testing specifications, or logistical contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link 
              href="/contact" 
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Contact Sales Team
              <ArrowRight size={16} />
            </Link>
            <a 
              href={`tel:${settings.business_phone}`}
              className="border border-on-primary/30 text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-on-primary/10 transition-all flex items-center justify-center gap-2"
            >
              Call {settings.business_phone}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-surface-container-low border-t border-b border-on-surface/5">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Quick answers to common inquiries regarding wholesale logistics, grading standards, and custom formulations.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "What is your Minimum Order Quantity (MOQ)?",
                a: "Our MOQ varies by category. For premium spices like Kashmiri Saffron, orders start at 500 grams. For whole peppercorns, cardamom, and seeds, MOQs typically range from 100 kg to 250 kg. We also offer sample packs for registered commercial accounts."
              },
              {
                q: "Do you provide Certificate of Analysis (CoA) reports?",
                a: "Yes. Every shipment is accompanied by a Certificate of Analysis (CoA) from accredited laboratories. We test for active compound concentrations (e.g., piperine in black pepper, curcumin in turmeric), moisture thresholds, volatile oil content, and microbiological compliance."
              },
              {
                q: "How do you handle shipping logistics and custom clearance?",
                a: "We offer FOB, CIF, and DDP shipping terms. Our B2B operations team coordinates ocean and air freight, completes phytosanitary registry clearances, manages import/export customs clearance forms, and utilizes moisture-barrier container configurations."
              },
              {
                q: "Can you manufacture custom spice formulations or private label packaging?",
                a: "Absolutely. Our processing facility features custom grinding lines to achieve specific mesh sizes, and custom blending drums for proprietary recipes. We also support private labeling with vacuum-sealed packaging configurations from 1kg bags to export cartons."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-surface border border-on-surface/10 rounded-lg p-5 [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:shadow-md">
                <summary className="flex justify-between items-center font-bold text-primary cursor-pointer list-none select-none">
                  <span className="font-title-lg text-sm sm:text-base pr-4">{faq.q}</span>
                  <span className="transition-transform duration-300 group-open:rotate-180 shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-on-surface/5 text-sm sm:text-base text-on-surface-variant leading-relaxed">
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
