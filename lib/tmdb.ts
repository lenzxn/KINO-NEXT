const TMDB_READ_TOKEN = process.env.TMDB_READ_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export interface Movie {
  id: number;
  title: string;
  intro: string;
  image: string | null;
  backdrop: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genreIds: number[];
  genre_names: string;
  kategori: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  intro: string;
  image: string | null;
  backdrop: string | null;
  releaseDate: string;
  rating: number;
  voteCount: number;
  genres: string[];
  runtime: number | null;
}

async function fetchTmdb<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_READ_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

function buildGenreMap(genres: { id: number; name: string }[]): Record<number, string> {
  const map: Record<number, string> = {};
  for (const g of genres) map[g.id] = g.name;
  return map;
}

function mapMovie(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movie: any,
  genreMap: Record<number, string>,
  kategori: string
): Movie {
  const genreIds: number[] = movie.genre_ids ?? [];
  const genre_names = genreIds
    .map((id) => genreMap[id])
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  return {
    id: movie.id,
    title: movie.title ?? "",
    intro: movie.overview ?? "",
    image: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : null,
    releaseDate: movie.release_date ?? "",
    rating: movie.vote_average ?? 0,
    voteCount: movie.vote_count ?? 0,
    genreIds,
    genre_names,
    kategori,
  };
}

function addUniqueMovies(source: Movie[], target: Movie[], limit: number) {
  const seen = new Set(target.map((m) => m.id));
  for (const m of source.slice(0, limit)) {
    if (!seen.has(m.id)) {
      target.push(m);
      seen.add(m.id);
    }
  }
}

export async function loadMovies(): Promise<Movie[]> {
  const [nowPlayingData, topListData, kidsData, classicsData, genreData] =
    await Promise.all([
      fetchTmdb<{ results: unknown[] }>("/movie/now_playing?language=sv-SE&page=1"),
      fetchTmdb<{ results: unknown[] }>("/movie/popular?language=sv-SE&page=3"),
      fetchTmdb<{ results: unknown[] }>("/discover/movie?language=sv-SE&with_genres=16,10751&include_adult=false&sort_by=popularity.desc&page=3"),
      fetchTmdb<{ results: unknown[] }>("/discover/movie?language=sv-SE&primary_release_date.lte=2009-12-31&sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&page=2"),
      fetchTmdb<{ genres: { id: number; name: string }[] }>("/genre/movie/list?language=sv-SE"),
    ]);

  const genreMap = buildGenreMap(genreData.genres);

  const nowPlaying = nowPlayingData.results.map((m) => mapMovie(m, genreMap, "aktuellt"));
  const topList = topListData.results.map((m) => mapMovie(m, genreMap, "populart"));
  const kids = kidsData.results.map((m) => mapMovie(m, genreMap, "barn"));
  const classics = classicsData.results.map((m) => mapMovie(m, genreMap, "klassiker"));

  const all: Movie[] = [];
  addUniqueMovies(nowPlaying, all, 20);
  addUniqueMovies(topList, all, 20);
  addUniqueMovies(kids, all, 15);
  addUniqueMovies(classics, all, 15);

  return all.slice(0, 70);
}

export async function loadMovie(id: number): Promise<MovieDetail | null> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?language=sv-SE`, {
    headers: {
      Authorization: `Bearer ${TMDB_READ_TOKEN}`,
      Accept: "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const movie: any = await res.json();

  return {
    id: movie.id,
    title: movie.title ?? "",
    intro: movie.overview ?? "",
    image: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : null,
    releaseDate: movie.release_date ?? "",
    rating: movie.vote_average ?? 0,
    voteCount: movie.vote_count ?? 0,
    genres: movie.genres?.map((g: { name: string }) => g.name) ?? [],
    runtime: movie.runtime ?? null,
  };
}
