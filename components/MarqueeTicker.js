"use client";

import { useMemo } from "react";

export default function MarqueeTicker({ settings }) {
  const isEnabled = settings?.marquee_ticker_enabled === 1 || settings?.marquee_ticker_enabled === true;

  const items = useMemo(() => {
    let raw = settings?.marquee_ticker_items;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        return raw.split("\n").map((s) => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(raw) && raw.length > 0) {
      return raw;
    }

    // Default high-value enterprise items
    return [
      "🌿 100% Origin Farm Sourced",
      "🔬 ISO 3632 & ISO 22000 Certified Quality",
      "🚢 Worldwide Ocean & Air Freight (FOB / CIF / DDP)",
      "📦 Vacuum-Sealed Moisture Barrier Packing",
      "🌱 Zero Pesticide & 100% Adulteration-Free Guarantee",
      "⚡ Custom Private-Label Blending & Packaging",
      "🌍 Exporting to 30+ Global Ports & Wholesale Distributors"
    ];
  }, [settings?.marquee_ticker_items]);

  if (!isEnabled || items.length === 0) {
    return null;
  }

  // Duplicate items 4 times to ensure a completely seamless continuous infinite loop on wide displays
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border-b border-on-surface/10 py-2.5 z-30 select-none group"
      aria-label="Enterprise Quality & Logistics Highlights"
    >
      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 70s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Subtle edge fades for smooth entrance and exit */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-surface-container to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-surface-container to-transparent z-10 pointer-events-none" />

      {/* Infinite Moving Track */}
      <div className="marquee-track flex items-center">
        {displayItems.map((text, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 whitespace-nowrap text-xs sm:text-xs font-bold uppercase tracking-wider text-primary/85 group-hover:text-primary transition-colors cursor-default"
          >
            <span>{text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-xs inline-block" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}
