"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldAlert } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide main navbar on admin dashboard pages
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="bg-surface w-full top-0 sticky border-b border-on-surface/10 z-50 shadow-[0_1px_3px_rgba(87,0,19,0.02)]">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        {/* Brand Name */}
        <Link href="/" className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md font-semibold text-primary hover:opacity-90 transition-opacity">
          TheSevenSpice
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-gutter items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-primary border-b-2 border-primary pb-1 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/products" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-primary/90 transition-colors">
            Request a Quote
          </Link>
          <Link href="/admin/dashboard" title="Admin Portal" className="text-on-surface-variant hover:text-primary transition-colors p-2" aria-label="Admin Portal">
            <ShieldAlert size={20} />
          </Link>
        </div>

        {/* Mobile Hamburguer Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-on-surface p-2 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-on-surface/10 w-full px-margin-mobile py-6 flex flex-col gap-6 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors duration-200 py-1 ${
                  isActive
                    ? "text-primary border-l-4 border-primary pl-3 font-bold"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="flex flex-col gap-4 pt-4 border-t border-on-surface/10">
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="bg-primary text-on-primary text-center font-label-md text-label-md px-6 py-3 rounded hover:bg-primary/90 transition-colors w-full"
            >
              Request a Quote
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="border border-on-surface/20 text-on-surface-variant text-center font-label-md text-label-md px-6 py-3 rounded hover:bg-on-surface/5 transition-colors w-full flex items-center justify-center gap-2"
            >
              <ShieldAlert size={16} /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
