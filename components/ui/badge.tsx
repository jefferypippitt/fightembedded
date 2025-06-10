import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-all duration-200 overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/30 dark:bg-primary/20 dark:border-primary/30 dark:hover:bg-primary/30",
        secondary:
          "border border-border bg-muted text-muted-foreground hover:bg-muted/80 hover:border-border/80 dark:bg-muted/50 dark:border-border/50 dark:hover:bg-muted/60",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:border-destructive/30",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent/50 hover:border-border/80 dark:bg-background/50 dark:border-border/50 dark:hover:bg-accent/20",
        // Event badges
        eventDate:
          "border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40 dark:border-amber-400/30 dark:bg-amber-400/10 dark:hover:bg-amber-400/20 dark:hover:border-amber-400/40",
        mainEvent:
          "border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:border-red-500/40 dark:border-red-400/30 dark:bg-red-400/10 dark:hover:bg-red-400/20 dark:hover:border-red-400/40 font-semibold",
        coMainEvent:
          "border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 dark:border-orange-400/30 dark:bg-orange-400/10 dark:hover:bg-orange-400/20 dark:hover:border-orange-400/40",
        prelims:
          "border border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20 hover:border-slate-500/40 dark:border-slate-400/30 dark:bg-slate-400/10 dark:hover:bg-slate-400/20 dark:hover:border-slate-400/40",
        // Men's divisions - Cooler colors, progressing from light to heavy
        lightweight:
          "border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40 dark:border-sky-400/30 dark:bg-sky-400/10 dark:hover:bg-sky-400/20 dark:hover:border-sky-400/40",
        welterweight:
          "border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40 dark:border-blue-400/30 dark:bg-blue-400/10 dark:hover:bg-blue-400/20 dark:hover:border-blue-400/40",
        middleweight:
          "border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/40 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:hover:bg-indigo-400/20 dark:hover:border-indigo-400/40",
        lightHeavyweight:
          "border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/40 dark:border-violet-400/30 dark:bg-violet-400/10 dark:hover:bg-violet-400/20 dark:hover:border-violet-400/40",
        heavyweight:
          "border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40 dark:border-purple-400/30 dark:bg-purple-400/10 dark:hover:bg-purple-400/20 dark:hover:border-purple-400/40",
        // Men's lighter divisions - Cooler colors
        featherweight:
          "border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:hover:bg-cyan-400/20 dark:hover:border-cyan-400/40",
        bantamweight:
          "border border-teal-500/30 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 hover:border-teal-500/40 dark:border-teal-400/30 dark:bg-teal-400/10 dark:hover:bg-teal-400/20 dark:hover:border-teal-400/40",
        flyweight:
          "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:hover:bg-emerald-400/20 dark:hover:border-emerald-400/40",
        // Women's divisions - Warmer colors
        womenFeatherweight:
          "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 dark:border-rose-400/30 dark:bg-rose-400/10 dark:hover:bg-rose-400/20 dark:hover:border-rose-400/40",
        womenBantamweight:
          "border border-pink-500/30 bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/40 dark:border-pink-400/30 dark:bg-pink-400/10 dark:hover:bg-pink-400/20 dark:hover:border-pink-400/40",
        womenFlyweight:
          "border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 hover:bg-fuchsia-500/20 hover:border-fuchsia-500/40 dark:border-fuchsia-400/30 dark:bg-fuchsia-400/10 dark:hover:bg-fuchsia-400/20 dark:hover:border-fuchsia-400/40",
        womenStrawweight:
          "border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 dark:border-orange-400/30 dark:bg-orange-400/10 dark:hover:bg-orange-400/20 dark:hover:border-orange-400/40",
        retired:
          "border border-slate-400/30 bg-slate-100/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 hover:border-slate-500/30 dark:border-slate-600/30 dark:bg-slate-800/20 dark:hover:bg-slate-700/30 dark:hover:border-slate-500/40 font-medium",
        champion:
          "border border-yellow-400/40 bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 dark:text-yellow-300 hover:from-yellow-100 hover:to-amber-100 hover:border-yellow-500/50 dark:border-yellow-600/30 dark:from-yellow-900/30 dark:to-amber-900/30 dark:hover:from-yellow-800/40 dark:hover:to-amber-800/40 font-semibold shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
