import { Tweet } from '@/lib/types';

interface ResultCardProps {
  tweet: Tweet;
  query?: string;
  index?: number;
  onClick?: () => void;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (tokens.length === 0) return text;
  const pattern = new RegExp(`(${tokens.join('|')})`, 'gi');
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    pattern.test(part) ? <mark key={i}>{part}</mark> : part
  );
}

function formatRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function userInitial(userId: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[userId % letters.length];
}

const AVATAR_COLORS = [
  '#4285f4', '#ea4335', '#fbbc05', '#34a853',
  '#9c27b0', '#00bcd4', '#ff5722', '#795548',
];

export function ResultCard({ tweet, query = '', index = 0, onClick }: ResultCardProps) {
  const time = formatRelativeTime(tweet.createdAt);
  const shortId = tweet.id.startsWith('mock-')
    ? tweet.id
    : `#${tweet.id.slice(0, 8)}`;
  const avatarColor = AVATAR_COLORS[tweet.userId % AVATAR_COLORS.length];
  const delay = Math.min(index * 60, 400);

  return (
    <div
      className="result-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* URL row */}
      <div className="result-card__url">
        <div
          className="result-card__icon"
          style={{ background: avatarColor, color: '#fff', border: 'none' }}
          aria-hidden="true"
        >
          {userInitial(tweet.userId)}
        </div>
        <div>
          <div className="result-card__domain">
            stream-search.local › tweets › {shortId}
          </div>
          <div className="result-card__subdomain">User {tweet.userId}</div>
        </div>
      </div>

      {/* Title */}
      <div
        className="result-card__title"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-label={`View tweet ${shortId}`}
      >
        {tweet.text.length > 60 ? tweet.text.slice(0, 60) + '…' : tweet.text}
      </div>

      {/* Snippet */}
      <div className="result-card__snippet">
        {highlightText(tweet.text, query)}
      </div>

      {/* Meta */}
      <div className="result-card__meta">
        <span>{time}</span>
        <span>·</span>
        <span>ID: {shortId}</span>
      </div>
    </div>
  );
}

/* Skeleton loader */
export function ResultCardSkeleton({ index = 0 }: { index?: number }) {
  const delay = Math.min(index * 60, 300);
  return (
    <div className="result-card result-card--skeleton" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 4, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 11, width: '25%', borderRadius: 4 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 8, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 4, borderRadius: 4 }} />
      <div className="skeleton" style={{ height: 14, width: '55%', borderRadius: 4 }} />
    </div>
  );
}
