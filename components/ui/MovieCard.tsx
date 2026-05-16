import Link from "next/link";
import Image from "next/image";
import type { Movie } from "@/lib/tmdb";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <Link href={`/(pages)/movies/${movie.id}`} className="movie-card">
      <div className="movie-card__poster">
        {movie.image ? (
          <Image
            src={movie.image}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="movie-card__img"
          />
        ) : (
          <div className="movie-card__no-image">
            <span>Ingen bild</span>
          </div>
        )}
        <div className="movie-card__rating">
          <span>★ {movie.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        {movie.genre_names && (
          <p className="movie-card__genre">{movie.genre_names}</p>
        )}
        <p className="movie-card__year">{movie.releaseDate?.slice(0, 4)}</p>
      </div>
    </Link>
  );
}
