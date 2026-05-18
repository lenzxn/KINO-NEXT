/**
 * @jest-environment node
 */

import { paginateReviews } from "@/lib/logic/viewReviews";

const mockReviews = Array.from({ length: 12 }, (_, i) => ({
  quote: `Recension ${i + 1}`,
  rating: (i % 5) + 1,
  name: `Användare ${i + 1}`,
  verified: true as const,
}));

describe("paginateReviews", () => {
  it("returnerar rätt antal recensioner per sida", () => {
    const result = paginateReviews(mockReviews, 1, 5);
    expect(result.data).toHaveLength(5);
    expect(result.totalItems).toBe(12);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(1);
  });

  it("returnerar rätt recensioner för sida 2", () => {
    const result = paginateReviews(mockReviews, 2, 5);
    expect(result.data).toHaveLength(5);
    expect(result.data[0].quote).toBe("Recension 6");
  });

  it("sista sidan kan ha färre recensioner än pageSize", () => {
    const result = paginateReviews(mockReviews, 3, 5);
    expect(result.data).toHaveLength(2);
  });

  it("returnerar tom array och noll sidor för tom lista", () => {
    const result = paginateReviews([], 1, 5);
    expect(result.data).toHaveLength(0);
    expect(result.totalPages).toBe(0);
    expect(result.totalItems).toBe(0);
  });
});

// Speglar valideringslogiken i POST /api/movies/[id]/reviews
const validateReview = (rating: unknown, comment: unknown): boolean => {
  if (!rating || !comment || Number(rating) < 1 || Number(rating) > 5) return false;
  return true;
};

describe("Review-validering (route-logik)", () => {
  it("godkänner giltiga betyg 1–5 med kommentar", () => {
    expect(validateReview(1, "Okej film")).toBe(true);
    expect(validateReview(3, "Helt okej")).toBe(true);
    expect(validateReview(5, "Fantastisk!")).toBe(true);
  });

  it("avvisar betyg under 1 eller över 5", () => {
    expect(validateReview(0, "Bra")).toBe(false);
    expect(validateReview(6, "Bra")).toBe(false);
    expect(validateReview(-1, "Bra")).toBe(false);
    expect(validateReview(10, "Bra")).toBe(false);
  });

  it("avvisar saknat eller tomt betyg", () => {
    expect(validateReview(null, "Bra film")).toBe(false);
    expect(validateReview(undefined, "Bra film")).toBe(false);
    expect(validateReview("", "Bra film")).toBe(false);
  });

  it("avvisar saknad eller tom kommentar", () => {
    expect(validateReview(4, null)).toBe(false);
    expect(validateReview(4, undefined)).toBe(false);
    expect(validateReview(4, "")).toBe(false);
  });
});

describe("JWT auth (lib/auth.ts)", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test_secret_minst_32_tecken_lang_123";
  });

  it("signToken + verifyToken returnerar rätt payload", async () => {
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

  it("token för gästanvändare (utan userId) verifieras korrekt", async () => {
    const { signToken, verifyToken } = await import("@/lib/auth");

    const token = await signToken({ username: "Gäst" });
    const result = await verifyToken(token);

    expect(result.username).toBe("Gäst");
    expect(result.userId).toBeUndefined();
  });
});
