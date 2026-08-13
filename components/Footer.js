import Link from "next/link";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { t } from "@/lib/translations";

export default function Footer({ locale = "en", settings = {} }) {
  return (
    <footer className="bg-primary w-full border-t border-white/10 text-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Column 1: Brand / Description */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="inline-flex h-16 w-[252px] overflow-hidden items-center hover:opacity-80 transition-opacity">
              <img
                src="/images/logo/seven-spices-horizontal-header.png"
                alt={t("brand", locale)}
                className="block h-14 w-[240px] scale-[2.35] object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              {t("footer_desc", locale)}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">{t("footer_quick_links", locale)}</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-secondary-fixed transition-colors">
                  {t("home", locale)}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors">
                  {t("products", locale)}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  {t("about", locale)}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-secondary-fixed transition-colors">
                  {t("blog", locale)}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary-fixed transition-colors">
                  {t("contact", locale)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">{t("footer_services", locale)}</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/70">
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors">
                  {t("footer_wholesale", locale)}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  {t("footer_logistics", locale)}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  {t("footer_certifications", locale)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">{t("footer_contact_info", locale)}</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="block text-white/55 text-[10px] tracking-widest uppercase font-bold mb-1">{t("email", locale)}</span>
                <a 
                  href={`mailto:${settings.business_email || "sales@thesevenspice.com"}`} 
                  className="text-white hover:text-secondary-fixed transition-colors font-semibold font-body-md"
                >
                  {settings.business_email || "sales@thesevenspice.com"}
                </a>
              </div>
              <div>
                <span className="block text-white/55 text-[10px] tracking-widest uppercase font-bold mb-1">{t("phone", locale)}</span>
                <a 
                  href={`tel:${settings.business_phone || "+1 (800) 555-SPICE"}`} 
                  className="text-white hover:text-secondary-fixed transition-colors font-semibold font-body-md"
                >
                  {settings.business_phone || "+1 (800) 555-SPICE"}
                </a>
              </div>
            </div>
          </div>

          {/* Column 5: Follow Us */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">{t("footer_follow_us", locale)}</h3>
            <div className="flex gap-3">
              {settings.social_linkedin && (
                <a 
                  href={settings.social_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-primary hover:border-white transition-all duration-300 transform hover:scale-105"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {settings.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-primary hover:border-white transition-all duration-300 transform hover:scale-105"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              )}
              {settings.social_facebook && (
                <a 
                  href={settings.social_facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-primary hover:border-white transition-all duration-300 transform hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              )}
              {settings.social_youtube && (
                <a 
                  href={settings.social_youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/90 hover:bg-white hover:text-primary hover:border-white transition-all duration-300 transform hover:scale-105"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60 text-center sm:text-left">
            © 2024{" "}
            <Link href="/admin/login" className="hover:underline text-white/60">
              {t("brand", locale)}
            </Link>
            . {t("footer_all_rights", locale)}
          </p>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-secondary-fixed transition-colors">
              {t("footer_privacy", locale)}
            </Link>
            <Link href="/terms" className="hover:text-secondary-fixed transition-colors">
              {t("footer_terms", locale)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
