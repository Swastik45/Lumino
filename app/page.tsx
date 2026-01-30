"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any | null>(null);
  const defaultQuery = "nature";

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/unsplash-search?query=${encodeURIComponent(defaultQuery)}&page=1&per_page=12`
        );
        const data = await res.json();
        setImages(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Featured: {defaultQuery}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {images.map((img) => (
          <div key={img.id} style={{ textAlign: "center", cursor: "pointer" }}>
            <div
              style={{
                width: "100%",
                height: "200px",
                overflow: "hidden",
                borderRadius: "8px",
              }}
              onClick={() => setPreview(img)}
            >
              <Image
                src={img.urls.regular}
                alt={img.description || img.alt_description || "No description"}
                width={300}
                height={200}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
              {img.description || img.alt_description || "No description"}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#555" }}>
              Photo by{" "}
              <a
                href={img.links.html}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0070f3" }}
              >
                {img.user?.name || "Unknown"}
              </a>{" "}
              on Unsplash
            </p>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "1rem" }}>Loading...</p>}

      {/* Modal Preview */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "1rem",
            cursor: "pointer",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90%", maxHeight: "90%", textAlign: "center" }}
          >
            <Image
              src={preview.urls.full || preview.urls.regular}
              alt={preview.description || preview.alt_description || "No description"}
              width={800}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
            <p style={{ marginTop: "0.5rem", fontStyle: "italic", color: "#fff" }}>
              {preview.description || preview.alt_description || "No description"}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#ddd" }}>
              Photo by{" "}
              <a
                href={preview.links.html}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffd700" }}
              >
                {preview.user?.name || "Unknown"}
              </a>{" "}
              on Unsplash
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
