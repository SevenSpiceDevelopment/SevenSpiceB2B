"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, ArrowRight, X } from "lucide-react";

export default function DealHeadlineBanner({ settings }) {
  const [isDismissed, setIsDismissed] = useState(true);

  const isEnabled = settings?.deal_headline_enabled === 1 || settings?.deal_headline_enabled === true;
  const headlineText = settings?.deal_headline_text?.trim();
  const badgeText = settings?.deal_headline_badge?.trim() || "Special Deal";
  const linkUrl = settings?.deal_headline_link?.trim() || "/contact";
  const linkText = settings?.deal_headline_link_text?.trim() || "Inquire Now";

  useEffect(() => {
    if (!isEnabled || !headlineText) {
      setIsDismissed(true);
      return;
    }

    try {
      const dismissedHeadline = sessionStorage.getItem("thesevenspice_deal_dismissed");
      if (dismissedHeadline === headlineText) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    } catch (e) {
      setIsDismissed(false);
    }
  }, [isEnabled, headlineText]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      if (headlineText) {
        sessionStorage.setItem("thesevenspice_deal_dismissed", headlineText);
      }
    } catch (e) {}
  };

  if (!isEnabled || !headlineText || isDismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="Promotional Announcement"
      className="relative z-40 w-full bg-gradient-to-r from-primary via-[#6d0018] to-primary text-white border-b border-white/10 shadow-sm animate-fadeIn"
    >
      <div className="max-w-container-max mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2.5">
        
        {/* Deal Content & Link Container */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-center items-start gap-1 sm:gap-3 min-w-0 text-left sm:text-center">
          {/* Glowing Deal Badge */}
          <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-bold text-[9px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase shrink-0 animate-pulse">
            <Gift size={11} className="text-on-secondary-container shrink-0" />
            <span>{badgeText}</span>
          </span>

          {/* Headline Text with Inline CTA Link */}
          <p className="font-medium text-white/95 text-[11px] sm:text-xs md:text-sm leading-snug break-words">
            {headlineText}
            {linkUrl && (
              <Link
                href={linkUrl}
                className="inline-flex items-center gap-0.5 font-bold text-secondary-fixed hover:text-white underline underline-offset-2 transition-colors ml-1.5 whitespace-nowrap group"
              >
                <span>{linkText}</span>
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5 shrink-0 inline" />
              </Link>
            )}
          </p>
        </div>

        {/* Dismiss Close Button */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 self-center"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
