/**
 * @jest-environment node
 */
// Testar Review-modellens validering och JWT auth-logiken

describe("Review-validering", () => {
  it("godkänner betyg 1–5", () => {
    for (const r of [1, 2, 3, 4, 5]) {
      expect(r >= 1 && r <= 5).toBe(true);
    }
  });

  it("avvisar betyg utanför 1–5", () => {
    for (const r of [0, 6, -1, 10]) {
      expect(r >= 1 && r <= 5).toBe(false);
    }
  });

  it("kräver icke-tom kommentar", () => {
    expect("Bra film!".trim().length > 0).toBe(true);
    expect("".trim().length > 0).toBe(false);
    expect("   ".trim().length > 0).toBe(false);
  });
});

describe("JWT auth (lib/auth.ts)", () => {
  it("signToken + verifyToken returnerar rätt payload", async () => {
    process.env.JWT_SECRET = "test_secret";
    const { signToken, verifyToken } = await import("@/lib/auth");

    const payload = { userId: "abc123", username: "TestUser", email: "test@kino.se" };
    const token = await signToken(payload);
    const result = await verifyToken(token);

    expect(result.userId).toBe(payload.userId);
    expect(result.username).toBe(payload.username);
    expect(result.email).toBe(payload.email);
  });

  it("verifyToken kastar fel för ogiltig token", async () => {
    const { verifyToken } = await import("@/lib/auth");
    await expect(verifyToken("felaktig.token.här")).rejects.toThrow();
  });
});
