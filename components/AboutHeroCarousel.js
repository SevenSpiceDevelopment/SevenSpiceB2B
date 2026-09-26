'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const carouselImages = [
  "/images/about/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(2).jpeg",
  "/images/about/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(4).jpeg",
  "/images/about/WhatsApp%20Image%202026-06-23%20at%2011.29.14%20PM%20(6).jpeg",
  "/images/about/860c800b-4bc7-4e14-943c-121861501476.png",
  "/images/about/pexels-bilal-ahmed-297238753-14020705.jpg",
  "/images/about/spice-farm-origin.png",
  "/images/about/quality-inspection.png"
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
        const isPrev = index === (currentIndex - 1 + carouselImages.length) % carouselImages.length;

        return (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full ${
              isActive 
                ? 'opacity-100 z-10 transition-opacity duration-1000 ease-in-out' 
                : isPrev 
                  ? 'opacity-100 z-0' 
                  : 'opacity-0 z-0'
            }`}
          >
            {/* Full-bleed background image with original clarity, high quality */}
            <Image
              src={src}
              alt={`About Us Background Slide ${index + 1}`}
              fill
              sizes="100vw"
              priority={index === 0}
              quality={95}
              className="object-cover select-none"
            />
          </div>
        );
      })}
    </div>
  );
}
