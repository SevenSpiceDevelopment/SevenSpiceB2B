"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Check, Search } from "lucide-react";
import { t } from "@/lib/translations";
import ProductSearchModal from "./ProductSearchModal";

export default function Navbar({ locale = "en", initialProducts = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Listen for global keyboard shortcut (Cmd+K or Ctrl+K or /)
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

  // Hide main navbar on admin dashboard pages
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  const navLinks = [
    { name: t("home", locale), href: "/" },
    { name: t("products", locale), href: "/products" },
    { name: t("about", locale), href: "/about" },
    { name: t("blog", locale), href: "/blog" },
    { name: t("contact", locale), href: "/contact" }
  ];

  const handleSelectLanguage = (newLocale) => {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <>
      {/* Backdrop overlay to close drawer on click outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="bg-surface/80 backdrop-blur-md w-full top-0 sticky border-b border-on-surface/10 z-50 shadow-[0_4px_30px_rgba(87,0,19,0.02)]">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
          {/* Brand Name */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="relative block h-10 w-[140px] min-[375px]:w-[158px] sm:h-12 sm:w-[175px] md:h-14 md:w-[230px] overflow-hidden">
              <img
                src="/images/logo/seven-spices-horizontal-header.png"
                alt={t("brand", locale)}
                className="absolute inset-0 block h-full w-full scale-[2.35] object-contain"
              />
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex gap-gutter items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors duration-200 ${isActive
                      ? "text-primary border-b-2 border-primary pb-1 font-bold"
                      : "text-on-surface-variant hover:text-primary"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA & Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Desktop Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary hover:bg-on-surface/5 transition-all duration-200 border border-on-surface/10 rounded-full px-4 py-2 bg-surface-container-lowest text-xs font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none"
              aria-label={t("search", locale)}
            >
              <Search size={14} className="text-primary" />
              <span>{t("search_products", locale)}</span>
            </button>

            {/* Custom Language Dropdown (Desktop) */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary hover:bg-on-surface/5 transition-all duration-200 border border-on-surface/10 rounded-full px-4 py-2 bg-surface-container-lowest text-xs font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus:outline-none"
                aria-label={t("select_lang", locale)}
              >
                <Globe size={14} className="text-on-surface-variant/60" />
                <span>{locale === "ur" ? "اردو" : "English"}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <>
                  {/* Invisible background overlay to trigger click outside close */}
                  <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsLangOpen(false)} />

                  {/* Dropdown Card Popover */}
                  <div className="absolute right-0 mt-2 w-36 bg-surface/95 backdrop-blur-md border border-on-surface/10 rounded-lg shadow-xl py-1.5 z-20 animate-fadeIn flex flex-col gap-0.5">
                    <button
                      onClick={() => handleSelectLanguage("en")}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors duration-150 ${locale === "en"
                          ? "text-primary bg-primary/5 font-bold"
                          : "text-on-surface-variant hover:text-primary hover:bg-on-surface/5"
                        }`}
                    >
                      <span>English</span>
                      {locale === "en" && <Check size={12} className="text-primary" />}
                    </button>
                    <button
                      onClick={() => handleSelectLanguage("ur")}
                      className={`flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors duration-150 ${locale === "ur"
                          ? "text-primary bg-primary/5 font-bold"
                          : "text-on-surface-variant hover:text-primary hover:bg-on-surface/5"
                        }`}
                    >
                      <span className="font-urdu">اردو (Urdu)</span>
                      {locale === "ur" && <Check size={12} className="text-primary" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            <Link href="/contact" className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-6 py-2.5 rounded hover:opacity-90 transition-all shadow-sm">
              {t("nav_cta", locale)}
            </Link>
          </div>

          {/* Mobile Actions (Search + Hamburger) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-lowest border border-on-surface/10 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all active:scale-95 shadow-sm"
              aria-label={t("search", locale)}
            >
              <Search size={18} className="text-primary" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="relative z-50 lg:hidden bg-surface border-b border-on-surface/10 w-full px-margin-mobile py-6 flex flex-col gap-5 animate-fadeIn">
            {/* Mobile Drawer Quick Search */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-on-surface/10 text-on-surface-variant hover:text-primary transition-colors text-sm shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Search size={16} className="text-primary" />
                <span className="font-medium">{t("search_placeholder", locale)}</span>
              </div>
              <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">
                {t("search", locale)}
              </span>
            </button>

            <div className="flex flex-col gap-1 pt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-medium transition-colors duration-200 py-2 ${isActive
                        ? locale === "ur"
                          ? "text-primary border-r-4 border-primary pr-3 font-bold text-right"
                          : "text-primary border-l-4 border-primary pl-3 font-bold text-left"
                        : "text-on-surface-variant hover:text-primary"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-on-surface/10">
              <span className="text-sm font-semibold text-on-surface-variant">Language</span>
              <div className="flex h-9 bg-surface-container border border-on-surface/10 rounded-full p-0.5">
                <button onClick={() => handleSelectLanguage("en")} className={`!min-h-0 h-8 px-3 rounded-full text-[11px] font-semibold ${locale === "en" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant"}`}>EN</button>
                <button onClick={() => handleSelectLanguage("ur")} className={`!min-h-0 h-8 px-3 rounded-full text-[11px] font-semibold ${locale === "ur" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface-variant"}`}>اردو</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-secondary-container text-on-secondary-container text-center font-label-md text-label-md px-6 py-3.5 rounded hover:opacity-90 transition-all w-full shadow-sm"
              >
                {t("nav_cta", locale)}
              </Link>
            </div>
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
