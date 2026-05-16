import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import Review from "@/models/Review";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = Number(params.id);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Ogiltigt film-id" }, { status: 400 });
  }

  await connectMongo();
  const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
  return NextResponse.json(reviews);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = Number(params.id);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Ogiltigt film-id" }, { status: 400 });
  }

  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  const { rating, comment } = await req.json();

  if (!rating || !comment) {
    return NextResponse.json({ error: "Betyg och kommentar krävs" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Betyg måste vara 1–5" }, { status: 400 });
  }

  await connectMongo();
  const review = await Review.create({
    movieId,
    userId: payload.userId,
    author: payload.username,
    rating,
    comment,
  });

  return NextResponse.json(review, { status: 201 });
}
