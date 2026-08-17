import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, HeartHandshake } from "lucide-react";
import { cookies } from "next/headers";
import { t } from "@/lib/translations";
import AboutHeroCarousel from "@/components/AboutHeroCarousel";
import ProcessTimeline from "@/components/ProcessTimeline";

export const metadata = {
  title: "About Our Heritage & Quality",
  description: "Learn about TheSevenSpice's history, global supply networks, strict processing facilities, and commitment to fair trade B2B sourcing."
};

export default function AboutPage() {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const coreValues = [
    {
      icon: <ShieldCheck className="text-secondary w-7 h-7" />,
      title: t("about_value1_title", locale),
      desc: t("about_value1_desc", locale),
      pill: locale === "ur" ? "شفافیت" : "100% Traceable"
    },
    {
      icon: <Award className="text-secondary w-7 h-7" />,
      title: t("about_value2_title", locale),
      desc: t("about_value2_desc", locale),
      pill: locale === "ur" ? "بین الاقوامی معیارات" : "Global Compliance"
    },
    {
      icon: <HeartHandshake className="text-secondary w-7 h-7" />,
      title: t("about_value3_title", locale),
      desc: t("about_value3_desc", locale),
      pill: locale === "ur" ? "براہ راست شراکت" : "Direct Co-ops"
    }
  ];

  return (
    <div className="flex flex-col w-full pb-stack-lg animate-fadeIn">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-24 md:py-32 border-b border-on-surface/10 w-full flex items-center min-h-[460px] md:min-h-[520px]"
      >
        {/* Background Carousel */}
        <AboutHeroCarousel />

        {/* Subtle decorative overlays for premium depth */}
        <div className="absolute inset-0 bg-subtle-pattern opacity-5 pointer-events-none z-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-secondary-fixed/5 blur-3xl z-10 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-container/10 blur-3xl z-10 pointer-events-none"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-20 text-left w-full">
          {/* Glassmorphism Card for text readability, keeping the rest of the image completely original and clear */}
          <div className="max-w-2xl bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/15 text-white flex flex-col gap-4 shadow-2xl">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight font-bold">
              {t("about_hero_title", locale)}
            </h1>
            <p className="font-body-lg text-body-lg text-white/95 max-w-xl leading-relaxed">
              {t("about_hero_desc", locale)}
            </p>
          </div>
        </div>
      </section>


      {/* Brand Story (2 Columns) */}
      <section className="py-20 bg-background max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary">
              {t("about_story_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("about_story_p1", locale)}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("about_story_p2", locale)}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("about_story_p3", locale)}
            </p>
          </div>

          {/* Visual Area */}
          <div className="lg:col-span-5 relative h-96 rounded-lg border border-on-surface/10 overflow-hidden bg-surface-container shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1602237514002-c2d8ae2da393?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Artisanal spice sorting process, showcasing premium dry herbs and spices." 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm px-4 py-2 rounded border border-on-surface/10">
              <span className="font-label-md text-label-md text-primary font-semibold block">{t("about_story_facility", locale)}</span>
              <span className="text-xs text-on-surface-variant">{t("about_story_audit", locale)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-20 bg-surface-container-low border-t border-b border-on-surface/10 relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3.5 py-1.5 rounded-full inline-block border border-secondary/20 mb-3">
              {locale === "ur" ? "ہمارے بنیادی اصول" : "Enterprise Governance"}
            </span>
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-3">
              {t("about_standards_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              {t("about_standards_subtitle", locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {coreValues.map((value, idx) => (
              <div 
                key={idx} 
                className="flex flex-col justify-between gap-5 p-6 sm:p-7 rounded-2xl bg-white border border-on-surface/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                {/* Header Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-on-surface/10 flex items-center justify-center shrink-0">
                    {value.icon}
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-secondary px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 whitespace-nowrap">
                    {value.pill}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-title-lg text-lg sm:text-xl lg:text-2xl text-primary font-bold tracking-tight">
                    {value.title}
                  </h3>
                  <p className="font-body-md text-xs sm:text-sm lg:text-base text-on-surface-variant leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Process Flow (Farm to Freight) - Vertical Alternating Timeline */}
      <section className="py-20 lg:py-28 bg-surface-container-low/60 border-b border-on-surface/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none" />
        
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3.5 py-1.5 rounded-full inline-block border border-secondary/20">
              {locale === "ur" ? "سپلائی چین سائیکل" : "Supply Chain Lifecycle"}
            </span>
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mt-4 mb-3">
              {t("about_process_title", locale)}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              {t("about_process_subtitle", locale)}
            </p>
          </div>

          {/* Interactive Scroll-Illuminating Timeline */}
          <ProcessTimeline locale={locale} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="bg-primary text-on-primary rounded-lg p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center gap-6 shadow-md">
          <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
          <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-on-primary max-w-2xl leading-tight relative z-10">
            {t("about_cta_title", locale)}
          </h2>
          <p className="font-body-md text-body-md text-on-primary/80 max-w-xl relative z-10">
            {t("about_cta_desc", locale)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 pt-2">
            <Link 
              href="/contact" 
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {t("about_cta_btn", locale)}
              <ArrowRight size={16} className={locale === "ur" ? "rotate-180" : ""} />
            </Link>
            <Link 
              href="/products" 
              className="border border-on-primary/30 text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-on-primary/10 transition-all text-center flex items-center justify-center"
            >
              {t("about_cta_browse", locale)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
