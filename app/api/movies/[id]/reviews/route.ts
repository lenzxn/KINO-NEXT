import { NextRequest, NextResponse } from "next/server";
import { getReviewsByMovieId } from "@/lib/cms";
import { paginateReviews } from "@/lib/logic/viewReviews";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = await getReviewsByMovieId(movieId);

  const simplified = raw.map((r) => ({
    id: r.id,
    quote: r.attributes.comment,
    rating: r.attributes.rating,
    name: r.attributes.author,
    verified: r.attributes.verified,
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
