"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Check, Search } from "lucide-react";
import { t } from "@/lib/translations";
import ProductSearchModal from "./ProductSearchModal";

export default function Navbar({ locale = "en", initialProducts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Listen for global keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSelectLanguage = (newLocale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="bg-surface/90 backdrop-blur-md w-full top-0 sticky border-b border-on-surface/10 z-50 shadow-[0_2px_15px_rgba(87,0,19,0.03)]">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-[68px] sm:h-20 flex-nowrap gap-3">
          
          {/* 1. BRAND LOGO (Shrink-0 to prevent compression) */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="relative block h-10 w-[140px] min-[375px]:w-[155px] sm:h-11 sm:w-[170px] md:h-12 md:w-[190px] overflow-hidden">
              <Image
                src="/images/logo/seven-spices-horizontal-header.png"
                alt={t("brand", locale)}
                fill
                priority
                quality={100}
                className="scale-[2.2] object-contain"
              />
            </span>
          </Link>

          {/* 2. DESKTOP NAV LINKS (Single Clean Row with No-Wrap & Drill-Down Dropdown) */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
            {/* Home Link */}
            <Link
              href="/"
              className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap py-2 ${
                pathname === "/"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("home", locale)}
            </Link>

            <Link
              href="/products"
              className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                pathname.startsWith("/products")
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("products", locale)}
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap py-2 ${
                pathname === "/about"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("about", locale)}
            </Link>

            {/* Spice Journal (Blog) */}
            <Link
              href="/blog"
              className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap py-2 ${
                pathname === "/blog"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("blog", locale)}
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              className={`text-sm font-semibold transition-colors duration-200 whitespace-nowrap py-2 ${
                pathname === "/contact"
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {t("contact", locale)}
            </Link>
          </div>

          {/* 3. CTA & ACTIONS (Sleek, Compact, Always Single-Row on Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Compact Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary hover:bg-slate-100 transition-all duration-200 border border-slate-200 rounded-full px-3.5 py-2 bg-surface-container-lowest text-xs font-semibold shadow-xs focus:outline-none whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={t("search", locale)}
            >
              <Search size={14} className="text-primary shrink-0" />
              <span className="hidden xl:inline text-slate-600">{locale === "ur" ? "تلاش کریں..." : "Search spices..."}</span>
              <span className="xl:hidden text-slate-600">{t("search", locale)}</span>
            </button>

            {/* Compact Language Switcher */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 transition-all duration-200 border border-slate-200 rounded-full px-3 py-2 bg-surface-container-lowest text-xs font-semibold shadow-xs focus:outline-none whitespace-nowrap cursor-pointer"
                aria-label={t("select_lang", locale)}
              >
                <Globe size={13} className="text-slate-500 shrink-0" />
                <span>{locale === "ur" ? "اردو" : "English"}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-20 animate-fadeIn flex flex-col gap-0.5">
                    <button
                      onClick={() => handleSelectLanguage("en")}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                        locale === "en"
                          ? "text-primary bg-primary/5 font-bold"
                          : "text-slate-700 hover:text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span>English</span>
                      {locale === "en" && <Check size={12} className="text-primary" />}
                    </button>
                    <button
                      onClick={() => handleSelectLanguage("ur")}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                        locale === "ur"
                          ? "text-primary bg-primary/5 font-bold"
                          : "text-slate-700 hover:text-primary hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-urdu">اردو (Urdu)</span>
                      {locale === "ur" && <Check size={12} className="text-primary" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Wholesale Inquiry Button (Sleek, Compact, No-Wrap) */}
            <Link
              href="/contact"
              className="bg-[#fccc38] hover:bg-[#eab308] text-[#2d1f00] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-md transition-all duration-200 shadow-[0_4px_16px_rgba(252,204,56,0.3)] hover:shadow-[0_6px_22px_rgba(252,204,56,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 whitespace-nowrap shrink-0 inline-flex items-center justify-center cursor-pointer"
            >
              {t("nav_cta", locale)}
            </Link>
          </div>

          {/* 4. MOBILE ACTIONS (Search + Hamburger) */}
          <div className="flex items-center gap-1.5 lg:hidden shrink-0">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 text-on-surface hover:text-primary transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label={t("search", locale)}
            >
              <Search size={20} className="text-primary" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 5. MOBILE DRAWER */}
        {isOpen && (
          <div className="relative z-50 lg:hidden bg-surface border-b border-on-surface/10 w-full px-margin-mobile py-5 flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  pathname === "/" ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                }`}
              >
                {t("home", locale)}
              </Link>

              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  pathname.startsWith("/products") ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                }`}
              >
                {t("products", locale)}
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  pathname === "/about" ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                }`}
              >
                {t("about", locale)}
              </Link>

              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  pathname === "/blog" ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                }`}
              >
                {t("blog", locale)}
              </Link>

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`text-base font-semibold py-2 transition-colors ${
                  pathname === "/contact" ? "text-primary font-bold" : "text-slate-700 hover:text-primary"
                }`}
              >
                {t("contact", locale)}
              </Link>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Language</span>
              <div className="flex h-8 bg-slate-100 border border-slate-200 rounded-full p-0.5">
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className={`!min-h-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all ${
                    locale === "en" ? "bg-primary text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleSelectLanguage("ur")}
                  className={`!min-h-0 h-7 px-3 rounded-full text-[11px] font-semibold transition-all ${
                    locale === "ur" ? "bg-primary text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  اردو
                </button>
              </div>
            </div>

            {/* Mobile CTA */}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="bg-[#fccc38] hover:bg-[#eab308] text-[#2d1f00] text-center font-bold text-xs uppercase tracking-wider py-3 rounded-md transition-all shadow-md active:scale-98 w-full inline-flex items-center justify-center cursor-pointer mt-1"
            >
              {t("nav_cta", locale)}
            </Link>
          </div>
        )}
      </nav>

      {/* Global Product Search Modal */}
      <ProductSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locale={locale}
        initialProducts={initialProducts}
      />
    </>
  );
}
