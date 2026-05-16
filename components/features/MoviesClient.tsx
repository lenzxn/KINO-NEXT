"use client";

import { useState } from "react";
import type { Movie } from "@/lib/tmdb";

const ROW_CONFIG = [
  { tag: "aktuellt",  label: "Nu på bio" },
  { tag: "populart",  label: "Populärt just nu" },
  { tag: "barn",      label: "För hela familjen" },
  { tag: "klassiker", label: "Klassiker" },
] as const;

const GENRE_BTNS = [
  { value: "alla",            label: "Alla filmer" },
  { value: "action",          label: "Action" },
  { value: "drama",           label: "Drama" },
  { value: "komedi",          label: "Komedi" },
  { value: "äventyr",         label: "Äventyr" },
  { value: "thriller",        label: "Thriller" },
  { value: "skräck",          label: "Skräck" },
  { value: "animerat",        label: "Animerat" },
  { value: "science fiction", label: "Science Fiction" },
  { value: "romantik",        label: "Romantik" },
  { value: "fantasy",         label: "Fantasy" },
  { value: "familj",          label: "Familj" },
];

export default function MoviesClient({ movies }: { movies: Movie[] }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("alla");
  const [activeGenre, setActiveGenre] = useState("alla");

  const isNetflix = activeTag === "alla" && activeGenre === "alla" && search.trim() === "";

  const filtered = movies.filter(m => {
    const tagOk   = activeTag   === "alla" || m.kategori === activeTag;
    const genreOk = activeGenre === "alla" || (m.genre_names ?? "").toLowerCase().includes(activeGenre);
    const searchOk = search.trim() === "" || m.title.toLowerCase().includes(search.trim().toLowerCase());
    return tagOk && genreOk && searchOk;
  });

  function handleTagClick(tag: string) {
    setActiveTag(tag);
    // Highlight matching top tag btn — done via state
    document.querySelectorAll<HTMLButtonElement>(".tagsbtn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll<HTMLButtonElement>(`.tagsbtn[data-tag="${tag}"]`).forEach(b => b.classList.add("active"));
  }

  return (
    <>
      <section className="filters-section">
        <div className="search__bar">
          <div className="search__input__wrapper">
            <input
              className="search__bar__movie"
              type="text"
              placeholder="Sök film..."
              id="searchInputMovies"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="button" className="search__icon-button" id="searchBtnMovies">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="genre-filters" id="genreFilters">
          {GENRE_BTNS.map(g => (
            <button
              key={g.value}
              className={`genre-btn${activeGenre === g.value ? " active" : ""}`}
              data-genre={g.value}
              onClick={() => setActiveGenre(g.value)}
            >
              {g.label}
            </button>
          ))}
        </div>
      </section>

      <div className="movies-wrapper">
        {/* Netflix-rader (default) */}
        <div id="netflixView" className="netflix-view" style={isNetflix ? undefined : { display: "none" }}>
          {ROW_CONFIG.map(row => {
            const rowMovies = movies.filter(m => m.kategori === row.tag);
            if (!rowMovies.length) return null;
            return (
              <div key={row.tag} className="netflix-row">
                <div className="netflix-row__header">
                  <h2 className="netflix-row__title">{row.label}</h2>
                  <button
                    className="netflix-row__showall tagsbtn"
                    data-tag={row.tag}
                    onClick={() => { setActiveTag(row.tag); setActiveGenre("alla"); }}
                  >
                    Se alla <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <div className="netflix-row__scroll">
                  <div className="netflix-row__strip">
                    {rowMovies.map(movie => (
                      <a key={movie.id} href={`/movies/${movie.id}`} className="netflix-card">
                        <div className="netflix-card__poster">
                          <img src={movie.image ?? ""} alt={movie.title} loading="lazy" />
                          <div className="netflix-card__overlay">
                            <div className="netflix-card__rating">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                              {Math.round(movie.rating * 10)}%
                            </div>
                            <p className="netflix-card__genre">{movie.genre_names}</p>
                          </div>
                        </div>
                        <p className="netflix-card__title">{movie.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid-vy vid sökning/filtrering */}
        <div id="gridView" className="movie__page__movies" style={isNetflix ? { display: "none" } : undefined}>
          {filtered.map((movie, idx) => (
            <a
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="poster-link"
              data-title={movie.title.toLowerCase()}
              data-kategori={movie.kategori}
              data-genres={(movie.genre_names ?? "").toLowerCase()}
              data-idx={idx}
            >
              <div className="movie-poster">
                <img src={movie.image ?? ""} alt={movie.title} loading="lazy" />
                <div className="movie-info">
                  <h2>{movie.title}</h2>
                  <div className="movie-info-icon-wrap">
                    <button className="movie-info-icon" aria-label="Mer info">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>
                    </button>
                    <div className="movie-tooltip">
                      <div className="movie-tooltip__rating">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#C9A84C"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        {Math.round(movie.rating * 10)}%
                      </div>
                      <p className="movie-tooltip__text">{movie.intro}</p>
                    </div>
                  </div>
                  <h3>{movie.genre_names}</h3>
                </div>
              </div>
            </a>
          ))}
        </div>

        {!isNetflix && filtered.length === 0 && (
          <div className="no-results" id="noResults">
            <div className="no-results__icon">
              {search.trim() ? <i className="fa-solid fa-magnifying-glass"></i> : <i className="fa-solid fa-film"></i>}
            </div>
            <h3 className="no-results__title">{search.trim() ? "Inga träffar" : "Inga filmer just nu"}</h3>
            <p className="no-results__sub">
              {search.trim()
                ? <>Inga filmer matchar <strong>&ldquo;{search}&rdquo;</strong>. Prova ett annat ord.</>
                : "Inga filmer i den kategorin. Prova en annan."}
            </p>
          </div>
        )}
      </div>

      <div className="button_films">
        {/* Load more hanteras av Netflix-rader / grid, ingen pagination behövs */}
      </div>
    </>
  );
}
