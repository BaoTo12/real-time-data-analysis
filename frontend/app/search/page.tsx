'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/SearchBox';
import { ResultCard, ResultCardSkeleton } from '@/components/ResultCard';
import { useSearch } from '@/hooks/useSearch';
import { Search } from 'lucide-react';

function SearchResults() {
  const router = useRouter();
  const params = useSearchParams();
  const urlQuery = params.get('q') ?? '';

  const { results, isLoading, isMock, query, setQuery } = useSearch(urlQuery);

  // Keep URL in sync when user types in the inline search box
  useEffect(() => {
    if (query && query !== urlQuery) {
      const timeout = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [query, urlQuery, router]);

  return (
    <div className="search-page">
      {/* Top search bar */}
      <div className="search-bar-row">
        <div className="search-bar-row__logo" aria-hidden="true">
          <span className="c1">S</span>
          <span className="c2">t</span>
          <span className="c3">r</span>
          <span className="c4">e</span>
          <span className="c5">a</span>
          <span className="c6">m</span>
        </div>
        <SearchBox
          initialValue={urlQuery}
          onChangeImmediate={setQuery}
          isLoading={isLoading}
          autoFocus={!urlQuery}
          placeholder="Search tweets…"
        />
      </div>

      {/* Centered results area */}
      <div className="search-results">
        {/* Loading skeletons */}
        {isLoading && (
          <>
            <div className="skeleton" style={{ height: 13, width: 180, marginBottom: 24, borderRadius: 4 }} />
            <div className="search-results__list">
              {[...Array(5)].map((_, i) => (
                <ResultCardSkeleton key={i} index={i} />
              ))}
            </div>
          </>
        )}

        {/* Results */}
        {!isLoading && query.trim() && results.length > 0 && (
          <>
            <div className="search-results__meta">
              About {results.length} result{results.length !== 1 ? 's' : ''}
              {isMock && (
                <span className="badge badge--mock" style={{ marginLeft: 8 }}>
                  Mock data
                </span>
              )}
            </div>
            <div className="search-results__list">
              {results.map((tweet, i) => (
                <ResultCard
                  key={tweet.id}
                  tweet={tweet}
                  query={query}
                  index={i}
                  onClick={() => router.push(`/tweets/${tweet.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* No results */}
        {!isLoading && query.trim() && results.length === 0 && (
          <div className="no-results animate-in">
            No results for <strong>&ldquo;{query}&rdquo;</strong>
            <p>
              Try keywords like &ldquo;Kafka&rdquo;, &ldquo;Spring&rdquo;, or
              &ldquo;Elasticsearch&rdquo;.
            </p>
          </div>
        )}

        {/* Empty prompt */}
        {!isLoading && !query.trim() && (
          <div className="empty-state animate-in">
            <Search size={52} color="var(--color-border)" />
            <div className="empty-state__title">Start searching</div>
            <div className="empty-state__subtitle">
              Type a keyword to explore indexed tweet documents
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="page-loading">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
