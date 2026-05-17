import { NextRequest, NextResponse } from "next/server";
import { getScreenings } from "@/lib/cms";
import { getUpcomingStartpageScreenings, findEarliestScreeningDate } from "@/lib/logic/startpageScreenings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const days  = Math.min(Number(searchParams.get("days"))  || 30, 60);
  const limit = Math.min(Number(searchParams.get("limit")) || 20, 40);

  try {
    const cmsJson = await getScreenings();
    const ref = findEarliestScreeningDate(cmsJson);
    const result = getUpcomingStartpageScreenings(cmsJson, ref, days, limit);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Could not load screenings" }, { status: 500 });
  }
}
