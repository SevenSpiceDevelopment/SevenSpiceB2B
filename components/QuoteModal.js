"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { submitQuoteRequest } from "@/app/actions";
import { X, CheckCircle2, Loader2, AlertCircle, ClipboardList, Phone, Clock, Mail, Send } from "lucide-react";
import { t } from "@/lib/translations";

export default function QuoteModal({ 
  isOpen, 
  onClose, 
  productName, 
  productId, 
  businessPhone, 
  businessEmail,
  locale = "en"
}) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState("form");

  // Track hydration/client mount so createPortal safely attaches to document.body
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  // Lock body scroll and register ESC key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setActiveTab("form");
      setResult(null);
      setValidationError("");
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    if (email && !email.includes("@")) {
      setValidationError(t("validation_email", locale));
      setLoading(false);
      return;
    }

    try {
      const res = await submitQuoteRequest(null, formData);
      setResult(res);
      if (res.success) {
        e.target.reset();
      }
    } catch (err) {
      setResult({ success: false, error: t("modal_error", locale) });
    } finally {
      setLoading(false);
    }
  };

  const successDesc = locale === "ur" ? (
    <>
      مصنوعات <strong>{productName}</strong> کے لیے آپ کی درخواست درج کر لی گئی ہے۔ ہماری تجارتی ٹیم 1 کاروباری دن کے اندر ریٹ شیٹ ای میل کرے گی۔
    </>
  ) : (
    <>
      Your wholesale quote request for <strong>{productName}</strong> has been logged. Our commercial sales desk will review quantities and provide an official quotation within 24 hours.
    </>
  );

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card - max-height ensures header and bottom buttons are ALWAYS visible on screen */}
      <div 
        className="bg-surface w-full max-w-lg rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[86vh] sm:max-h-[82vh] overflow-hidden"
        style={{ border: "none", outline: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. FIXED HEADER - Always pinned at top, never cut off */}
        <div className="shrink-0 px-6 py-3.5 sm:py-4 border-b border-on-surface/10 flex justify-between items-center bg-surface">
          <div className="text-left pr-4">
            <span className="text-[11px] font-bold text-[#C47029] uppercase tracking-[0.2em] block">
              {t("modal_title_span", locale)}
            </span>
            <h3 className="font-title-lg text-lg sm:text-xl font-bold text-primary mt-0.5">
              {t("modal_title", locale)}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-2 rounded-lg hover:bg-on-surface/10 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 2. SCROLLABLE BODY - Smooth native scrolling with sleek modern scrollbar */}
        <div 
          className="overflow-y-auto flex-1 px-6 py-4 sm:py-5 text-left overscroll-contain modal-custom-scrollbar min-h-0"
        >
          {result?.success ? (
            <div className="text-center py-8 flex flex-col items-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="text-[#C47029] w-10 h-10" />
              </div>
              <h4 className="font-headline-md-mobile text-xl text-primary font-bold">
                {t("modal_success_title", locale)}
              </h4>
              <p className="text-on-surface-variant max-w-md text-sm leading-relaxed">
                {successDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  onClose();
                }}
                className="mt-4 bg-[#C47029] hover:bg-[#A85B1C] text-white font-semibold text-sm px-7 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                {t("modal_success_close", locale)}
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {/* Selected product reminder - seamless with NO borders */}
              <div className="bg-surface-container-low px-4 py-2.5 rounded-lg flex items-center justify-between" style={{ border: "none" }}>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant block">
                    {t("modal_prod_interest", locale)}
                  </span>
                  <span className="font-bold text-primary text-sm sm:text-base block mt-0.5">
                    {productName}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-on-surface/10 pb-px gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`pb-2.5 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === "form"
                      ? "border-[#C47029] text-[#C47029] font-bold"
                      : "border-transparent text-on-surface-variant hover:text-primary"
                  }`}
                >
                  <ClipboardList size={16} />
                  {t("modal_tab_form", locale)}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("call")}
                  className={`pb-2.5 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                    activeTab === "call"
                      ? "border-[#C47029] text-[#C47029] font-bold"
                      : "border-transparent text-on-surface-variant hover:text-primary"
                  }`}
                >
                  <Phone size={16} />
                  {t("modal_tab_call", locale)}
                </button>
              </div>

              {activeTab === "form" ? (
                <form id="quote-modal-form" onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 animate-fadeIn">
                  <input type="hidden" name="product_id" value={productId || ""} />
                  <input type="hidden" name="product_name" value={productName} />

                  {result?.error && (
                    <div className="bg-error-container/20 border border-error/30 text-error p-3 rounded-lg flex items-center gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{result.error}</span>
                    </div>
                  )}

                  {validationError && (
                    <div className="bg-error-container/20 border border-error/30 text-error p-3 rounded-lg flex items-center gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Row 1: Name & Company (clean underline, no left/right/top borders) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-name">
                        {t("modal_label_name", locale)}
                      </label>
                      <input
                        id="modal-name"
                        name="name"
                        required
                        placeholder="e.g. Tariq Khan"
                        type="text"
                        disabled={loading}
                        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                        className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-company">
                        {t("modal_label_company", locale)}
                      </label>
                      <input
                        id="modal-company"
                        name="company"
                        required
                        placeholder="e.g. Apex Foods Global"
                        type="text"
                        disabled={loading}
                        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                        className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-email">
                        {t("modal_label_email", locale)}
                      </label>
                      <input
                        id="modal-email"
                        name="email"
                        required
                        placeholder="procurement@company.com"
                        type="email"
                        disabled={loading}
                        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                        className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-phone">
                        {t("modal_label_phone", locale)}
                      </label>
                      <input
                        id="modal-phone"
                        name="phone"
                        placeholder="+92 300 1234567"
                        type="tel"
                        disabled={loading}
                        style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                        className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Estimated Quantity */}
                  <div>
                    <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-qty">
                      {t("modal_label_qty", locale)}
                    </label>
                    <input
                      id="modal-qty"
                      name="quantity"
                      required
                      placeholder={t("modal_qty_placeholder", locale)}
                      type="text"
                      disabled={loading}
                      style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                      className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors"
                    />
                  </div>

                  {/* Row 4: Additional Details */}
                  <div>
                    <label className="font-semibold text-xs text-primary mb-1 block" htmlFor="modal-message">
                      {t("modal_label_message", locale)}
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      placeholder={t("modal_msg_placeholder", locale)}
                      rows={2}
                      disabled={loading}
                      style={{ borderTop: "none", borderLeft: "none", borderRight: "none" }}
                      className="w-full bg-transparent border-0 border-b border-on-surface/25 focus:border-[#C47029] focus:ring-0 rounded-none px-0 py-1.5 sm:py-2 text-sm text-on-surface placeholder:text-on-surface/35 outline-none transition-colors resize-none"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-4 py-1 animate-fadeIn">
                  <div className="text-center bg-surface-container-low p-5 rounded-lg flex flex-col items-center gap-3" style={{ border: "none" }}>
                    <div className="bg-secondary/10 p-3 rounded-full">
                      <Phone className="w-6 h-6 text-[#C47029]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-title-lg text-base font-bold text-primary">{t("modal_broker_title", locale)}</h4>
                      <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
                        {t("modal_broker_desc", locale)}
                      </p>
                    </div>
                    
                    <a
                      href={`tel:${businessPhone || "+923286828006"}`}
                      className="mt-1 bg-[#C47029] hover:bg-[#A85B1C] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Phone size={16} />
                      <span>{businessPhone || "+92 328 6828006"}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2.5" style={{ border: "none" }}>
                      <Clock className="w-4 h-4 text-[#C47029] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-primary block">{t("modal_hours_title", locale)}</span>
                        <span className="text-on-surface-variant block mt-0.5">{t("modal_hours_val", locale)}</span>
                      </div>
                    </div>

                    <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2.5" style={{ border: "none" }}>
                      <Mail className="w-4 h-4 text-[#C47029] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-primary block">{t("modal_direct_email", locale)}</span>
                        <a href={`mailto:${businessEmail || "sales@thesevenspice.com"}`} className="text-[#C47029] hover:underline block mt-0.5 break-all font-medium">
                          {businessEmail || "sales@thesevenspice.com"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. FIXED STICKY FOOTER - ALWAYS 100% VISIBLE ON SCREEN, NEVER SCROLLED AWAY */}
        {!result?.success && (
          <div className="shrink-0 px-6 py-3 sm:py-3.5 border-t border-on-surface/10 flex items-center justify-end gap-3 bg-surface z-20">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 font-semibold text-xs text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
            >
              {t("cancel", locale)}
            </button>
            {activeTab === "form" ? (
              <button
                type="submit"
                form="quote-modal-form"
                disabled={loading}
                className="bg-[#C47029] hover:bg-[#A85B1C] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <span>{locale === "ur" ? "جمع کرایا جا رہا ہے..." : "Submitting..."}</span>
                    <Loader2 className="animate-spin w-4 h-4" />
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>{locale === "ur" ? "درخواست جمع کروائیں" : "Submit Quote Request"}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg font-semibold text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                {t("close", locale)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
