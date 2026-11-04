import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  BadgePercent,
  Layers,
  FileText,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import { getProductById as dbGetProductById, getProducts, getSiteSettings } from "@/lib/db";
import { t, translateProduct, translateProducts } from "@/lib/translations";
import { getProductIdFromSlug, getProductSlug } from "@/lib/productPaths";
import ProductQuoteButton from "@/components/ProductQuoteButton";
import ProductMobileStickyBar from "@/components/ProductMobileStickyBar";
import FormattedContent from "@/components/FormattedContent";

const getProductById = cache(dbGetProductById);

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: getProductSlug(product),
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const productId = getProductIdFromSlug(params.slug);
  if (!productId) return {};

  const product = await getProductById(productId);
  if (!product) return {};

  const title = product.seo_title || `${product.name} | Seven Spice`;
  const description = product.meta_description || (product.description || "").replace(/[#*]/g, "").slice(0, 160).trim();
  const secondaryKeywordsArray = typeof product.secondary_keywords === "string"
    ? product.secondary_keywords.split(",").map((k) => k.trim())
    : Array.isArray(product.secondary_keywords)
      ? product.secondary_keywords
      : [];
  const keywords = [product.primary_keyword, ...secondaryKeywordsArray].filter(Boolean);

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
    alternates: {
      canonical: `/products/${product.slug || params.slug}`,
    }
  };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

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

  // Filter related products: prioritize same collection first, then same category
  const rawRelated = rawProducts
    .filter((item) => item.id !== rawProduct.id && item.category === rawProduct.category)
    .sort((a, b) => {
      const aSameCol = rawProduct.collection && a.collection === rawProduct.collection ? -1 : 1;
      const bSameCol = rawProduct.collection && b.collection === rawProduct.collection ? -1 : 1;
      return aSameCol - bSameCol;
    });

  const relatedProducts = translateProducts(rawRelated, locale).slice(0, 3);
  const salesEmail = settings?.business_email || "sales@thesevenspice.com";
  const businessPhone = settings?.business_phone || "+92 3286828006";
  const whatsappNumber = settings?.whatsapp_number || "+923286828006";
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, "");
  const waProductUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Seven Spice, I would like to inquire about wholesale bulk ${product.name}.`)}`;

  const buyerFit = [
    "Food manufacturers and private-label processors",
    "Wholesale distributors and importers",
    "Retail chains and specialty ingredient buyers",
    "Hospitality and commercial catering supply teams",
  ];

  const productImage = product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="bg-background pb-stack-lg min-h-screen">
      {/* Top Product Section */}
      <section className="relative overflow-hidden border-b border-on-surface/10 bg-surface">
        <div className="absolute inset-0 bg-subtle-pattern opacity-70 pointer-events-none"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 sm:py-10 relative z-10">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:text-primary transition-colors text-xs py-1"
            >
              <ArrowLeft size={14} /> {t("product_detail_back", locale)}
            </Link>
          </div>

          {/* Mobile-Only Header: Title and Category Pills placed directly above image on mobile */}
          <div className="lg:hidden mb-4 animate-fade-in-down">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#C47029] border border-[#C47029]/30 text-[11px] uppercase font-bold tracking-[0.18em] px-2.5 py-1 rounded">
                <BadgePercent size={12} /> {product.category}
              </span>
              {product.collection && (
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}&collection=${encodeURIComponent(product.collection)}`}
                  className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container text-[11px] font-semibold px-2.5 py-1 rounded hover:opacity-90 transition-opacity border border-secondary/20"
                >
                  <Layers size={11} className="text-secondary" />
                  <span>{product.collection}</span>
                </Link>
              )}
            </div>

            <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary font-bold leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Main 2-Column Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (Desktop 5 cols): Clean Product Image with smooth entrance and zoom */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 animate-scale-in">
              <div className="group bg-surface-container-lowest border border-on-surface/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative h-[300px] sm:h-[380px] lg:h-[450px] bg-surface-container-high overflow-hidden">
                  <Image
                    src={productImage}
                    alt={product.name || "Product"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    quality={95}
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (Desktop 7 cols): Title, Actions & Full Product Description */}
            <div className="lg:col-span-7 flex flex-col justify-start animate-fade-in-up">
              {/* Desktop-Only Title and Category Pills */}
              <div className="hidden lg:block">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#C47029] border border-[#C47029]/30 text-xs uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded transition-transform duration-200 hover:scale-105">
                    <BadgePercent size={12} /> {product.category}
                  </span>
                  {product.collection && (
                    <Link
                      href={`/products?category=${encodeURIComponent(product.category)}&collection=${encodeURIComponent(product.collection)}`}
                      className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1.5 rounded hover:opacity-90 transition-all border border-secondary/20 hover:scale-105"
                    >
                      <Layers size={12} className="text-secondary" />
                      <span>{product.collection}</span>
                    </Link>
                  )}
                </div>

                <h1 className="font-display-lg text-display-lg text-primary font-bold leading-tight tracking-tight mb-5">
                  {product.name}
                </h1>
              </div>

              {/* Action Buttons: Request Quote, WhatsApp, Browse */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={businessPhone}
                  businessEmail={salesEmail}
                  locale={locale}
                  variant="hero"
                  className="bg-secondary-container text-on-secondary-container hover:brightness-95 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 border border-secondary/30"
                >
                  <FileText size={16} />
                  <span>{t("product_detail_quote", locale)}</span>
                </ProductQuoteButton>

                <a
                  href={waProductUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white hover:bg-[#20ba5a] px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <MessageCircle size={17} />
                  <span>Inquire on WhatsApp</span>
                </a>

                <Link
                  href="/products"
                  className="bg-surface border border-on-surface/15 text-on-surface hover:text-primary hover:border-primary/40 px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center text-center hover:shadow-xs"
                >
                  {t("product_detail_browse", locale)}
                </Link>
              </div>

              {/* Full Description with exact WordPress spacing, headings, and lists */}
              <div className="border-t border-on-surface/10 pt-6">
                <FormattedContent content={product.description} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Sections: Buyer Fit & Related Products */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Buyer Fit Section */}
        <section className="reveal-on-scroll card-interactive bg-surface-container-low border border-on-surface/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <ShieldCheck size={20} className="text-secondary" /> {t("product_detail_fit_title", locale)}
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-on-surface-variant">
              {buyerFit.map((item) => (
                <li key={item} className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                  <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="reveal-on-scroll card-interactive bg-surface-container-low border border-on-surface/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full shadow-xs hover:shadow-md transition-all duration-300">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2 mb-4">
              <Package size={20} className="text-secondary" /> {t("product_detail_related_title", locale)}
            </h3>
            <div className="space-y-3">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${getProductSlug(relatedProduct)}`}
                    className="group flex gap-3 p-2 rounded-xl hover:bg-surface-container transition-all duration-300 border border-transparent hover:border-on-surface/10 hover:-translate-y-0.5"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-on-surface/10">
                      <Image
                        src={relatedProduct.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=240"}
                        alt={relatedProduct.name || "Related product"}
                        fill
                        sizes="64px"
                        quality={90}
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">{relatedProduct.category}</div>
                      <div className="mt-1 text-sm font-semibold text-primary group-hover:text-secondary leading-tight line-clamp-2 transition-colors break-words">
                        {relatedProduct.name}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">No related products are available right now.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Commercial Quote Call-to-Action Section */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-16 md:mt-20">
        <section className="reveal-on-scroll bg-primary text-on-primary rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md font-bold text-on-primary leading-tight">
              {t("product_detail_cta_title", locale)}
            </h2>
            <p className="mt-4 font-body-lg text-body-lg text-on-primary/85 leading-relaxed max-w-2xl text-sm sm:text-base">
              {t("product_detail_cta_desc", locale)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <ProductQuoteButton
                productName={product.name}
                productId={product.id}
                businessPhone={businessPhone}
                businessEmail={salesEmail}
                locale={locale}
                variant="inverse"
                className="bg-secondary-container text-on-secondary-container hover:opacity-90 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                <span>{t("product_detail_quote", locale)}</span>
              </ProductQuoteButton>
              <a
                href={waProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white hover:bg-[#20ba5a] px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={17} />
                <span>Inquire on WhatsApp</span>
              </a>
              <Link
                href={`mailto:${salesEmail}?subject=${encodeURIComponent(product.name + " - Wholesale Inquiry")}`}
                className="bg-white/10 text-on-primary border border-white/20 px-6 py-3.5 rounded-xl font-label-md text-sm hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                Email Sales Team
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <ProductMobileStickyBar
        productName={product.name}
        productId={product.id}
        productImage={productImage}
        category={product.category}
        businessPhone={businessPhone}
        businessEmail={salesEmail}
        whatsappNumber={whatsappNumber}
        locale={locale}
      />
    </div>
  );
}
