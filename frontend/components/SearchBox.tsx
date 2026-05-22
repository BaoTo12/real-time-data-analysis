'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  initialValue?: string;
  onChangeImmediate?: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchBox({
  initialValue = '',
  onChangeImmediate,
  autoFocus = false,
  placeholder = 'Search tweets — try "Kafka", "Spring Boot", "Elasticsearch"…',
  isLoading = false,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Sync if parent changes initialValue (e.g. URL param)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChangeImmediate?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleClear = () => {
    setValue('');
    onChangeImmediate?.('');
    inputRef.current?.focus();
  };

  return (
    <div className="search-box" role="search">
      <span className="search-box__icon" aria-hidden="true">
        <Search size={20} />
      </span>
      <input
        ref={inputRef}
        id="tweet-search-input"
        type="text"
        className="search-box__input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Search tweets"
      />
      {isLoading && <span className="search-box__spinner" aria-label="Loading" />}
      {!isLoading && value && (
        <button
          className="search-box__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
