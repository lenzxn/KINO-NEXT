import { NextRequest, NextResponse } from "next/server";
import { getScreenings } from "@/lib/cms";
import { findEarliestScreeningDate } from "@/lib/logic/startpageScreenings";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = Number(params.id);
  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Ogiltigt film-id" }, { status: 400 });
  }

  try {
    const cmsResult = await getScreenings();
    const ref = findEarliestScreeningDate(cmsResult);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upcoming = (cmsResult.data ?? [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((s: any) => s.attributes?.movie?.data?.id === movieId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((s: any) => new Date(s.attributes.start_time) > ref)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((s: any) => ({
        id: s.id,
        start_time: s.attributes.start_time,
        room: s.attributes.room,
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return NextResponse.json(upcoming);
  } catch (err) {
    console.error("screenings error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
