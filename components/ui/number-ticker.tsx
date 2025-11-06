"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useVelocity,
  animate,
} from "framer-motion";

import { cn } from "@/lib/utils";

export default function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const velocity = useVelocity(springValue);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const blurMotionValue = useMotionValue(0);
  const previousValue = useRef(0);
  const lastUpdateTime = useRef<number | null>(null);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  // Track velocity for high-quality motion blur
  useMotionValueEvent(springValue, "change", (latest) => {
    if (ref.current) {
      const currentValue = Number(latest.toFixed(decimalPlaces));
      const now = Date.now();

      // Initialize lastUpdateTime on first call (client-side only)
      if (lastUpdateTime.current === null) {
        lastUpdateTime.current = now;
      }

      const deltaTime = (now - lastUpdateTime.current) / 1000; // Convert to seconds
      lastUpdateTime.current = now;

      // Calculate actual velocity (change per second)
      const valueChange = Math.abs(currentValue - previousValue.current);
      const actualVelocity = deltaTime > 0 ? valueChange / deltaTime : 0;

      // Calculate blur based on velocity with smooth curve
      // Use logarithmic scale for more natural motion blur
      const blur = Math.min(
        Math.pow(actualVelocity * 0.15, 0.7) * 2.5,
        4 // Cap at 4px blur for high quality
      );

      // Smoothly animate blur changes
      animate(blurMotionValue, blur, {
        duration: 0.1,
        ease: "easeOut",
      });

      ref.current.textContent = Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }).format(currentValue);

      previousValue.current = currentValue;
    }
  });

  // Gradually reduce blur when animation slows down
  useMotionValueEvent(velocity, "change", (latest) => {
    if (Math.abs(latest) < 0.1) {
      // Animation is essentially stopped, fade out blur
      animate(blurMotionValue, 0, {
        duration: 0.3,
        ease: "easeOut",
      });
    }
  });

  // Subscribe to blur motion value for rendering
  const [blurAmount, setBlurAmount] = useState(0);
  useMotionValueEvent(blurMotionValue, "change", (latest) => {
    setBlurAmount(latest);
  });

  return (
    <span
      className={cn(
        "inline-block tabular-nums text-black dark:text-white tracking-wider",
        className
      )}
      ref={ref}
      style={{
        filter: `blur(${blurAmount}px)`,
        willChange: "filter",
        transform: "translateZ(0)", // Enable hardware acceleration
      }}
    />
  );
}
