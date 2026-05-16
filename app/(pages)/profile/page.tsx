"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewItem {
  _id: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!name || !token) {
      router.push("/(pages)/login");
      return;
    }
    setUsername(name);
  }, [router]);

  if (!username) return null;

  return (
    <div className="profile-page">
      <h1>Hej, {username}!</h1>

      <section className="profile-page__reviews">
        <h2>Dina recensioner</h2>
        {reviews.length === 0 ? (
          <p>Du har inte skrivit några recensioner ännu.</p>
        ) : (
          <ul>
            {reviews.map((r) => (
              <li key={r._id} className="profile-review">
                <span className="profile-review__rating">{"★".repeat(r.rating)}</span>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleDateString("sv-SE")}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
