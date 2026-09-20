"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductSlug } from "@/lib/productPaths";
import QuoteModal from "./QuoteModal";

export default function FeaturedProductCard({
  product,
  locale = "en",
  businessPhone,
  businessEmail
}) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const productSlug = getProductSlug(product);

  const cleanDescription = String(product.description || "")
    .replace(/\s+/g, " ")
    .trim();
  const previewDescription = cleanDescription.length > 80
    ? `${cleanDescription.slice(0, 80).trim()}...`
    : cleanDescription;

  return (
    <>
      <div className="w-[78vw] max-w-[78vw] min-w-[78vw] xs:w-[260px] xs:max-w-[260px] xs:min-w-[260px] sm:w-[280px] sm:max-w-[280px] sm:min-w-[280px] md:w-full md:max-w-none md:min-w-0 snap-start shrink-0 bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group select-none border border-slate-100 shadow-sm">
        
        {/* 1. TOP IMAGE CANVAS (Reduced height, crisp presentation) */}
        <Link
          href={`/products/${productSlug}`}
          aria-label={`View ${product.name}`}
          className="relative w-full aspect-[4/3] bg-[#f7f5f2] rounded-xl overflow-hidden flex items-center justify-center cursor-pointer p-3"
        >
          <Image
            src={
              product.image_url ||
              "/images/turmeric_mortar.png"
            }
            alt={product.name || "Spices"}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 280px, 320px"
            quality={90}
            className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out p-2"
          />

          {/* Clean Category Badge */}
          {product.category && (
            <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-bold uppercase tracking-wider text-secondary-fixed bg-black/75 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-xs border border-white/15">
              {product.category}
            </span>
          )}

          {/* Grade A Badge */}
          <span className="absolute top-2.5 right-2.5 z-10 text-[9px] font-bold uppercase tracking-wider text-primary bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border border-slate-100">
            {locale === "ur" ? "100% خالص" : "100% Pure"}
          </span>
        </Link>

        {/* 2. PRODUCT INFO (No prices shown, compact clean typography) */}
        <div className="pt-3 flex flex-col flex-grow text-left rtl:text-right">
          <Link href={`/products/${productSlug}`}>
            <h3 className="text-slate-900 font-bold text-base leading-snug line-clamp-1 hover:text-primary transition-colors tracking-tight">
              {product.name}
            </h3>
          </Link>

          {previewDescription && (
            <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2 mt-1 mb-2.5">
              {previewDescription}
            </p>
          )}

          {/* 3. COMPACT ACTION BUTTONS (Single sleek row, replaces tall stacked buttons) */}
          <div className="mt-auto pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 px-3 rounded-full text-center text-xs sm:text-[13px] transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
            >
              {locale === "ur" ? "کوٹیشن طلب کریں" : "Request Quote"}
            </button>

            <Link
              href={`/products/${productSlug}`}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full text-center text-xs transition-all duration-200 cursor-pointer shrink-0"
              aria-label={`Details for ${product.name}`}
            >
              {locale === "ur" ? "تفصیلات" : "Details"}
            </Link>
          </div>
        </div>
      </div>

      {/* Quote / Order Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        productName={product.name}
        productId={product.id}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
        locale={locale}
      />
    </>
  );
}