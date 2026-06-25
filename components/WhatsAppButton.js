"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { t } from "@/lib/translations";

export default function WhatsAppButton({ whatsappNumber, whatsappMessage, locale = "en" }) {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-pop the tooltip 2 seconds after page load to draw user attention, then hide it after 6 seconds
  useEffect(() => {
    if (!whatsappNumber) return;
    
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 7000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [whatsappNumber]);

  // Hide on admin dashboard routes
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  if (!whatsappNumber) {
    return null;
  }

  // Format the whatsapp phone number (remove all non-digit characters)
  const cleanedPhone = whatsappNumber.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(whatsappMessage || "")}`;

  // Localized CTA text
  const ctaText = t("whatsapp_cta", locale);

  // Position class: Float bottom-left for Urdu RTL to avoid overlapping right elements, and bottom-right for English LTR
  const alignmentClass = locale === "ur" 
    ? "left-6 md:left-8 flex-row-reverse" 
    : "right-6 md:right-8 flex-row";

  return (
    <>
      <style jsx global>{`
        @keyframes pulse-whatsapp-glow {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        .whatsapp-pulse-button {
          animation: pulse-whatsapp-glow 2s infinite;
        }
      `}</style>
      
      <div 
        className={`fixed bottom-6 md:bottom-8 z-50 flex items-center gap-3 group transition-all duration-300 ${alignmentClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip Label Container */}
        <div 
          className={`bg-surface/90 backdrop-blur-md border border-on-surface/10 text-on-surface font-sans text-xs md:text-sm font-semibold tracking-wide py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 select-none whitespace-nowrap
            ${(showTooltip || isHovered) ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-90 pointer-events-none"}
            ${locale === "ur" 
              ? "origin-left -translate-x-2 group-hover:translate-x-0" 
              : "origin-right translate-x-2 group-hover:translate-x-0"
            }`}
        >
          {ctaText}
        </div>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ctaText}
          className="whatsapp-pulse-button w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-xl cursor-pointer hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512" 
            className="w-7 h-7 md:w-8 md:h-8 fill-current"
          >
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
