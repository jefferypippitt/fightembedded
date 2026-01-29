"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number; // in seconds
  duration?: number; // in seconds
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up", // kept for API compatibility, currently unused
  delay = 0,
  duration = 1.5,
  className,
}: NumberTickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timeoutId = window.setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);

          return () => {
            window.clearTimeout(timeoutId);
          };
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;
    const totalDurationMs = duration * 1000;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDurationMs, 1);
      const currentValue =
        startValue + (endValue - startValue) * progress;

      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}
