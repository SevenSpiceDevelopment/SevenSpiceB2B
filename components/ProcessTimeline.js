"use client";

import { useEffect, useRef, useState } from "react";
import { Sprout, FlaskConical, PackageCheck, Ship } from "lucide-react";

export default function ProcessTimeline({ locale = "en", steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = [];

    stepRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep((prev) => Math.max(prev, index));
          }
        },
        {
          threshold: 0.25,
          rootMargin: "0px 0px -10% 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const defaultSteps = [
    {
      stepNumber: "01",
      icon: Sprout,
      stageLabel: locale === "ur" ? "مرحلہ اول" : "Stage 01",
      stageCategory: locale === "ur" ? "ماخذ" : "Origin Sourcing",
      title: steps?.[0]?.title || (locale === "ur" ? "فارم سے براہ راست حصول" : "Direct Farm Sourcing"),
      desc: steps?.[0]?.desc || (locale === "ur" 
        ? "کشمیر، کیرالہ اور سری لنکا میں تصدیق شدہ زرعی کوآپریٹیو کے ساتھ براہ راست اخلاقی شراکت داری۔" 
        : "Direct partnerships with certified farming cooperatives across Kashmir, Kerala, and Sri Lanka to ensure ethical harvesting and premier crop purity."),
      image: "/images/methi-farm-real.jpg",
      imageAlt: "Authentic lush green fenugreek (methi) crop cultivation in farming fields"
    },
    {
      stepNumber: "02",
      icon: FlaskConical,
      stageLabel: locale === "ur" ? "مرحلہ دوم" : "Stage 02",
      stageCategory: locale === "ur" ? "تجزیہ" : "ISO Lab Analysis",
      title: steps?.[1]?.title || (locale === "ur" ? "ISO لیب ٹیسٹنگ اور گریڈنگ" : "ISO Lab Testing & Grading"),
      desc: steps?.[1]?.desc || (locale === "ur" 
        ? "کروسین، پائپرین اور ضروری تیلوں کے ارتکاز کی تصدیق اور بین الاقوامی معیارات پر مکمل لیب آڈٹ۔" 
        : "Chemical analysis measuring active volatile oil concentrations, moisture thresholds, and complete ISO batch verification."),
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=1200",
      imageAlt: "Scientific laboratory spectrometry analysis and quality control of spices"
    },
    {
      stepNumber: "03",
      icon: PackageCheck,
      stageLabel: locale === "ur" ? "مرحلہ سوم" : "Stage 03",
      stageCategory: locale === "ur" ? "پیکیجنگ" : "Barrier Packing",
      title: steps?.[2]?.title || (locale === "ur" ? "نمی سے محفوظ پیکیجنگ" : "Climate-Controlled Packaging"),
      desc: steps?.[2]?.desc || (locale === "ur" 
        ? "طویل فاصلے کے سمندری ٹرانزٹ کے دوران تازگی، رنگ اور خوشبو کے مکمل تحفظ کے لیے ویکیوم سیلنگ۔" 
        : "Food-grade multi-wall Kraft barrier packing with vacuum-sealed inner liners to eliminate humidity risks during transit."),
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
      imageAlt: "Clean, sanitary food packaging facility with high-barrier vacuum sealing"
    },
    {
      stepNumber: "04",
      icon: Ship,
      stageLabel: locale === "ur" ? "مرحلہ چہارم" : "Stage 04",
      stageCategory: locale === "ur" ? "ترسیل" : "Global Export",
      title: steps?.[3]?.title || (locale === "ur" ? "عالمی لاجسٹکس اور فریٹ" : "Global Export Freight"),
      desc: steps?.[3]?.desc || (locale === "ur" 
        ? "درجہ حرارت کے کنٹرول والے کنٹینرز اور فائٹوسینٹری کلیئرنس کے ساتھ دنیا بھر میں برآمد۔" 
        : "FOB, CIF, and DDP international logistics coordination with full phytosanitary clearance and automated refrigerated tracking."),
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200",
      imageAlt: "International container shipping port and freight logistics for bulk spice export"
    }
  ];

  const items = defaultSteps;

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4 sm:py-8">
      {/* Central Connecting Timeline Spine (Desktop only) */}
      <div 
        className="hidden lg:block absolute left-1/2 top-12 bottom-12 -translate-x-1/2 w-1 bg-gradient-to-b from-primary/15 via-secondary/35 to-primary/20 rounded-full" 
        aria-hidden="true"
      />

      {/* Process Step Rows */}
      <div className="flex flex-col gap-8 sm:gap-12 lg:gap-24 relative">
        {items.map((item, index) => {
          const isRightSide = index % 2 === 1;
          const isPassedOrActive = index <= activeStep;
          const IconComp = item.icon;

          return (
            <div
              key={index}
              ref={(el) => (stepRefs.current[index] = el)}
              className={`relative flex items-center w-full scroll-mt-28 ${
                isRightSide ? "lg:justify-end" : "lg:justify-start"
              }`}
            >
              {/* Central Glowing Number Badge (Desktop Only - anchored to center spine) */}
              <div 
                className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-30 items-center justify-center transition-all duration-700 ease-out"
                style={{ top: "50%", transform: "translate(-50%, -50%)" }}
              >
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-serif font-bold text-base border-2 transition-all duration-500 shadow-xl select-none ${
                    isPassedOrActive
                      ? "bg-secondary-container text-on-secondary-container border-secondary-fixed shadow-[0_0_35px_rgba(252,204,56,0.7)] scale-110 ring-4 ring-secondary/35"
                      : "bg-surface-container-high text-on-surface-variant/60 border-on-surface/20 scale-95"
                  }`}
                >
                  {item.stepNumber}
                </div>
              </div>

              {/* Single High-Impact Image Card (Full width on mobile, 46% width on desktop) */}
              <div 
                className={`w-full lg:w-[46%] ${
                  isRightSide ? "lg:ml-auto" : "lg:mr-auto"
                }`}
              >
                <div 
                  className={`group relative h-72 xs:h-80 sm:h-96 lg:h-[390px] w-full rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1 ${
                    isPassedOrActive
                      ? "border-secondary/50 shadow-[0_15px_40px_rgba(87,0,19,0.12),_0_0_25px_rgba(252,204,56,0.15)] ring-1 ring-secondary/20"
                      : "border-on-surface/10 opacity-80"
                  }`}
                >
                  {/* Background High-Resolution Picture */}
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Subtle top accent gradient */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-[3px] sm:h-[4px] z-20 transition-opacity duration-500 bg-gradient-to-r from-primary via-secondary to-primary ${
                      isPassedOrActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Clean Gradient Scrim for optimal readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 z-10" />

                  {/* Top Floating Badge with Step Number */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-md">
                      {/* Step Number on Mobile */}
                      <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container font-extrabold text-[10px] flex items-center justify-center font-mono">
                        {item.stepNumber}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-secondary-fixed flex items-center gap-1">
                        <IconComp size={12} className="text-secondary-fixed" />
                        {item.stageLabel}
                      </span>
                    </div>

                    <span className="text-[10px] sm:text-xs font-medium text-white/90 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {item.stageCategory}
                    </span>
                  </div>

                  {/* Bottom Information Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 flex flex-col gap-1.5 sm:gap-2 text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary-container/90 text-on-secondary-container flex items-center justify-center shadow-md shrink-0">
                        <IconComp size={16} />
                      </div>
                      <h3 className="font-title-lg text-base sm:text-xl text-white font-bold tracking-tight drop-shadow-sm line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-body-md text-xs sm:text-sm text-white/85 leading-relaxed pl-10.5 sm:pl-11.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
