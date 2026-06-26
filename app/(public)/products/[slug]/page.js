import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, Package, ShieldCheck, Truck, MapPin, BadgePercent } from "lucide-react";
import { getProductById as dbGetProductById, getProducts, getSiteSettings } from "@/lib/db";
import { t, translateProduct, translateProducts } from "@/lib/translations";
import { getProductIdFromSlug, getProductSlug } from "@/lib/productPaths";
import ProductQuoteButton from "@/components/ProductQuoteButton";

const getProductById = cache(dbGetProductById);

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: getProductSlug(product),
  }));
}

export async function generateMetadata({ params }) {
  const productId = getProductIdFromSlug(params.slug);
  if (!productId) return {};

  const product = await getProductById(productId);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description.substring(0, 160),
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }) {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const productId = getProductIdFromSlug(params.slug);

  if (!productId) {
    notFound();
  }

  const [rawProduct, rawProducts, settings] = await Promise.all([
    getProductById(productId),
    getProducts(),
    getSiteSettings(),
  ]);

  if (!rawProduct) {
    notFound();
  }

  const product = translateProduct(rawProduct, locale);
  const relatedProducts = translateProducts(
    rawProducts.filter((item) => item.id !== rawProduct.id && item.category === rawProduct.category),
    locale
  ).slice(0, 3);
  const salesEmail = settings?.business_email || "sales@thesevenspice.com";
  const descriptionPreview = (product.description || "").replace(/\s+/g, " ").trim();
  const summaryText = descriptionPreview
    ? descriptionPreview.length > 240
      ? `${descriptionPreview.slice(0, 240).trimEnd()}...`
      : descriptionPreview
    : "Commercial product details are available below for procurement teams and wholesale buyers.";

  const supplyHighlights = [
    {
      icon: Package,
      title: "Bulk-ready packaging",
      text: product.packaging_info || "Configured for wholesale transit and secure export handling.",
    },
    {
      icon: ShieldCheck,
      title: "Quality control",
      text: "Positioned for commercial buyers who need consistent grade, traceability, and dependable supply.",
    },
    {
      icon: Truck,
      title: "Export logistics",
      text: "Suitable for distributors, food manufacturers, and importers working across international freight channels.",
    },
  ];

  const buyerFit = [
    "Food manufacturers and private-label processors",
    "Wholesale distributors and importers",
    "Retail chains and specialty ingredient buyers",
    "Hospitality and catering supply teams",
  ];

  const commercialFacts = [
    { label: "Category", value: product.category },
    { label: "Packaging", value: product.packaging_info || "Available on request" },
    { label: "MOQ / Rate", value: product.price_moq || "Available on inquiry" },
  ];

  return (
    <div className="bg-background pb-stack-lg">
      <section className="relative overflow-hidden border-b border-on-surface/10 bg-surface">
        <div className="absolute inset-0 bg-subtle-pattern opacity-80 pointer-events-none"></div>
        <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14 relative z-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-secondary font-label-md text-xs hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> {t("product_detail_back", locale)}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 bg-secondary/10 text-primary text-xs uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded">
                <BadgePercent size={12} /> {product.category}
              </span>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 leading-tight max-w-3xl">
                {product.name}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-5 max-w-3xl leading-relaxed break-words">
                {summaryText}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={settings?.business_phone || "+1 (800) 555-SPICE"}
                  businessEmail={salesEmail}
                  locale={locale}
                />
                <Link
                  href="/products"
                  className="bg-surface border border-on-surface/10 text-on-surface px-5 py-3 rounded font-label-md text-sm hover:border-primary/30 hover:text-primary transition-all inline-flex items-center gap-2"
                >
                  {t("product_detail_browse", locale)}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border border-on-surface/10 rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(26,26,26,0.06)]">
                <div className="h-[320px] md:h-[420px] bg-surface-container-high overflow-hidden">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 border-t border-on-surface/10 grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Category</div>
                    <div className="mt-1 text-on-surface font-semibold">{product.category}</div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Sales Email</div>
                    <div className="mt-1 text-on-surface font-semibold break-all">{salesEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <article className="lg:col-span-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {commercialFacts.map((fact) => (
              <div key={fact.label} className="bg-surface-container-low border border-on-surface/10 rounded-xl p-5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">{fact.label}</div>
                <div className="mt-2 text-sm text-on-surface font-semibold leading-relaxed break-words">{fact.value}</div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supplyHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-surface-container-low border border-on-surface/10 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-title-lg text-title-lg text-primary">{item.title}</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </section>

          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6 md:p-8">
            <h2 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <MapPin size={18} className="text-secondary" /> {t("product_detail_specs_title", locale)}
            </h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-on-surface/10 bg-surface p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Packaging</div>
                <div className="mt-2 text-sm text-on-surface font-semibold leading-relaxed">{product.packaging_info || "Bulk export packaging available on request."}</div>
              </div>
              <div className="rounded-lg border border-on-surface/10 bg-surface p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Price / MOQ</div>
                <div className="mt-2 text-sm text-primary font-bold leading-relaxed">{product.price_moq || "Pricing available on inquiry."}</div>
              </div>
            </div>
          </section>

          <section className="bg-primary text-on-primary rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
            <div className="relative z-10 max-w-2xl">
              <h2 className="font-title-lg text-title-lg font-bold">{t("product_detail_cta_title", locale)}</h2>
              <p className="mt-3 text-sm text-on-primary/85 leading-relaxed">
                {t("product_detail_cta_desc", locale)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={settings?.business_phone || "+1 (800) 555-SPICE"}
                  businessEmail={salesEmail}
                  locale={locale}
                  variant="inverse"
                />
                <Link
                  href={`mailto:${salesEmail}?subject=${encodeURIComponent(product.name + " - Wholesale Inquiry")}`}
                  className="bg-white/10 text-on-primary border border-white/15 px-4 py-2.5 rounded font-label-md text-xs hover:bg-white/15 transition-all inline-flex items-center gap-2"
                >
                  Email Sales Team
                </Link>
              </div>
            </div>
          </section>
        </article>

        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6">
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <ShieldCheck size={18} className="text-secondary" /> {t("product_detail_fit_title", locale)}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
              {buyerFit.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6">
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <Package size={18} className="text-secondary" /> {t("product_detail_related_title", locale)}
            </h3>
            <div className="mt-4 space-y-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${getProductSlug(relatedProduct)}`}
                    className="group flex gap-3 border-b border-on-surface/5 pb-4 last:pb-0 last:border-b-0"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-on-surface/10">
                      <img
                        src={relatedProduct.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=240"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">{relatedProduct.category}</div>
                      <div className="mt-1 text-sm font-semibold text-primary group-hover:text-secondary leading-tight line-clamp-2 transition-colors">
                        {relatedProduct.name}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">No related products are available right now.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}