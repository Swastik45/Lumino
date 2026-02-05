"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    if (typeof window === "undefined") return 'dark';
    const stored = window.localStorage.getItem('theme') as 'light'|'dark' | null;
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const routeKeyword = query.trim().replace(/\s+/g, "-");
    router.push(`/${routeKeyword}`);
    setQuery("");
  };

  return (
    <header className="site-header container">
      <div className="brand">
        <div className="logo">A</div>
        <div>
          <div>Lumino</div>
          <div className="muted" style={{ fontSize: 12 }}>Search images from Unsplash</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            aria-label="Search images"
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        <button
          aria-label="Toggle theme"
          title="Toggle theme"
          className="btn btn-ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
