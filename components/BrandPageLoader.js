"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function BrandPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  // When pathname or search params change, route transition has completed
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on internal links to trigger the loading indicator instantly
    const handleAnchorClick = (event) => {
      const target = event.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto/tel, hash anchors, new tabs, and same-page links
      const isExternal = 
        target.target === "_blank" || 
        href.startsWith("http") || 
        href.startsWith("mailto:") || 
        href.startsWith("tel:");
      const isHash = href.startsWith("#");
      const isSamePage = href === pathname || href === window.location.pathname;

      if (!isExternal && !isHash && !isSamePage && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none select-none bg-black/10 backdrop-blur-[2px] transition-all duration-150 animate-fadeIn"
      aria-live="polite"
      aria-label="Loading..."
    >
      {/* Pure Simple Animated Bouncing Dots */}
      <div className="flex items-center gap-2.5">
        <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary-container shadow-sm animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary shadow-sm animate-bounce" />
      </div>
    </div>
  );
}
