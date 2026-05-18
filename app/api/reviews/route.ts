import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import Review from "@/models/Review";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  if (!payload.userId) {
    return NextResponse.json(
      { error: "Registrera dig för att skriva recensioner" },
      { status: 403 }
    );
  }

  const { rating, comment, movieId } = await req.json();

  if (!movieId || !rating || !comment || Number(rating) < 1 || Number(rating) > 5) {
    return NextResponse.json(
      { success: false, error: "Alla fält krävs (movieId, rating, comment)" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();
    const review = await Review.create({
      movieId: Number(movieId),
      userId: payload.userId,
      author: payload.username,
      rating: Number(rating),
      comment: String(comment).trim(),
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review._id.toString(),
        rating: review.rating,
        quote: review.comment,
        name: review.author,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Kunde inte spara recensionen" }, { status: 500 });
  }
}
