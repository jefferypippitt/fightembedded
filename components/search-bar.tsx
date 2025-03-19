"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export interface SearchBarProps {
  defaultValue?: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-label'?: string
  maxWidth?: string
}

export function SearchBar({ 
  defaultValue = '', 
  onChange, 
  placeholder = 'Search...',
  'aria-label': ariaLabel = 'Search',
  maxWidth = '100%'
}: SearchBarProps) {
  const router = useRouter();
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
      router.push(`?${createQueryString("")}`);
      onChange?.("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Update URL and trigger new search with the query parameter
    router.push(`?${createQueryString(newValue)}`);
    onChange?.(newValue);
  };

  return (
    <div className="w-full" style={{ maxWidth }}>
      <div className="relative w-full">
        <Search className="absolute left-2 top-2.5 h-4 w-4" />
        <Input
          ref={inputRef}
          name="query"
          placeholder={placeholder}
          type="search"
          value={value}
          onChange={handleChange}
          className="pl-8 pr-8 w-full [&::-webkit-search-cancel-button]:hidden placeholder:text-sm"
          aria-label={ariaLabel}
        />
        {value && (
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
