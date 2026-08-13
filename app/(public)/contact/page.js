import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/db";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cookies } from "next/headers";
import { t } from "@/lib/translations";

export const metadata = {
  title: "Partner with Us - Wholesale Inquiries",
  description: "Connect with our wholesale accounts team. Inquire about bulk spice supplies, customized formulations, or private label programs."
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  const businessAddress = settings.business_address === "1200 Silk Road Plaza, Suite 400, Trade District, NY 10001, United States"
    ? (locale === "ur" ? "1200 سلک روڈ پلازہ، سویٹ 400، ٹریڈ ڈسٹرکٹ، نیویارک 10001، ریاستہائے متحدہ" : settings.business_address)
    : settings.business_address;

  const officeHours = locale === "ur" ? "پیر تا جمعہ: صبح 8:00 بجے سے شام 6:00 بجے تک" : "Mon - Fri: 8:00 AM - 6:00 PM";

  return (
    <div className="flex-grow flex flex-col w-full animate-fadeIn">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-20 md:py-28 bg-cover bg-center border-b border-on-surface/10 w-full flex items-center min-h-[400px] md:min-h-[520px]"
        style={{ backgroundImage: `url('/images/Contact%20Us%20Hero.png')` }}
      >
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 w-full">
          <div className="max-w-3xl flex flex-col gap-3 text-left">
            <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-secondary-fixed/20 w-fit">
              {t("contact_hero_span", locale)}
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
              {t("contact_hero_title", locale)}
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl">
              {t("contact_hero_desc", locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 w-full flex-grow flex flex-col gap-stack-lg">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Lead Gen Form (Takes 7 cols on desktop) */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-on-surface/10 rounded-2xl p-stack-md md:p-stack-lg relative overflow-hidden shadow-[0_18px_55px_rgba(87,0,19,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary pointer-events-none"></div>
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-30"></div>
            <ContactForm locale={locale} />
          </div>

          {/* Right Column: Contact Info & Map (Takes 5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Contact Details Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#3d0010] border border-primary/30 rounded-2xl p-6 md:p-8 text-left text-white shadow-[0_22px_55px_rgba(87,0,19,0.18)]">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
              <div className="absolute inset-x-0 top-0 h-px bg-white/45 pointer-events-none"></div>
              <div className="relative">
                <span className="inline-flex items-center rounded-full border border-secondary-fixed/40 bg-secondary-fixed/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-fixed">
                  Seven Spices
                </span>
                <h3 className="mt-4 font-title-lg text-title-lg text-white">{t("contact_hq_title", locale)}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">Our team is ready to support your next wholesale shipment.</p>
              </div>
              
              <ul className="relative mt-7 space-y-0">
                <li className="flex items-start gap-4 border-b border-white/15 py-5 first:pt-0">
                  <MapPin className="text-secondary-fixed w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-white mb-1">{t("contact_hq_address", locale)}</p>
                    <p className="font-body-md text-body-md text-white/70 leading-relaxed">
                      {businessAddress}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4 border-b border-white/15 py-5">
                  <Phone className="text-secondary-fixed w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-white mb-1">{t("contact_hq_phone", locale)}</p>
                    <a 
                      href={`tel:${settings.business_phone || "+1-800-555-7742"}`} 
                      className="font-body-md text-body-md text-white/75 font-semibold hover:text-secondary-fixed transition-colors hover:underline"
                    >
                      {settings.business_phone || "+1 (800) 555-SPICE"}
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4 border-b border-white/15 py-5">
                  <Mail className="text-secondary-fixed w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-white mb-1">{t("contact_hq_b2b", locale)}</p>
                    <a 
                      href={`mailto:${settings.business_email || "sales@thesevenspice.com"}`} 
                      className="font-body-md text-body-md text-white/75 hover:text-secondary-fixed transition-colors hover:underline"
                    >
                      {settings.business_email || "sales@thesevenspice.com"}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="relative mt-0 flex items-start gap-4 pt-5">
                <Clock className="text-secondary-fixed w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-white mb-1">{t("contact_hq_hours", locale)}</p>
                  <p className="font-body-md text-body-md text-white/75 font-semibold">{officeHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
