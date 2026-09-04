"use client";

export default function TrustSignals({ 
  cards = [], 
  eyebrow = "OUR CAPABILITIES", 
  title = "End-to-End Spice Supply Capabilities", 
  subtitle = "We close the gap between agricultural producers and global food distributors through strict quality-control layers.",
  locale = "en" 
}) {
  return (
    <div className="w-full text-center">
      {/* 1. TOP HEADER SECTION */}
      <div className="max-w-3xl mx-auto flex flex-col items-center mb-12 sm:mb-16 reveal-on-scroll">
        {/* Eyebrow in Gold with wide tracking */}
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#a67c2e]">
          {eyebrow}
        </span>

        {/* Clean Minimalist Divider */}
        <div className="w-12 h-[1.5px] bg-[#d8c5a4]/80 my-3 sm:my-3.5 rounded-full" />

        {/* Website Font Style Title */}
        <h2 className="font-sans text-2xl sm:text-3xl md:text-[34px] font-extrabold text-primary tracking-tight leading-snug max-w-2xl">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-normal leading-relaxed mt-2.5 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* 2. THREE CAPABILITIES COLUMNS WITH VECTOR ILLUSTRATIONS & STAR DIVIDERS */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`reveal-on-scroll ${index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"} relative flex flex-col items-center text-center px-4 sm:px-6 md:px-8 group ${
              index < cards.length - 1 ? "pb-8 md:pb-0" : ""
            }`}
          >
            {/* Desktop Vertical Divider */}
            {index < cards.length - 1 && (
              <div 
                className="hidden md:flex flex-col items-center justify-center absolute -right-[1px] top-1/2 -translate-y-1/2 h-[70%] z-20 pointer-events-none" 
                aria-hidden="true"
              >
                <div className="w-[1px] h-full bg-[#e8dfd5]/80" />
              </div>
            )}

            {/* Custom Luxury Line-Art Illustration Icon */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none transition-transform duration-300 hover:scale-105">
              {index === 0 && (
                /* Icon 1: Wireframe Globe with Sprouting Botanical Spice Leaves */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Globe outer & latitude arcs */}
                  <circle cx="50" cy="50" r="34" stroke="#a67c2e" strokeWidth="1.75" />
                  <line x1="16" y1="50" x2="84" y2="50" stroke="#a67c2e" strokeWidth="1.35" strokeOpacity="0.75" />
                  <path d="M22 36 Q50 42 78 36" stroke="#a67c2e" strokeWidth="1.35" strokeOpacity="0.75" fill="none" />
                  <path d="M22 64 Q50 58 78 64" stroke="#a67c2e" strokeWidth="1.35" strokeOpacity="0.75" fill="none" />
                  <ellipse cx="50" cy="50" rx="16" ry="34" stroke="#a67c2e" strokeWidth="1.35" strokeOpacity="0.75" fill="none" />
                  {/* Botanical spice sprout emerging upwards */}
                  <line x1="50" y1="72" x2="50" y2="35" stroke="#a67c2e" strokeWidth="2.25" strokeLinecap="round" />
                  <path d="M50 58 C38 52 34 40 48 38 C49 46 50 54 50 58 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M50 58 C62 52 66 40 52 38 C51 46 50 54 50 58 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M50 42 C45 34 47 24 50 22 C53 24 55 34 50 42 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              )}

              {index === 1 && (
                /* Icon 2: Cargo Vessel, Shipping Container, and Cold-Chain Snowflake Badge */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Globe background grid arc */}
                  <path d="M28 42 C30 25 44 15 62 15 C74 15 82 23 85 35" stroke="#a67c2e" strokeWidth="1.35" strokeOpacity="0.55" fill="none" />
                  <ellipse cx="52" cy="28" rx="12" ry="13" stroke="#a67c2e" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
                  <line x1="40" y1="28" x2="64" y2="28" stroke="#a67c2e" strokeWidth="1.2" strokeOpacity="0.5" />
                  {/* Cargo Container Ship (Left) */}
                  <path d="M16 63 L22 73 L48 73 L50 63 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M14 76 Q20 74 26 76 T38 76 T50 76" stroke="#a67c2e" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 63 L20 55 L25 55 L25 63" stroke="#a67c2e" strokeWidth="1.75" />
                  <rect x="22" y="51" width="1.5" height="4" fill="#a67c2e" />
                  <rect x="27" y="56" width="9" height="7" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.5" />
                  <rect x="37" y="56" width="9" height="7" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.5" />
                  {/* Shipping Container (Right) */}
                  <rect x="52" y="51" width="30" height="22" rx="1" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" />
                  <line x1="58" y1="51" x2="58" y2="73" stroke="#a67c2e" strokeWidth="1.4" />
                  <line x1="64" y1="51" x2="64" y2="73" stroke="#a67c2e" strokeWidth="1.4" />
                  <line x1="70" y1="51" x2="70" y2="73" stroke="#a67c2e" strokeWidth="1.4" />
                  <line x1="76" y1="51" x2="76" y2="73" stroke="#a67c2e" strokeWidth="1.4" />
                  {/* Snowflake / Temperature Control Badge */}
                  <circle cx="73" cy="27" r="10" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" />
                  <line x1="73" y1="20" x2="73" y2="34" stroke="#a67c2e" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="67" y1="23.5" x2="79" y2="30.5" stroke="#a67c2e" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="67" y1="30.5" x2="79" y2="23.5" stroke="#a67c2e" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M71 22 L73 20 L75 22" stroke="#a67c2e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M71 32 L73 34 L75 32" stroke="#a67c2e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}

              {index === 2 && (
                /* Icon 3: Laboratory Conical Flask & Botanical Leaves */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Conical Flask */}
                  <rect x="42" y="24" width="16" height="3" rx="1.5" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" />
                  <path d="M45 27 L45 38 L31 66 C29 70 32 74 37 74 L63 74 C68 74 71 70 69 66 L55 38 L55 27 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M36 57 Q50 61 64 57" stroke="#a67c2e" strokeWidth="1.4" strokeOpacity="0.7" />
                  {/* Bubbling Solution Drops */}
                  <circle cx="44" cy="65" r="2" fill="none" stroke="#a67c2e" strokeWidth="1.25" />
                  <circle cx="53" cy="62" r="1.5" fill="none" stroke="#a67c2e" strokeWidth="1.25" />
                  <circle cx="48" cy="69" r="1.5" fill="none" stroke="#a67c2e" strokeWidth="1.25" />
                  <circle cx="58" cy="67" r="2" fill="none" stroke="#a67c2e" strokeWidth="1.25" />
                  {/* Natural Botanical Spice Leaves */}
                  <path d="M68 52 C78 50 84 60 76 68 C72 65 69 58 68 52 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  <line x1="68" y1="52" x2="76" y2="68" stroke="#a67c2e" strokeWidth="1.25" strokeOpacity="0.6" />
                  <path d="M72 64 C82 66 86 78 77 82 C72 80 70 72 72 64 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  <line x1="72" y1="64" x2="77" y2="82" stroke="#a67c2e" strokeWidth="1.25" strokeOpacity="0.6" />
                </svg>
              )}
            </div>

            {/* Column Title in Website Font Style */}
            <h3 className="font-sans text-base sm:text-lg md:text-[19px] font-bold text-primary tracking-tight mt-4 sm:mt-5 leading-snug">
              {card.title}
            </h3>

            {/* Clean Divider Line under Title */}
            <div className="w-8 h-[1px] bg-[#d8c5a4]/80 my-2.5 sm:my-3 rounded-full" />

            {/* Description Text in Website Font Style */}
            <p className="font-sans text-xs sm:text-[13.5px] text-on-surface-variant font-normal leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
