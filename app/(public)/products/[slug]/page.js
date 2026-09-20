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
  Layers 
} from "lucide-react";
import { getProductById as dbGetProductById, getProducts, getSiteSettings } from "@/lib/db";
import { t, translateProduct, translateProducts } from "@/lib/translations";
import { getProductIdFromSlug, getProductSlug } from "@/lib/productPaths";
import ProductQuoteButton from "@/components/ProductQuoteButton";

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

function renderFormattedText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

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

  // Parse all clean paragraphs for the complete description - never truncated with ellipsis
  const rawDescription = product.description || "";
  const descriptionParagraphs = rawDescription
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("###") && !p.startsWith("##") && !p.startsWith("#") && !p.startsWith("*") && !p.startsWith("-"));

  const paragraphsToRender = descriptionParagraphs.length > 0 
    ? descriptionParagraphs 
    : [rawDescription.replace(/[#*]/g, "").trim()];

  const buyerFit = [
    "Food manufacturers and private-label processors",
    "Wholesale distributors and importers",
    "Retail chains and specialty ingredient buyers",
    "Hospitality and commercial catering supply teams",
  ];

  return (
    <div className="bg-background pb-stack-lg">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-on-surface/10 bg-surface">
        <div className="absolute inset-0 bg-subtle-pattern opacity-80 pointer-events-none"></div>
        <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14 relative z-10">
          <Link href="/products" className="inline-flex items-center gap-2 text-secondary font-label-md text-xs hover:text-primary transition-colors mb-6">
            <ArrowLeft size={14} /> {t("product_detail_back", locale)}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-[#C47029] border border-[#C47029]/30 text-xs uppercase font-bold tracking-[0.2em] px-3 py-1.5 rounded">
                  <BadgePercent size={12} /> {product.category}
                </span>
                {product.collection && (
                  <Link 
                    href={`/products?category=${encodeURIComponent(product.category)}&collection=${encodeURIComponent(product.collection)}`}
                    className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container text-xs font-semibold px-3 py-1.5 rounded hover:opacity-90 transition-opacity border border-secondary/20"
                  >
                    <Layers size={12} className="text-secondary" />
                    <span>{product.collection}</span>
                  </Link>
                )}
              </div>

              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-4 leading-tight max-w-3xl break-words">
                {product.name}
              </h1>
              
              {/* Complete product description paragraphs - in full, never truncated */}
              <div className="font-body-lg text-body-lg text-on-surface-variant mt-5 max-w-3xl leading-relaxed space-y-4">
                {paragraphsToRender.map((paragraph, idx) => (
                  <p key={idx} className="break-words">
                    {renderFormattedText(paragraph)}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ProductQuoteButton
                  productName={product.name}
                  productId={product.id}
                  businessPhone={settings?.business_phone || "+92 3286828006"}
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
                <div className="relative h-[320px] md:h-[420px] bg-surface-container-high overflow-hidden">
                  <Image
                    src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1200"}
                    alt={product.name || "Product"}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={95}
                    className="object-cover"
                  />
                </div>
                <div className={`p-5 border-t border-on-surface/10 grid ${product.collection ? "grid-cols-3" : "grid-cols-2"} gap-3 text-sm`}>
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Category</div>
                    <div className="mt-1 text-on-surface font-semibold text-xs sm:text-sm">{product.category}</div>
                  </div>
                  {product.collection && (
                    <div className="bg-surface-container-low rounded-lg p-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Collection</div>
                      <div className="mt-1 text-primary font-semibold text-xs sm:text-sm truncate" title={product.collection}>{product.collection}</div>
                    </div>
                  )}
                  <div className="bg-surface-container-low rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Sales Desk</div>
                    <div className="mt-1 text-on-surface font-semibold text-xs sm:text-sm break-all">{salesEmail}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Sections: Buyer Fit & Related Products */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-12 grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Buyer Fit Section */}
        <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6 md:p-8 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
              <ShieldCheck size={20} className="text-secondary" /> {t("product_detail_fit_title", locale)}
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-on-surface-variant">
              {buyerFit.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="bg-surface-container-low border border-on-surface/10 rounded-xl p-6 md:p-8 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-title-lg text-title-lg text-primary flex items-center gap-2 mb-4">
              <Package size={20} className="text-secondary" /> {t("product_detail_related_title", locale)}
            </h3>
            <div className="space-y-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${getProductSlug(relatedProduct)}`}
                    className="group flex gap-3 border-b border-on-surface/5 pb-4 last:pb-0 last:border-b-0"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-on-surface/10">
                      <Image
                        src={relatedProduct.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=240"}
                        alt={relatedProduct.name || "Related product"}
                        fill
                        sizes="64px"
                        quality={90}
                        className="object-cover"
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
        <section className="bg-primary text-on-primary rounded-xl p-8 md:p-12 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md font-bold text-on-primary leading-tight">
              {t("product_detail_cta_title", locale)}
            </h2>
            <p className="mt-4 font-body-lg text-body-lg text-on-primary/85 leading-relaxed max-w-2xl">
              {t("product_detail_cta_desc", locale)}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
              <ProductQuoteButton
                productName={product.name}
                productId={product.id}
                businessPhone={settings?.business_phone || "+92 3286828006"}
                businessEmail={salesEmail}
                locale={locale}
                variant="inverse"
              />
              <Link
                href={`mailto:${salesEmail}?subject=${encodeURIComponent(product.name + " - Wholesale Inquiry")}`}
                className="bg-white/10 text-on-primary border border-white/20 px-6 py-3.5 rounded font-label-md text-sm hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                Email Sales Team
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}