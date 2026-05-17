import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import Review from "@/models/Review";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";
import { paginateReviews } from "@/lib/logic/viewReviews";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = Number(params.id);
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  await connectMongo();
  const raw = await Review.find({ movieId }).sort({ createdAt: -1 });

  const simplified = raw.map((r) => ({
    id: r._id.toString(),
    quote: r.comment,
    rating: r.rating,
    name: r.author,
    verified: true,
  }));

  if (!page) {
    return NextResponse.json(simplified);
  }

  const pageNum = Number(page) || 1;
  const pageSize = Number(searchParams.get("limit")) || 5;
  const result = paginateReviews(simplified, pageNum, pageSize);

  return NextResponse.json({
    reviews: result.data,
    totalPages: result.totalPages,
    totalItems: result.totalItems,
    page: result.page,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = getTokenFromHeader(req.headers.get("Authorization"));
  if (!token) {
    return NextResponse.json({ error: "Inte inloggad" }, { status: 401 });
  }

  let payload;
  try {
    payload = await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  if (!payload.userId) {
    return NextResponse.json(
      { error: "Registrera dig via formuläret för att skriva recensioner" },
      { status: 403 }
    );
  }

  const movieId = Number(params.id);
  const { rating, comment } = await req.json();

  if (!rating || !comment || Number(rating) < 1 || Number(rating) > 5) {
    return NextResponse.json({ error: "Ogiltiga uppgifter" }, { status: 400 });
  }

  try {
    const review = await Review.create({
      movieId,
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
    return NextResponse.json({ error: "Kunde inte spara recension" }, { status: 500 });
  }
}
