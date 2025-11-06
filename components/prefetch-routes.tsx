"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const DEFAULT_PRIMARY_ROUTES = [
  "/athletes",
  "/retired",
  "/events",
  "/rankings/popularity",
  "/rankings/divisions",
] as const;

const DEFAULT_SECONDARY_ROUTES = [
  "/division/men-heavyweight",
  "/division/men-light-heavyweight",
  "/division/men-middleweight",
  "/division/men-welterweight",
  "/division/men-lightweight",
  "/division/men-featherweight",
  "/division/men-bantamweight",
  "/division/men-flyweight",
  "/division/women-bantamweight",
  "/division/women-flyweight",
  "/division/women-strawweight",
] as const;

const prefetchedRoutes = new Set<string>();

type PrefetchRoutesProps = {
  primaryRoutes?: readonly string[];
  secondaryRoutes?: readonly string[];
  /** Delay between successive prefetch calls in milliseconds. */
  stagger?: number;
};

export default function PrefetchRoutes({
  primaryRoutes = DEFAULT_PRIMARY_ROUTES,
  secondaryRoutes = DEFAULT_SECONDARY_ROUTES,
  stagger = 160,
}: PrefetchRoutesProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const queue = Array.from(
      new Set([...primaryRoutes, ...secondaryRoutes])
    ).filter(
      (route) => route && route !== pathname && !prefetchedRoutes.has(route)
    );

    if (!queue.length) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const runQueue = (index: number) => {
      if (cancelled || index >= queue.length) return;

      const target = queue[index];
      prefetchedRoutes.add(target);
      try {
        const maybePromise = router.prefetch(target);
        void Promise.resolve(maybePromise).catch(() => {
          prefetchedRoutes.delete(target);
          // Ignore failures; we'll rely on native navigation fallback.
        });
      } catch {
        prefetchedRoutes.delete(target);
        // Swallow synchronous errors and fall back to native navigation.
      }

      timeoutId = window.setTimeout(() => runQueue(index + 1), stagger);
    };

    timeoutId = window.setTimeout(() => runQueue(0), 240);

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname, primaryRoutes, router, secondaryRoutes, stagger]);

  return null;
}
