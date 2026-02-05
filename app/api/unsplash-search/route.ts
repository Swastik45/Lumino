import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const page = url.searchParams.get("page") || "1";
  const per_page = url.searchParams.get("per_page") || "8";

  if (!query) return NextResponse.json({ results: [] });

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${per_page}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  if (!res.ok) {
    return NextResponse.json({ results: [], error: `Unsplash API error ${res.status}` });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
