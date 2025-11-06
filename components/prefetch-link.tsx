"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  type ComponentProps,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";

type PrefetchLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  children: ReactNode;
  /** Prefetch when the element receives pointer hover. */
  prefetchOnHover?: boolean;
  /** Prefetch when the element receives keyboard focus. */
  prefetchOnFocus?: boolean;
  /** Prefetch when the element receives a touch interaction. */
  prefetchOnTouch?: boolean;
  /** Prefetch shortly after mount, useful for high-priority routes. */
  prefetchOnMount?: boolean;
};

const PrefetchLink = forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
  (
    {
      href,
      children,
      prefetchOnHover = true,
      prefetchOnFocus = true,
      prefetchOnTouch = true,
      prefetchOnMount = false,
      onMouseEnter,
      onFocus,
      onTouchStart,
      prefetch: prefetchProp,
      ...linkProps
    },
    ref
  ) => {
    const router = useRouter();
    const prefetchedRef = useRef(false);
    const effectivePrefetch = prefetchProp ?? false;

    const prefetch = useCallback(() => {
      if (prefetchedRef.current) return;

      prefetchedRef.current = true;
      try {
        const maybePromise = router.prefetch(href);
        void Promise.resolve(maybePromise).catch(() => {
          prefetchedRef.current = false;
        });
      } catch {
        prefetchedRef.current = false;
      }
    }, [href, router]);

    useEffect(() => {
      prefetchedRef.current = false;
    }, [href]);

    useEffect(() => {
      if (!prefetchOnMount) return;

      const timeoutId = window.setTimeout(prefetch, 200);
      return () => window.clearTimeout(timeoutId);
    }, [prefetch, prefetchOnMount]);

    const handleMouseEnter = useCallback(
      (event: MouseEvent<HTMLAnchorElement>) => {
        onMouseEnter?.(event);
        if (prefetchOnHover) {
          prefetch();
        }
      },
      [onMouseEnter, prefetch, prefetchOnHover]
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        if (prefetchOnFocus) {
          prefetch();
        }
      },
      [onFocus, prefetch, prefetchOnFocus]
    );

    const handleTouchStart = useCallback(
      (event: TouchEvent<HTMLAnchorElement>) => {
        onTouchStart?.(event);
        if (prefetchOnTouch) {
          prefetch();
        }
      },
      [onTouchStart, prefetch, prefetchOnTouch]
    );

    return (
      <Link
        ref={ref}
        href={href}
        prefetch={effectivePrefetch}
        {...linkProps}
        onMouseEnter={handleMouseEnter}
        onFocus={handleFocus}
        onTouchStart={handleTouchStart}
      >
        {children}
      </Link>
    );
  }
);

PrefetchLink.displayName = "PrefetchLink";

export default PrefetchLink;
