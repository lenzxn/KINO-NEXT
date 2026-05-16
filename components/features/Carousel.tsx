"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";

interface Props {
  movies: Movie[];
}

export default function Carousel({ movies }: Props) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const featured = movies.slice(0, 6);

  function startAutoplay() {
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 6000);
  }

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [featured.length]);

  function goTo(i: number) {
    setIndex(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
    startAutoplay();
  }

  const movie = featured[index];
  if (!movie) return null;

  return (
    <section className="carousel" aria-label="Utvalda filmer">
      <div className="carousel__slide">
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            priority
            className="carousel__backdrop"
            sizes="100vw"
          />
        )}
        <div className="carousel__overlay" />
        <div className="carousel__content">
          <span className="carousel__tag">
            {movie.kategori === "aktuellt" ? "Nu på bio" :
             movie.kategori === "populart" ? "Populärt" :
             movie.kategori === "barn" ? "Barn & familj" : "Klassiker"}
          </span>
          <h2 className="carousel__title">{movie.title}</h2>
          <p className="carousel__intro">{movie.intro?.slice(0, 160)}…</p>
          <div className="carousel__actions">
            <Link href={`/movies/${movie.id}`} className="btn btn--primary">
              Läs mer
            </Link>
            <span className="carousel__rating">★ {movie.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="carousel__dots" role="tablist">
        {featured.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Bild ${i + 1}`}
            className={`carousel__dot ${i === index ? "carousel__dot--active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      <button
        className="carousel__arrow carousel__arrow--left"
        aria-label="Föregående"
        onClick={() => goTo((index - 1 + featured.length) % featured.length)}
      >
        <Image src="/img/arrow-left-circle.png" alt="" width={40} height={40} />
      </button>
      <button
        className="carousel__arrow carousel__arrow--right"
        aria-label="Nästa"
        onClick={() => goTo((index + 1) % featured.length)}
      >
        <Image src="/img/arrow-right-circle.png" alt="" width={40} height={40} />
      </button>
    </section>
  );
}
