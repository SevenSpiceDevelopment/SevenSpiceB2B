"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function BrandPageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // When pathname changes, route transition has completed -> smoothly release lock
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Safety fallback: ensure click lock is never stuck for more than 6 seconds
  useEffect(() => {
    if (loading) {
      const safetyTimer = setTimeout(() => {
        setLoading(false);
      }, 6000);
      return () => clearTimeout(safetyTimer);
    }
  }, [loading]);

  // Completely block all pointer events, clicks, touches, and hover actions across the entire document during loading
  useEffect(() => {
    if (!loading) {
      document.documentElement.style.pointerEvents = "";
      return;
    }

    // Freeze all page interactions behind the loader
    document.documentElement.style.pointerEvents = "none";

    const blockAllUserEvents = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Capture and destroy all interaction events at window level
    const events = ["click", "mousedown", "mouseup", "pointerdown", "pointerup", "touchstart", "touchend", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, blockAllUserEvents, true);
    });

    return () => {
      document.documentElement.style.pointerEvents = "";
      events.forEach((evt) => {
        window.removeEventListener(evt, blockAllUserEvents, true);
      });
    };
  }, [loading]);

  useEffect(() => {
    // Intercept clicks on internal links to trigger the loading indicator and lock extra clicks
    const handleAnchorClick = (event) => {
      if (loading) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return;
      }

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
  }, [pathname, loading]);

  if (!loading) return null;

  return (
    <div
      id="global-page-loader-barrier"
      className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center select-none bg-black/15 backdrop-blur-[2px] transition-all duration-150 animate-fadeIn"
      style={{ pointerEvents: "all", touchAction: "none" }}
      aria-live="polite"
      aria-label="Loading..."
    >
      {/* Pure Simple Animated Bouncing Dots */}
      <div className="flex items-center gap-2.5 pointer-events-none">
        <span className="w-3.5 h-3.5 rounded-full bg-primary shadow-sm animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary-container shadow-sm animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3.5 h-3.5 rounded-full bg-secondary shadow-sm animate-bounce" />
      </div>
    </div>
  );
}
