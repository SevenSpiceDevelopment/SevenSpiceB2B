"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import QuoteModal from "./QuoteModal";

export default function HeroSection({
  locale = "en",
  heroSpan = "EXPORT-GRADE PAKISTANI BULK SPICES",
  heroTitle = "Premium Pakistani Spices for Global Food Manufacturers & Importers",
  heroSubtitle = "Export-quality spices, herbs, and seasoning ingredients supplied in bulk with consistent quality, competitive pricing, and worldwide container shipments.",
  heroCtaText = "Request a Quote",
  heroBrowseText = "Discover More",
  businessPhone,
  businessEmail,
}) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center text-center rounded-b-[32px] sm:rounded-b-[44px] md:rounded-b-[54px] border-b border-black/20 shadow-2xl bg-[#0d0f12]">
        
        {/* 1. CINEMATIC OVERHEAD SPICE FLAT-LAY BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-spice-flatlay.jpg"
            alt="Authentic Spices and Herbs Flatlay"
            fill
            priority
            quality={95}
            className="object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            sizes="100vw"
          />

          {/* Moody vignette overlay matching the sample image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75 z-10" />
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10 opacity-70" />
        </div>

        {/* 2. HERO CENTERED CONTENT */}
        <div className="relative z-20 max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center">
          
          {/* Eyebrow / Category Tag */}
          <span className="animate-fade-in-down text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#ffdf90] mb-2.5 sm:mb-3 drop-shadow-md select-none">
            {locale === "ur" ? "• 100% خالص پاکستانی مصالحہ جات •" : `• ${heroSpan} •`}
          </span>

          {/* Main Centered Headline with Staggered Entrance */}
          <h1 className="animate-fade-in-up delay-100 font-sans text-2xl xs:text-3xl sm:text-4xl md:text-[38px] lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.2] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] max-w-2xl sm:max-w-3xl">
            {heroTitle}
          </h1>

          {/* Centered Subtitle with Staggered Entrance */}
          <p className="animate-fade-in-up delay-200 font-sans text-xs xs:text-sm md:text-[14.5px] text-white/90 font-normal leading-relaxed max-w-xl mt-3 sm:mt-3.5 drop-shadow-md">
            {heroSubtitle}
          </p>

          {/* 3. PROPER ACTION BUTTONS MATCHING SAMPLE */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
            {/* Primary Golden Yellow "Explore Our Products" Button */}
            <Link
              href="/products"
              className="bg-[#fccc38] hover:bg-[#eab308] text-[#2d1f00] font-bold text-xs sm:text-[13px] uppercase tracking-widest px-8 py-3.5 sm:py-4 rounded-md transition-all duration-200 shadow-[0_4px_22px_rgba(252,204,56,0.38)] hover:shadow-[0_6px_28px_rgba(252,204,56,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 inline-flex items-center justify-center cursor-pointer"
            >
              <span>{locale === "ur" ? "ہماری مصنوعات دیکھیں" : (heroBrowseText?.trim() || "Explore Our Products")}</span>
            </Link>

            {/* Secondary Transparent/Bordered "Request Wholesale Quote" Button */}
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="border border-white/70 hover:border-white bg-black/40 hover:bg-black/60 text-white font-bold text-xs sm:text-[13px] uppercase tracking-widest px-8 py-3.5 sm:py-4 rounded-md transition-all duration-200 backdrop-blur-md shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 inline-flex items-center justify-center cursor-pointer"
            >
              <span>{locale === "ur" ? "ہول سیل ریٹ معلوم کریں" : (heroCtaText?.trim() || "Request Wholesale Quote")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Commercial Quote Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
        locale={locale}
      />
    </>
  );
}
