"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedStat({ targetValue, startValue = 0, suffix = "%", duration = 1500 }) {
  const [value, setValue] = useState(startValue);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setValue(targetValue);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = percentage * (2 - percentage);
            
            const currentValue = Math.round(
              startValue + (targetValue - startValue) * easeProgress
            );
            
            setValue(currentValue);
            
            if (progress < duration) {
              requestAnimationFrame(animate);
            } else {
              setValue(targetValue);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [targetValue, startValue, duration]);

  return <span ref={elementRef}>{value}{suffix}</span>;
}
