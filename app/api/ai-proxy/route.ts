import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt");
  const seed = searchParams.get("seed") || "1";

  if (!prompt) {
    return new NextResponse("Missing prompt", { status: 400 });
  }

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?model=flux&nologo=true&seed=${seed}`;

  try {
    const res = await fetch(url, { cache: "force-cache" });

    if (!res.ok) {
      return new NextResponse("Failed upstream", { status: 500 });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Error generating image", { status: 500 });
  }
}