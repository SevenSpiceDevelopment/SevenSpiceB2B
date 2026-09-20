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
                /* Icon 1: Quality Assurance & Laboratory Purity Seal */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Outer Seal Circle */}
                  <circle cx="50" cy="50" r="34" stroke="#a67c2e" strokeWidth="1.75" />
                  <circle cx="50" cy="50" r="30" stroke="#a67c2e" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7" />
                  {/* Lab Flask / Beaker Purity Analysis */}
                  <path d="M46 30 L54 30 M50 30 L50 44 L38 64 C36 68 39 72 44 72 L56 72 C61 72 64 68 62 64 L50 44" stroke="#a67c2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#f5ede0" />
                  {/* Liquid line & bubble */}
                  <path d="M41 61 Q50 58 59 61" stroke="#a67c2e" strokeWidth="1.5" />
                  <circle cx="48" cy="65" r="1.5" fill="#a67c2e" />
                  <circle cx="53" cy="64" r="1" fill="#a67c2e" />
                  {/* Purity check sparkle badge */}
                  <path d="M68 28 L70 32 L74 34 L70 36 L68 40 L66 36 L62 34 L66 32 Z" fill="#a67c2e" />
                </svg>
              )}

              {index === 1 && (
                /* Icon 2: Direct Farm Sourcing & Agricultural Origin */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Sun / Horizon arc */}
                  <path d="M26 64 C26 48 37 36 50 36 C63 36 74 48 74 64" stroke="#a67c2e" strokeWidth="1.25" strokeDasharray="3 3" strokeOpacity="0.6" fill="none" />
                  {/* Direct Farmer Partnership Handshake silhouette */}
                  <path d="M22 52 L36 44 L44 50 L38 58 L28 58 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  <path d="M78 52 L64 44 L56 50 L62 58 L72 58 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  <path d="M44 50 L50 56 L56 50" stroke="#a67c2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M40 54 L47 61 L53 55" stroke="#a67c2e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Sprouting Botanical Leaves Emerging Upward */}
                  <path d="M50 44 L50 24" stroke="#a67c2e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M50 34 C42 30 38 22 48 20 C49 26 50 31 50 34 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  <path d="M50 34 C58 30 62 22 52 20 C51 26 50 31 50 34 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.75" strokeLinejoin="round" />
                  {/* Ground furrow lines */}
                  <path d="M28 72 Q50 68 72 72" stroke="#a67c2e" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
                  <path d="M34 78 Q50 75 66 78" stroke="#a67c2e" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
                </svg>
              )}

              {index === 2 && (
                /* Icon 3: Flexible Bulk Export Packaging (PP Bags, Multi-layer Sacks) */
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="44" fill="#f5ede0" />
                  {/* Industrial Woven Spice Sack */}
                  <path d="M36 40 C36 34 40 32 50 32 C60 32 64 34 64 40 L66 68 C66 73 60 76 50 76 C40 76 34 73 34 68 Z" fill="#f5ede0" stroke="#a67c2e" strokeWidth="2" strokeLinejoin="round" />
                  {/* Sack Tie / Neck at top */}
                  <ellipse cx="50" cy="33" rx="8" ry="3" fill="#a67c2e" />
                  <path d="M47 30 Q50 25 53 30" stroke="#a67c2e" strokeWidth="2" strokeLinecap="round" />
                  {/* Packaging grade stripes / Texture lines */}
                  <path d="M36 50 Q50 54 64 50" stroke="#a67c2e" strokeWidth="1.5" strokeOpacity="0.8" />
                  <path d="M35 58 Q50 62 65 58" stroke="#a67c2e" strokeWidth="1.5" strokeOpacity="0.8" />
                  {/* Seven Spice Quality Star Seal on Bag */}
                  <circle cx="50" cy="44" r="4" stroke="#a67c2e" strokeWidth="1.25" fill="#f5ede0" />
                  <path d="M50 41 L51 43 L53 43 L51.5 44.5 L52 46.5 L50 45 L48 46.5 L48.5 44.5 L47 43 L49 43 Z" fill="#a67c2e" />
                  {/* Pallet support base beneath sack */}
                  <rect x="28" y="76" width="44" height="4" rx="1" fill="#f5ede0" stroke="#a67c2e" strokeWidth="1.5" />
                  <line x1="38" y1="76" x2="38" y2="80" stroke="#a67c2e" strokeWidth="1.5" />
                  <line x1="62" y1="76" x2="62" y2="80" stroke="#a67c2e" strokeWidth="1.5" />
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
