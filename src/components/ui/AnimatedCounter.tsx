"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  className?: string;
  locale?: string;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  className = "",
  locale = "en",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setCount(target);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setHasAnimated(true);

        const start = performance.now();

        function animate(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = progress * (2 - progress); // ease-out
          setCount(Math.floor(eased * target));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        }

        requestAnimationFrame(animate);
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {formatNumber(count, locale)}
    </span>
  );
}
