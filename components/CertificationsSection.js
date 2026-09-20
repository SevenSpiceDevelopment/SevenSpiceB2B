"use client";

import { ShieldCheck, Award, FileCheck2, CheckCircle2, FileSpreadsheet } from "lucide-react";
import { t } from "@/lib/translations";

export default function CertificationsSection({ locale = "en" }) {
  const certifications = [
    {
      code: "ISO",
      title: t("home_cert_iso", locale),
      desc: t("home_cert_iso_desc", locale),
      badge: "ISO 22000 / 9001",
      status: locale === "ur" ? "معیارِ اول" : "Export Benchmark",
    },
    {
      code: "HACCP",
      title: t("home_cert_haccp", locale),
      desc: t("home_cert_haccp_desc", locale),
      badge: "HACCP CODEX",
      status: locale === "ur" ? "حفظانِ صحت" : "Hygiene Certified",
    },
    {
      code: "HALAL",
      title: t("home_cert_halal", locale),
      desc: t("home_cert_halal_desc", locale),
      badge: "100% HALAL",
      status: locale === "ur" ? "مصدقہ حلال" : "100% Certified",
    },
    {
      code: "FDA",
      title: t("home_cert_fda", locale),
      desc: t("home_cert_fda_desc", locale),
      badge: "US FDA COMPLIANT",
      status: locale === "ur" ? "رجسٹرڈ معیار" : "Facility Compliant",
    },
    {
      code: "SGS",
      title: t("home_cert_sgs", locale),
      desc: t("home_cert_sgs_desc", locale),
      badge: "SGS / INTERTEK",
      status: locale === "ur" ? "آزاد جانچ" : "Inspection Available",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f2] border-b border-[#ebdcc9]/60 overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 reveal-on-scroll">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#a67c2e]">
            {t("home_cert_span", locale)}
          </span>

          <div className="flex items-center justify-center my-3 sm:my-3.5">
            <span className="h-[1.5px] w-12 bg-[#d8c5a4]/80 rounded-full" />
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl md:text-[34px] font-extrabold text-primary tracking-tight leading-snug">
            {t("home_cert_title", locale)}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed mt-2.5 max-w-xl mx-auto">
            {t("home_cert_subtitle", locale)}
          </p>
        </div>

        {/* Certifications Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className={`reveal-on-scroll delay-${(idx + 1) * 75} bg-white rounded-2xl p-6 border border-[#ebdcc9] hover:border-[#a67c2e] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group`}
            >
              {/* Luxury Seal Emblem */}
              <div className="w-20 h-20 rounded-full bg-[#fdfaf5] border-2 border-[#ebdcc9] group-hover:border-[#a67c2e] flex flex-col items-center justify-center relative mb-4 transition-colors duration-200 shadow-inner">
                {/* Decorative outer dashed ring */}
                <div className="absolute inset-1 rounded-full border border-dashed border-[#a67c2e]/40 pointer-events-none" />
                
                <span className="text-[10px] font-extrabold tracking-widest text-[#a67c2e] uppercase">
                  {cert.code}
                </span>
                <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase mt-0.5">
                  Standard
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="font-sans text-sm sm:text-[15px] font-bold text-primary tracking-tight leading-snug mb-1">
                {cert.title}
              </h3>
              
              <p className="text-[11.5px] text-slate-500 leading-relaxed font-normal mb-4">
                {cert.desc}
              </p>

              {/* Status Pill */}
              <div className="mt-auto inline-flex items-center gap-1.5 bg-[#faf7f2] border border-[#ebdcc9] group-hover:border-[#a67c2e]/40 px-3 py-1 rounded-full text-[10.5px] font-bold text-[#a67c2e] tracking-wide">
                <CheckCircle2 size={12} className="text-[#a67c2e]" />
                <span>{cert.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Reassurance Banner */}
        <div className="mt-12 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-[#ebdcc9] shadow-xs max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left rtl:sm:text-right reveal-on-scroll">
          <div className="w-10 h-10 rounded-full bg-[#faf7f2] border border-[#ebdcc9] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-[#a67c2e]" />
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
            {t("home_cert_note", locale)}
          </p>
        </div>

      </div>
    </section>
  );
}
