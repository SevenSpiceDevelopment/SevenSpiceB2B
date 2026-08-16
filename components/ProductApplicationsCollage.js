"use client";

import { useState, useRef } from "react";
import { Factory, UtensilsCrossed, Pill, Croissant, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ProductApplicationsCollage({ locale = "en", translations = {} }) {
  const t = (key, fallback) => translations[key] || fallback;
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef(null);

  const applications = [
    {
      id: "industrial",
      icon: Factory,
      title: t("home_app1_title", "Industrial Food Manufacturing & Seasonings"),
      desc: t("home_app1_desc", "Bulk whole seeds, micro-milled powders, and oleoresin-rich extracts for savory snacks, ready meals, sauces, and industrial recipe formulations."),
      pill: t("home_app1_pill", "Food Processing"),
      image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=1200",
      imageAlt: "Industrial food manufacturing and bulk spice seasoning mixing equipment",
      gridSpan: "lg:col-span-7 h-80 sm:h-96 lg:h-[390px]"
    },
    {
      id: "horeca",
      icon: UtensilsCrossed,
      title: t("home_app2_title", "Gourmet Hospitality & HoReCa"),
      desc: t("home_app2_desc", "Grade-A Saffron, Tellicherry Peppercorns, and Kerala Cardamom tailored for luxury hotel chains, fine dining, and master chefs."),
      pill: t("home_app2_pill", "Luxury HoReCa"),
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
      imageAlt: "Gourmet Michelin-starred culinary chef plating dish with saffron and fine spices",
      gridSpan: "lg:col-span-5 h-80 sm:h-96 lg:h-[390px]"
    },
    {
      id: "pharma",
      icon: Pill,
      title: t("home_app3_title", "Nutraceuticals & Dietary Formulations"),
      desc: t("home_app3_desc", "High-curcumin turmeric, premium fenugreek seeds, and botanical extracts for health capsules, herbal teas, and wellness supplements."),
      pill: t("home_app3_pill", "Nutraceuticals"),
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000",
      imageAlt: "Botanical dietary supplements and certified organic turmeric powders in laboratory",
      gridSpan: "lg:col-span-4 h-72 sm:h-80 lg:h-[330px]"
    },
    {
      id: "bakery",
      icon: Croissant,
      title: t("home_app4_title", "Artisanal Bakeries & Distilleries"),
      desc: t("home_app4_desc", "Pure Ceylon cinnamon quills, whole cloves, and aromatic botanical blends for artisanal baking, confectionery, and craft beverages."),
      pill: t("home_app4_pill", "Bakery & Beverages"),
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000",
      imageAlt: "Artisanal pastry bakery with cinnamon quills, baked loaves, and spiced confections",
      gridSpan: "lg:col-span-4 h-72 sm:h-80 lg:h-[330px]"
    },
    {
      id: "retail",
      icon: ShoppingBag,
      title: t("home_app5_title", "Private Label & Supermarket Retail"),
      desc: t("home_app5_desc", "Custom-blended bulk formulations and nitrogen-flushed barrier jars branded directly for international grocery and retail chains."),
      pill: t("home_app5_pill", "Private Label"),
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=1000",
      imageAlt: "Premium packaged spice glass jars with custom labels for supermarket retail",
      gridSpan: "lg:col-span-4 h-72 sm:h-80 lg:h-[330px]"
    }
  ];

  const handleScroll = () => {
    const node = sliderRef.current;
    if (!node || !node.children.length) return;
    const scrollPos = node.scrollLeft;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(node.children).forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - scrollPos);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveSlide(closestIndex);
  };

  const scrollToSlide = (index) => {
    const node = sliderRef.current;
    if (!node || !node.children[index]) return;
    node.children[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveSlide(index);
  };

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-surface-container-low/70 border-b border-on-surface/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none" />

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <span className="font-label-md text-[11px] sm:text-xs text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full inline-block border border-secondary/20 mb-2.5 shadow-xs">
            {t("home_applications_span", "Industries & Commercial Applications")}
          </span>
          <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-2.5">
            {t("home_applications_title", "Where Our Ingredients Power Global Brands")}
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {t("home_applications_subtitle", "From high-volume industrial food manufacturing to Michelin-starred dining, nutraceutical extracts, and private label packaging.")}
          </p>
        </div>

        {/* ========================================================= */}
        {/* 1. MOBILE & TABLET SLIDER (< lg screens)                 */}
        {/* ========================================================= */}
        <div className="lg:hidden">
          {/* Slider Container */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3.5 sm:gap-5 pb-3 px-2"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {applications.map((app, index) => {
              const IconComp = app.icon;
              return (
                <div
                  key={app.id}
                  className="group relative shrink-0 snap-center w-[86vw] max-w-[310px] sm:max-w-[350px] h-[340px] sm:h-[370px] rounded-2xl sm:rounded-3xl overflow-hidden border border-on-surface/10 shadow-md flex flex-col justify-between p-5 select-none"
                >
                  {/* Background Image */}
                  <img
                    src={app.image}
                    alt={app.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.90]"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 z-10" />

                  {/* Top Hairline Gloss */}
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-secondary to-primary z-20" />

                  {/* Top Category Badge */}
                  <div className="relative z-20 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-secondary-fixed bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-secondary-fixed/30 shadow-xs">
                      <IconComp size={11} className="text-secondary-fixed shrink-0" />
                      <span className="truncate max-w-[170px]">{app.pill}</span>
                    </span>

                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center justify-center text-[10px] font-mono font-bold">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-20 flex flex-col gap-1.5 text-left">
                    <h3 className="font-title-lg text-base sm:text-lg font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                      {app.title}
                    </h3>
                    <p className="font-body-md text-[11px] sm:text-xs text-white/85 leading-relaxed line-clamp-3">
                      {app.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean Small Centered Pagination Dots */}
          <div className="flex justify-center items-center gap-1.5 pt-3 pb-2" aria-label="Slide indicators">
            {applications.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`!min-h-0 !min-w-0 !p-0 !border-0 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx 
                    ? "!w-5 !h-1.5 bg-secondary shadow-xs" 
                    : "!w-1.5 !h-1.5 bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DESKTOP BENTO MOSAIC GRID (lg: screens)                */}
        {/* ========================================================= */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {applications.map((app) => {
            const IconComp = app.icon;

            return (
              <div
                key={app.id}
                className={`group relative rounded-3xl overflow-hidden border border-on-surface/10 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between p-7 ${app.gridSpan}`}
              >
                {/* Background Relevant Photograph */}
                <img
                  src={app.image}
                  alt={app.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.95]"
                />

                {/* Dark Vignette / Legibility Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 z-10" />

                {/* Top Glowing Hairline Gloss Sheen */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                {/* Card Top: Tag & Action Icon */}
                <div className="relative z-20 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-fixed bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-secondary-fixed/30 shadow-md">
                    <IconComp size={13} className="text-secondary-fixed shrink-0" />
                    <span>{app.pill}</span>
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 flex items-center justify-center group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all duration-300 shadow-sm shrink-0">
                    <ArrowUpRight size={15} />
                  </div>
                </div>

                {/* Card Bottom: Title & Clear Description */}
                <div className="relative z-20 flex flex-col gap-2 text-left">
                  <h3 className="font-title-lg text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-sm group-hover:text-secondary-fixed transition-colors">
                    {app.title}
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-3">
                    {app.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Direct CTA */}
        <div className="mt-8 sm:mt-12 text-center px-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary/90 font-label-md text-xs sm:text-sm px-6 py-3 sm:py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto max-w-sm mx-auto"
          >
            <span>{locale === "ur" ? "صنعتی نرخ نامہ حاصل کریں" : "Request Industry Specifications"}</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
