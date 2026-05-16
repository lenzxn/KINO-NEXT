import { loadMovies, type Movie } from "@/lib/tmdb";
import Carousel from "@/components/features/Carousel";
import HomeClient from "@/components/features/HomeClient";

export default async function HomePage() {
  const movies = await loadMovies();
  return (
    <>
      <section id="toplist-carousel">
        <Carousel movies={movies} />
      </section>
      <HomeClient movies={movies} />
    </>
  );
}
