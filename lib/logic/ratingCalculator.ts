// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEnoughReviews(items: any[]): boolean {
  return items.length >= 5;
}

export function getAverage(ratings: number[]): number {
  return ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateRating(reviews: any[], imdbRating: number): number {
  if (isEnoughReviews(reviews)) {
    const ratings = reviews.map((obj) => obj.attributes.rating);
    return getAverage(ratings);
  }
  return imdbRating;
}
