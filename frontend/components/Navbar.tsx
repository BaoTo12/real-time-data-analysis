'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const path = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar__logo" style={{ textDecoration: 'none' }}>
        <span>Stream</span>Search
      </Link>
      <div className="navbar__links">
        <Link
          href="/"
          className={`navbar__link${path === '/' ? ' navbar__link--active' : ''}`}
        >
          Home
        </Link>
        <Link
          href="/search"
          className={`navbar__link${path.startsWith('/search') ? ' navbar__link--active' : ''}`}
        >
          Search
        </Link>
        <Link
          href="/tweets"
          className={`navbar__link${path.startsWith('/tweets') ? ' navbar__link--active' : ''}`}
        >
          All Tweets
        </Link>
      </div>
    </nav>
  );
}
