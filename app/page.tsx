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
}

export default function Home() {
  const [tab, setTab] = useState<"browse" | "generate">("browse");
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ImageData | null>(null);
  const defaultQuery = "nature";

  // Handler for AI Generated images (required by AIGenerate props)
  const handleGeneratedImage = (url: string) => {
    console.log("AI Image Generated:", url);
    // You could potentially add the new AI image to your 'images' state here
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/unsplash-search?query=${encodeURIComponent(defaultQuery)}&page=1&per_page=12`
        );
        const data: { results?: ImageData[] } = await res.json();
        setImages(data.results || []);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      
      {/* Navigation Tab Bar */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", justifyContent: "center" }}>
        <button
          className={`btn ${tab === "browse" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("browse")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            backgroundColor: tab === "browse" ? "#0070f3" : "#eee",
            color: tab === "browse" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px"
          }}
        >
          🔍 Browse Photos
        </button>
        <button
          className={`btn ${tab === "generate" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("generate")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            backgroundColor: tab === "generate" ? "#0070f3" : "#eee",
            color: tab === "generate" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px"
          }}
        >
          ✨ AI Generate
        </button>
      </div>

      {/* Dynamic Content Area */}
      {tab === "generate" ? (
        <AIGenerate 
          keyword={defaultQuery} 
          onImageGenerated={handleGeneratedImage} 
        />
      ) : (
        <>
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Featured: {defaultQuery}</h1>

          {loading && <p style={{ textAlign: "center" }}>Loading high-quality images...</p>}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {images.map((img) => (
              <div key={img.id} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "100%",
                    height: "250px",
                    overflow: "hidden",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                  onClick={() => setPreview(img)}
                >
                  <Image
                    src={img.urls.regular}
                    alt={img.description || img.alt_description || "Unsplash Image"}
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", fontWeight: "500" }}>
                  {img.description || img.alt_description || "Untitled"}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  By{" "}
                  <a
                    href={img.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0070f3", textDecoration: "none" }}
                  >
                    {img.user?.name}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fullscreen Modal Preview */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "2rem",
            cursor: "zoom-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "1000px", width: "100%", cursor: "default" }}
          >
            <Image
              src={preview.urls.full}
              alt="Full resolution"
              width={1200}
              height={800}
              style={{ 
                width: "100%", 
                height: "auto", 
                maxHeight: "80vh", 
                objectFit: "contain", 
                borderRadius: "4px" 
              }}
              unoptimized
            />
            <div style={{ color: "#fff", marginTop: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "1.2rem" }}>{preview.description || "Photo Details"}</p>
              <p>Credits: {preview.user.name} via Unsplash</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}