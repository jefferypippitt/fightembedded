"use client";

import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  defaultValue?: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-label'?: string
  maxWidth?: string
  isLoading?: boolean
}

export function SearchBar({ 
  defaultValue = '', 
  onChange, 
  placeholder = 'Search...',
  'aria-label': ariaLabel = 'Search',
  maxWidth = '100%',
  isLoading = false
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue || "");

  const createQueryString = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    return params.toString();
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setValue("");
      // Update URL and trigger new search without the query parameter
      router.replace(`${pathname}?${createQueryString("")}`);
      onChange?.("");
    }
  };

  // Debounced URL update handler
  const debouncedUrlUpdate = useDebouncedCallback((term: string) => {
    router.replace(`${pathname}?${createQueryString(term)}`);
    onChange?.(term);
  }, 300);

  // Immediate input update handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedUrlUpdate(newValue);
  }, [debouncedUrlUpdate]);

  return (
    <div className="w-full" style={{ maxWidth }}>
      <div className="relative w-full">
        <Search className={cn(
          "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground",
          isLoading && "opacity-50"
        )} />
        <Input
          ref={inputRef}
          name="query"
          placeholder={placeholder}
          type="search"
          value={value}
          onChange={handleInputChange}
          className={cn(
            "pl-8 pr-8 w-full [&::-webkit-search-cancel-button]:hidden placeholder:text-sm",
            isLoading && "pr-12"
          )}
          aria-label={ariaLabel}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {value && !isLoading && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}
