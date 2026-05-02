"use client";
import { useState } from "react";

interface AiGenerateProps {
  keyword: string;
  onImageGenerated: (url: string) => void;
}

const STYLE_PILLS = [
  { label: "Photorealistic", value: "photorealistic" },
  { label: "Cinematic", value: "cinematic, film grain" },
  { label: "Oil Painting", value: "oil painting style" },
  { label: "Pencil Sketch", value: "detailed pencil sketch" },
  { label: "Watercolor", value: "watercolor illustration" },
  { label: "Neon Noir", value: "neon noir, cyberpunk lighting" },
];

const QUICK_PROMPTS = [
  { label: "Tokyo neon rain", value: "Cyberpunk Tokyo street at night, neon reflections on wet pavement" },
  { label: "Mystical library", value: "Ancient library with floating candles, mystical atmosphere, dust motes in light" },
  { label: "Dew on web", value: "Macro photography of a dewdrop on a spider web at sunrise, golden bokeh" },
  { label: "Nordic interior", value: "Minimalist Scandinavian interior, morning light, linen textures" },
  { label: "Reef sunlight", value: "Underwater coral reef with shafts of sunlight, vibrant sea life" },
];

const LOADING_MESSAGES = [
  "Painting pixels with imagination…",
  "Conjuring your vision from thin air…",
  "Teaching colors to dream…",
  "Assembling light and shadow…",
  "Weaving your prompt into reality…",
  "Brewing the perfect composition…",
];

interface GeneratedImage {
  url: string;
  prompt: string;
  style: string;
  status: "loading" | "ready" | "error";
}

