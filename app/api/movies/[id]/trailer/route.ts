import { NextRequest, NextResponse } from "next/server";

const TMDB_READ_TOKEN = process.env.TMDB_READ_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ key: null });

  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/${id}/videos?language=sv-SE`, {
      headers: {
        Authorization: `Bearer ${TMDB_READ_TOKEN}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return NextResponse.json({ key: null });

    const data = await res.json();
    const videos: { site: string; type: string; key: string }[] = data.results ?? [];

    const trailer =
      videos.find(v => v.site === "YouTube" && v.type === "Trailer") ??
      videos.find(v => v.site === "YouTube" && v.type === "Teaser") ??
      videos.find(v => v.site === "YouTube");

    return NextResponse.json({ key: trailer?.key ?? null });
  } catch {
    return NextResponse.json({ key: null });
  }
}
