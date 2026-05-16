import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/db/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-post och lösenord krävs" }, { status: 400 });
    }

    await connectMongo();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Felaktiga inloggningsuppgifter" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Felaktiga inloggningsuppgifter" }, { status: 401 });
    }

    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    return NextResponse.json({ token, username: user.username });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
