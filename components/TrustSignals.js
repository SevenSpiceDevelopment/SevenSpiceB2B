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
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it fully enters the viewport
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
      className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
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
              transitionDuration: "750ms",
              transitionDelay: isVisible ? `${index * 150}ms` : "0ms",
            }}
            className={`group relative flex flex-col gap-4 p-6 md:p-7 rounded-[20px] bg-white/75 backdrop-blur-lg border border-white/80 shadow-[0_15px_45px_rgba(87,0,19,0.04),_0_5px_15px_rgba(0,0,0,0.015)] hover:shadow-[0_30px_70px_rgba(87,0,19,0.15),_0_10px_30px_rgba(87,0,19,0.05)] hover:-translate-y-2.5 hover:border-secondary/30 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:-translate-y-2.5 focus-visible:shadow-[0_30px_70px_rgba(87,0,19,0.15)] transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-95 pointer-events-none"
            }`}
          >
            {/* Ambient Background Glows - Golden and Burgundy mix */}
            <div 
              className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-gradient-to-br from-secondary-fixed/20 to-primary-fixed/10 blur-2xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none" 
              aria-hidden="true"
            />
            <div 
              className="absolute -left-12 -bottom-12 w-28 h-28 rounded-full bg-gradient-to-tr from-secondary-fixed/15 to-transparent blur-2xl opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500 pointer-events-none"
              aria-hidden="true"
            />

            {/* Subtle light bar accent at the top edge */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/15 via-secondary/40 to-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              aria-hidden="true"
            />

            {/* Direct Icon Display without container */}
            <div className="w-fit shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out" aria-hidden="true">
              <IconComponent className="w-8 h-8 text-secondary group-hover:text-primary transition-colors duration-500" />
            </div>

            {/* Card Content */}
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-title-lg text-title-lg text-primary">
                {card.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {card.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
