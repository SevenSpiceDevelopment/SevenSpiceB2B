import Link from "next/link";
import { getSiteSettings } from "@/lib/db";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-primary w-full border-t border-white/10 text-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Column 1: Brand / Description */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <span className="font-serif text-3xl font-bold text-white">The</span>
              <span className="font-serif text-3xl font-bold text-secondary-fixed">SevenSpice</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Global Spice Logistics & Export. Bridging heritage agriculture with modern enterprise supply chains.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">Quick Links</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-secondary-fixed transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-secondary-fixed transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary-fixed transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">Services</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/70">
              <li>
                <Link href="/products" className="hover:text-secondary-fixed transition-colors">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  Logistics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-secondary-fixed transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">Contact Info</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="block text-white/55 text-[10px] tracking-widest uppercase font-bold mb-1">Email</span>
                <a 
                  href={`mailto:${settings.business_email || "sales@thesevenspice.com"}`} 
                  className="text-white hover:text-secondary-fixed transition-colors font-semibold font-body-md"
                >
                  {settings.business_email || "sales@thesevenspice.com"}
                </a>
              </div>
              <div>
                <span className="block text-white/55 text-[10px] tracking-widest uppercase font-bold mb-1">Phone</span>
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
            <h3 className="font-bold text-secondary-fixed text-xs uppercase tracking-wider">Follow Us</h3>
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
              TheSevenSpice
            </Link>
            . All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-secondary-fixed transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-secondary-fixed transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

