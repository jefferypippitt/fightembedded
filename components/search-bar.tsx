'use client'

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Form from "next/form"
import { useRef } from "react"

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex gap-2 max-w-md">
      <Form action="" className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            name="query"
            placeholder="Search athletes"
            type="search"
            defaultValue={defaultValue}
            className="pl-8 [&::-webkit-search-cancel-button]:hidden"
          />
        </div>
      </Form>
      {defaultValue && (
        <Form action="/athletes">
          <Button 
            variant="ghost" 
            type="submit"
            onClick={handleClear}
            className="px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        </Form>
      )}
    </div>
  )
} 