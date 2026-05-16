import { loadMovie } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/features/ReviewForm";
import ScreeningPicker from "@/components/features/ScreeningPicker";
import type { Metadata } from "next";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = await loadMovie(Number(params.id));
  return { title: movie?.title ?? "Film" };
}

export default async function MoviePage({ params }: Props) {
  const id = Number(params.id);
  const movie = await loadMovie(id);

  if (!movie) notFound();

  return (
    <div className="movie-detail">
      {movie.backdrop && (
        <div className="movie-detail__hero">
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            priority
            className="movie-detail__backdrop"
            sizes="100vw"
          />
          <div className="movie-detail__hero-overlay" />
        </div>
      )}

      <div className="movie-detail__content">
        <div className="movie-detail__poster-wrap">
          {movie.image && (
            <Image
              src={movie.image}
              alt={movie.title}
              width={220}
              height={330}
              className="movie-detail__poster"
            />
          )}
        </div>

        <div className="movie-detail__info">
          <h1>{movie.title}</h1>

          <div className="movie-detail__meta">
            <span>★ {movie.rating.toFixed(1)} ({movie.voteCount.toLocaleString("sv-SE")} röster)</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
            <span>{movie.releaseDate?.slice(0, 4)}</span>
          </div>

          {movie.genres.length > 0 && (
            <div className="movie-detail__genres">
              {movie.genres.map((g) => <span key={g} className="genre-tag">{g}</span>)}
            </div>
          )}

          <p className="movie-detail__intro">{movie.intro}</p>
        </div>
      </div>

      <div className="movie-detail__below">
        <ScreeningPicker movieId={id} />
        <ReviewForm movieId={id} />
      </div>
    </div>
  );
}
