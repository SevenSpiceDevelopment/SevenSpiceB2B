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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left Column: Lead Gen Form (Takes 7 cols on desktop) */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-on-surface/10 rounded-lg p-stack-md md:p-stack-lg relative overflow-hidden shadow-[0_2px_8px_rgba(87,0,19,0.01)]">
            <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-50"></div>
            <ContactForm locale={locale} />
          </div>

          {/* Right Column: Contact Info & Map (Takes 5 cols on desktop) */}
          <div className="md:col-span-5 flex flex-col gap-gutter">
            {/* Contact Details Card */}
            <div className="bg-surface-container-low border border-on-surface/10 rounded-lg p-stack-md flex-grow text-left">
              <h3 className="font-title-lg text-title-lg text-primary mb-stack-md">{t("contact_hq_title", locale)}</h3>
              
              <ul className="space-y-stack-sm">
                <li className="flex items-start gap-4 pb-stack-sm border-b border-on-surface/10">
                  <MapPin className="text-secondary w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface mb-1">{t("contact_hq_address", locale)}</p>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {businessAddress}
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4 pb-stack-sm border-b border-on-surface/10">
                  <Phone className="text-secondary w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface mb-1">{t("contact_hq_phone", locale)}</p>
                    <a 
                      href={`tel:${settings.business_phone || "+1-800-555-7742"}`} 
                      className="font-body-md text-body-md text-on-surface-variant font-semibold hover:text-primary transition-colors hover:underline"
                    >
                      {settings.business_phone || "+1 (800) 555-SPICE"}
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <Mail className="text-secondary w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="font-label-md text-label-md text-on-surface mb-1">{t("contact_hq_b2b", locale)}</p>
                    <a 
                      href={`mailto:${settings.business_email || "sales@thesevenspice.com"}`} 
                      className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors hover:underline"
                    >
                      {settings.business_email || "sales@thesevenspice.com"}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-stack-md pt-stack-sm border-t border-on-surface/10 flex items-start gap-4">
                <Clock className="text-secondary w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface mb-1">{t("contact_hq_hours", locale)}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant font-semibold">{officeHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
