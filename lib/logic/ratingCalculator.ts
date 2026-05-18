export function isEnoughReviews(items: { rating: number }[]): boolean {
  return items.length >= 5;
}

export function getAverage(ratings: number[]): number {
  return ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
}

export function calculateRating(reviews: { rating: number }[], imdbRating: number): number {
  if (isEnoughReviews(reviews)) {
    return getAverage(reviews.map((r) => r.rating));
  }
  return imdbRating;
}
