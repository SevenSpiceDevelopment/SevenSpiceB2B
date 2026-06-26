"use client";

import { useRouter } from "next/navigation";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";
import ProductQuoteButton from "./ProductQuoteButton";

export default function FeaturedProductCard({ product, locale = "en", businessPhone, businessEmail }) {
  const router = useRouter();

  const openProductPage = () => {
    router.push(`/products/${getProductSlug(product)}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openProductPage}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProductPage();
        }
      }}
      className="min-w-[85vw] sm:min-w-[320px] snap-align-center md:min-w-0 flex-shrink-0 bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
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
          <h3 className="font-title-lg text-title-lg text-primary line-clamp-1 group-hover:text-primary transition-colors font-bold">
            {product.name}
          </h3>
          <p className="text-sm text-on-surface-variant line-clamp-3">{product.description}</p>
        </div>

        <div className="border-t border-on-surface/5 pt-4 w-full space-y-4">
          {(product.packaging_info || product.price_moq) && (
            <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant/80">
              {product.packaging_info ? <span>{product.packaging_info}</span> : <span></span>}
              {product.price_moq ? <span className="text-primary font-bold">{product.price_moq}</span> : <span></span>}
            </div>
          )}

          <div onClick={(event) => event.stopPropagation()}>
            <ProductQuoteButton
              productName={product.name}
              productId={product.id}
              businessPhone={businessPhone}
              businessEmail={businessEmail}
              locale={locale}
              variant="compact"
            />
          </div>
        </div>
      </div>
    </div>
  );
}