export default function AIGenerate({ keyword, onImageGenerated }: AiGenerateProps) {
  const [prompt, setPrompt] = useState(keyword);
  const [selectedStyle, setSelectedStyle] = useState("");
  const [variation, setVariation] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [loadingMsg] = useState(() => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    const fullPrompt = selectedStyle ? `${prompt}, ${selectedStyle}` : prompt;
    const seed = Math.floor(Math.random() * 100000 * variation);
    const url = `/api/ai-proxy?prompt=${encodeURIComponent(fullPrompt)}&seed=${seed}`;

    const newImage: GeneratedImage = {
      url,
      prompt: fullPrompt,
      style: selectedStyle,
      status: "loading",
    };

    setGeneratedImages((prev) => [newImage, ...prev]);

    // Notify parent immediately with URL
    onImageGenerated(url);

    // Image load is tracked via onLoad/onError on the <img> tag below
    // We just end the "button" generating state after a short delay
    setTimeout(() => setIsGenerating(false), 800);
  };

  const handleImageLoad = (index: number) => {
    setGeneratedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, status: "ready" } : img))
    );
  };

  const handleImageError = (index: number) => {
    setGeneratedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, status: "error" } : img))
    );
  };

  const toggleStyle = (value: string) => {
    setSelectedStyle((prev) => (prev === value ? "" : value));
  };

  const css = `
    @keyframes ai-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes ai-pulse {
      0%, 100% { opacity: 0.4; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    @keyframes ai-shimmer {
      0% { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    @keyframes ai-fadein {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes ai-dots {
      0%, 80%, 100% { opacity: 0; transform: scale(0.6); }
      40% { opacity: 1; transform: scale(1); }
    }
    @keyframes ai-scan {
      0% { top: 0%; }
      100% { top: 100%; }
    }
    .ai-shimmer-bg {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.03) 0%,
        rgba(255,255,255,0.10) 40%,
        rgba(200,169,110,0.08) 50%,
        rgba(255,255,255,0.10) 60%,
        rgba(255,255,255,0.03) 100%
      );
      background-size: 600px 100%;
      animation: ai-shimmer 1.8s infinite linear;
    }
    .ai-dot { animation: ai-dots 1.4s infinite ease-in-out; }
    .ai-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-dot:nth-child(3) { animation-delay: 0.4s; }
    .ai-img-ready { animation: ai-fadein 0.5s ease; }
    .ai-scan-line {
      position: absolute;
      left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(200,169,110,0.7), transparent);
      animation: ai-scan 2s linear infinite;
      pointer-events: none;
    }
    .ai-gen-btn {
      transition: all 0.2s;
    }
    .ai-gen-btn:hover:not(:disabled) {
      background: #d4b97e !important;
      transform: translateY(-1px);
    }
    .ai-gen-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .ai-style-pill {
      transition: all 0.18s;
      cursor: pointer;
    }
    .ai-style-pill:hover {
      border-color: rgba(200,169,110,0.5) !important;
      color: rgba(200,169,110,0.9) !important;
    }
    .ai-quick-pill {
      transition: all 0.18s;
      cursor: pointer;
    }
    .ai-quick-pill:hover {
      border-color: rgba(255,255,255,0.3) !important;
      color: rgba(255,255,255,0.75) !important;
    }
    .ai-retry-btn {
      transition: all 0.18s;
      cursor: pointer;
    }
    .ai-retry-btn:hover {
      background: rgba(200,169,110,0.2) !important;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: "700px", margin: "0 auto" }}>

        {/* ── Header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a96e", marginBottom: "4px" }}>
            Prompt Studio
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
            Be descriptive — style, mood, lighting, and subject matter give the best results.
          </p>
        </div>

        {/* ── Textarea */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
          placeholder="e.g. Cinematic aerial shot of a misty mountain valley at golden hour, moody atmosphere, film grain…"
          rows={4}
          style={{
            width: "100%", padding: "14px 16px",
            borderRadius: "12px", border: "1.5px solid rgba(200,169,110,0.25)",
            background: "rgba(255,255,255,0.05)", color: "white",
            fontSize: "14px", lineHeight: 1.6, resize: "vertical", outline: "none",
            fontFamily: "inherit", transition: "border-color 0.2s", boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.6)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(200,169,110,0.25)")}
        />

        {/* ── Style Pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "10px 0 0" }}>
          {STYLE_PILLS.map((pill) => (
            <button
              key={pill.value}
              className="ai-style-pill"
              onClick={() => toggleStyle(pill.value)}
              style={{
                padding: "4px 12px", borderRadius: "999px", border: "0.5px solid",
                borderColor: selectedStyle === pill.value ? "#c8a96e" : "rgba(255,255,255,0.18)",
                background: selectedStyle === pill.value ? "rgba(200,169,110,0.15)" : "transparent",
                color: selectedStyle === pill.value ? "#c8a96e" : "rgba(255,255,255,0.5)",
                fontSize: "12px", fontFamily: "inherit",
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ── Controls Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "180px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>Variation</span>
            <input
              type="range" min="1" max="5" step="1" value={variation}
              onChange={(e) => setVariation(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#c8a96e" }}
            />
            <span style={{ fontSize: "13px", fontWeight: 500, color: "white", minWidth: "16px", textAlign: "center" }}>{variation}</span>
          </div>

          <button
            className="ai-gen-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              padding: "11px 26px", borderRadius: "999px", border: "none",
              background: isGenerating ? "rgba(200,169,110,0.3)" : "#c8a96e",
              color: isGenerating ? "rgba(255,255,255,0.5)" : "#0d0d0d",
              fontSize: "14px", fontWeight: 600, cursor: isGenerating ? "not-allowed" : "pointer",
              minWidth: "180px", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {isGenerating ? (
              <>
                <span style={{
                  width: "14px", height: "14px", borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.25)",
                  borderTopColor: "rgba(255,255,255,0.8)",
                  animation: "ai-spin 0.75s linear infinite",
                  display: "inline-block", flexShrink: 0,
                }} />
                Generating…
              </>
            ) : "✦ Generate Image"}
          </button>
        </div>

        {/* ── Quick Prompts */}
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>
            Quick ideas
          </p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.label}
                className="ai-quick-pill"
                onClick={() => setPrompt(p.value)}
                style={{
                  padding: "3px 10px", borderRadius: "999px",
                  border: "0.5px solid rgba(255,255,255,0.14)",
                  background: "transparent", color: "rgba(255,255,255,0.38)",
                  fontSize: "11px", fontFamily: "inherit",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "0.75rem", textAlign: "center" }}>
          Tip: Press ⌘ + Enter to generate quickly
        </p>

        {/* ── Generated Images with Loading States */}
        {generatedImages.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
                Generated
              </p>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "999px", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                {generatedImages.length}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {generatedImages.map((img, index) => (
                <div
                  key={img.url + index}
                  style={{
                    borderRadius: "14px", overflow: "hidden", position: "relative",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    aspectRatio: "4/3",
                  }}
                >
                  {/* ── LOADING STATE ── */}
                  {img.status === "loading" && (
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 2,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      gap: "1.25rem",
                      background: "rgba(10,10,10,0.92)",
                      borderRadius: "14px",
                    }}>
                      {/* Shimmer layer */}
                      <div className="ai-shimmer-bg" style={{ position: "absolute", inset: 0, borderRadius: "14px" }} />

                      {/* Scan line */}
                      <div className="ai-scan-line" />

                      {/* Spinner ring */}
                      <div style={{ position: "relative", width: "52px", height: "52px", flexShrink: 0 }}>
                        <div style={{
                          position: "absolute", inset: 0, borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,0.07)",
                        }} />
                        <div style={{
                          position: "absolute", inset: 0, borderRadius: "50%",
                          border: "2px solid transparent",
                          borderTopColor: "#c8a96e",
                          animation: "ai-spin 0.9s linear infinite",
                        }} />
                        <div style={{
                          position: "absolute", inset: "10px", borderRadius: "50%",
                          border: "1.5px solid transparent",
                          borderTopColor: "rgba(200,169,110,0.4)",
                          animation: "ai-spin 1.4s linear infinite reverse",
                        }} />
                        {/* Center dot */}
                        <div style={{
                          position: "absolute", inset: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{
                            width: "6px", height: "6px", borderRadius: "50%",
                            background: "#c8a96e",
                            animation: "ai-pulse 1.4s ease-in-out infinite",
                          }} />
                        </div>
                      </div>

                      {/* Loading text */}
                      <div style={{ position: "relative", textAlign: "center", padding: "0 1rem" }}>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500, marginBottom: "6px", lineHeight: 1.4 }}>
                          {loadingMsg}
                        </p>
                        {/* Animated dots */}
                        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="ai-dot"
                              style={{
                                width: "5px", height: "5px", borderRadius: "50%",
                                background: "#c8a96e",
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Prompt preview */}
                      <div style={{
                        position: "relative",
                        maxWidth: "80%", padding: "6px 12px",
                        background: "rgba(200,169,110,0.1)",
                        border: "0.5px solid rgba(200,169,110,0.2)",
                        borderRadius: "999px",
                      }}>
                        <p style={{
                          fontSize: "10px", color: "rgba(200,169,110,0.75)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: "220px", margin: 0,
                        }}>
                          {img.prompt.slice(0, 50)}{img.prompt.length > 50 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── ERROR STATE ── */}
                  {img.status === "error" && (
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 2,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "0.75rem",
                      background: "rgba(10,10,10,0.9)", borderRadius: "14px",
                    }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: "rgba(226,75,74,0.15)",
                        border: "0.5px solid rgba(226,75,74,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px",
                      }}>✕</div>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>Failed to load</p>
                      <button
                        className="ai-retry-btn"
                        onClick={() => handleImageLoad(index)}
                        style={{
                          padding: "6px 16px", borderRadius: "999px",
                          border: "0.5px solid rgba(200,169,110,0.3)",
                          background: "rgba(200,169,110,0.1)",
                          color: "#c8a96e", fontSize: "12px",
                          fontFamily: "inherit", fontWeight: 500,
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* ── ACTUAL IMAGE (always rendered so onLoad fires) ── */}
                  <img
                    src={img.url}
                    alt={img.prompt}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    className={img.status === "ready" ? "ai-img-ready" : ""}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      display: "block", borderRadius: "14px",
                      opacity: img.status === "ready" ? 1 : 0,
                      transition: "opacity 0.4s ease",
                    }}
                  />

                  {/* ── READY BADGE ── */}
                  {img.status === "ready" && (
                    <div style={{
                      position: "absolute", inset: 0, borderRadius: "14px",
                      background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                      pointerEvents: "none",
                    }}>
                      <span style={{
                        position: "absolute", top: "10px", right: "10px",
                        background: "#c8a96e", color: "#0d0d0d",
                        fontSize: "9px", fontWeight: 700, letterSpacing: "1px",
                        textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px",
                      }}>AI</span>
                      <div style={{
                        position: "absolute", bottom: "12px", left: "12px", right: "12px",
                      }}>
                        <p style={{
                          color: "white", fontSize: "11px", margin: 0,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          opacity: 0.8,
                        }}>
                          {img.prompt.slice(0, 55)}{img.prompt.length > 55 ? "…" : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}