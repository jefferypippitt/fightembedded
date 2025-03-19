'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function RetiredError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Retired page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        We couldn&apos;t load the retired athletes. Please try again later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
} 