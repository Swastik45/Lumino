import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query   = searchParams.get("query") || "nature";
  const page    = searchParams.get("page")    || "1";
  const perPage = searchParams.get("per_page") || "12";

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "UNSPLASH_ACCESS_KEY is not set in environment variables." },
      { status: 500 }
    );
  }

  try {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query",    query);
    url.searchParams.set("page",     page);
    url.searchParams.set("per_page", perPage);
    url.searchParams.set("orientation", "landscape");

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      next: { revalidate: 60 }, // cache for 60 s
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Unsplash API error: ${res.status}`, detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch from Unsplash.", detail: String(err) },
      { status: 500 }
    );
  }
}