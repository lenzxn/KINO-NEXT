/**
 * Testar /api/movies och /api/movies/[id] route-handlers
 */

global.fetch = jest.fn();

const mockMovies = [
  {
    id: 550,
    title: "Fight Club",
    intro: "En sömnlös man bildar en klubb.",
    image: "https://image.tmdb.org/t/p/w500/test.jpg",
    backdrop: null,
    releaseDate: "1999-10-15",
    rating: 8.4,
    voteCount: 26000,
    genreIds: [18, 53],
    genre_names: "Drama, Thriller",
    kategori: "klassiker",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("loadMovies (TMDB integration)", () => {
  it("returnerar en array av filmer", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ results: mockMovies, genres: [] }),
    });

    const { loadMovies } = await import("@/lib/tmdb");
    const movies = await loadMovies();
    expect(Array.isArray(movies)).toBe(true);
  });

  it("kastar fel om TMDB svarar med fel", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 401 });

    const { loadMovies } = await import("@/lib/tmdb");
    await expect(loadMovies()).rejects.toThrow("TMDB error: 401");
  });
});

describe("loadMovie (TMDB enskild film)", () => {
  it("returnerar null för 404", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false, status: 404 });

    const { loadMovie } = await import("@/lib/tmdb");
    const result = await loadMovie(99999);
    expect(result).toBeNull();
  });

  it("returnerar filmdata för giltigt id", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 550,
        title: "Fight Club",
        overview: "En sömnlös man.",
        poster_path: "/test.jpg",
        backdrop_path: null,
        release_date: "1999-10-15",
        vote_average: 8.4,
        vote_count: 26000,
        genres: [{ id: 18, name: "Drama" }],
        runtime: 139,
      }),
    });

    const { loadMovie } = await import("@/lib/tmdb");
    const movie = await loadMovie(550);
    expect(movie).not.toBeNull();
    expect(movie!.title).toBe("Fight Club");
    expect(movie!.runtime).toBe(139);
  });
});
