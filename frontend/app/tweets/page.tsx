'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAllTweets } from '@/hooks/useAllTweets';
import { ResultCard, ResultCardSkeleton } from '@/components/ResultCard';
import { Search } from 'lucide-react';

export default function TweetsPage() {
  const { data: tweets, isLoading } = useAllTweets();
  const router = useRouter();
  const [filter, setFilter] = useState('');

  const filtered = (tweets ?? []).filter((t) =>
    filter.trim() ? t.text.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <main className="tweets-page">
      <div className="tweets-page__header">
        <h1 className="tweets-page__title">All Indexed Tweets</h1>

        <div className="search-box tweets-page__filter">
          <span className="search-box__icon" aria-hidden="true">
            <Search size={18} />
          </span>
          <input
            className="search-box__input"
            type="text"
            placeholder="Filter by keyword…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter tweets"
          />
        </div>

        {!isLoading && (
          <p className="tweets-page__meta">
            {filtered.length} document{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="tweets-page__list">
        {isLoading
          ? [...Array(8)].map((_, i) => <ResultCardSkeleton key={i} />)
          : filtered.map((t, i) => (
              <ResultCard
                key={t.id}
                tweet={t}
                query={filter}
                index={i}
                onClick={() => router.push(`/tweets/${t.id}`)}
              />
            ))}

        {!isLoading && filtered.length === 0 && (
          <div className="no-results">
            No tweets match <strong>&ldquo;{filter}&rdquo;</strong>
            <p>Try a different keyword.</p>
          </div>
        )}
      </div>
    </main>
  );
}
