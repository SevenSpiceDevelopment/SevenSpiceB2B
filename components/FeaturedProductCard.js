"use client";

import Link from "next/link";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";
import { ArrowRight } from "lucide-react";

export default function FeaturedProductCard({ product, locale = "en", businessPhone, businessEmail }) {
  return (
    <Link
      href={`/products/${getProductSlug(product)}`}
      className="min-w-[85vw] sm:min-w-[320px] snap-align-center md:min-w-0 flex-shrink-0 bg-surface border border-on-surface/10 rounded-lg overflow-hidden flex flex-col hover:shadow-[0px_20px_40px_rgba(26,26,26,0.03)] transition-all duration-300 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="h-48 md:h-64 overflow-hidden relative bg-surface-container">
        <img
          src={product.image_url || "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between gap-4">
        <h3 className="font-title-lg text-title-lg text-primary line-clamp-2 group-hover:text-primary transition-colors font-bold">
          {product.name}
        </h3>

        <div className="border-t border-on-surface/5 pt-4 w-full flex justify-between items-center">
          <span className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1 text-xs font-label-md">
            {locale === "ur" ? "مصنوعات دیکھیں" : "View Product"} 
            <ArrowRight size={14} className={locale === "ur" ? "rotate-180" : ""} />
          </span>
        </div>
      </div>
    </Link>
  );
}