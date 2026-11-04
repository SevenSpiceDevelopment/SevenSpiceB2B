"use client";

import { useState } from "react";
import QuoteModal from "./QuoteModal";
import { t } from "@/lib/translations";

export default function ProductQuoteButton({
  productName,
  productId,
  businessPhone,
  businessEmail,
  locale = "en",
  variant = "default",
  className = "",
  children,
  label
}) {
  const [isOpen, setIsOpen] = useState(false);

  let defaultClasses =
    variant === "compact"
      ? "w-full bg-secondary-container text-on-secondary-container py-3 rounded text-center font-label-md hover:opacity-90 transition-all block text-sm font-semibold"
      : variant === "inverse"
      ? "bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded font-label-md text-xs hover:opacity-90 transition-all inline-flex items-center justify-center gap-2 font-semibold"
      : variant === "hero"
      ? "w-full sm:w-auto bg-secondary-container text-on-secondary-container px-6 py-3.5 rounded-lg font-bold text-sm hover:opacity-95 transition-all shadow-sm inline-flex items-center justify-center gap-2 border border-secondary/20"
      : "bg-secondary-container text-on-secondary-container px-5 py-3 rounded font-label-md text-sm hover:opacity-90 transition-all inline-flex items-center justify-center gap-2 font-semibold";

  const finalClasses = className ? className : defaultClasses;
  const buttonContent = children || label || t("catalog_req_quote", locale);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={finalClasses}>
        {buttonContent}
      </button>

      <QuoteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productName={productName}
        productId={productId}
        businessPhone={businessPhone}
        businessEmail={businessEmail}
        locale={locale}
      />
    </>
  );
}