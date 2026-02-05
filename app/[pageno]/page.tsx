"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { use } from "react";

interface ImageData {
  id: string;
  urls: { regular: string; full: string };
  description: string | null;
  alt_description: string | null;
  user: { name: string };
  links: { html: string };
}

export default function Page({ params }: { params: Promise<{ pageno: string }> }) {
  const resolvedParams = use(params);
  const keyword = resolvedParams.pageno.replace(/-/g, " ");

  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [preview, setPreview] = useState<ImageData | null>(null);

  const fetchImages = async (currentPage: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/unsplash-search?query=${encodeURIComponent(
          keyword
        )}&page=${currentPage}&per_page=12`
      );
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        setImages((prev) => [...prev, ...data.results]);
      } else if (currentPage === 1) {
        setError(`No images found for "${keyword}"`);
      }
    } catch {
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages(1);
  }, [keyword]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Results for: {keyword}</h1>
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* Grid of images */}
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

      {!loading && images.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Load More
          </button>
        </div>
      )}

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
            onClick={(e) => e.stopPropagation()} // prevent modal close when clicking content
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
