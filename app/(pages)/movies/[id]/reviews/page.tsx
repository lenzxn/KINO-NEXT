"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

interface Review {
  _id: string;
  author: string;
  rating: number;
  comment: string;
  verified?: boolean | null;
}

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const params = useParams();
  const movieId = params.id as string;

  const [reviews, setReviews]   = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  const loadReviews = useCallback(async (page: number) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/movies/${movieId}/reviews?page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
        setTotalPages(1);
      } else {
        setReviews(data.reviews ?? []);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => { loadReviews(currentPage); }, [loadReviews, currentPage]);

  function verifiedIcon(verified: boolean | null | undefined) {
    if (verified === true)  return "✅";
    if (verified === false) return "❌ Ej verifierad";
    return "☑";
  }

  return (
    <section className="review-list">

      <div className="review-header">
        <button className="backBtn" onClick={() => history.back()}>
          <span className="arrow _left"></span>
        </button>
        <h1 className="review-title">Recensioner</h1>
      </div>

      <div id="reviews-container" className="reviews-container">
        {loading && <p>Laddar recensioner...</p>}
        {error && <p>Kunde inte ladda recensioner.</p>}
        {!loading && !error && reviews.length === 0 && <p>Inga recensioner ännu</p>}
        {!loading && !error && reviews.map(review => (
          <article key={review._id} className="review-card">
            <p className="review-card_rating">&#11088; {review.rating}/5</p>
            <blockquote className="review-card_quote">{review.comment}</blockquote>
            <h2 className="review-card_name">
              {review.author}
              <span className="review-card_verified"> {verifiedIcon(review.verified)}</span>
            </h2>
          </article>
        ))}
      </div>

      <div className="review-pagination">
        <span
          className="arrow _left"
          id="previous-page"
          onClick={() => { if (currentPage > 1) setCurrentPage(p => p - 1); }}
          style={{ cursor: currentPage === 1 ? "default" : "pointer", opacity: currentPage === 1 ? 0.3 : 1 }}
        ></span>
        <p className="page-indicator">{currentPage} / {totalPages}</p>
        <span
          className="arrow _right"
          id="next-page"
          onClick={() => { if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
          style={{ cursor: currentPage === totalPages ? "default" : "pointer", opacity: currentPage === totalPages ? 0.3 : 1 }}
        ></span>
      </div>

    </section>
  );
}
