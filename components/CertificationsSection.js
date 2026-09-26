"use client";

import Image from "next/image";
import { t } from "@/lib/translations";

export default function CertificationsSection({ locale = "en" }) {
  const certifications = [
    {
      code: "ISO",
      title: t("home_cert_iso", locale),
      desc: t("home_cert_iso_desc", locale),
      badge: "ISO 22000 / 9001",
      status: locale === "ur" ? "معیارِ اول" : "Export Benchmark",
      logo: "/images/certifications/iso-22000-transparent.png",
    },
    {
      code: "HACCP",
      title: t("home_cert_haccp", locale),
      desc: t("home_cert_haccp_desc", locale),
      badge: "HACCP CODEX",
      status: locale === "ur" ? "حفظانِ صحت" : "Hygiene Certified",
      logo: "/images/certifications/haccp-certified-transparent.png",
    },
    {
      code: "HALAL",
      title: t("home_cert_halal", locale),
      desc: t("home_cert_halal_desc", locale),
      badge: "100% HALAL",
      status: locale === "ur" ? "مصدقہ حلال" : "100% Certified",
      logo: "/images/certifications/halal-certified-transparent.png",
    },
    {
      code: "FDA",
      title: t("home_cert_fda", locale),
      desc: t("home_cert_fda_desc", locale),
      badge: "US FDA COMPLIANT",
      status: locale === "ur" ? "رجسٹرڈ معیار" : "Facility Compliant",
      logo: "/images/certifications/fda.svg",
    },
    {
      code: "SGS",
      title: t("home_cert_sgs", locale),
      desc: t("home_cert_sgs_desc", locale),
      badge: "SGS / INTERTEK",
      status: locale === "ur" ? "آزاد جانچ" : "Inspection Available",
      logo: "/images/certifications/sgs.png",
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

        {/* Continuous certification marquee */}
        <div className="certification-marquee overflow-hidden -mx-margin-mobile md:-mx-margin-desktop reveal-on-scroll" aria-label="Certifications">
          <div className="certification-marquee-track flex w-max items-stretch">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-stretch"
                aria-hidden={copy === 1 ? "true" : undefined}
              >
                {certifications.map((cert) => (
                  <article
                    key={`${copy}-${cert.code}`}
                    className="flex w-[252px] shrink-0 flex-col items-center justify-center px-6 py-3 text-center sm:w-[290px] sm:px-8"
                  >
                    <div className="relative mb-3 h-16 w-24 sm:h-20 sm:w-28">
                      <Image
                        src={cert.logo}
                        alt={copy === 1 ? "" : `${cert.title} logo`}
                        fill
                        unoptimized
                        className="object-contain"
                        sizes="112px"
                      />
                    </div>

                    <h3 className="font-sans text-sm font-bold text-primary tracking-tight leading-snug sm:text-[15px]">
                      {cert.title}
                    </h3>
                    <p className="mt-1 text-[11.5px] font-normal leading-relaxed text-slate-500">
                      {cert.desc}
                    </p>
                    <p className="mt-2 text-[10.5px] font-bold tracking-wide text-[#a67c2e]">
                      {cert.status}
                    </p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
