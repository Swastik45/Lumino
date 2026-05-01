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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ImageData | null>(null);

  // Fetch Unsplash Data
  const fetchImages = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/unsplash-search?query=${encodeURIComponent(keyword)}&page=${currentPage}&per_page=12`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setImages((prev) => (currentPage === 1 ? data.results : [...prev, ...data.results]));
      } else if (currentPage === 1) {
        setImages([]);
        setError(`No Unsplash results found for "${keyword}"`);
      }
    } catch {
      setError("Failed to fetch images. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [keyword]);

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages(1);
  }, [fetchImages]);

  // Handle receiving the AI URL from child component
  const handleAiGenerated = (url: string) => {
    const aiImage: ImageData = {
      id: `ai-${Date.now()}`,
      urls: { regular: url, full: url },
      description: `AI Visualization: ${keyword}`,
      alt_description: keyword,
      user: { name: "Pollinations AI" },
      links: { html: url },
      isAi: true,
    };
    // Prepend the new AI image to the grid
    setImages((prev) => [aiImage, ...prev]);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "2rem" }}>
        Results for: <em style={{ color: "#4f46e5" }}>{keyword}</em>
      </h1>

      {/* Pass both keyword and the callback function */}
      <AiGenerate keyword={keyword} onImageGenerated={handleAiGenerated} />

      {error && <p style={{ textAlign: "center", color: "#ff6b6b" }}>{error}</p>}

      {/* Integrated Image Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
      }}>
        {images.map((img) => (
          <div key={img.id} onClick={() => setPreview(img)} style={{ cursor: "pointer" }}>
            <div style={{ 
              width: "100%", 
              height: "220px", 
              overflow: "hidden", 
              borderRadius: "12px",
              position: "relative",
              border: img.isAi ? "3px solid #4f46e5" : "1px solid #eee" 
            }}>
              {img.isAi ? (
                /* NATIVE IMG bypasses Next.js optimization that blocks anonymous AI requests */
                <img
                  src={img.urls.regular}
                  alt={img.description || "AI"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Image
                  src={img.urls.regular}
                  alt={img.description || "Unsplash"}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              )}
              {img.isAi && (
                <span style={{ 
                  position: "absolute", top: 12, left: 12, background: "#4f46e5", 
                  color: "white", padding: "4px 10px", borderRadius: "6px", 
                  fontSize: "0.7rem", fontWeight: "bold" 
                }}>
                  AI GENERATED
                </span>
              )}
            </div>
            <p style={{ fontSize: "0.85rem", marginTop: "0.8rem", fontWeight: 500 }}>
              {img.isAi ? "✨ Dynamic AI Content" : `📸 ${img.user.name}`}
            </p>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "2rem" }}>Updating results...</p>}
      
      {!loading && images.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "3rem", paddingBottom: "2rem" }}>
          <button 
            onClick={() => { setPage(p => p + 1); fetchImages(page + 1); }} 
            style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #ccc", background: "white", cursor: "pointer" }}
          >
            Load More from Unsplash
          </button>
        </div>
      )}

      {/* Full-Screen Preview Modal */}
      {preview && (
        <div 
          onClick={() => setPreview(null)} 
          style={{ 
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", 
            display: "flex", justifyContent: "center", alignItems: "center", 
            zIndex: 1000, padding: "2rem" 
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "1000px", width: "100%", textAlign: "center" }}>
            <img
              src={preview.urls.full}
              alt="Full Preview"
              style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px", objectFit: "contain" }}
            />
            <div style={{ marginTop: "1.5rem", color: "white" }}>
              <p style={{ fontSize: "1.1rem" }}>{preview.description || "Visual preview"}</p>
              <button 
                onClick={() => setPreview(null)} 
                style={{ marginTop: "20px", padding: "8px 25px", borderRadius: "20px", border: "none", background: "#fff", cursor: "pointer", fontWeight: "bold" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}