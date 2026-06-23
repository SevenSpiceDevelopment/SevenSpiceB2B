"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { t } from "@/lib/translations";

export default function ContactForm({ locale = "en" }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Quick validation
    const email = formData.get("email");
    if (email && !email.includes("@")) {
      setValidationError(t("validation_email", locale));
      setLoading(false);
      return;
    }

    try {
      const res = await submitInquiry(null, formData);
      setResult(res);
      if (res.success) {
        e.target.reset();
      }
    } catch (err) {
      setResult({ success: false, error: t("inquiry_send_error", locale) });
    } finally {
      setLoading(false);
    }
  };

  const getSuccessMessage = (originalMessage) => {
    if (locale === "ur") {
      return "شکریہ! آپ کی انکوائری کامیابی کے ساتھ جمع ہو گئی ہے۔ ہماری ٹیم جلد ہی آپ سے رابطہ کرے گی۔";
    }
    return originalMessage;
  };

  if (result?.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fadeIn">
        <CheckCircle2 className="text-secondary w-16 h-16 mb-4 animate-bounce" />
        <h3 className="font-headline-md-mobile text-primary mb-2">{t("form_success_title", locale)}</h3>
        <p className="text-on-surface-variant max-w-md mb-6">
          {getSuccessMessage(result.message)}
        </p>
        <button 
          onClick={() => setResult(null)} 
          className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/5 transition-colors font-label-md text-sm"
        >
          {t("form_success_btn", locale)}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
      <div className="border-b border-on-surface/10 pb-4 mb-6">
        <h2 className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md text-primary font-bold">
          {t("form_title", locale)}
        </h2>
        <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
          {t("form_desc", locale)}
        </p>
      </div>

      {result?.error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <span className="font-semibold">{result.error}</span>
        </div>
      )}

      {validationError && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="name">
            {t("form_label_name", locale)} <span className="text-error">{t("form_required_star", locale)}</span>
          </label>
          <input
            className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface/35 transition-all duration-200 outline-none disabled:opacity-60"
            id="name"
            name="name"
            placeholder={t("form_name_placeholder", locale)}
            required
            type="text"
            disabled={loading}
          />
        </div>
        
        {/* Company */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="company">
            {t("form_label_company", locale)} <span className="text-on-surface-variant/50 text-xs font-normal">{t("form_optional", locale)}</span>
          </label>
          <input
            className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface/35 transition-all duration-200 outline-none disabled:opacity-60"
            id="company"
            name="company"
            placeholder={t("form_company_placeholder", locale)}
            type="text"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="email">
            {t("form_label_email", locale)} <span className="text-error">{t("form_required_star", locale)}</span>
          </label>
          <input
            className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface/35 transition-all duration-200 outline-none disabled:opacity-60"
            id="email"
            name="email"
            placeholder="john@acmefoods.com"
            required
            type="email"
            disabled={loading}
          />
        </div>
        
        {/* Phone */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="phone">
            {t("form_label_phone", locale)} <span className="text-on-surface-variant/50 text-xs font-normal">{t("form_optional", locale)}</span>
          </label>
          <input
            className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface/35 transition-all duration-200 outline-none disabled:opacity-60"
            id="phone"
            name="phone"
            placeholder={t("form_phone_placeholder", locale)}
            type="tel"
            disabled={loading}
          />
        </div>
      </div>

      {/* Product Interest */}
      <div className="flex flex-col">
        <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="interest">
          {t("form_label_interest", locale)} <span className="text-error">{t("form_required_star", locale)}</span>
        </label>
        <select
          className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface transition-all duration-200 outline-none cursor-pointer disabled:opacity-60"
          id="interest"
          name="product_interest"
          required
          defaultValue=""
          disabled={loading}
        >
          <option value="" disabled>{t("form_interest_placeholder", locale)}</option>
          <option value="Premium Saffron">{t("form_interest_opt1", locale)}</option>
          <option value="Bulk Spice Blends">{t("form_interest_opt2", locale)}</option>
          <option value="Private Label Manufacturing">{t("form_interest_opt3", locale)}</option>
          <option value="Raw Commodities">{t("form_interest_opt4", locale)}</option>
          <option value="Other Inquiry">{t("form_interest_opt5", locale)}</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col">
        <label className="font-label-md text-label-md text-on-surface font-semibold mb-2" htmlFor="message">
          {t("form_label_message", locale)} <span className="text-error">{t("form_required_star", locale)}</span>
        </label>
        <textarea
          className="w-full bg-surface border border-on-surface/15 hover:border-on-surface/30 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 rounded px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface/35 transition-all duration-200 outline-none resize-y min-h-[120px] disabled:opacity-60"
          id="message"
          name="message"
          placeholder={t("form_message_placeholder", locale)}
          rows={4}
          required
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-primary/95 transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-primary/60 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.99]"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              {t("form_submitting", locale)}
              <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            <>
              {t("form_submit", locale)}
              <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
