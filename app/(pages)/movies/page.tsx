import { loadMovies } from "@/lib/tmdb";
import MovieCard from "@/components/ui/MovieCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Filmer" };

interface Props {
  searchParams: { search?: string; kategori?: string };
}

export default async function MoviesPage({ searchParams }: Props) {
  const movies = await loadMovies();
  const search = searchParams.search?.toLowerCase() ?? "";
  const kategori = searchParams.kategori ?? "";

  const filtered = movies.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search);
    const matchKategori = !kategori || m.kategori === kategori;
    return matchSearch && matchKategori;
  });

  const kategorier = [
    { value: "", label: "Alla" },
    { value: "aktuellt", label: "Nu på bio" },
    { value: "populart", label: "Populärt" },
    { value: "barn", label: "Barn & familj" },
    { value: "klassiker", label: "Klassiker" },
  ];

  return (
    <div className="movies-page">
      <h1>Filmer</h1>

      <div className="movies-page__filters">
        {kategorier.map((k) => (
          <a
            key={k.value}
            href={k.value ? `?kategori=${k.value}` : "?"}
            className={`filter-chip ${kategori === k.value ? "filter-chip--active" : ""}`}
          >
            {k.label}
          </a>
        ))}
      </div>

      {search && (
        <p className="movies-page__search-info">
          Sökresultat för &ldquo;{searchParams.search}&rdquo; — {filtered.length} filmer
        </p>
      )}

      <div className="movie-grid">
        {filtered.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
        {filtered.length === 0 && <p>Inga filmer matchade din sökning.</p>}
      </div>
    </div>
  );
}
