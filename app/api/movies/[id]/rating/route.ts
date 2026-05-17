import { NextRequest, NextResponse } from "next/server";
import { getReviewsByMovieId } from "@/lib/cms";
import { loadMovie } from "@/lib/tmdb";
import { calculateRating } from "@/lib/logic/ratingCalculator";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  if (isNaN(Number(movieId))) {
    return NextResponse.json({ error: "Ogiltigt Movie-ID" }, { status: 400 });
  }

  try {
    const [reviews, movie] = await Promise.all([
      getReviewsByMovieId(movieId),
      loadMovie(Number(movieId)),
    ]);

    const tmdbRating = movie?.rating ?? 0;
    const finalRating = calculateRating(reviews, tmdbRating);
    const source = reviews.length >= 5 ? "local" : "imdb";

    return NextResponse.json({ rating: finalRating, source });
  } catch {
    return NextResponse.json({ rating: 0, error: "Betyg kunde inte beräknas" }, { status: 500 });
  }
}
