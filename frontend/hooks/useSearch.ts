import { useState, useEffect, useRef, useCallback } from 'react';
import { Tweet } from '@/lib/types';
import { searchTweets } from '@/lib/api';
import { searchMockTweets } from '@/lib/mockData';

interface UseSearchResult {
  results: Tweet[];
  isLoading: boolean;
  isError: boolean;
  isMock: boolean;
  errorMessage: string | null;
  query: string;
  setQuery: (q: string) => void;
}

export function useSearch(initialQuery = ''): UseSearchResult {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsError(false);
      setIsMock(false);
      setErrorMessage(null);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    setIsMock(false);
    setErrorMessage(null);
    try {
      const data = await searchTweets(q);
      setResults(data);
    } catch {
      // Backend unreachable — silently fall back to mock data
      const mockResults = searchMockTweets(q);
      setResults(mockResults);
      setIsError(false);
      setIsMock(true);
      setErrorMessage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  return { results, isLoading, isError, isMock, errorMessage, query, setQuery };
}
