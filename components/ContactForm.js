"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
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
      setValidationError("Please enter a valid corporate email address.");
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
      setResult({ success: false, error: "Failed to send inquiry. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (result?.success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fadeIn">
        <CheckCircle2 className="text-secondary w-16 h-16 mb-4 animate-bounce" />
        <h3 className="font-headline-md-mobile text-primary mb-2">Inquiry Submitted</h3>
        <p className="text-on-surface-variant max-w-md mb-6">
          {result.message}
        </p>
        <button 
          onClick={() => setResult(null)} 
          className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary/5 transition-colors font-label-md text-sm"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-md relative z-10">
      <h2 className="font-headline-md-mobile text-headline-md-mobile md:font-headline-md md:text-headline-md text-primary mb-stack-md">
        Wholesale Inquiry
      </h2>

      {result?.error && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <span>{result.error}</span>
        </div>
      )}

      {validationError && (
        <div className="bg-error-container border border-error/20 text-on-error-container p-4 rounded flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Name */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="name">
            Full Name *
          </label>
          <input
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/40 transition-colors"
            id="name"
            name="name"
            placeholder="John Doe"
            required
            type="text"
            disabled={loading}
          />
        </div>
        
        {/* Company */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="company">
            Company Name *
          </label>
          <input
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/40 transition-colors"
            id="company"
            name="company"
            placeholder="Acme Foods Inc."
            required
            type="text"
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {/* Email */}
        <div className="flex flex-col">
          <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="email">
            Corporate Email *
          </label>
          <input
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/40 transition-colors"
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
          <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/40 transition-colors"
            id="phone"
            name="phone"
            placeholder="+1 (555) 000-0000"
            type="tel"
            disabled={loading}
          />
        </div>
      </div>

      {/* Product Interest */}
      <div className="flex flex-col">
        <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="interest">
          Primary Product Interest *
        </label>
        <select
          className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface transition-colors cursor-pointer"
          id="interest"
          name="product_interest"
          required
          defaultValue=""
          disabled={loading}
        >
          <option value="" disabled>Select an option...</option>
          <option value="Premium Saffron">Premium Saffron</option>
          <option value="Bulk Spice Blends">Bulk Spice Blends</option>
          <option value="Private Label Manufacturing">Private Label Manufacturing</option>
          <option value="Raw Commodities">Raw Commodities</option>
          <option value="Other Inquiry">Other Inquiry</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col">
        <label className="font-label-md text-label-md text-on-surface-variant mb-base" htmlFor="message">
          Project Details / Message *
        </label>
        <textarea
          className="bg-transparent border-0 border-b border-on-surface/20 focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface placeholder:text-on-surface/40 transition-colors resize-y min-h-[100px]"
          id="message"
          name="message"
          placeholder="Briefly describe your volume requirements or formulation specs..."
          rows={4}
          required
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-stack-sm">
        <button
          className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:bg-primary/60 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              Submitting...
              <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            <>
              Submit Inquiry
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
