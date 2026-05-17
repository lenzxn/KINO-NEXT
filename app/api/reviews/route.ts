import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromHeader } from "@/lib/auth";

const CMS_REVIEWS = "https://plankton-app-xhkom.ondigitalocean.app/api/reviews";

export async function POST(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get("authorization"));
  if (!token) return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });

  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Ogiltig token" }, { status: 401 });
  }

  const { name, rating, comment, movie } = await req.json();

  if (!name || !comment || movie === undefined || rating === undefined) {
    return NextResponse.json(
      { success: false, error: "Alla fält krävs (name, rating, comment, movie)" },
      { status: 400 }
    );
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, error: "Rating måste vara ett nummer mellan 1 och 5" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(CMS_REVIEWS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { author: name, rating, comment, movie, verified: true } }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.error?.message || "Fel vid extern API" },
        { status: response.status }
      );
    }
    return NextResponse.json({ success: true, review: data.data });
  } catch {
    return NextResponse.json({ success: false, error: "Kunde inte skicka recensionen" }, { status: 500 });
  }
}
