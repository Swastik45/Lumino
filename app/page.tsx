"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AIGenerate from "./components/AIGenerate";

interface ImageData {
  id: string;
  urls: { regular: string; full: string };
  description: string | null;
  alt_description: string | null;
  user: { name: string };
  links: { html: string };
  isAi?: boolean;
}

const QUICK_TERMS = ["architecture", "portrait", "ocean", "abstract", "forest", "city lights", "macro", "travel"];

export default function Home() {
  const [tab, setTab] = useState<"browse" | "generate">("browse");
  const [images, setImages] = useState<ImageData[]>([]);
  const [aiImages, setAiImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("nature");
  const [searchInput, setSearchInput] = useState("nature");
  const [lightbox, setLightbox] = useState<ImageData | null>(null);

  const fetchImages = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/unsplash-search?query=${encodeURIComponent(q)}&page=1&per_page=12`);
      const data = await res.json();
      setImages(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(query); }, [query]);

  const handleSearch = () => {
    if (searchInput.trim()) setQuery(searchInput.trim());
  };

  const handleGeneratedImage = (url: string) => {
    const aiImage: ImageData = {
      id: `ai-${Date.now()}`,
      urls: { regular: url, full: url },
      description: "AI Generated",
      alt_description: "ai",
      user: { name: "AI Studio" },
      links: { html: url },
      isAi: true,
    };
    setAiImages((prev) => [aiImage, ...prev]);
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 4rem", fontFamily: "system-ui, sans-serif" }}>

      {/* ── STICKY HEADER ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.25rem 0", borderBottom: "0.5px solid rgba(13,13,13,0.12)",
        position: "sticky", top: 0, background: "#f9f8f5", zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#c8a96e" }} />
          <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px", color: "#0d0d0d" }}>Lumino</span>
        </div>

        <nav style={{ display: "flex", gap: "4px", background: "#f0ede6", borderRadius: "999px", padding: "4px", border: "0.5px solid rgba(13,13,13,0.12)" }}>
          {(["browse", "generate"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 18px", borderRadius: "999px", border: "none",
              background: tab === t ? "white" : "transparent",
              color: tab === t ? "#0d0d0d" : "#6b6b6b",
              fontSize: "13px", fontWeight: 500, cursor: "pointer",
              boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s", fontFamily: "inherit",
            }}>
              {t === "browse" ? "Browse" : "AI Studio"}
            </button>
          ))}
        </nav>

        <div style={{ width: "80px" }} />
      </header>

      {/* ── BROWSE TAB ── */}
      {tab === "browse" && (
        <>
          {/* Hero */}
          <div style={{ padding: "3rem 0 2rem", textAlign: "center" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#8b5e3c", marginBottom: "8px" }}>
              Image Explorer
            </p>
            <h1 style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "-1.5px", color: "#0d0d0d", lineHeight: 1.1, marginBottom: "12px" }}>
              Find the <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8b5e3c" }}>perfect</em> visual
            </h1>
            <p style={{ fontSize: "15px", color: "#6b6b6b", marginBottom: "1.5rem" }}>
              Search millions of curated photos
            </p>

            <div style={{ display: "flex", gap: "8px", maxWidth: "520px", margin: "0 auto 1rem" }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search anything…"
                style={{
                  flex: 1, padding: "12px 20px", borderRadius: "999px",
                  border: "1.5px solid rgba(13,13,13,0.18)", background: "white",
                  fontSize: "14px", color: "#0d0d0d", outline: "none", fontFamily: "inherit",
                }}
              />
              <button onClick={handleSearch} style={{
                padding: "12px 24px", borderRadius: "999px", border: "none",
                background: "#0d0d0d", color: "white", fontSize: "13px",
                fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>Search</button>
            </div>

            <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
              {QUICK_TERMS.map((term) => (
                <button key={term} onClick={() => { setSearchInput(term); setQuery(term); }} style={{
                  padding: "4px 12px", borderRadius: "999px",
                  border: "0.5px solid rgba(13,13,13,0.15)", background: "transparent",
                  color: "#6b6b6b", fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.2s",
                }}>
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a0a0a0" }}>Gallery</span>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(13,13,13,0.12)" }} />
            {images.length > 0 && <span style={{ fontSize: "11px", color: "#a0a0a0", background: "#f0ede6", padding: "2px 8px", borderRadius: "999px", border: "0.5px solid rgba(13,13,13,0.1)" }}>{images.length} photos</span>}
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ borderRadius: "14px", background: "#e6e2d9", aspectRatio: "4/3" }} />
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
              {images.map((img, i) => (
                <div
                  key={img.id} onClick={() => setLightbox(img)}
                  style={{
                    gridColumn: i === 0 ? "span 2" : "span 1",
                    borderRadius: "14px", overflow: "hidden", position: "relative",
                    cursor: "pointer", border: "0.5px solid rgba(13,13,13,0.1)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(0)")}
                >
                  <Image
                    src={img.urls.regular} alt={img.alt_description || ""}
                    width={800} height={600}
                    style={{ width: "100%", aspectRatio: i === 0 ? "16/7" : "4/3", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 14px 14px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0")}
                  >
                    <p style={{ color: "white", fontSize: "12px", fontWeight: 500, margin: 0 }}>{img.description || "Untitled"}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "2px 0 0" }}>by {img.user.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── AI STUDIO TAB ── */}
      {tab === "generate" && (
        <>
          <div style={{ padding: "2.5rem 0 1.5rem", textAlign: "center" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#8b5e3c", marginBottom: "8px" }}>AI Creation Studio</p>
            <h1 style={{ fontSize: "42px", fontWeight: 700, letterSpacing: "-1.5px", color: "#0d0d0d", lineHeight: 1.1 }}>
              Imagine <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8b5e3c" }}>anything</em>
            </h1>
          </div>

          <div style={{ border: "0.5px solid rgba(13,13,13,0.12)", borderRadius: "20px", background: "white", overflow: "hidden", marginBottom: "2rem" }}>
            <div style={{ padding: "1.75rem 2rem", borderBottom: "0.5px solid rgba(13,13,13,0.08)", background: "#0f0f0f" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(200,169,110,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✦</div>
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: 700, color: "white", margin: 0 }}>Prompt Studio</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "3px 0 0" }}>Type your idea and generate visuals instantly</p>
                </div>
              </div>
            </div>
            <div style={{ padding: "1.75rem 2rem", background: "#111" }}>
              <AIGenerate keyword="nature" onImageGenerated={handleGeneratedImage} />
            </div>
          </div>

          {/* AI results */}
          {aiImages.length > 0 && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a0a0a0" }}>Your Creations</span>
                <div style={{ flex: 1, height: "0.5px", background: "rgba(13,13,13,0.12)" }} />
                <span style={{ fontSize: "11px", color: "#a0a0a0", background: "#f0ede6", padding: "2px 8px", borderRadius: "999px" }}>{aiImages.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {aiImages.map((img) => (
                  <div key={img.id} style={{ borderRadius: "14px", overflow: "hidden", position: "relative", cursor: "pointer", border: "0.5px solid rgba(13,13,13,0.1)" }} onClick={() => setLightbox(img)}>
                    <img src={img.urls.regular} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                    <span style={{ position: "absolute", top: "10px", right: "10px", background: "#c8a96e", color: "#0d0d0d", fontSize: "9px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px" }}>AI</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(13,13,13,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }}>
          <div style={{ position: "relative", maxWidth: "900px", width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: "-42px", right: 0, background: "rgba(255,255,255,0.12)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <img src={lightbox.urls.full} alt="" style={{ width: "100%", maxHeight: "82vh", objectFit: "contain", borderRadius: "14px", display: "block" }} />
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>
              {lightbox.description || "Photo"} — {lightbox.user.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}