import Link from "next/link";
import { getSiteSettings } from "@/lib/db";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-surface-container-highest w-full border-t border-on-surface/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand / Description */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-headline-md text-headline-md text-on-surface font-semibold hover:text-primary transition-colors">
              TheSevenSpice
            </Link>
            <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
              Global Spice Logistics & Export. Bridging heritage agriculture with modern enterprise supply chains.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-surface text-base">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-surface text-base">Services</h3>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Logistics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-surface text-base">Contact Info</h3>
            <div className="flex flex-col gap-1.5 text-sm text-on-surface-variant">
              <div>
                <span className="block text-on-surface-variant">Email:</span>
                <a href={`mailto:${settings.business_email || "sales@thesevenspice.com"}`} className="text-on-surface hover:text-primary transition-colors">
                  {settings.business_email || "sales@thesevenspice.com"}
                </a>
              </div>
              <div className="mt-1.5">
                <span className="text-on-surface-variant">Phone: </span>
                <a href={`tel:${settings.business_phone || "+1 (800) 555-SPICE"}`} className="text-on-surface hover:text-primary transition-colors">
                  {settings.business_phone || "+1 (800) 555-SPICE"}
                </a>
              </div>
            </div>
          </div>

          {/* Column 5: Follow Us */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-surface text-base">Follow Us</h3>
            <div className="flex gap-3">
              {settings.social_linkedin && (
                <a 
                  href={settings.social_linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105"
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
                  className="w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105"
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
                  className="w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105"
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
                  className="w-8 h-8 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 transform hover:scale-105"
                  aria-label="YouTube"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-on-surface/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-variant/80 text-center sm:text-left">
            © 2024{" "}
            <Link href="/admin/login" className="hover:underline text-on-surface-variant">
              TheSevenSpice
            </Link>
            . All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-on-surface-variant/80">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

