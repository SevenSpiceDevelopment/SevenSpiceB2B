"use client";

import { useState } from "react";
import Link from "next/link";
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
  const previewDescription = cleanDescription.length > 90
    ? `${cleanDescription.slice(0, 90).trim()}...`
    : cleanDescription;

  return (
    <>
      <div className="w-[85vw] max-w-[85vw] min-w-[85vw] xs:w-[290px] xs:max-w-[290px] xs:min-w-[290px] sm:w-[320px] sm:max-w-[320px] sm:min-w-[320px] md:w-full md:max-w-none md:min-w-0 snap-start shrink-0 bg-white rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group select-none border border-slate-100 shadow-sm">
        
        {/* 1. TOP IMAGE CANVAS (Clean minimalist rounded container) */}
        <Link
          href={`/products/${productSlug}`}
          aria-label={`View ${product.name}`}
          className="relative w-full aspect-square bg-[#f5f5f7] rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer p-4 sm:p-6"
        >
          <img
            src={
              product.image_url ||
              "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800"
            }
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* 2. PRODUCT INFO & DETAILS */}
        <div className="pt-4 flex flex-col flex-grow text-left">
          {/* Main Title */}
          <Link href={`/products/${productSlug}`}>
            <h3 className="text-slate-900 font-bold text-lg sm:text-xl leading-tight line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {previewDescription && (
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed line-clamp-2 mt-1.5 mb-3">
              {previewDescription}
            </p>
          )}

          {/* Price & Wholesale Badge */}
          <div className="flex items-center justify-between mt-auto mb-4 pt-1">
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {product.price_moq || (locale === "ur" ? "قیمت معلوم کریں" : "Inquire for MOQ")}
            </span>
            <span className="text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {locale === "ur" ? "تھوک سپلائی" : "Wholesale"}
            </span>
          </div>

          {/* 3. DUAL PILL ACTION BUTTONS */}
          <div className="flex flex-col gap-2.5">
            {/* Primary "Request Commercial Quote" Button */}
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 sm:py-3.5 rounded-full text-center text-sm sm:text-[15px] transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-[0.98]"
            >
              {locale === "ur" ? "کمرشل کوٹیشن طلب کریں" : "Request Commercial Quote"}
            </button>

            {/* Secondary "View Product" Button */}
            <Link
              href={`/products/${productSlug}`}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-medium py-3 sm:py-3.5 rounded-full text-center text-sm sm:text-[15px] transition-all duration-200 cursor-pointer block active:scale-[0.98]"
            >
              {locale === "ur" ? "مصنوعات دیکھیں" : "View Product"}
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