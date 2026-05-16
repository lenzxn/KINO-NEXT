import { loadMovie } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import MovieActions from "@/components/features/MovieActions";
import type { Metadata } from "next";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await loadMovie(Number(params.id));
  return { title: movie?.title ?? "Film" };
}

export default async function MoviePage({ params }: Props) {
  const id = Number(params.id);
  const movie = await loadMovie(id);
  if (!movie) notFound();

  return (
    <section className="info-page">
      <div className="info-card">
        <img className="info-card_img" src={movie.image ?? ""} alt={movie.title} />

        <div className="info-card_aside">
          <div className="info-card_text">
            <p><span className="rating"></span></p>
            <h1>{movie.title}</h1>
            <p>{movie.intro}</p>
          </div>

          <MovieActions movieId={id} />
        </div>
      </div>
    </section>
  );
}
