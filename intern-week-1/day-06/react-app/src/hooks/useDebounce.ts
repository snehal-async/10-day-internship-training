/**
 * src/hooks/useDebounce.ts
 * Generic React custom hook to debounce rapidly changing values (e.g. search input)
 */

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
