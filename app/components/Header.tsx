"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or system preference
    const stored = window.localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (stored) {
      setTheme(stored);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    if (!mounted) return;
    
    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    window.localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const routeKeyword = query.trim().replace(/\s+/g, "-");
    router.push(`/${routeKeyword}`);
    setQuery("");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="site-header">
      <div className="brand">
        <div className="logo">L</div>
        <div>Lumino</div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        alignItems: 'center',
        flex: '1',
        justifyContent: 'flex-end'
      }}>
        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            aria-label="Search images"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <button
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="btn btn-ghost"
          onClick={toggleTheme}
          style={{ 
            minWidth: '44px', 
            padding: '0.55rem',
            fontSize: '1.2rem'
          }}
        >
          {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
        </button>
      </div>
    </header>
  );
}