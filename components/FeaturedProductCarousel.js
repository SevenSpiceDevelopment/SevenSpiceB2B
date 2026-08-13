"use client";

import { useRef, useState } from "react";
import FeaturedProductCard from "./FeaturedProductCard";

export default function FeaturedProductCarousel({ products, locale, businessPhone, businessEmail }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.children);
    const closestIndex = cards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft - scroller.scrollLeft);
      const closestDistance = Math.abs(cards[closest].offsetLeft - scroller.scrollLeft);
      return distance < closestDistance ? index : closest;
    }, 0);

    setActiveIndex(closestIndex);
  };

  const scrollToCard = (index) => {
    const card = scrollerRef.current?.children[index];
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(index);
  };

  return (
    <>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter"
      >
        {products.map((product) => (
          <FeaturedProductCard
            key={product.id}
            product={product}
            locale={locale}
            businessPhone={businessPhone}
            businessEmail={businessEmail}
          />
        ))}
      </div>

      {products.length > 1 && (
        <div className="flex justify-center items-center gap-2 pt-1 md:hidden" aria-label="Featured products carousel navigation">
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => scrollToCard(index)}
              aria-label={`Show featured product ${index + 1}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`!min-h-0 h-2 shrink-0 rounded-full p-0 transition-all duration-200 ${
                activeIndex === index
                  ? "w-6 bg-primary"
                  : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
