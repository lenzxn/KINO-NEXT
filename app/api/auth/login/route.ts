import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/db/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || typeof username !== "string" || !username.trim()) {
    return NextResponse.json({ error: "Användarnamn krävs" }, { status: 400 });
  }

  try {
    await connectMongo();
    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      // Not in MongoDB (localStorage-only user) — sign simple JWT for backward compat
      const token = await signToken({ username: username.trim() });
      return NextResponse.json({ token });
    }

    const valid = await bcrypt.compare(password ?? "", user.password);
    if (!valid) {
      return NextResponse.json({ error: "Felaktigt lösenord" }, { status: 401 });
    }

    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
