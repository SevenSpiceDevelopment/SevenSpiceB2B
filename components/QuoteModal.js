"use client";

import { useState, useEffect } from "react";
import { submitQuoteRequest } from "@/app/actions";
import { X, CheckCircle2, Loader2, AlertCircle, ClipboardList, Phone, Clock, Mail } from "lucide-react";

export default function QuoteModal({ isOpen, onClose, productName, productId, businessPhone, businessEmail }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [activeTab, setActiveTab] = useState("form");

  // Prevent background scrolling and reset states when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveTab("form");
      setResult(null);
      setValidationError("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    if (email && !email.includes("@")) {
      setValidationError("Please enter a valid corporate email address.");
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
      setResult({ success: false, error: "Failed to submit quote request. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4 animate-fadeIn">
      {/* Modal Card */}
      <div className="bg-surface w-full max-w-lg rounded-lg border border-on-surface/10 shadow-[0_20px_50px_rgba(26,26,26,0.15)] relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-40"></div>

        {/* Modal Header */}
        <div className="relative z-10 p-6 border-b border-on-surface/10 flex justify-between items-center bg-surface-container-low">
          <div>
            <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">B2B QUOTE REQUEST</span>
            <h3 className="font-title-lg text-title-lg text-primary mt-1">Request Wholesale Pricing</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-on-surface/5 transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 p-6 overflow-y-auto flex-grow">
          {result?.success ? (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <CheckCircle2 className="text-secondary w-16 h-16 animate-bounce" />
              <h4 className="font-headline-md-mobile text-primary font-semibold">Request Received</h4>
              <p className="text-on-surface-variant max-w-sm text-sm">
                Your request for <strong>{productName}</strong> has been logged. Our commercial accounts team will review margins and email a custom catalog rate sheet within 1 business day.
              </p>
              <button
                onClick={() => {
                  setResult(null);
                  onClose();
                }}
                className="mt-4 bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded hover:bg-primary/90 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product detail reminder */}
              <div className="bg-surface-container border border-on-surface/5 p-3.5 rounded text-sm">
                <span className="text-xs text-on-surface-variant font-mono block animate-pulse">PRODUCT OF INTEREST</span>
                <span className="font-semibold text-primary">{productName}</span>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-on-surface/10 pb-px gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className={`pb-3 text-sm font-label-md transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "form"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/20"
                  }`}
                >
                  <ClipboardList size={16} />
                  Request via Form
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("call")}
                  className={`pb-3 text-sm font-label-md transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === "call"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/20"
                  }`}
                >
                  <Phone size={16} />
                  Call Sales Team
                </button>
              </div>

              {activeTab === "form" ? (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                  <input type="hidden" name="product_id" value={productId || ""} />
                  <input type="hidden" name="product_name" value={productName} />

                  {result?.error && (
                    <div className="bg-error-container border border-error/20 text-on-error-container p-3.5 rounded flex items-center gap-3 text-xs">
                      <AlertCircle className="w-5 h-5 shrink-0 text-error" />
                      <span>{result.error}</span>
                    </div>
                  )}

                  {validationError && (
                    <div className="bg-error-container border border-error/20 text-on-error-container p-3.5 rounded flex items-center gap-3 text-xs">
                      <AlertCircle className="w-5 h-5 shrink-0 text-error" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-name">
                      Full Name *
                    </label>
                    <input
                      id="modal-name"
                      name="name"
                      required
                      placeholder="John Doe"
                      type="text"
                      disabled={loading}
                      className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors"
                    />
                  </div>

                  {/* Company */}
                  <div className="flex flex-col">
                    <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-company">
                      Company Name *
                    </label>
                    <input
                      id="modal-company"
                      name="company"
                      required
                      placeholder="Acme Foods Inc."
                      type="text"
                      disabled={loading}
                      className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="flex flex-col">
                      <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-email">
                        Corporate Email *
                      </label>
                      <input
                        id="modal-email"
                        name="email"
                        required
                        placeholder="john@acmefoods.com"
                        type="email"
                        disabled={loading}
                        className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-phone">
                        Phone Number
                      </label>
                      <input
                        id="modal-phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        disabled={loading}
                        className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col">
                    <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-qty">
                      Target Volume / Quantity Needed *
                    </label>
                    <input
                      id="modal-qty"
                      name="quantity"
                      required
                      placeholder="e.g. 500 kg, 2 metric tons"
                      type="text"
                      disabled={loading}
                      className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col">
                    <label className="font-label-md text-xs text-on-surface-variant mb-1" htmlFor="modal-message">
                      Volumetric requirements or Custom formulation requests
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      placeholder="Add any specific packaging forms, shipping destinations, or regulatory audits required..."
                      rows={3}
                      disabled={loading}
                      className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-1.5 font-body-md text-on-surface placeholder:text-on-surface/40 text-sm transition-colors resize-y"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-on-surface/5">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-5 py-2.5 rounded border border-on-surface/20 font-label-md text-xs text-on-surface-variant hover:bg-on-surface/5 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-on-primary font-label-md text-xs px-6 py-2.5 rounded hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:bg-primary/60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          Submitting...
                          <Loader2 className="animate-spin w-3.5 h-3.5" />
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 py-2 animate-fadeIn">
                  <div className="text-center bg-surface-container border border-on-surface/5 p-6 rounded-lg flex flex-col items-center gap-4 shadow-[0_4px_20px_rgba(26,26,26,0.02)]">
                    <div className="bg-primary/5 p-4 rounded-full">
                      <Phone className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-title-lg text-primary font-bold">Speak Directly with a Broker</h4>
                      <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
                        Call our commercial trade desk for instant quotes, supply constraints, and customs clearing specifications.
                      </p>
                    </div>
                    
                    <a
                      href={`tel:${businessPhone}`}
                      className="mt-2 bg-primary text-on-primary font-title-lg px-8 py-3 rounded hover:bg-primary/90 transition-all shadow-md flex items-center gap-3 group hover:scale-[1.02]"
                    >
                      <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      {businessPhone}
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Business Hours Card */}
                    <div className="bg-surface-container-low border border-on-surface/10 p-4 rounded flex items-start gap-3">
                      <Clock className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider block">OFFICE HOURS</span>
                        <span className="text-sm font-semibold text-primary block mt-1">Mon - Fri: 8:00 AM - 6:00 PM EST</span>
                        <span className="text-xs text-on-surface-variant">Closed on holidays</span>
                      </div>
                    </div>

                    {/* Direct Email Card */}
                    <div className="bg-surface-container-low border border-on-surface/10 p-4 rounded flex items-start gap-3">
                      <Mail className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider block">DIRECT EMAIL</span>
                        <a href={`mailto:${businessEmail}`} className="text-sm font-semibold text-primary hover:underline block mt-1 break-all">
                          {businessEmail}
                        </a>
                        <span className="text-xs text-on-surface-variant">Response in 1 business day</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-on-surface/5 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2.5 rounded border border-on-surface/20 font-label-md text-xs text-on-surface-variant hover:bg-on-surface/5 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
