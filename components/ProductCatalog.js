"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuoteModal from "./QuoteModal";
import { Tag, ArrowRight } from "lucide-react";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {initialProducts.length > 0 ? (
          initialProducts.map((product) => (
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
              className="bg-surface-container-lowest border border-on-surface/10 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(26,26,26,0.04)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 h-full"
            >
              <div className="flex flex-col flex-grow">
                {/* Image Frame */}
                <div className="h-60 overflow-hidden relative bg-surface-container-high border-b border-on-surface/10 shrink-0">
                  <img
                    src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  {product.category && (
                    <span className="absolute top-4 left-4 bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
                      <Tag size={10} /> {product.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-title-lg text-title-lg text-primary line-clamp-1 break-words">{product.name}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-3 break-words">
                      {product.description}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary pt-2">
                    {locale === "ur" ? "تفصیلات دیکھیں" : "View product details"} <ArrowRight size={12} className={locale === "ur" ? "rotate-180" : ""} />
                  </div>
                </div>
              </div>

              {/* Primary Call-to-Action Button */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openQuote(product);
                  }}
                  className="w-full bg-secondary-container text-on-secondary-container py-3 rounded text-center font-label-md hover:opacity-90 group-hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
                >
                  {t("catalog_req_quote", locale)}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-surface-container-low border border-on-surface/10 rounded-lg">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">inventory_2</span>
            <p className="font-body-lg text-on-surface-variant">{t("catalog_no_products", locale)}</p>
          </div>
        )}
      </div>

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

