import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  return useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
}

export function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const result = window.matchMedia(query);
      result.addEventListener("change", onChange);
      return () => result.removeEventListener("change", onChange);
    },
    [query]
  );

  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Matches the previous behavior of reporting false until hydrated
    () => false
  );
}
