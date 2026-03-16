import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

// Fetcher function for server actions
async function serverActionFetcher<T, A extends readonly unknown[]>(
  key: string,
  action: (...args: A) => Promise<T>,
  ...args: A
): Promise<T> {
  return action(...args)
}

// Custom hook for server actions with SWR
export function useServerAction<T, P extends readonly unknown[]>(
  action: ((...args: P) => Promise<T>) | null,
  args: P | null,
  options?: SWRConfiguration<T>
) {
  // Create a stable key from action name and args
  const key = args && action
    ? `${action.name}-${JSON.stringify(args)}`
    : null

  return useSWR(
    key,
    key && args
      ? () => serverActionFetcher(key, action!, ...args)
      : null,
    {
      revalidateOnFocus: false, // Server actions don't need focus revalidation
      revalidateOnReconnect: false,
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      keepPreviousData: true, // Keep previous data while loading new data
      ...options,
    }
  )
}

// Hook for paginated data with optimistic updates
export function usePaginatedData<T, P extends Record<string, unknown>>(
  action: (params: P) => Promise<{ data: T[]; total: number } | { athletes: T[]; total: number } | { events: T[]; total: number }>,
  params: P,
  options?: SWRConfiguration<{ data: T[]; total: number } | { athletes: T[]; total: number } | { events: T[]; total: number }>
) {
  const hasFallbackData =
    !!options &&
    "fallbackData" in options &&
    options.fallbackData !== undefined;

  return useServerAction(action, [params], {
    revalidateOnMount: hasFallbackData ? false : true,
    ...options,
  })
}
