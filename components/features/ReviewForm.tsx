"use client";

import { useState, FormEvent } from "react";
import Button from "@/components/ui/Button";

interface Props {
  movieId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ movieId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Välj ett betyg mellan 1 och 5");
      return;
    }
    if (!comment.trim()) {
      setError("Skriv en kommentar");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Du måste vara inloggad för att lämna en recension");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/movies/${movieId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Något gick fel");
      }

      setRating(0);
      setComment("");
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serverfel");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <p className="review-form__success">Tack för din recension!</p>;
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Lämna en recension</h3>

      <div className="review-form__stars" role="group" aria-label="Betyg">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`review-form__star ${star <= rating ? "review-form__star--active" : ""}`}
            onClick={() => setRating(star)}
            aria-label={`${star} stjärnor`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        className="review-form__textarea"
        placeholder="Skriv din recension…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        maxLength={1000}
        required
      />

      {error && <p className="review-form__error">{error}</p>}

      <Button type="submit" loading={loading}>
        Skicka recension
      </Button>
    </form>
  );
}
