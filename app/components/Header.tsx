"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const routeKeyword = query.trim().replace(/\s+/g, "-");
    router.push(`/${routeKeyword}`);
    setQuery("");
    setSearchOpen(false);
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const isDark = theme === "dark";

  const css = `
    .hdr {
      position: sticky;
      top: 0;
      z-index: 50;
      width: 100%;
      transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
    }
    .hdr-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1.5rem;
      height: 60px;
    }
    .hdr-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      text-decoration: none;
      flex-shrink: 0;
      user-select: none;
    }
    .hdr-logo {
      width: 34px; height: 34px;
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 800; letter-spacing: -0.5px;
      flex-shrink: 0;
      transition: transform 0.2s;
    }
    .hdr-brand:hover .hdr-logo { transform: scale(1.07) rotate(-3deg); }
    .hdr-wordmark {
      font-size: 17px; font-weight: 700; letter-spacing: -0.5px;
      transition: opacity 0.2s;
    }
    .hdr-spacer { flex: 1; }
    .hdr-search-form {
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s;
    }
    .hdr-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }
    .hdr-input-icon {
      position: absolute;
      left: 12px;
      font-size: 14px;
      pointer-events: none;
      opacity: 0.45;
    }
    .hdr-input {
      height: 36px;
      padding: 0 14px 0 36px;
      border-radius: 999px;
      border: 1.5px solid transparent;
      font-size: 13px;
      outline: none;
      font-family: inherit;
      width: 220px;
      transition: width 0.25s, border-color 0.2s, background 0.2s;
    }
    .hdr-input:focus { width: 280px; }
    .hdr-submit {
      height: 36px;
      padding: 0 18px;
      border-radius: 999px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: transform 0.15s, opacity 0.15s;
      white-space: nowrap;
    }
    .hdr-submit:hover { opacity: 0.88; }
    .hdr-submit:active { transform: scale(0.97); }
    .hdr-icon-btn {
      width: 36px; height: 36px;
      border-radius: 999px;
      border: 1.5px solid transparent;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, transform 0.15s;
      flex-shrink: 0;
    }
    .hdr-icon-btn:hover { transform: scale(1.08); }
    .hdr-icon-btn:active { transform: scale(0.95); }
    .hdr-mob-search-btn {
      display: none;
    }
    .hdr-search-overlay {
      display: none;
    }
    @media (max-width: 640px) {
      .hdr-search-form { display: none; }
      .hdr-mob-search-btn { display: flex; }
      .hdr-search-overlay {
        display: flex;
        position: fixed;
        inset: 0;
        z-index: 60;
        align-items: flex-start;
        padding: 1rem;
        animation: fadeIn 0.18s ease;
      }
      .hdr-search-overlay-inner {
        width: 100%;
        border-radius: 14px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 4px;
      }
      .hdr-overlay-input {
        width: 100%;
        height: 44px;
        padding: 0 16px 0 42px;
        border-radius: 999px;
        font-size: 15px;
        font-family: inherit;
        border: 1.5px solid transparent;
        outline: none;
      }
      .hdr-overlay-submit {
        height: 44px;
        border-radius: 999px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
      }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `;

  // ── Theme tokens
  const bg = isDark
    ? scrolled ? "rgba(10,10,10,0.92)" : "rgba(15,15,15,1)"
    : scrolled ? "rgba(249,248,245,0.92)" : "rgba(249,248,245,1)";
  const border = isDark
    ? scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"
    : scrolled ? "rgba(13,13,13,0.12)" : "rgba(13,13,13,0.08)";
  const shadow = scrolled
    ? isDark ? "0 1px 24px rgba(0,0,0,0.4)" : "0 1px 16px rgba(0,0,0,0.08)"
    : "none";
  const text = isDark ? "#f5f5f5" : "#0d0d0d";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "#6b6b6b";
  const logoBg = isDark ? "rgba(200,169,110,0.18)" : "rgba(139,94,60,0.12)";
  const logoColor = isDark ? "#c8a96e" : "#8b5e3c";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(13,13,13,0.05)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(13,13,13,0.14)";
  const inputFocusBorder = isDark ? "rgba(200,169,110,0.55)" : "rgba(139,94,60,0.45)";
  const inputColor = isDark ? "#f5f5f5" : "#0d0d0d";
  const submitBg = isDark ? "#c8a96e" : "#0d0d0d";
  const submitColor = isDark ? "#0d0d0d" : "#ffffff";
  const iconBtnBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(13,13,13,0.06)";
  const iconBtnBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(13,13,13,0.12)";
  const overlayBg = isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.35)";
  const overlayCardBg = isDark ? "#1a1a1a" : "#ffffff";
  const overlayCardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(13,13,13,0.1)";

  return (
    <>
      <style>{css}</style>

      <header
        className="hdr"
        style={{ background: bg, borderBottom: `0.5px solid ${border}`, boxShadow: shadow, backdropFilter: scrolled ? "blur(14px)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px)" : "none" }}
      >
        <div className="hdr-inner">

          {/* ── Brand */}
          <div className="hdr-brand" onClick={() => router.push("/")}>
            <div className="hdr-logo" style={{ background: logoBg, color: logoColor }}>L</div>
            <span className="hdr-wordmark" style={{ color: text }}>Lumino</span>
          </div>

          <div className="hdr-spacer" />

          {/* ── Desktop search */}
          <form className="hdr-search-form" onSubmit={handleSearch}>
            <div className="hdr-input-wrap">
              <span className="hdr-input-icon" style={{ color: textMuted }}>⌕</span>
              <input
                className="hdr-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search images…"
                aria-label="Search images"
                style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                onBlur={(e) => (e.target.style.borderColor = inputBorder)}
              />
            </div>
            <button className="hdr-submit" type="submit" style={{ background: submitBg, color: submitColor }}>
              Search
            </button>
          </form>

          {/* ── Mobile search trigger */}
          <button
            className="hdr-icon-btn hdr-mob-search-btn"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            style={{ background: iconBtnBg, borderColor: iconBtnBorder, color: text }}
          >
            ⌕
          </button>

          {/* ── Theme toggle */}
          <button
            className="hdr-icon-btn"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            style={{ background: iconBtnBg, borderColor: iconBtnBorder }}
          >
            {mounted ? (isDark ? "☀️" : "🌙") : "🌙"}
          </button>

        </div>
      </header>

      {/* ── Mobile search overlay */}
      {searchOpen && (
        <div
          className="hdr-search-overlay"
          style={{ background: overlayBg }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="hdr-search-overlay-inner"
            style={{ background: overlayCardBg, border: `0.5px solid ${overlayCardBorder}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "16px", fontSize: "16px", opacity: 0.4, color: text, pointerEvents: "none" }}>⌕</span>
                <input
                  className="hdr-overlay-input"
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search images…"
                  style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                />
              </div>
              <button
                className="hdr-overlay-submit"
                type="submit"
                style={{ background: submitBg, color: submitColor }}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{ background: "transparent", border: "none", color: textMuted, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: "4px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}