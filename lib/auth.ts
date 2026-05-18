import { SignJWT, jwtVerify } from "jose";

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET saknas i miljövariablerna");

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface JwtPayload {
  userId?: string;
  username: string;
  email?: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as JwtPayload;
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
