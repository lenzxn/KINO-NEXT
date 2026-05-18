"use client";

import { useState, useEffect } from "react";

interface Screening {
  id: number;
  start_time: string;
  room: string;
}

interface Props { movieId: number }

export default function MovieActions({ movieId }: Props) {
  const [showPopup, setShowPopup]     = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  const [screenings, setScreenings]     = useState<Screening[]>([]);
  const [byDate, setByDate]             = useState<Record<string, Screening[]>>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<Screening | null>(null);
  const [noScreenings, setNoScreenings] = useState(false);

  const [reviewRating, setReviewRating]   = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    fetch(`/api/movies/${movieId}/reviews`)
      .then(r => r.json())
      .then((data) => setReviewCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, [movieId]);

  useEffect(() => {
    fetch(`/api/movies/${movieId}/screenings`)
      .then(r => r.json())
      .then((data: Screening[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setNoScreenings(true);
          return;
        }
        setScreenings(data);
        const grouped: Record<string, Screening[]> = {};
        data.forEach(s => {
          const date = s.start_time.split("T")[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(s);
        });
        setByDate(grouped);
        const firstDate = Object.keys(grouped).sort()[0];
        setSelectedDate(firstDate);
      })
      .catch(() => setNoScreenings(true));
  }, [movieId]);

  useEffect(() => {
    fetch(`/api/movies/${movieId}/rating`)
      .then(r => r.json())
      .then(result => {
        const ratingArea = document.querySelector(".rating");
        if (!ratingArea) return;
        ratingArea.textContent = "";

        const ratingValue = Number(result.rating).toFixed(1);

        if (result.source === "local") {
          ratingArea.textContent = `⭐ ${ratingValue}`;
        } else if (result.source === "imdb") {
          const img = document.createElement("img");
          img.src = "/img/imdbLogo.png";
          img.alt = "IMDb";
          img.style.cssText = "width:40px;vertical-align:middle;margin-right:5px;";
          ratingArea.append(img, ` ${ratingValue}`);
        }
      })
      .catch(() => {});
  }, [movieId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setReviewMessage("Skickar recension...");

    const token = localStorage.getItem("token");
    if (!token) {
      setReviewMessage("Du måste logga in för att skriva en recension.");
      return;
    }

    try {
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: parseInt(reviewRating),
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewMessage("Recension skickad!");
        setReviewRating(""); setReviewComment("");
        setReviewCount(c => c + 1);
      } else {
        setReviewMessage("Fel: " + (data.error ?? "Okänt fel"));
      }
    } catch {
      setReviewMessage("Kunde inte skicka recensionen.");
    }
  }

  const dates = Object.keys(byDate).sort();
  const timesForDate = byDate[selectedDate] ?? [];

  return (
    <>
      <div className="info-card_buttons">
        <button
          id="viewReviewsBtn"
          className="reviewBtn _view"
          data-id={movieId}
          onClick={() => window.location.href = `/movies/${movieId}/reviews`}
        >
          Recensioner ({reviewCount}) <span className="arrow _right"></span>
        </button>

        <button
          className="reviewBtn _write"
          id="reviewBtn"
          data-id={movieId}
          onClick={() => setShowPopup(true)}
        >
          Skriv recension <span className="arrow _right"></span>
        </button>

        {showPopup && (
          <div
            id="reviewPopup"
            className="popupWrite"
            style={{ display: "flex" }}
            onClick={e => { if (e.target === e.currentTarget) setShowPopup(false); }}
          >
            <div className="popupWrite-content">
              <span className="closeX" onClick={() => setShowPopup(false)}>&times;</span>
              <div id="popupWriteInnerContent">
                <div className="review-form-container">
                  <h3>Lämna en recension</h3>
                  <form id="reviewForm" onSubmit={submitReview}>
                    <label htmlFor="rating">Betyg (1-5):</label>
                    <select id="rating" value={reviewRating} onChange={e => setReviewRating(e.target.value)} required>
                      <option value="">Välj</option>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <label htmlFor="comment">Kommentar:</label>
                    <textarea id="comment" rows={4} value={reviewComment} onChange={e => setReviewComment(e.target.value)} required />
                    <button type="submit">Skicka recension</button>
                  </form>
                  {reviewMessage && (
                    <div id="reviewMessage" style={{ color: reviewMessage.includes("Fel") || reviewMessage.includes("måste") || reviewMessage.includes("Kunde") ? "red" : "green" }}>
                      {reviewMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <section className="ticket-section">
        <div className="ticket-filter-box">
          <h2>Kommande visningar</h2>
          {noScreenings || screenings.length === 0 ? (
            <p>Inga kommande visningar</p>
          ) : (
            <>
              <label htmlFor="dateSelect">Välj datum nedan:</label>
              <select
                id="dateSelect"
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedTime(null); }}
              >
                {dates.map(date => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "short" })}
                  </option>
                ))}
              </select>

              <div id="timeSelect" className="time-grid">
                {timesForDate.map(s => {
                  const time = new Date(s.start_time).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <button
                      key={s.id}
                      className={`time-btn${selectedTime?.id === s.id ? " active" : ""}`}
                      onClick={() => setSelectedTime(s)}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              <div id="selectedRoom" className="room-box">
                {selectedTime ? `Salong: ${selectedTime.room}` : ""}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
