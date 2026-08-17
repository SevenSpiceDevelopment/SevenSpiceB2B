"use client";

import { BadgeCheck, Globe, FlaskConical } from "lucide-react";

export default function TrustSignals({ cards }) {
  // Map each card to its specific icon
  const icons = [BadgeCheck, Globe, FlaskConical];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
      {cards.map((card, index) => {
        const IconComponent = icons[index] || BadgeCheck;

        return (
          <div
            key={index}
            tabIndex={0}
            role="article"
            aria-label={card.title}
            className="flex flex-col justify-between gap-5 p-6 sm:p-7 rounded-2xl bg-white border border-on-surface/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-on-surface/10 flex items-center justify-center shrink-0">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>

              {card.pill && (
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 whitespace-nowrap">
                  {card.pill}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
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
