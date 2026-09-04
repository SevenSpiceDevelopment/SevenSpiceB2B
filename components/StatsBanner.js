"use client";

import { useState } from "react";
import Link from "next/link";
import QuoteModal from "./QuoteModal";

export default function StatsBanner({ 
  locale = "en",
  businessPhone,
  businessEmail
}) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const stats = [
    {
      number: "50",
      suffix: "+",
      title: locale === "ur" ? "ممالک میں سپلائی" : "Countries Served",
      desc: locale === "ur" 
        ? "شمالی امریکہ، یورپ اور مشرق وسطیٰ کے اہم بین الاقوامی پورٹس پر براہ راست کنٹینرائزڈ ترسیل۔"
        : "Direct containerized freight across major commercial ports in North America, Europe, Asia & Middle East.",
    },
    {
      number: "100",
      suffix: "+",
      title: locale === "ur" ? "قابلِ اعتماد پارٹنرز" : "Trusted Partners",
      desc: locale === "ur"
        ? "فوڈ پروسیسرز، ہوٹل چینز اور ریٹیل برانڈز کے ساتھ طویل مدتی ہول سیل سپلائی معاہدے۔"
        : "Long-term wholesale supply agreements with food processors, hotel chains, and gourmet brands.",
    },
    {
      number: "30",
      suffix: "+",
      title: locale === "ur" ? "کوالٹی چیک پوائنٹس" : "Quality Checkpoints",
      desc: locale === "ur"
        ? "نمی، تیل کی مقدار اور مائکروبیولوجیکل پاکیزگی کے لیے ملٹی اسٹیج لیبارٹری جانچ۔"
        : "Rigorous laboratory testing for moisture, volatile oil levels, microbial purity, and mesh sizing.",
    },
    {
      number: "99.5",
      suffix: "%",
      title: locale === "ur" ? "بروقت ترسیل" : "On-Time Delivery",
      desc: locale === "ur"
        ? "محفوظ شپنگ سروس لیول ایگریمنٹ اور مکمل کنٹینر لاجسٹکس ٹریکنگ۔"
        : "Guaranteed freight SLA and automated bill-of-lading logistics tracking for zero disruptions.",
    },
  ];

  return (
    <>
      <div className="mt-14 sm:mt-18 w-full reveal-on-scroll">
        {/* White Rounded Card aligned with website brand colors & borders */}
        <div className="w-full bg-white rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-[#e8dfd5] shadow-[0_20px_50px_rgba(87,0,19,0.04)] p-6 sm:p-10 md:p-14 transition-all duration-300">
          
          {/* TOP HEADER ROW: Title & Subtitle on Left, Action Pill Buttons on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
            <div className="max-w-2xl text-left rtl:text-right">
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-primary tracking-tight leading-tight">
                {locale === "ur" ? "ہم صرف شاندار نتائج دیتے ہیں۔" : "We only deliver results."}
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base font-normal mt-2 leading-relaxed">
                {locale === "ur" 
                  ? "معیار، برآمدی تقاضوں اور بروقت ترسیل کے اصولوں پر کوئی سمجھوتہ نہیں۔"
                  : "We don't use excuses or cut corners. Premium grade spices delivered with absolute precision."}
              </p>
            </div>

            {/* ACTION PILL BUTTONS */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Secondary Clean Catalog Pill (No video/play icon) */}
              <Link
                href="/products"
                className="bg-transparent hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-xs inline-flex items-center justify-center cursor-pointer"
              >
                <span>{locale === "ur" ? "کیٹلاگ دیکھیں" : "Explore Catalog"}</span>
              </Link>

              {/* Primary Pill Button in website maroon #570013 */}
              <button
                type="button"
                onClick={() => setIsQuoteOpen(true)}
                className="bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg inline-flex items-center justify-center cursor-pointer"
              >
                <span>{locale === "ur" ? "آرڈر شروع کریں" : "Start An Order"}</span>
              </button>
            </div>
          </div>

          {/* BOTTOM STATS GRID: 4 Columns with Numbers in Brand Maroon & Gold Suffix */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-[#f0eae1] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 text-left rtl:text-right">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col reveal-on-scroll ${idx === 0 ? "delay-100" : idx === 1 ? "delay-200" : idx === 2 ? "delay-300" : "delay-400"} p-2 rounded-xl transition-all duration-300 hover:bg-slate-50/70`}
              >
                {/* Big Bold Stat Number in Brand Palette */}
                <div className="flex items-baseline gap-0.5">
                  <span className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-primary tracking-tight font-display leading-none">
                    {stat.number}
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold text-[#b47a18] leading-none">
                    {stat.suffix}
                  </span>
                </div>

                {/* Stat Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-3.5 sm:mt-4 tracking-tight">
                  {stat.title}
                </h3>

                {/* Stat Description */}
                <p className="text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed mt-2">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote / Order Modal */}
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
