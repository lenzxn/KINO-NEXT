import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "demo_secret");

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username || typeof username !== "string" || !username.trim()) {
    return NextResponse.json({ error: "Användarnamn krävs" }, { status: 400 });
  }

  const token = await new SignJWT({ username: username.trim() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(SECRET);

  return NextResponse.json({ token });
}
