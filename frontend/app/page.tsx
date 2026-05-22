'use client';

import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { SearchBox } from '@/components/SearchBox';
import { MOCK_TWEETS } from '@/lib/mockData';

const SUGGESTED = [
  'Kafka Avro serialization',
  'Spring Boot microservices',
  'Elasticsearch full-text search',
  'Java virtual threads',
  'event-driven architecture',
];

export default function HomePage() {
  const router = useRouter();
  const recent = MOCK_TWEETS.slice(0, 6);


  return (
    <main className="home">
      {/* Logo */}
      <div className="home__logo">
        <div className="home__logo-text">
          <span className="c1">S</span>
          <span className="c2">t</span>
          <span className="c3">r</span>
          <span className="c4">e</span>
          <span className="c5">a</span>
          <span className="c6">m</span>
          <span className="c7">S</span>
          <span className="c8">e</span>
          <span className="c9">arch</span>
        </div>
        <p className="home__subtitle">
          Real-time tweet data · Kafka → Elasticsearch · Spring Boot
        </p>
      </div>

      {/* Search */}
      <div className="home__search-wrap">
        <SearchBox
          autoFocus
          onChangeImmediate={() => {}}
          placeholder='Try "Kafka", "Spring Boot", "Elasticsearch"…'
        />
      </div>

      {/* Buttons */}
      <div className="home__buttons">
        <button
          id="btn-search"
          className="home__btn"
          onClick={() => {
            const input = document.getElementById(
              'tweet-search-input'
            ) as HTMLInputElement;
            if (input?.value.trim())
              router.push(`/search?q=${encodeURIComponent(input.value.trim())}`);
          }}
        >
          StreamSearch
        </button>
        <button
          id="btn-all"
          className="home__btn"
          onClick={() => router.push('/tweets')}
        >
          Browse All Tweets
        </button>
      </div>

      {/* Suggested topics */}
      <div className="home__recent">
        <div className="home__recent-title">Suggested Topics</div>
        {SUGGESTED.map((s, i) => (
          <div
            key={s}
            className="recent-row"
            role="button"
            tabIndex={0}
            style={{ animationDelay: `${i * 50}ms`, opacity: 0, animation: `fadeSlideIn 0.3s ease ${i * 50}ms forwards` }}
            onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}
            onKeyDown={(e) =>
              e.key === 'Enter' && router.push(`/search?q=${encodeURIComponent(s)}`)
            }
          >
            <span className="recent-row__icon"><Clock size={16} /></span>
            <span className="recent-row__text">{s}</span>
          </div>
        ))}

        {/* Recent tweets preview */}
        <div className="home__recent-title" style={{ marginTop: 32 }}>
          Recent Tweets (mock)
        </div>
        {recent.map((t, i) => (
          <div
            key={t.id}
            className="recent-row"
            role="button"
            tabIndex={0}
            style={{ animationDelay: `${(i + SUGGESTED.length) * 50}ms`, opacity: 0, animation: `fadeSlideIn 0.3s ease ${(i + SUGGESTED.length) * 50}ms forwards` }}
            onClick={() => router.push(`/tweets/${t.id}`)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/tweets/${t.id}`)}
          >
            <span className="recent-row__icon"><Clock size={16} /></span>
            <span className="recent-row__text">{t.text}</span>
            <span className="recent-row__time">{new Date(t.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
