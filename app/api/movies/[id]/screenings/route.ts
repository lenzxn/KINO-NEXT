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
    const upcoming = (cmsResult.data as any[] ?? [])
      .filter((s: any) => s.attributes?.movie?.data?.id === movieId)
      .filter((s: any) => new Date(s.attributes.start_time) > ref)
      .map((s: any) => ({
        id: s.id,
        start_time: s.attributes.start_time,
        room: s.attributes.room,
      }))
      .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return NextResponse.json(upcoming);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
