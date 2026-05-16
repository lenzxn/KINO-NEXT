import { loadMovies } from "@/lib/tmdb";
import MoviesClient from "@/components/features/MoviesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Filmer" };

export default async function MoviesPage() {
  const movies = await loadMovies();
  return <MoviesClient movies={movies} />;
}
