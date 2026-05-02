"use client";

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import AiGenerate from "../components/AIGenerate";

interface ImageData {
  id: string;
  urls: { regular: string; full: string };
  description: string | null;
  alt_description: string | null;
  user: { name: string };
  links: { html: string };
  isAi?: boolean;
}

export default function Page({ params }: { params: Promise<{ pageno: string }> }) {
  const resolvedParams = use(params);
  const keyword = resolvedParams.pageno.replace(/-/g, " ");

  const [images, setImages] = useState<ImageData[]>([]);
  const [aiImages, setAiImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<ImageData | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/unsplash-search?query=${encodeURIComponent(keyword)}&page=1&per_page=12`);
      const data = await res.json();
      setImages(data.results || []);
    } catch {
      setError("Failed to load images. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleAiGenerated = (url: string) => {
    const aiImage: ImageData = {
      id: `ai-${Date.now()}`,
      urls: { regular: url, full: url },
      description: `AI Generated: ${keyword}`,
      alt_description: keyword,
      user: { name: "AI Studio" },
      links: { html: url },
      isAi: true,
    };
    setAiImages((prev) => [aiImage, ...prev]);
  };

  const cardStyle = (i: number): React.CSSProperties => ({
    gridColumn: i === 0 ? "span 2" : "span 1",
    borderRadius: "14px",
    overflow: "hidden",
    position: "relative",
    cursor: "pointer",
    background: "#e6e2d9",
    border: "0.5px solid rgba(13,13,13,0.12)",
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 4rem", fontFamily: "system-ui, sans-serif" }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: "2.5rem 0 1.5rem", borderBottom: "0.5px solid rgba(13,13,13,0.12)", marginBottom: "2rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#8b5e3c", marginBottom: "6px" }}>
          Exploring
        </p>
        <h1 style={{ fontSize: "36px", fontWeight: 700, letterSpacing: "-1px", color: "#0d0d0d", lineHeight: 1.1 }}>
          {keyword}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b6b6b", marginTop: "8px" }}>
          Curated photos + AI creations for this topic
        </p>
      </div>

      {/* ── AI STUDIO ── */}
      <div style={{
        padding: "2rem", borderRadius: "20px",
        background: "#0f0f0f", color: "white", marginBottom: "2.5rem",
        border: "0.5px solid rgba(200,169,110,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "rgba(200,169,110,0.15)", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0,
          }}>✦</div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, fontFamily: "inherit" }}>AI Creation Studio</h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>
              Generate unique visuals from text
            </p>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "1.5rem" }}>
          <AiGenerate keyword={keyword} onImageGenerated={handleAiGenerated} />
        </div>
      </div>

      {/* ── AI RESULTS ── */}
      {aiImages.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a0a0a0" }}>
              Your AI Creations
            </span>
            <div style={{ flex: 1, height: "0.5px", background: "rgba(13,13,13,0.12)" }} />
            <span style={{ fontSize: "11px", color: "#a0a0a0", background: "#f0ede6", padding: "2px 8px", borderRadius: "999px", border: "0.5px solid rgba(13,13,13,0.1)" }}>
              {aiImages.length}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
            {aiImages.map((img) => (
              <div key={img.id} style={{ borderRadius: "14px", overflow: "hidden", position: "relative", cursor: "pointer", border: "0.5px solid rgba(13,13,13,0.1)" }} onClick={() => setLightbox(img)}>
                <img src={img.urls.regular} alt={img.alt_description || ""} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: "10px", right: "10px", background: "#c8a96e", color: "#0d0d0d", fontSize: "9px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px" }}>AI</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── STOCK GALLERY ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#a0a0a0" }}>Stock Gallery</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(13,13,13,0.12)" }} />
          {images.length > 0 && (
            <span style={{ fontSize: "11px", color: "#a0a0a0", background: "#f0ede6", padding: "2px 8px", borderRadius: "999px", border: "0.5px solid rgba(13,13,13,0.1)" }}>
              {images.length} photos
            </span>
          )}
        </div>

        {error && <p style={{ textAlign: "center", color: "#e24b4a", padding: "2rem" }}>{error}</p>}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ borderRadius: "14px", background: "#e6e2d9", aspectRatio: "4/3", animation: "pulse 1.4s ease infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {images.map((img, i) => (
              <div key={img.id} style={cardStyle(i)} onClick={() => setLightbox(img)}>
                <Image
                  src={img.urls.regular} alt={img.alt_description || ""}
                  width={800} height={600}
                  style={{ width: "100%", aspectRatio: i === 0 ? "16/7" : "4/3", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)",
                  opacity: 0, transition: "opacity 0.2s", display: "flex", alignItems: "flex-end", padding: "12px",
                }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.opacity = "0")}
                >
                  <div>
                    <div style={{ color: "white", fontSize: "12px", fontWeight: 500, lineHeight: 1.4 }}>
                      {img.description || "Untitled"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", marginTop: "2px" }}>
                      by {img.user.name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(13,13,13,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }}
        >
          <div style={{ position: "relative", maxWidth: "900px", width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              style={{ position: "absolute", top: "-42px", right: 0, background: "rgba(255,255,255,0.12)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
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