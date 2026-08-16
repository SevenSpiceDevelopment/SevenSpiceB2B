"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When route transition finishes, complete the progress bar and fade out
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on internal links to trigger the loading bar instantly
    const handleAnchorClick = (event) => {
      const target = event.target.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, hash anchors, new tabs, and same-page links
      const isExternal = target.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
      const isHash = href.startsWith("#");
      const isSamePage = href === pathname || href === window.location.pathname;

      if (!isExternal && !isHash && !isSamePage && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        setLoading(true);
        setProgress(30);

        // Animate up to 80% while waiting for page response
        setTimeout(() => {
          setProgress((prev) => (prev < 80 ? 75 : prev));
        }, 200);
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300"
      style={{ opacity: loading || progress === 100 ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Top Gradient Progress Line */}
      <div
        className="h-[3.5px] bg-gradient-to-r from-primary via-secondary-container to-secondary shadow-[0_0_12px_rgba(252,204,56,0.9),_0_0_5px_rgba(87,0,19,0.5)] transition-all duration-300 ease-out rounded-r-full"
        style={{
          width: `${progress}%`,
        }}
      />
      {/* Glowing tip flare */}
      <div 
        className="absolute top-0 h-[3.5px] w-24 bg-gradient-to-r from-transparent to-white opacity-70 blur-[1px] -translate-y-[0.5px]"
        style={{
          left: `calc(${progress}% - 96px)`,
        }}
      />
    </div>
  );
}
