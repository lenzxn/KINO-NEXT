import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/db/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Alla fält krävs" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Lösenordet måste vara minst 6 tecken" }, { status: 400 });
    }

    await connectMongo();

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return NextResponse.json({ error: "Användarnamn eller e-post är redan registrerat" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed });

    const token = await signToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    return NextResponse.json({ token, username: user.username }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
