import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/db";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Partner with Us - Wholesale Inquiries",
  description: "Connect with our wholesale accounts team. Inquire about bulk spice supplies, customized formulations, or private label programs."
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex-grow flex flex-col pt-stack-lg pb-stack-lg w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop gap-stack-lg">
      {/* Header Section */}
      <header className="text-center md:text-left max-w-3xl">
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-primary mb-stack-sm">
          Partner with Us
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Whether you are looking for bulk wholesale pricing, custom spice blends, or global logistics support, our dedicated B2B team is ready to assist. Complete the inquiry form below to connect with a specialist.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Left Column: Lead Gen Form (Takes 7 cols on desktop) */}
        <div className="md:col-span-7 bg-surface-container-lowest border border-on-surface/10 rounded-lg p-stack-md md:p-stack-lg relative overflow-hidden shadow-[0_2px_8px_rgba(87,0,19,0.01)]">
          <div className="absolute inset-0 bg-subtle-pattern pointer-events-none opacity-50"></div>
          <ContactForm />
        </div>

        {/* Right Column: Contact Info & Map (Takes 5 cols on desktop) */}
        <div className="md:col-span-5 flex flex-col gap-gutter">
          {/* Contact Details Card */}
          <div className="bg-surface-container-low border border-on-surface/10 rounded-lg p-stack-md flex-grow">
            <h3 className="font-title-lg text-title-lg text-primary mb-stack-md">Global Headquarters</h3>
            
            <ul className="space-y-stack-sm">
              <li className="flex items-start gap-4 pb-stack-sm border-b border-on-surface/10">
                <MapPin className="text-secondary w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface mb-1">Corporate Address</p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {settings.business_address || "1200 Silk Road Plaza, Suite 400, Trade District, NY 10001, United States"}
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-4 pb-stack-sm border-b border-on-surface/10">
                <Phone className="text-secondary w-5 h-5 mt-1 shrink-0" />
                <div>
                  <p className="font-label-md text-label-md text-on-surface mb-1">Wholesale Sales Line</p>
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
                  <p className="font-label-md text-label-md text-on-surface mb-1">B2B Inquiries</p>
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
                <p className="font-label-md text-label-md text-on-surface mb-1">Operating Hours (EST)</p>
                <p className="font-body-md text-body-md text-on-surface-variant font-semibold">Mon - Fri: 8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
