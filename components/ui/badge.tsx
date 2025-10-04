import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-all duration-200 overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "border border-muted/40 bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:border-muted/50 dark:bg-muted/30 dark:border-muted/50 dark:hover:bg-muted/40",
        secondary:
          "border border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400 dark:border-slate-400/30 dark:bg-slate-400/10",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:border-destructive/30 dark:bg-destructive/20 dark:border-destructive/30 dark:hover:bg-destructive/30",
        outline:
          "border border-border bg-muted text-muted-foreground dark:bg-muted/50 dark:border-border/50",
        // Event badges
        eventDate:
          "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 dark:border-amber-400/30 dark:bg-amber-400/10 dark:hover:bg-amber-400/20 dark:hover:border-amber-400/40",
        date: "border border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/20 hover:border-zinc-500/40 dark:border-zinc-400/30 dark:bg-zinc-400/10 dark:hover:bg-zinc-400/20 dark:hover:border-zinc-400/40",
        mainEvent:
          "border border-gray-500/30 bg-gray-500/10 text-gray-700 dark:text-gray-300 hover:bg-gray-500/20 hover:border-gray-500/40 dark:border-gray-400/30 dark:bg-gray-400/10 dark:hover:bg-gray-400/20 dark:hover:border-gray-400/40 font-semibold",
        // Men's divisions - Cooler colors, progressing from light to heavy
        lightweight:
          "border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:border-sky-400/30 dark:bg-sky-400/10",
        welterweight:
          "border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:border-blue-400/30 dark:bg-blue-400/10",
        middleweight:
          "border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400/30 dark:bg-indigo-400/10",
        lightHeavyweight:
          "border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:border-violet-400/30 dark:bg-violet-400/10",
        heavyweight:
          "border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 dark:border-purple-400/30 dark:bg-purple-400/10",
        // Men's lighter divisions - Cooler colors
        featherweight:
          "border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 dark:border-cyan-400/30 dark:bg-cyan-400/10",
        bantamweight:
          "border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 dark:border-teal-400/30 dark:bg-teal-400/10",
        flyweight:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400/30 dark:bg-emerald-400/10",
        // Women's divisions - Warmer colors
        womenFeatherweight:
          "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:border-rose-400/30 dark:bg-rose-400/10",
        womenBantamweight:
          "border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 dark:border-pink-400/30 dark:bg-pink-400/10",
        womenFlyweight:
          "border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 dark:border-fuchsia-400/30 dark:bg-fuchsia-400/10",
        womenStrawweight:
          "border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 dark:border-orange-400/30 dark:bg-orange-400/10",
        nr: "border border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 dark:border-zinc-400/30 dark:bg-zinc-400/10",
        champion:
          "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:border-amber-400/30 dark:bg-amber-400/10",
        retired:
          "border border-stone-500/30 bg-stone-500/10 text-stone-600 dark:text-stone-400 dark:border-stone-400/30 dark:bg-stone-400/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
