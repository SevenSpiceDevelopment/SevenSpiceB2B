import Link from "next/link";
import { getSiteSettings } from "@/lib/db";
import { Shield } from "lucide-react";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-surface-container-highest w-full mt-stack-lg border-t border-on-surface/10">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto gap-stack-md md:gap-0">
        <div>
          <div className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md font-semibold text-primary mb-2">
            TheSevenSpice
          </div>
          <p className="text-on-surface-variant max-w-sm text-sm">
            {settings.hero_subtitle || "Exquisite Spices sourced globally, delivered reliably."}
          </p>
          <div className="mt-4 text-xs text-on-surface-variant/70 flex flex-col gap-1">
            <p><strong>HQ:</strong> {settings.business_address}</p>
            <p><strong>Sales:</strong> {settings.business_phone} | <strong>Email:</strong> {settings.business_email}</p>
          </div>
        </div>

        <div className="flex flex-col md:items-end gap-4">
          <div className="flex flex-wrap gap-stack-sm md:gap-gutter">
            <Link className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline transition-all" href="/about">
              About Us
            </Link>
            <Link className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline transition-all" href="/products">
              Products Catalog
            </Link>
            <Link className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline transition-all" href="/contact">
              Contact / Inquiry
            </Link>
            <Link className="text-on-surface-variant font-body-md text-body-md hover:text-primary underline transition-all" href="/admin/login">
              Admin Portal
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-2">
            {settings.social_linkedin && (
              <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                LinkedIn
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                Facebook
              </a>
            )}
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                Twitter
              </a>
            )}
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-margin-mobile md:px-margin-desktop pb-stack-lg max-w-container-max mx-auto border-t border-on-surface/5 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-body-md text-body-md text-on-surface-variant opacity-70 text-xs text-center sm:text-left">
          © {new Date().getFullYear()} TheSevenSpice. All rights reserved. Global Spice Logistics & Export.
        </p>
        <Link href="/admin/dashboard" className="text-xs text-on-surface-variant/50 hover:text-primary flex items-center gap-1 transition-colors">
          <Shield size={12} /> Secure Admin Panel
        </Link>
      </div>
    </footer>
  );
}
