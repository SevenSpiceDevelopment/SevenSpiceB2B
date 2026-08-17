"use client";

import Link from "next/link";
import { t } from "@/lib/translations";
import { getProductSlug } from "@/lib/productPaths";
import { ArrowRight, Tag, ShieldCheck } from "lucide-react";

export default function FeaturedProductCard({ product, locale = "en", businessPhone, businessEmail }) {
  const cleanDescription = String(product.description || "")
    .replace(/\s+/g, " ")
    .trim();
  const previewDescription = cleanDescription.length > 110
    ? `${cleanDescription.slice(0, 110).trim()}...`
    : cleanDescription;

  return (
    <Link
      href={`/products/${getProductSlug(product)}`}
      aria-label={`View ${product.name}`}
      className="min-w-[85vw] max-w-[85vw] sm:min-w-[320px] sm:max-w-[320px] md:min-w-0 md:max-w-none snap-start shrink-0 bg-surface-container-lowest rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(87,0,19,0.08)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer text-left outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 select-none h-full shadow-sm"
    >
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

        {/* 3. POLISHED "VIEW PRODUCT" BUTTON */}
        <div className="pt-2">
          <div className="w-full bg-primary text-on-primary group-hover:bg-primary/90 py-3 px-4 rounded-xl text-center font-label-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md transition-all duration-200">
            <span>{locale === "ur" ? "مصنوعات دیکھیں" : "View Product"}</span>
            <ArrowRight size={14} className={locale === "ur" ? "rotate-180" : "group-hover:translate-x-1 transition-transform"} />
          </div>
        </div>
      </div>
    </Link>
  );
}