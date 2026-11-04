"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ProductQuoteButton from "@/components/ProductQuoteButton";
import { MessageCircle, FileText } from "lucide-react";
import { t } from "@/lib/translations";

export default function ProductMobileStickyBar({
  productName,
  productId,
  productImage,
  category,
  businessPhone,
  businessEmail,
  whatsappNumber,
  locale = "en"
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past initial hero (200px)
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const cleanWhatsApp = (whatsappNumber || businessPhone || "+923286828006").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Seven Spice, I would like to inquire about wholesale bulk ${productName}.`)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-on-surface/10 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden transition-all duration-300 transform translate-y-0 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {productImage && (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 border border-on-surface/10">
              <Image
                src={productImage}
                alt={productName || "Product"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase font-bold text-secondary tracking-wider truncate">
              {category}
            </div>
            <div className="text-xs font-bold text-primary truncate leading-tight">
              {productName}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inquire on WhatsApp"
            className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0 shadow-xs"
          >
            <MessageCircle size={18} />
          </a>

          <ProductQuoteButton
            productName={productName}
            productId={productId}
            businessPhone={businessPhone}
            businessEmail={businessEmail}
            locale={locale}
            variant="compact"
            className="bg-secondary-container text-on-secondary-container px-3.5 py-2 rounded-lg font-bold text-xs hover:opacity-90 transition-all shadow-xs inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <FileText size={13} />
            <span>{t("catalog_req_quote", locale)}</span>
          </ProductQuoteButton>
        </div>
      </div>
    </div>
  );
}

