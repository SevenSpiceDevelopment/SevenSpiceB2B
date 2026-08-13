"use client";

import { useEffect, useRef, useState } from "react";

export default function MobileCardCarousel({ children, count, className = "" }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const cards = Array.from(children);

  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = 0;
  }, []);

  const onScroll = () => {
    const node = ref.current;
    if (!node) return;
    const index = cards.reduce((best, _, i) => {
      const distance = Math.abs(node.children[i].offsetLeft - node.scrollLeft);
      const bestDistance = Math.abs(node.children[best].offsetLeft - node.scrollLeft);
      return distance < bestDistance ? i : best;
    }, 0);
    setActive(index);
  };

  return (
    <>
      <div ref={ref} onScroll={onScroll} className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 pb-6 md:grid md:grid-cols-3 md:gap-gutter [&>a]:h-[520px] [&>div]:h-[520px] [&.compact-cards>a]:!h-[440px] [&.compact-cards>div]:!h-[440px] [&.home-blog-cards>a]:!h-[360px] [&.home-blog-cards>div]:!h-[360px] md:[&>a]:h-auto md:[&>div]:h-auto ${className}`}>
        {cards}
      </div>
      {count > 1 && (
        <div className="flex justify-center items-center gap-2 pt-1 md:hidden" aria-label="Card navigation">
          {cards.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                ref.current?.children[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                setActive(index);
              }}
              aria-label={`Show card ${index + 1}`}
              aria-current={active === index ? "true" : undefined}
              className={`!min-h-0 h-2 shrink-0 rounded-full p-0 transition-all duration-200 ${active === index ? "w-6 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
