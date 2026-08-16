"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Globe, FlaskConical } from "lucide-react";

export default function TrustSignals({ cards }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Setup intersection observer to trigger entrance animation once
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Map each card to its specific premium icon
  const icons = [BadgeCheck, Globe, FlaskConical];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
    >
      {cards.map((card, index) => {
        const IconComponent = icons[index] || BadgeCheck;

        return (
          <div
            key={index}
            tabIndex={0}
            role="article"
            aria-label={card.title}
            style={{
              transitionDuration: "700ms",
              transitionDelay: isVisible ? `${index * 120}ms` : "0ms",
            }}
            className={`group relative flex flex-col justify-between gap-5 sm:gap-6 p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/95 via-white/85 to-white/65 backdrop-blur-2xl border border-white/90 shadow-[0_12px_35px_rgba(87,0,19,0.04),_0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(87,0,19,0.12),_0_8px_20px_rgba(252,204,56,0.12)] hover:-translate-y-1.5 hover:border-secondary/40 hover:bg-white/95 transition-all duration-500 text-left overflow-hidden cursor-pointer ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95 pointer-events-none"
            }`}
          >
            {/* Specular Ambient Glow Flares */}
            <div 
              className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-gradient-to-br from-secondary-fixed/30 via-primary-fixed/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" 
              aria-hidden="true"
            />
            <div 
              className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-tr from-secondary-fixed/20 to-transparent blur-2xl opacity-40 group-hover:opacity-80 transition-all duration-500 pointer-events-none" 
              aria-hidden="true"
            />

            {/* Top Edge Gloss Accent Sheen */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/20 via-secondary to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              aria-hidden="true"
            />

            {/* Glossy Header Bar */}
            <div className="flex items-center justify-between gap-2 relative z-10">
              {/* Glossy Translucent Icon Orb */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary/15 to-primary/5 backdrop-blur-md border border-secondary/25 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:rotate-3 group-hover:border-secondary/60 group-hover:shadow-[0_0_20px_rgba(252,204,56,0.3)] transition-all duration-500 shrink-0">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-secondary group-hover:text-primary transition-colors duration-500" />
              </div>

              {card.pill && (
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 shadow-xs whitespace-nowrap">
                  {card.pill}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-title-lg text-lg sm:text-xl lg:text-2xl text-primary font-bold tracking-tight">
                {card.title}
              </h3>
              <p className="font-body-md text-xs sm:text-sm lg:text-base text-on-surface-variant leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
