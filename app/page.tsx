import { loadMovies } from "@/lib/tmdb";
import Carousel from "@/components/features/Carousel";
import MovieCard from "@/components/ui/MovieCard";

export default async function HomePage() {
  const movies = await loadMovies();

  const aktuella = movies.filter((m) => m.kategori === "aktuellt");
  const populara = movies.filter((m) => m.kategori === "populart");
  const barn = movies.filter((m) => m.kategori === "barn");
  const klassiker = movies.filter((m) => m.kategori === "klassiker");

  return (
    <>
      <Carousel movies={aktuella} />

      <div className="home-sections">
        <Section title="Nu på bio" movies={aktuella} />
        <Section title="Populärt just nu" movies={populara} />
        <Section title="Barn & familj" movies={barn} />
        <Section title="Klassiker" movies={klassiker} />
      </div>
    </>
  );
}

function Section({ title, movies }: { title: string; movies: ReturnType<typeof Array.prototype.filter> }) {
  if (!movies.length) return null;
  return (
    <section className="movie-section">
      <h2 className="movie-section__title">{title}</h2>
      <div className="movie-grid">
        {movies.slice(0, 8).map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </section>
  );
}
