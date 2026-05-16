import { render, screen } from "@testing-library/react";
import MovieCard from "@/components/ui/MovieCard";
import type { Movie } from "@/lib/tmdb";

const mockMovie: Movie = {
  id: 550,
  title: "Fight Club",
  intro: "En sömnlös man bildar en underjordisk slagsmålsklubb.",
  image: "https://image.tmdb.org/t/p/w500/poster.jpg",
  backdrop: null,
  releaseDate: "1999-10-15",
  rating: 8.4,
  voteCount: 26000,
  genreIds: [18, 53],
  genre_names: "Drama, Thriller",
  kategori: "klassiker",
};

describe("MovieCard", () => {
  it("renderar filmens titel", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Fight Club")).toBeInTheDocument();
  });

  it("renderar genrer", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Drama, Thriller")).toBeInTheDocument();
  });

  it("visar release-år", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("1999")).toBeInTheDocument();
  });

  it("har länk till filmsidan", () => {
    render(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/550");
  });

  it("visar betyg", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
  });
});
