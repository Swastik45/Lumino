import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.url ? new URL(req.url) : { searchParams: new URLSearchParams() };
  const query = searchParams.get("query");

  if (!query) return NextResponse.json({ error: "No query provided" });

  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
  const data = await res.json();

  const imageUrl = data.urls?.regular;
  const description = data.description || data.alt_description || "No description";
  const photographer = data.user?.name || "Unknown";

  return NextResponse.json({ url: imageUrl, description, photographer });
}
