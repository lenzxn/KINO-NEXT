import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import Screening from "@/models/Screening";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = Number(params.id);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Ogiltigt film-id" }, { status: 400 });
  }

  await connectMongo();
  const screenings = await Screening.find({
    movieId,
    startTime: { $gt: new Date() },
  }).sort({ startTime: 1 });

  return NextResponse.json(screenings);
}
