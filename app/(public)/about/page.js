import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "About Our Heritage & Quality",
  description: "Learn about TheSevenSpice's history, global supply networks, strict processing facilities, and commitment to fair trade B2B sourcing."
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <ShieldCheck className="text-secondary w-8 h-8" />,
      title: "Traceability Assurance",
      desc: "Every batch of spice is trackable back to the region, co-op, or estate where it was grown. We work with third-party verification bodies to audit and confirm geographical indicators."
    },
    {
      icon: <Award className="text-secondary w-8 h-8" />,
      title: "Logistical Certifications",
      desc: "Our processing facilities comply fully with FDA registries, HACCP safety management, and GMP practices, maintaining sanitization lines from arrival through dispatch."
    },
    {
      icon: <HeartHandshake className="text-secondary w-8 h-8" />,
      title: "Direct Grower Cooperatives",
      desc: "We skip speculative brokers, trading directly with farming cooperatives. This ensures premium pricing yields return directly to agricultural communities."
    }
  ];

  return (
    <div className="flex flex-col w-full pb-stack-lg">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden py-20 md:py-28 bg-cover bg-center border-b border-on-surface/10 w-full flex items-center min-h-[400px] md:min-h-[520px]"
        style={{ backgroundImage: `url('/images/About%20Us%20Hero.png')` }}
      >
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-left w-full">
          <div className="max-w-3xl flex flex-col gap-3">
            <span className="font-label-md text-label-md text-secondary-fixed uppercase tracking-widest bg-black/40 px-3 py-1 rounded border border-secondary-fixed/20 w-fit">
              Our Heritage
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-white leading-tight">
              Bridging the gap between origin growers and global food manufacturers.
            </h1>
            <p className="font-body-lg text-body-lg text-white/95 max-w-2xl">
              For over two decades, TheSevenSpice has pioneered secure global logistics routes for premium spices. We serve culinary innovators, large scale food manufacturers, and boutique retailers.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story (2 Columns) */}
      <section className="py-20 bg-background max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary">
              A Modern Silk Road Built on Transparency
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              TheSevenSpice began with a simple observation: the international spice supply chain was filled with intermediaries, speculative grading, and inconsistent moisture controls. This resulted in diminished flavor profiles and shipping delays.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              By establishing direct contracts with regional farming collectives in Sri Lanka, India, Egypt, and Madagascar, we bypassed brokers. We built local testing hubs at each source region. This direct model allows us to test and confirm chemical standards—like piperine levels in pepper or crocin levels in saffron—before cargo ever boards an ocean vessel.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Today, we provide streamlined door-to-door distribution services. We handle customs clearances, health certifications, and quality laboratory audits for international partners.
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
              <span className="font-label-md text-label-md text-primary font-semibold block">Origin Sorting Facility</span>
              <span className="text-xs text-on-surface-variant">100% trace audited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-surface border-t border-b border-on-surface/10 bg-subtle-pattern">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-primary mb-4">
              Our Operational Standards
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We govern our networks through clear SLAs, rigorous lab audits, and ethical business codes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-on-surface/10 rounded-lg p-8 flex flex-col gap-4">
                <div className="p-3 bg-surface rounded-lg w-fit border border-on-surface/5">
                  {value.icon}
                </div>
                <h3 className="font-title-lg text-title-lg text-primary">{value.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-20 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="bg-primary text-on-primary rounded-lg p-10 md:p-16 relative overflow-hidden flex flex-col items-center text-center gap-6 shadow-md">
          <div className="absolute inset-0 bg-subtle-pattern opacity-10 pointer-events-none"></div>
          <h2 className="font-headline-md-mobile md:font-headline-md text-headline-md-mobile md:text-headline-md text-on-primary max-w-2xl leading-tight relative z-10">
            Work with a reliable, certified supply partner.
          </h2>
          <p className="font-body-md text-body-md text-on-primary/80 max-w-xl relative z-10">
            Reach out to our B2B team to receive product specifications, lab analysis certificates, or custom wholesale quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10 pt-2">
            <Link 
              href="/contact" 
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Contact Wholesale Department
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/products" 
              className="border border-on-primary/30 text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-on-primary/10 transition-all text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
