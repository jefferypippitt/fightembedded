import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

// Fetcher function for server actions
async function serverActionFetcher<T>(
  key: string,
  action: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> {
  return action(...args)
}

// Custom hook for server actions with SWR
export function useServerAction<T, P extends any[]>(
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
export function usePaginatedData<T, P extends Record<string, any>>(
  action: (params: P) => Promise<{ data: T[]; total: number } | { athletes: T[]; total: number } | { events: T[]; total: number }>,
  params: P,
  options?: SWRConfiguration<{ data: T[]; total: number } | { athletes: T[]; total: number } | { events: T[]; total: number }>
) {
  return useServerAction(action, [params], {
    revalidateOnMount: true,
    ...options,
  })
}
