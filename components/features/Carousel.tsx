"use client";

import { useEffect, useRef } from "react";
import type { Movie } from "@/lib/tmdb";

interface Props {
  movies: Movie[];
}

const AUTOPLAY_DELAY = 9000;
const CAROUSEL_MIN = 3;
const CAROUSEL_MAX = 6;
const KEY_TIMEOUT = 1500;
const CANDIDATES = 7;

declare global {
  interface Window {
    YT: {
      Player: new (el: Element, opts: object) => YTPlayer;
      PlayerState: { PLAYING: number; ENDED: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  pauseVideo: () => void;
  playVideo: () => void;
  setPlaybackQuality: (q: string) => void;
  mute: () => void;
}

export default function Carousel({ movies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let currentIndex = 0;
    let autoplayTimer: ReturnType<typeof setInterval> | null = null;
    let slides: HTMLElement[] = [];
    let dots: HTMLButtonElement[] = [];
    const players: (YTPlayer | null)[] = [];
    const trailerCache: Record<string, string | null> = {};
    let ytCallbacks: (() => void)[] = [];

    function loadYouTubeAPI(): Promise<void> {
      return new Promise(resolve => {
        if (window.YT?.Player) { resolve(); return; }
        ytCallbacks.push(resolve);
        if (!document.getElementById("yt-api-script")) {
          const s = document.createElement("script");
          s.id = "yt-api-script";
          s.src = "https://www.youtube.com/iframe_api";
          s.defer = true;
          document.head.appendChild(s);
        }
      });
    }

    window.onYouTubeIframeAPIReady = () => {
      ytCallbacks.forEach(cb => cb());
      ytCallbacks = [];
    };

    async function fetchTrailerKey(movieId: string): Promise<string | null> {
      if (trailerCache[movieId] !== undefined) return trailerCache[movieId];
      try {
        const res = await fetch(`/api/movies/${movieId}/trailer`);
        const data = await res.json();
        trailerCache[movieId] = data.key || null;
      } catch {
        trailerCache[movieId] = null;
      }
      return trailerCache[movieId];
    }

    function fetchKeyWithTimeout(movieId: string): Promise<string | null> {
      return Promise.race([
        fetchTrailerKey(movieId),
        new Promise<null>(resolve => setTimeout(() => resolve(null), KEY_TIMEOUT)),
      ]);
    }

    function initYTPlayer(slideIndex: number, videoId: string) {
      const slide = slides[slideIndex];
      const el = slide?.querySelector(".yt-player-el");
      if (!el || !window.YT?.Player) return;

      const player = new window.YT.Player(el, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: slideIndex === currentIndex ? 1 : 0,
          mute: 1, controls: 0, loop: 1, playlist: videoId,
          rel: 0, modestbranding: 1, iv_load_policy: 3,
          fs: 0, disablekb: 1, enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady(e: { target: YTPlayer }) {
            e.target.mute();
            const iframe = slide.querySelector("iframe");
            if (iframe) iframe.setAttribute("tabindex", "-1");
            if (slideIndex === currentIndex) {
              e.target.setPlaybackQuality("hd1080");
              e.target.playVideo();
            }
          },
          onStateChange(e: { data: number }) {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setTimeout(() => {
                if (slides[currentIndex] === slide) slide.classList.add("player-active");
              }, 500);
            } else if (
              e.data === window.YT.PlayerState.ENDED ||
              e.data === window.YT.PlayerState.PAUSED
            ) {
              slide.classList.remove("player-active");
            }
          },
          onError() { slide.classList.remove("player-active"); },
        },
      });

      players[slideIndex] = player;
    }

    function buildDots() {
      const container = containerRef.current?.querySelector("#slideDots");
      if (!container) return;
      container.innerHTML = "";
      dots = slides.map((_, i) => {
        const btn = document.createElement("button");
        btn.className = "slide-dot" + (i === 0 ? " active" : "");
        btn.setAttribute("aria-label", `Slide ${i + 1}`);
        btn.addEventListener("click", () => { goTo(i); restartAutoplay(); });
        container.appendChild(btn);
        return btn;
      });
    }

    function goTo(index: number) {
      const prev = currentIndex;
      try { players[prev]?.pauseVideo(); } catch { /* no-op */ }
      slides.forEach(s => { s.style.display = "none"; s.classList.remove("active"); });
      dots.forEach(d => d.classList.remove("active"));
      currentIndex = index;
      slides[currentIndex].style.display = "block";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slides[currentIndex].classList.add("active");
          try {
            const p = players[currentIndex];
            if (p) { p.setPlaybackQuality("hd1080"); p.playVideo(); }
          } catch { /* no-op */ }
        });
      });
      dots[currentIndex]?.classList.add("active");
      startAutoplay();
    }

    function step(dir: number) {
      let next = currentIndex + dir;
      if (next >= slides.length) next = 0;
      if (next < 0) next = slides.length - 1;
      goTo(next);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => step(1), AUTOPLAY_DELAY);
    }
    function stopAutoplay() {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function restartAutoplay() { startAutoplay(); }

    async function openTrailer(movieId: string) {
      const modal  = document.getElementById("trailerModal");
      const iframe = document.getElementById("trailerIframe") as HTMLIFrameElement | null;
      if (!modal || !iframe) return;
      try { players[currentIndex]?.pauseVideo(); } catch { /* no-op */ }
      stopAutoplay();
      modal.style.display = "flex";
      requestAnimationFrame(() => modal.classList.add("active"));
      const key = trailerCache[movieId] ?? await fetchTrailerKey(movieId);
      if (key) {
        iframe.src = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1`;
      } else {
        closeTrailer();
      }
    }

    function closeTrailer() {
      const modal  = document.getElementById("trailerModal");
      const iframe = document.getElementById("trailerIframe") as HTMLIFrameElement | null;
      if (!modal) return;
      modal.classList.remove("active");
      setTimeout(() => { modal.style.display = "none"; }, 300);
      if (iframe) iframe.src = "";
      try { players[currentIndex]?.playVideo(); } catch { /* no-op */ }
      startAutoplay();
    }

    const container = containerRef.current;
    if (!container) return;
    const allSlides = Array.from(container.querySelectorAll<HTMLElement>(".mySlides"));
    if (!allSlides.length) return;

    allSlides[0].style.display = "block";
    allSlides[0].classList.add("active");

    container.querySelector(".prev")?.addEventListener("click", () => { step(-1); restartAutoplay(); });
    container.querySelector(".next")?.addEventListener("click", () => { step(1);  restartAutoplay(); });

    container.querySelectorAll<HTMLButtonElement>(".slide-btn--trailer").forEach(btn => {
      btn.addEventListener("click", () => openTrailer(btn.dataset.id ?? ""));
    });

    document.getElementById("trailerModalClose")?.addEventListener("click", closeTrailer);
    document.getElementById("trailerModalBackdrop")?.addEventListener("click", closeTrailer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeTrailer(); });

    const candidates = allSlides.slice(0, CANDIDATES);
    Promise.all([
      Promise.all(candidates.map(s => fetchKeyWithTimeout(s.dataset.movieId ?? ""))),
      loadYouTubeAPI(),
    ]).then(([keys]) => {
      const withTrailers = candidates.filter((_, i) => !!keys[i]).slice(0, CAROUSEL_MAX);
      slides = withTrailers.length >= CAROUSEL_MIN ? withTrailers : candidates.slice(0, CAROUSEL_MAX);

      allSlides.forEach(s => {
        if (!slides.includes(s)) { s.style.display = "none"; s.classList.remove("active"); }
      });

      buildDots();

      const newFirst = slides[0];
      if (!newFirst.classList.contains("active")) {
        allSlides[0].style.display = "none";
        allSlides[0].classList.remove("active");
        currentIndex = 0;
        goTo(0);
      } else {
        currentIndex = 0;
        dots[0]?.classList.add("active");
        startAutoplay();
      }

      slides.forEach((slide, i) => {
        const key = trailerCache[slide.dataset.movieId ?? ""];
        if (key) initYTPlayer(i, key);
      });
    });

    return () => { stopAutoplay(); };
  }, []);

  const featured = movies.slice(0, 10);

  return (
    <>
      <div className="slideshow-container" ref={containerRef}>
        {featured.map((movie, i) => (
          <div
            key={movie.id}
            className="mySlides fade"
            data-movie-id={String(movie.id)}
            style={i > 0 ? { display: "none" } : undefined}
          >
            <div className="slide-image-wrapper">
              {i === 0 ? (
                movie.backdrop
                  ? <img className="slide-img" src={movie.backdrop} alt={movie.title} fetchPriority="high" />
                  : movie.image
                    ? <img className="slide-img" src={movie.image} alt={movie.title} fetchPriority="high" />
                    : null
              ) : (
                movie.backdrop
                  ? <img className="slide-img" src={movie.backdrop} alt={movie.title} loading="lazy" />
                  : movie.image
                    ? <img className="slide-img" src={movie.image} alt={movie.title} loading="lazy" />
                    : null
              )}

              <div className="slide-player-wrap">
                <div className="yt-player-el"></div>
              </div>

              <div className="slide-overlay">
                <div className="slide-meta">
                  {movie.genre_names && <span className="slide-genres">{movie.genre_names}</span>}
                  {movie.rating > 0 && <span className="slide-rating">★ {movie.rating}</span>}
                </div>
                <h2 className="slide-title">{movie.title}</h2>
                <div className="slide-actions">
                  <a href={`/movies/${movie.id}`} className="slide-btn slide-btn--info">Mer info</a>
                  <button className="slide-btn slide-btn--trailer" data-id={String(movie.id)}>
                    <span className="play-icon">▶</span> Se trailer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="prev" aria-label="Föregående">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button className="next" aria-label="Nästa">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div className="slide-dots" id="slideDots"></div>
      </div>

      <div id="trailerModal" className="trailer-modal">
        <div className="trailer-modal__backdrop" id="trailerModalBackdrop"></div>
        <div className="trailer-modal__content">
          <button className="trailer-modal__close" id="trailerModalClose">✕</button>
          <div className="trailer-modal__iframe-wrapper">
            <iframe id="trailerIframe" frameBorder={0}
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
