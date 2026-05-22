'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Hash, AlertTriangle } from 'lucide-react';
import { Tweet } from '@/lib/types';
import { getTweetById } from '@/lib/api';
import { MOCK_TWEETS } from '@/lib/mockData';

function formatDateLong(isoString: string) {
  try {
    return new Date(isoString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
}

/** Extract #Hashtags from tweet text */
function extractTags(text: string): string[] {
  const matches = text.match(/#\w+/g) ?? [];
  return [...new Set(matches)];
}

/** Render tweet text with clickable hashtags highlighted */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(#\w+)/g);
  return (
    <p className="post__body">
      {parts.map((part, i) =>
        part.startsWith('#') ? (
          <span key={i} className="post__hashtag">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export default function TweetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setNotFound(false);
    getTweetById(id)
      .then(setTweet)
      .catch(() => {
        const found = MOCK_TWEETS.find((t) => t.id === id);
        if (found) setTweet(found);
        else setNotFound(true);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const tags = tweet ? extractTags(tweet.text) : [];

  return (
    <div className="post-page">
      <Link href="/tweets" className="post-page__back">
        <ArrowLeft size={15} />
        All posts
      </Link>

      {/* Loading */}
      {isLoading && (
        <div className="post-card post-card--loading">
          <div className="skeleton" style={{ height: 13, width: '30%', borderRadius: 4, marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 28, width: '90%', borderRadius: 4, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 22, width: '75%', borderRadius: 4, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '100%', borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '60%', borderRadius: 4 }} />
        </div>
      )}

      {/* Not found */}
      {!isLoading && notFound && (
        <div className="empty-state">
          <AlertTriangle size={40} color="var(--color-text-light)" />
          <div className="empty-state__title">Post not found</div>
          <div className="empty-state__subtitle">No document with ID &ldquo;{id}&rdquo; exists.</div>
        </div>
      )}

      {/* Post card */}
      {!isLoading && tweet && (
        <article className="post-card">

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="post__tags">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag.slice(1))}`}
                  className="post__tag"
                >
                  <Hash size={11} />
                  {tag.slice(1)}
                </Link>
              ))}
            </div>
          )}

          {/* Main text as "headline + body" */}
          <RichText text={tweet.text} />

          {/* Timestamp */}
          <div className="post__meta">
            <Clock size={13} />
            <time dateTime={tweet.createdAt} title={formatDateLong(tweet.createdAt)}>
              {formatRelativeTime(tweet.createdAt)}
              <span className="post__meta-sep">·</span>
              {formatDateLong(tweet.createdAt)}
            </time>
          </div>

          <hr className="post__divider" />

          {/* Source info — no user, just pipeline context */}
          <div className="post__source">
            <span className="post__source-label">Source pipeline</span>
            <span className="post__source-path">
              Twitter stream → Kafka (Avro) → Elasticsearch → elastic-query-service
            </span>
          </div>
        </article>
      )}
    </div>
  );
}
