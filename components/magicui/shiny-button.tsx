"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, type AnimationProps } from "motion/react";
import React from "react";

const animationProps = {
  initial: { "--x": "100%" },
  animate: { "--x": "-100%" },
  transition: {
    repeat: Infinity,
    repeatType: "loop" as const,
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 1,
  },
} as AnimationProps;

interface ShinyButtonProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>,
    MotionProps {
  children: React.ReactNode;
  className?: string;
}

function ShinyButton({
  children,
  className,
  ...props
}: ShinyButtonProps) {
  return (
    <motion.button
      data-slot="shiny-button"
      className={cn(
        "relative overflow-hidden rounded-lg",
        "px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2",
        "bg-black/5 dark:bg-white/5 backdrop-blur-xl transition-all duration-300",
        "hover:shadow-[0_0_1rem_var(--color-shiny-gradient)]",
        "dark:bg-[radial-gradient(circle_at_50%_0%,var(--color-shiny-gradient)_0%,transparent_70%)]",
        "dark:hover:shadow-[0_0_1rem_var(--color-shiny-gradient-hover)]",
        "border border-black/10 dark:border-white/20",
        "before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:bg-[linear-gradient(-75deg,var(--color-shiny-gradient)_calc(var(--x)+20%),var(--color-shiny-gradient-hover)_calc(var(--x)+25%),var(--color-shiny-gradient)_calc(var(--x)+100%))] before:opacity-100 before:z-0",
        className
      )}
      {...animationProps}
      {...props}
    >
      <span
        className="relative block size-full text-xs sm:text-sm md:text-sm uppercase tracking-wide text-black/80 dark:font-light dark:text-[rgb(255,255,255,90%)]"
        style={{
          maskImage:
            "linear-gradient(-75deg,var(--color-primary) calc(var(--x) + 20%),transparent calc(var(--x) + 25%),var(--color-primary) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,var(--color-shiny-gradient)_calc(var(--x)+20%),var(--color-shiny-gradient-hover)_calc(var(--x)+25%),var(--color-shiny-gradient)_calc(var(--x)+100%))] p-[1px]"
      />
    </motion.button>
  );
}

export { ShinyButton };

