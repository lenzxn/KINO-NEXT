import { NextResponse } from "next/server";
import { loadMovies } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await loadMovies();
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Kunde inte hämta filmer" }, { status: 500 });
  }
}
