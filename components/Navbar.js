"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Check } from "lucide-react";
import { t } from "@/lib/translations";

export default function Navbar({ locale = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();

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

          {/* CTA & Language Switcher (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
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

            <Link href="/contact" className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-6 py-3 rounded hover:opacity-90 transition-all">
              {t("nav_cta", locale)}
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Language switcher is inside the drawer */}
            <div className="hidden">
              <button
                onClick={() => handleSelectLanguage("en")}
                className={`!min-h-0 h-8 px-2.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${locale === "en"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                EN
              </button>
              <button
                onClick={() => handleSelectLanguage("ur")}
                className={`!min-h-0 h-8 px-2.5 rounded-full text-[11px] font-semibold transition-all duration-200 ${locale === "ur"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                اردو
              </button>
            </div>

            {/* Mobile Hamburguer Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-on-surface p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="relative z-50 lg:hidden bg-surface border-b border-on-surface/10 w-full px-margin-mobile py-6 flex flex-col gap-6 animate-fadeIn">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors duration-200 py-1 ${isActive
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
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-on-surface/10">
              <span className="text-sm font-semibold text-on-surface-variant">Language</span>
              <div className="flex h-9 bg-surface-container border border-on-surface/10 rounded-full p-0.5">
                <button onClick={() => handleSelectLanguage("en")} className={`!min-h-0 h-8 px-3 rounded-full text-[11px] font-semibold ${locale === "en" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>EN</button>
                <button onClick={() => handleSelectLanguage("ur")} className={`!min-h-0 h-8 px-3 rounded-full text-[11px] font-semibold ${locale === "ur" ? "bg-primary text-on-primary" : "text-on-surface-variant"}`}>اردو</button>
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-4 border-t border-on-surface/10">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="bg-secondary-container text-on-secondary-container text-center font-label-md text-label-md px-6 py-3 rounded hover:opacity-90 transition-all w-full"
              >
                {t("nav_cta", locale)}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
