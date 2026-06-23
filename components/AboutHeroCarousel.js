'use client';

import { useState, useEffect } from 'react';

const carouselImages = [
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM.jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(1).jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(2).jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(3).jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(4).jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(5).jpeg",
  "/images/images%20cureosel%20About%20us%20Hero/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(6).jpeg"
];

export default function AboutHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-[#30000a]">
      {carouselImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Full-bleed background image with original clarity, no dark filters on top of the image */}
            <img
              src={src}
              alt={`About Us Background Slide ${index + 1}`}
              className="w-full h-full object-cover select-none"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}
    </div>
  );
}
