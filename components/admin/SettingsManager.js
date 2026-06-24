"use client";

import { useState } from "react";
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
  MapPin
} from "lucide-react";

export default function SettingsManager({ initialSettings }) {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${
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
        <div className="bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <Check size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle size={18} className="text-error" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Forms */}
      <div className="bg-surface border border-on-surface/10 rounded-lg p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-30"></div>

        {/* 1. HERO TAB */}
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
            <input type="hidden" name="business_address" value={initialSettings?.business_address || ""} />
            <input type="hidden" name="business_phone" value={initialSettings?.business_phone || ""} />
            <input type="hidden" name="business_email" value={initialSettings?.business_email || ""} />
            <input type="hidden" name="social_facebook" value={initialSettings?.social_facebook || ""} />
            <input type="hidden" name="social_twitter" value={initialSettings?.social_twitter || ""} />
            <input type="hidden" name="social_instagram" value={initialSettings?.social_instagram || ""} />
            <input type="hidden" name="social_linkedin" value={initialSettings?.social_linkedin || ""} />
            <input type="hidden" name="social_youtube" value={initialSettings?.social_youtube || ""} />

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Save Homepage Copy
              </button>
            </div>
          </form>
        )}

        {/* 2. CONTACT TAB */}
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

            {/* Social Links */}
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2 pt-4 flex items-center gap-2">
              <Share2 size={18} className="text-secondary" /> Marketing & Social URLs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-linkedin">
                  LinkedIn Company Page
                </label>
                <input
                  id="soc-linkedin"
                  name="social_linkedin"
                  placeholder="https://linkedin.com/company/thesevenspice"
                  defaultValue={initialSettings?.social_linkedin || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-facebook">
                  Facebook Page
                </label>
                <input
                  id="soc-facebook"
                  name="social_facebook"
                  placeholder="https://facebook.com/thesevenspice"
                  defaultValue={initialSettings?.social_facebook || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-twitter">
                  Twitter profile
                </label>
                <input
                  id="soc-twitter"
                  name="social_twitter"
                  placeholder="https://twitter.com/thesevenspice"
                  defaultValue={initialSettings?.social_twitter || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-instagram">
                  Instagram Profile
                </label>
                <input
                  id="soc-instagram"
                  name="social_instagram"
                  placeholder="https://instagram.com/thesevenspice"
                  defaultValue={initialSettings?.social_instagram || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="soc-youtube">
                  YouTube Channel
                </label>
                <input
                  id="soc-youtube"
                  name="social_youtube"
                  placeholder="https://youtube.com/@thesevenspice"
                  defaultValue={initialSettings?.social_youtube || ""}
                  disabled={loading}
                  className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface-variant text-sm font-mono"
                />
              </div>
            </div>

            {/* Hidden fields to preserve other settings */}
            <input type="hidden" name="hero_title" value={initialSettings?.hero_title || ""} />
            <input type="hidden" name="hero_subtitle" value={initialSettings?.hero_subtitle || ""} />
            <input type="hidden" name="hero_cta_text" value={initialSettings?.hero_cta_text || ""} />
            <input type="hidden" name="hero_cta_link" value={initialSettings?.hero_cta_link || ""} />

            <div className="pt-4 border-t border-on-surface/5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm"
              >
                {loading && <Loader2 className="animate-spin w-3.5 h-3.5" />}
                Save Headquarters Profile
              </button>
            </div>
          </form>
        )}

        {/* 3. SECURITY TAB */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6 relative z-10 max-w-md">
            <h4 className="font-title-lg text-title-lg text-primary border-b border-on-surface/5 pb-2">
              Update Administrator Access Password
            </h4>

            <div className="flex flex-col">
              <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="pass-curr">
                Current Password *
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
                className="bg-secondary-container text-on-secondary-container font-label-md text-xs px-6 py-2.5 rounded hover:opacity-90 transition-all flex items-center gap-1.5 disabled:bg-secondary-container/70 shadow-sm w-full sm:w-auto"
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
