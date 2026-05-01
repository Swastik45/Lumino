"use client";

import { useState } from "react";

interface AiGenerateProps {
  keyword: string;
  onImageGenerated: (url: string) => void;
}

export default function AiGenerate({ keyword, onImageGenerated }: AiGenerateProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = () => {
    setIsGenerating(true);
    
    // Unique seed ensures a fresh image every click
    const seed = Math.floor(Math.random() * 1000000);
    
    // Using the stable anonymous /p/ endpoint to avoid "Authenticated user" errors
    const aiUrl = `https://pollinations.ai/p/${encodeURIComponent(keyword)}?seed=${seed}&model=flux&nologo=true`;

    // Safety check: only call if the parent passed the function
    if (typeof onImageGenerated === "function") {
      onImageGenerated(aiUrl);
    } else {
      console.error("Critical: 'onImageGenerated' prop is missing or not a function.");
    }

    // Brief timeout to prevent button spamming
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      <button
        onClick={generateImage}
        disabled={isGenerating}
        style={{
          padding: "12px 24px",
          backgroundColor: isGenerating ? "#333" : "#4f46e5",
          color: "white",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: isGenerating ? "wait" : "pointer",
          transition: "transform 0.1s active"
        }}
      >
        {isGenerating ? "✨ Sending Request..." : "✨ Generate AI Version"}
      </button>
    </div>
  );
}