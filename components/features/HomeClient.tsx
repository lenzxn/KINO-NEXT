"use client";

import { useState, useEffect, useRef } from "react";
import type { Movie } from "@/lib/tmdb";

interface Screening {
  _id: string;
  movie: { title: string; poster: string | null };
  startsAt: string;
  room: string;
}
interface DayCard {
  date: string;
  screenings: Screening[];
}

const ROW_CONFIG = [
  { tag: "aktuellt",  label: "Nu på bio" },
  { tag: "populart",  label: "Populärt just nu" },
  { tag: "barn",      label: "För hela familjen" },
  { tag: "klassiker", label: "Klassiker" },
] as const;

const PAGE_SIZE = 16;

export default function HomeClient({ movies }: { movies: Movie[] }) {
  const [activeTag, setActiveTag] = useState("alla");
  const [currentLimit, setCurrentLimit] = useState(PAGE_SIZE);
  const [screeningDays, setScreeningDays] = useState<DayCard[]>([]);
  const [screeningsLoading, setScreeningsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/screenings?days=3&limit=12")
      .then(r => r.json())
      .then(d => setScreeningDays(d.days ?? []))
      .catch(() => setScreeningDays([]))
      .finally(() => setScreeningsLoading(false));
  }, []);

  function getColsPerRow() {
    const w = gridRef.current?.clientWidth ?? 0;
    return Math.max(1, Math.floor((w + 24) / (220 + 24)));
  }

  function getVisiblePosters() {
    const matching = movies.filter(m => m.kategori === activeTag);
    const cols = getColsPerRow();
    const fullRows = Math.max(cols, Math.floor(currentLimit / cols) * cols);
    return matching.slice(0, Math.min(fullRows, matching.length));
  }

  function handleTagClick(tag: string) {
    setActiveTag(tag);
    setCurrentLimit(PAGE_SIZE);
  }

  // Hide tags with fewer than 2 movies
  const visibleTags = ROW_CONFIG.filter(
    r => movies.filter(m => m.kategori === r.tag).length >= 2
  ).map(r => r.tag);

  const isNetflix = activeTag === "alla";
  const matchingMovies = activeTag !== "alla" ? movies.filter(m => m.kategori === activeTag) : [];
  const visibleMovies = activeTag !== "alla" ? getVisiblePosters() : [];
  const hasMore = activeTag !== "alla" && visibleMovies.length < matchingMovies.length;

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
  }
  function formatDate(yyyyMmDd: string) {
    return new Date(yyyyMmDd + "T00:00:00").toLocaleDateString("sv-SE", {
      weekday: "long", month: "long", day: "numeric"
    });
  }

  return (
    <>
      <div className="button_frontpage">
        <a href="/movies" className="secondarybtn"><i className="fa-solid fa-clapperboard"></i> Mer filmer</a>
        <button className="primarybtn"><i className="fa-solid fa-ticket"></i> Boka nu</button>
      </div>

      <section className="screenings">
        <div className="screenings__header">
          <div className="screenings__eyebrow">
            <span></span>
            <i className="fa-solid fa-star"></i>
            <span></span>
          </div>
          <h2>Kommande visningar</h2>
        </div>
        <div id="screenings" className="screenings__content">
          {screeningsLoading ? (
            <>
              <div className="loading"></div>
              <div className="loading"></div>
            </>
          ) : screeningDays.length === 0 ? (
            <div className="state">
              <h3 className="state__title">Inga kommande visningar just nu</h3>
              <p className="state__text">Kolla gärna igen senare – vi uppdaterar löpande.</p>
            </div>
          ) : (
            screeningDays.map(day => (
              <article key={day.date} className="day-card">
                <h3 className="day-card__title"><span>{formatDate(day.date)}</span></h3>
                <div className="day-card__grid">
                  {day.screenings.map(s => (
                    <div key={String(s._id)} className="screening-item">
                      {s.movie.poster
                        ? <img className="screening-poster" src={s.movie.poster} alt={s.movie.title} loading="lazy" />
                        : <div className="screening-poster screening-poster--placeholder"></div>
                      }
                      <div className="screening-meta">
                        <div className="screening-time">{formatTime(String(s.startsAt))}</div>
                        <div className="screening-title">{s.movie.title}</div>
                        {s.room && <div className="screening-room">{s.room}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="member-banner">
        <div className="member-banner__icon">
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="member-banner__body">
          <strong>Bli Kino-medlem</strong>
          <span>Få rabatt på biljetter, tidig bokning och exklusiva erbjudanden varje månad</span>
        </div>
        <a href="/profile" className="member-banner__cta">
          Läs mer <i className="fa-solid fa-chevron-right"></i>
        </a>
      </section>

      {/* Tag-knappar */}
      <section className="tags">
        <button
          className={`tagsbtn${activeTag === "alla" ? " active" : ""}`}
          onClick={() => handleTagClick("alla")}
          data-tag="alla"
        >
          Alla
        </button>
        {ROW_CONFIG.map(r => (
          <button
            key={r.tag}
            className={`tagsbtn${activeTag === r.tag ? " active" : ""}`}
            onClick={() => handleTagClick(r.tag)}
            data-tag={r.tag}
            style={!visibleTags.includes(r.tag) ? { display: "none" } : undefined}
          >
            {r.tag === "aktuellt" ? "Aktuellt" :
             r.tag === "populart" ? "Populärt" :
             r.tag === "barn"     ? "Barnfilmer" : "Klassiker"}
          </button>
        ))}
      </section>

      <section className="home-movies">
        {/* Netflix-rader */}
        <div id="startNetflixView" className="netflix-view" style={isNetflix ? undefined : { display: "none" }}>
          {ROW_CONFIG.map(row => {
            const rowMovies = movies.filter(m => m.kategori === row.tag);
            if (!rowMovies.length) return null;
            return (
              <div key={row.tag} className="netflix-row" data-tag={row.tag}>
                <div className="netflix-row__header">
                  <h2 className="netflix-row__title">{row.label}</h2>
                  <a href="/movies" className="netflix-row__showall">
                    Se alla <i className="fa-solid fa-chevron-right"></i>
                  </a>
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

        {/* Grid-vy vid tag-filtrering */}
        <div
          id="startGridView"
          className="movie__page__movies"
          style={isNetflix ? { display: "none" } : undefined}
          ref={gridRef}
        >
          {movies.map(movie => (
            <a
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="poster-link"
              data-title={movie.title.toLowerCase()}
              data-kategori={movie.kategori}
              data-genres={(movie.genre_names ?? "").toLowerCase()}
              style={
                !isNetflix && visibleMovies.find(m => m.id === movie.id)
                  ? undefined
                  : { display: "none" }
              }
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

        <div className="home-movies__cta">
          {hasMore && (
            <button
              className="home-movies__load-more-btn"
              type="button"
              id="startLoadMoreBtn"
              onClick={() => setCurrentLimit(l => l + PAGE_SIZE)}
            >
              <i className="fa-solid fa-layer-plus"></i> Fler filmer
            </button>
          )}
          <a href="/movies" className="home-movies__cta-btn">
            Utforska alla filmer <i className="fa-solid fa-chevron-right"></i>
          </a>
        </div>
      </section>

      <section className="info-panels">
        <div className="price-card">
          <div className="price-card__header">
            <i className="fa-solid fa-ticket"></i>
            <h3>Prislista</h3>
          </div>
          <div className="price-card__rows">
            <div className="price-card__row"><span>Vuxen</span><span className="price-card__amount">200 kr</span></div>
            <div className="price-card__row"><span>Barn</span><span className="price-card__amount">100 kr</span></div>
            <div className="price-card__row"><span>Student</span><span className="price-card__amount">150 kr</span></div>
            <div className="price-card__row"><span>Pensionär</span><span className="price-card__amount">150 kr</span></div>
          </div>
          <p className="price-card__note">* Andra priser gäller under evenemang</p>
        </div>

        <div className="kino-card">
          <div className="kino-card__header">
            <i className="fa-solid fa-film"></i>
            <h3>På Kino</h3>
          </div>
          <ul className="kino-card__list">
            <li><i className="fa-solid fa-utensils"></i> Restaurang</li>
            <li><i className="fa-solid fa-martini-glass"></i> Bar</li>
            <li><i className="fa-solid fa-calendar-star"></i> Events</li>
            <li><i className="fa-solid fa-baby-carriage"></i> Barnvagnsbio</li>
            <li><i className="fa-solid fa-user-clock"></i> Pensionärsbio</li>
            <li><i className="fa-solid fa-champagne-glasses"></i> Bubbel &amp; chark</li>
            <li><i className="fa-solid fa-clapperboard"></i> Klassiker</li>
            <li><i className="fa-solid fa-child"></i> Barnbio</li>
            <li><i className="fa-solid fa-store"></i> Kiosk</li>
          </ul>
        </div>
      </section>
    </>
  );
}
