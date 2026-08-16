"use client";

import { useState, useMemo } from "react";
import { saveSiteSettingsAction, changeAdminPasswordAction } from "@/app/actions";
import { 
  Home, 
  Share2, 
  Lock, 
  Check, 
  AlertCircle, 
  Loader2,
  Phone,
  Mail,
  MapPin,
  Gift,
  Megaphone,
  ArrowRight,
  Eye,
  CheckCircle2,
  Activity,
  Layers
} from "lucide-react";

export default function SettingsManager({ initialSettings }) {
  const [activeTab, setActiveTab] = useState("deals");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Live preview state for Deal Headline
  const [dealEnabled, setDealEnabled] = useState(
    initialSettings?.deal_headline_enabled === 1 || initialSettings?.deal_headline_enabled === true
  );
  const [dealBadge, setDealBadge] = useState(initialSettings?.deal_headline_badge || "Special Deal");
  const [dealText, setDealText] = useState(
    initialSettings?.deal_headline_text || "New Season Harvest: 15% discount on bulk Grade-A Saffron & Fenugreek wholesale orders!"
  );
  const [dealLink, setDealLink] = useState(initialSettings?.deal_headline_link || "/contact");
  const [dealLinkText, setDealLinkText] = useState(initialSettings?.deal_headline_link_text || "Inquire Now");

  // Live preview state for Marquee Ticker
  const [tickerEnabled, setTickerEnabled] = useState(
    initialSettings?.marquee_ticker_enabled !== false && initialSettings?.marquee_ticker_enabled !== 0
  );

  const initialTickerText = useMemo(() => {
    let raw = initialSettings?.marquee_ticker_items;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.join("\n");
      } catch (e) {
        return raw;
      }
    } else if (Array.isArray(raw) && raw.length > 0) {
      return raw.join("\n");
    }
    return [
      "🌿 100% Origin Farm Sourced",
      "🔬 ISO 3632 & ISO 22000 Certified Quality",
      "🚢 Worldwide Ocean & Air Freight (FOB / CIF / DDP)",
      "📦 Vacuum-Sealed Moisture Barrier Packing",
      "🌱 Zero Pesticide & 100% Adulteration-Free Guarantee",
      "⚡ Custom Private-Label Blending & Packaging",
      "🌍 Exporting to 30+ Global Ports & Wholesale Distributors"
    ].join("\n");
  }, [initialSettings?.marquee_ticker_items]);

  const [tickerText, setTickerText] = useState(initialTickerText);

  const parsedTickerItems = useMemo(() => {
    return tickerText.split("\n").map(s => s.trim()).filter(Boolean);
  }, [tickerText]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await saveSiteSettingsAction(formData);
      if (res.success) {
        setSuccess(res.message);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to save site configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await changeAdminPasswordAction(formData);
      if (res.success) {
        setSuccess(res.message);
        e.target.reset();
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Failed to change admin password.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "deals", name: "Deals & Moving Ticker", icon: <Gift size={16} /> },
    { id: "hero", name: "Homepage Copywriting", icon: <Home size={16} /> },
    { id: "contact", name: "HQ Contact & Socials", icon: <Share2 size={16} /> },
    { id: "security", name: "Admin Security Profile", icon: <Lock size={16} /> }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Navigation */}
      <div className="flex border-b border-on-surface/10 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setError("");
              setSuccess("");
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {success && (
        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-lg flex items-center gap-3 text-sm animate-fadeIn shadow-xs">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded-lg flex items-center gap-3 text-sm animate-fadeIn shadow-xs">
          <AlertCircle size={18} className="text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Forms */}
      <div className="bg-surface border border-on-surface/10 rounded-xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-30"></div>

        {/* 1. DEALS & SCROLLING TICKER TAB */}
        {activeTab === "deals" && (
          <form onSubmit={handleSettingsSubmit} className="space-y-10 relative z-10">
            {/* SECTION 1: PROMOTIONAL DEAL HEADLINE */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-on-surface/5 pb-4">
                <div>
                  <h4 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
                    <Megaphone size={18} className="text-secondary" />
                    Website Deal Headline & Announcement Banner (Top)
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Displays an eye-catching deal headline above the navbar for promotions, harvest specials, and bulk discounts.
                  </p>
                </div>

                {/* Active Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    name="deal_headline_enabled"
                    value="true"
                    checked={dealEnabled}
                    onChange={(e) => setDealEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-on-surface/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-xs font-semibold text-primary">
                    {dealEnabled ? "Banner Active" : "Banner Disabled"}
                  </span>
                </label>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-on-surface/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} className="text-secondary" /> Live Banner Preview
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    dealEnabled ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                  }`}>
                    {dealEnabled ? "LIVE ON SITE" : "HIDDEN"}
                  </span>
                </div>

                {/* Mock Banner */}
                <div className="w-full bg-gradient-to-r from-primary via-[#6d0018] to-primary text-white p-3 rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs uppercase">
                      <Gift size={10} />
                      {dealBadge || "Deal"}
                    </span>
                    <span className="font-medium text-white/95 line-clamp-1">
                      {dealText || "Write your promotional headline message..."}
                    </span>
                    {dealLink && (
                      <span className="inline-flex items-center gap-0.5 font-bold text-secondary-fixed underline underline-offset-2 text-xs">
                        {dealLinkText || "Inquire Now"}
                        <ArrowRight size={11} />
                      </span>
                    )}
                  </div>
                  <span className="text-white/60 text-xs">✕</span>
                </div>
              </div>

              {/* Form Fields for Deal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="deal-badge">
                    Deal Tag / Badge Label *
                  </label>
                  <input
                    id="deal-badge"
                    name="deal_headline_badge"
                    value={dealBadge}
                    onChange={(e) => setDealBadge(e.target.value)}
                    placeholder="e.g. Special Deal, Flash Offer, New Harvest"
                    required
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                  />
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="deal-text">
                    Promotional Headline / Deal Message *
                  </label>
                  <input
                    id="deal-text"
                    name="deal_headline_text"
                    value={dealText}
                    onChange={(e) => setDealText(e.target.value)}
                    placeholder="e.g. Special Harvest Offer: 15% discount on bulk Grade-A Saffron wholesale orders!"
                    required
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="deal-link">
                    Call-to-Action Link Destination *
                  </label>
                  <input
                    id="deal-link"
                    name="deal_headline_link"
                    value={dealLink}
                    onChange={(e) => setDealLink(e.target.value)}
                    placeholder="/contact or /products"
                    required
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm font-mono"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="deal-link-text">
                    Call-to-Action Button Label *
                  </label>
                  <input
                    id="deal-link-text"
                    name="deal_headline_link_text"
                    value={dealLinkText}
                    onChange={(e) => setDealLinkText(e.target.value)}
                    placeholder="e.g. Inquire Now, Claim Offer, View Deals"
                    required
                    disabled={loading}
                    className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: CONTINUOUS MOVING TICKER */}
            <div className="space-y-6 pt-6 border-t border-on-surface/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-on-surface/5 pb-4">
                <div>
                  <h4 className="font-title-lg text-title-lg text-primary flex items-center gap-2">
                    <Activity size={18} className="text-secondary" />
                    Continuous Moving Marquee Slide (Below Navbar)
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1">
                    An animated, infinite moving ribbon directly below the navbar. Enter your key enterprise highlights, certifications, and live assurances (one per line).
                  </p>
                </div>

                {/* Ticker Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    name="marquee_ticker_enabled"
                    value="true"
                    checked={tickerEnabled}
                    onChange={(e) => setTickerEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-on-surface/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  <span className="ml-3 text-xs font-semibold text-primary">
                    {tickerEnabled ? "Ticker Active" : "Ticker Disabled"}
                  </span>
                </label>
              </div>

              {/* Live Moving Ticker Preview */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-on-surface/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Eye size={13} className="text-secondary" /> Live Moving Ticker Preview
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    tickerEnabled ? "bg-emerald-100 text-emerald-800" : "bg-zinc-200 text-zinc-600"
                  }`}>
                    {tickerEnabled ? "LIVE ON SITE" : "HIDDEN"}
                  </span>
                </div>

                {/* Animated Mock Ticker */}
                <div className="w-full bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container border border-on-surface/10 py-2.5 rounded-lg overflow-hidden relative select-none">
                  <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar animate-pulse text-xs font-bold text-primary uppercase tracking-wider px-3">
                    {parsedTickerItems.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 shrink-0">
                        <span>{item}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticker Items Editor Textarea */}
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="ticker-items">
                  Marquee Items (Enter one item per line) *
                </label>
                <textarea
                  id="ticker-items"
                  name="marquee_ticker_items"
                  rows={6}
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  placeholder="🌿 100% Origin Farm Sourced&#10;🔬 ISO 3632 & ISO 22000 Certified Quality&#10;🚢 Worldwide Ocean Freight (FOB / CIF)"
                  required
                  disabled={loading}
                  className="bg-transparent border border-on-surface/20 rounded-lg p-3 font-mono text-xs sm:text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary leading-relaxed"
                />
                <span className="text-[11px] text-on-surface-variant/70 mt-1">
                  Tip: You can include emojis (🌿, 🔬, 🚢, 📦, 🌱, ⚡, 🌍) to make the ticker visually engaging.
                </span>
              </div>
            </div>

            {/* Hidden fields to preserve other settings */}
            <input type="hidden" name="hero_title" value={initialSettings?.hero_title || ""} />
            <input type="hidden" name="hero_subtitle" value={initialSettings?.hero_subtitle || ""} />
            <input type="hidden" name="hero_cta_text" value={initialSettings?.hero_cta_text || ""} />
            <input type="hidden" name="hero_cta_link" value={initialSettings?.hero_cta_link || ""} />
            <input type="hidden" name="business_address" value={initialSettings?.business_address || ""} />
            <input type="hidden" name="business_phone" value={initialSettings?.business_phone || ""} />
            <input type="hidden" name="business_email" value={initialSettings?.business_email || ""} />
            <input type="hidden" name="social_facebook" value={initialSettings?.social_facebook || ""} />
            <input type="hidden" name="social_twitter" value={initialSettings?.social_twitter || ""} />
            <input type="hidden" name="social_instagram" value={initialSettings?.social_instagram || ""} />
            <input type="hidden" name="social_linkedin" value={initialSettings?.social_linkedin || ""} />
            <input type="hidden" name="social_youtube" value={initialSettings?.social_youtube || ""} />
            <input type="hidden" name="whatsapp_number" value={initialSettings?.whatsapp_number || ""} />
            <input type="hidden" name="whatsapp_message" value={initialSettings?.whatsapp_message || ""} />

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Save Deals & Moving Ticker
              </button>
            </div>
          </form>
        )}

        {/* 2. HERO TAB */}
        {activeTab === "hero" && (
          <form onSubmit={handleSettingsSubmit} className="space-y-6 relative z-10">
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2">
              Homepage Hero Specifications
            </h4>
            
            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="hero-title">
                Hero Title Header Text *
              </label>
              <textarea
                id="hero-title"
                name="hero_title"
                required
                rows={2}
                defaultValue={initialSettings?.hero_title || ""}
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm resize-y"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="hero-sub">
                Hero Subtitle / Description *
              </label>
              <textarea
                id="hero-sub"
                name="hero_subtitle"
                required
                rows={3}
                defaultValue={initialSettings?.hero_subtitle || ""}
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="hero-cta-t">
                  Hero CTA Button Text *
                </label>
                <input
                  id="hero-cta-t"
                  name="hero_cta_text"
                  required
                  placeholder="Submit Inquiry"
                  defaultValue={initialSettings?.hero_cta_text || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="hero-cta-l">
                  Hero CTA Link Destination *
                </label>
                <input
                  id="hero-cta-l"
                  name="hero_cta_link"
                  required
                  placeholder="/contact"
                  defaultValue={initialSettings?.hero_cta_link || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>
            </div>

            {/* Hidden fields to preserve other settings */}
            <input type="hidden" name="deal_headline_enabled" value={dealEnabled ? "true" : "false"} />
            <input type="hidden" name="deal_headline_badge" value={dealBadge || ""} />
            <input type="hidden" name="deal_headline_text" value={dealText || ""} />
            <input type="hidden" name="deal_headline_link" value={dealLink || ""} />
            <input type="hidden" name="deal_headline_link_text" value={dealLinkText || ""} />
            <input type="hidden" name="marquee_ticker_enabled" value={tickerEnabled ? "true" : "false"} />
            <input type="hidden" name="marquee_ticker_items" value={tickerText} />
            <input type="hidden" name="business_address" value={initialSettings?.business_address || ""} />
            <input type="hidden" name="business_phone" value={initialSettings?.business_phone || ""} />
            <input type="hidden" name="business_email" value={initialSettings?.business_email || ""} />
            <input type="hidden" name="social_facebook" value={initialSettings?.social_facebook || ""} />
            <input type="hidden" name="social_twitter" value={initialSettings?.social_twitter || ""} />
            <input type="hidden" name="social_instagram" value={initialSettings?.social_instagram || ""} />
            <input type="hidden" name="social_linkedin" value={initialSettings?.social_linkedin || ""} />
            <input type="hidden" name="social_youtube" value={initialSettings?.social_youtube || ""} />
            <input type="hidden" name="whatsapp_number" value={initialSettings?.whatsapp_number || ""} />
            <input type="hidden" name="whatsapp_message" value={initialSettings?.whatsapp_message || ""} />

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Save Homepage Copy
              </button>
            </div>
          </form>
        )}

        {/* 3. CONTACT TAB */}
        {activeTab === "contact" && (
          <form onSubmit={handleSettingsSubmit} className="space-y-6 relative z-10">
            {/* HQ Info */}
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2 flex items-center gap-2">
              <MapPin size={18} className="text-secondary" /> Corporate HQ Identifiers
            </h4>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="corp-address">
                HQ Mailing Address *
              </label>
              <textarea
                id="corp-address"
                name="business_address"
                required
                rows={2}
                defaultValue={initialSettings?.business_address || ""}
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 flex items-center gap-1" htmlFor="corp-phone">
                  <Phone size={12} className="text-secondary" /> Sales Phone Line *
                </label>
                <input
                  id="corp-phone"
                  name="business_phone"
                  required
                  defaultValue={initialSettings?.business_phone || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1 flex items-center gap-1" htmlFor="corp-email">
                  <Mail size={12} className="text-secondary" /> B2B Sourcing Email *
                </label>
                <input
                  id="corp-email"
                  name="business_email"
                  required
                  type="email"
                  defaultValue={initialSettings?.business_email || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>
            </div>

            {/* Social Directories */}
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2 pt-4 flex items-center gap-2">
              <Share2 size={18} className="text-secondary" /> Verified Social Directories
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-fb">
                  Facebook Page URL
                </label>
                <input
                  id="soc-fb"
                  name="social_facebook"
                  defaultValue={initialSettings?.social_facebook || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-tw">
                  Twitter / X Profile
                </label>
                <input
                  id="soc-tw"
                  name="social_twitter"
                  defaultValue={initialSettings?.social_twitter || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-ig">
                  Instagram Direct
                </label>
                <input
                  id="soc-ig"
                  name="social_instagram"
                  defaultValue={initialSettings?.social_instagram || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-li">
                  LinkedIn Enterprise Profile
                </label>
                <input
                  id="soc-li"
                  name="social_linkedin"
                  defaultValue={initialSettings?.social_linkedin || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-yt">
                  YouTube Channel
                </label>
                <input
                  id="soc-yt"
                  name="social_youtube"
                  defaultValue={initialSettings?.social_youtube || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>
            </div>

            {/* WhatsApp Integration */}
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2 pt-4 flex items-center gap-2">
              <Phone size={18} className="text-emerald-600" /> WhatsApp Quick Chat Integration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="wa-num">
                  WhatsApp Number (with country code)
                </label>
                <input
                  id="wa-num"
                  name="whatsapp_number"
                  placeholder="+15550000000"
                  defaultValue={initialSettings?.whatsapp_number || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="wa-msg">
                  Default Chat Message
                </label>
                <input
                  id="wa-msg"
                  name="whatsapp_message"
                  placeholder="Hello TheSevenSpice, I would like to inquire..."
                  defaultValue={initialSettings?.whatsapp_message || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
                />
              </div>
            </div>

            {/* Hidden fields to preserve other settings */}
            <input type="hidden" name="deal_headline_enabled" value={dealEnabled ? "true" : "false"} />
            <input type="hidden" name="deal_headline_badge" value={dealBadge || ""} />
            <input type="hidden" name="deal_headline_text" value={dealText || ""} />
            <input type="hidden" name="deal_headline_link" value={dealLink || ""} />
            <input type="hidden" name="deal_headline_link_text" value={dealLinkText || ""} />
            <input type="hidden" name="marquee_ticker_enabled" value={tickerEnabled ? "true" : "false"} />
            <input type="hidden" name="marquee_ticker_items" value={tickerText} />
            <input type="hidden" name="hero_title" value={initialSettings?.hero_title || ""} />
            <input type="hidden" name="hero_subtitle" value={initialSettings?.hero_subtitle || ""} />
            <input type="hidden" name="hero_cta_text" value={initialSettings?.hero_cta_text || ""} />
            <input type="hidden" name="hero_cta_link" value={initialSettings?.hero_cta_link || ""} />

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Save HQ Contacts & WhatsApp
              </button>
            </div>
          </form>
        )}

        {/* 4. SECURITY TAB */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg relative z-10">
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2 flex items-center gap-2">
              <Lock size={18} className="text-secondary" /> Administrative Passkey Rotation
            </h4>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="pass-curr">
                Current Passkey *
              </label>
              <input
                id="pass-curr"
                name="current_password"
                required
                type="password"
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="pass-new">
                New Access Password *
              </label>
              <input
                id="pass-new"
                name="new_password"
                required
                type="password"
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="pass-conf">
                Confirm New Password *
              </label>
              <input
                id="pass-conf"
                name="confirm_password"
                required
                type="password"
                disabled={loading}
                className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface text-sm"
              />
            </div>

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm w-full sm:w-auto"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Change Password Keys
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
