"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuoteModal from "./QuoteModal";
import { Tag, ArrowRight, ShieldCheck } from "lucide-react";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";
import MobileCardCarousel from "./MobileCardCarousel";

export default function ProductCatalog({ initialProducts = [], businessPhone, businessEmail, locale = "en" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for quote modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState({ name: "", id: "" });

  // Auto-trigger modal if search params are present (e.g. redirected from Home page)
  useEffect(() => {
    const quoteProduct = searchParams.get("quoteProduct");
    const productId = searchParams.get("productId");
    if (quoteProduct) {
      setModalProduct({ name: quoteProduct, id: productId || "" });
      setModalOpen(true);
    }
  }, [searchParams]);

  const openQuote = (product) => {
    setModalProduct({ name: product.name, id: product.id });
    setModalOpen(true);
  };

  const openProductDetails = (product) => {
    router.push(`/products/${getProductSlug(product)}`);
  };

  return (
    <div className="space-y-stack-lg animate-fadeIn">
      {/* Products Grid */}
      <MobileCardCarousel count={initialProducts.length} className="md:grid-cols-2 lg:grid-cols-3">
        {initialProducts.length > 0 ? (
          initialProducts.map((product) => {
            const cleanDescription = String(product.description || "")
              .replace(/\s+/g, " ")
              .trim();
            const previewDescription = cleanDescription.length > 110
              ? `${cleanDescription.slice(0, 110).trim()}...`
              : cleanDescription;

            return (
            <div 
              key={product.id} 
              onClick={() => openProductDetails(product)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openProductDetails(product);
                }
              }}
              role="link"
              tabIndex={0}
              aria-label={`Open details for ${product.name}`}
              className="w-[85vw] max-w-[85vw] min-w-[85vw] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] snap-start shrink-0 md:w-auto md:max-w-none md:min-w-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(87,0,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-left outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none h-full shadow-sm"
            >
              <div className="flex flex-col flex-grow">
                {/* 1. PRODUCT SHOWCASE CANVAS (Seamless background, zero image border) */}
                <div className="relative p-4 sm:p-5 pb-2">
                  <div className="relative w-full h-56 sm:h-64 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-surface-container-high/40">
                    {/* Product Category Tag Pill */}
                    {product.category && (
                      <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-secondary-fixed text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        <Tag size={10} className="text-secondary-fixed" />
                        <span>{product.category}</span>
                      </span>
                    )}

                    {/* Premium Quality Badge */}
                    <span className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      <ShieldCheck size={11} className="text-secondary" />
                      <span className="uppercase">{locale === "ur" ? "پریمیئم" : "Grade A"}</span>
                    </span>

                    {/* Clean Main Product Image without any image border */}
                    <img
                      src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>

                {/* 2. PRODUCT INFO & DETAILS */}
                <div className="p-5 sm:p-6 pt-3 flex-grow flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-title-lg text-lg sm:text-xl font-bold text-primary leading-snug line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                      {product.name}
                    </h3>
                    {previewDescription && (
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                        {previewDescription}
                      </p>
                    )}
                  </div>

                  {product.price_moq && (
                    <div className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary/80 bg-surface-container-high px-3 py-1.5 rounded-lg border border-on-surface/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      <span className="truncate">{product.price_moq}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. POLISHED BUTTONS & ACTIONS */}
              <div className="p-5 sm:p-6 pt-0 space-y-2.5">
                <div className="w-full bg-primary text-on-primary group-hover:bg-primary/90 py-3 px-4 rounded-xl text-center font-label-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md transition-all duration-200">
                  <span>{locale === "ur" ? "مصنوعات دیکھیں" : "View Product"}</span>
                  <ArrowRight size={14} className={locale === "ur" ? "rotate-180" : "group-hover:translate-x-1 transition-transform"} />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openQuote(product);
                  }}
                  className="w-full bg-secondary-container/80 hover:bg-secondary-container text-on-secondary-container py-2.5 px-4 rounded-xl text-center font-label-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-secondary/20"
                >
                  {t("catalog_req_quote", locale)}
                </button>
              </div>
            </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
            <p className="font-body-lg text-on-surface-variant">{t("catalog_no_products", locale)}</p>
          </div>
        )}
      </MobileCardCarousel>

      {/* Quote Overlay Modal */}
      <QuoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // Clean search query params after closing modal
          window.history.replaceState(null, "", window.location.pathname);
        }}
        productName={modalProduct.name}
        productId={modalProduct.id}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
        locale={locale}
      />
    </div>
  );
}
