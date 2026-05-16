import { NextRequest, NextResponse } from "next/server";
import { loadMovie } from "@/lib/tmdb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Ogiltigt film-id" }, { status: 400 });
  }

  try {
    const movie = await loadMovie(id);
    if (!movie) return NextResponse.json({ error: "Film hittades inte" }, { status: 404 });
    return NextResponse.json(movie);
  } catch {
    return NextResponse.json({ error: "Kunde inte hämta film" }, { status: 500 });
  }
}
