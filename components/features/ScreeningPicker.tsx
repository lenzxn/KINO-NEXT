"use client";

import { useEffect, useState } from "react";

interface Screening {
  _id: string;
  startTime: string;
  room: string;
  seats: number;
  price: number;
}

interface Props {
  movieId: number;
}

export default function ScreeningPicker({ movieId }: Props) {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/movies/${movieId}/screenings`)
      .then((r) => r.json())
      .then((data) => setScreenings(Array.isArray(data) ? data : []))
      .catch(() => setScreenings([]))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <p>Hämtar visningar…</p>;
  if (screenings.length === 0) return <p>Inga kommande visningar just nu.</p>;

  return (
    <div className="screening-picker">
      <h3>Kommande visningar</h3>
      <ul className="screening-picker__list">
        {screenings.map((s) => (
          <li key={s._id}>
            <button
              className={`screening-picker__slot ${selected === s._id ? "screening-picker__slot--selected" : ""}`}
              onClick={() => setSelected(s._id)}
            >
              <span className="screening-picker__time">
                {new Date(s.startTime).toLocaleString("sv-SE", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="screening-picker__room">{s.room}</span>
              <span className="screening-picker__price">{s.price} kr</span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <button className="btn btn--primary screening-picker__book">
          Boka vald visning
        </button>
      )}
    </div>
  );
}
