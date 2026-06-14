"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Inbox, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Globe,
  Menu,
  X,
  UserCheck
} from "lucide-react";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If it's the login page, don't show the dashboard shell layout
  const isLoginPage = pathname === "/admin/login";
  if (isLoginPage) {
    return <div className="min-h-screen bg-surface-container-low flex items-center justify-center">{children}</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products Manager", href: "/admin/products", icon: <Package size={18} /> },
    { name: "Blog Manager", href: "/admin/blog", icon: <FileText size={18} /> },
    { name: "Inquiries", href: "/admin/inquiries", icon: <Inbox size={18} /> },
    { name: "Quote Requests", href: "/admin/quotes", icon: <ClipboardList size={18} /> },
    { name: "Site Settings", href: "/admin/settings", icon: <Settings size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col md:flex-row text-on-surface">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-primary text-on-primary h-16 px-4 flex justify-between items-center z-30 shadow-md">
        <span className="font-bold font-headline-md-mobile text-sm">Spice Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Navigation">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-primary text-on-primary flex flex-col shrink-0 z-20 transition-all duration-300 md:translate-x-0 fixed md:static inset-y-0 left-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } pt-16 md:pt-0`}>
        {/* Brand Header */}
        <div className="h-20 px-6 items-center gap-2 border-b border-on-primary-container/20 hidden md:flex">
          <UserCheck className="text-secondary-fixed-dim" size={24} />
          <div>
            <h1 className="font-bold text-sm tracking-wide leading-tight">TheSevenSpice</h1>
            <span className="text-[10px] text-on-primary-container/80 uppercase font-mono tracking-widest font-semibold block">Control Panel</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded text-sm transition-all font-medium ${
                  isActive
                    ? "bg-secondary-container text-on-secondary-container font-bold shadow-sm"
                    : "text-on-primary/80 hover:bg-primary-container hover:text-on-primary"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-on-primary-container/10 space-y-2">
          {session?.user && (
            <div className="px-4 py-2 text-xs text-on-primary-container/60 truncate font-mono">
              Role: Admin ({session.user.email})
            </div>
          )}
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 text-xs text-on-primary/70 hover:text-on-primary transition-colors font-mono"
            target="_blank"
          >
            <Globe size={14} /> View Live Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm text-on-primary-container hover:bg-on-error/10 hover:text-on-primary transition-all font-medium border border-on-primary-container/10"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-full">
        {/* Breadcrumb banner */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-on-surface/10 pb-4 gap-2">
          <div>
            <span className="text-xs font-mono text-on-surface-variant/70 uppercase">Administration Workspace</span>
            <h2 className="font-headline-md-mobile text-primary font-semibold capitalize mt-0.5">
              {pathname?.split("/").pop()} Profile
            </h2>
          </div>
          <div className="text-xs font-mono text-on-surface-variant bg-surface border border-on-surface/10 rounded px-3 py-1.5 shadow-sm">
            UTC: {new Date().toISOString().substring(0, 10)}
          </div>
        </div>

        {/* View content */}
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>

      {/* Sidebar background overlay on mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-10 md:hidden"
        ></div>
      )}
    </div>
  );
}
