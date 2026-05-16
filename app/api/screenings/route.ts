import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/db/mongodb";
import Screening from "@/models/Screening";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "3", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);

  try {
    await connectMongo();

    const now = new Date();
    const until = new Date(now);
    until.setDate(until.getDate() + days);

    const screenings = await Screening.find({
      startTime: { $gte: now, $lte: until },
    })
      .sort({ startTime: 1 })
      .limit(limit)
      .lean();

    // Group by date (yyyy-mm-dd)
    const byDate: Record<string, typeof screenings> = {};
    for (const s of screenings) {
      const date = new Date(s.startTime).toISOString().slice(0, 10);
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(s);
    }

    const resultDays = Object.entries(byDate).map(([date, items]) => ({
      date,
      screenings: items.map(s => ({
        _id: s._id,
        movie: { title: s.movieTitle, poster: null },
        startsAt: s.startTime,
        room: s.room,
      })),
    }));

    return NextResponse.json({ days: resultDays });
  } catch {
    return NextResponse.json({ days: [] });
  }
}
