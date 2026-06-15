import Link from "next/link";
import { getSiteSettings, getProducts } from "@/lib/db";
import { ShieldCheck, Truck, Droplets, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const products = await getProducts();
  
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
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1600')` }}
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
                <div key={product.id} className="bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300">
                  <div className="h-64 overflow-hidden relative bg-surface-container">
                    <img 
                      src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"} 
                      alt={product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-secondary text-on-secondary text-xs uppercase tracking-wider font-bold px-3 py-1 rounded">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-title-lg text-title-lg text-primary line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-on-surface-variant line-clamp-3">{product.description}</p>
                    </div>
                    <div className="border-t border-on-surface/5 pt-4">
                      {(product.packaging_info || product.price_moq) && (
                        <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant/80 mb-4">
                          {product.packaging_info ? <span>Pack: {product.packaging_info}</span> : <span></span>}
                          {product.price_moq ? <span className="text-primary font-bold">{product.price_moq}</span> : <span></span>}
                        </div>
                      )}
                      <Link 
                        href={`/products?quoteProduct=${encodeURIComponent(product.name)}&productId=${product.id}`}
                        className="w-full bg-primary text-on-primary py-3 rounded text-center font-label-md hover:bg-primary/90 transition-colors block text-sm"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-3 text-center text-on-surface-variant py-12">No products loaded yet. Create them in the Admin Dashboard!</p>
            )}
          </div>
        </div>
      </section>

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
      <section className="py-20 bg-primary text-on-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-pattern opacity-10"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10 flex flex-col items-center gap-6">
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
    </div>
  );
}
