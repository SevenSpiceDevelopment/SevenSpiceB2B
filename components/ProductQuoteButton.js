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
  variant = "default"
}) {
  const [isOpen, setIsOpen] = useState(false);

  const baseClasses =
    variant === "compact"
      ? "w-full bg-secondary-container text-on-secondary-container py-3 rounded text-center font-label-md hover:opacity-90 transition-all block text-sm"
      :
    variant === "inverse"
      ? "bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded font-label-md text-xs hover:opacity-90 transition-all inline-flex items-center gap-2"
      : "bg-secondary-container text-on-secondary-container px-5 py-3 rounded font-label-md text-sm hover:opacity-90 transition-all inline-flex items-center gap-2";

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={baseClasses}>
        {t("catalog_req_quote", locale)}
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