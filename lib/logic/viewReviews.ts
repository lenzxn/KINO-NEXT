interface ReviewItem {
  quote: string;
  rating: number;
  name: string;
  verified?: boolean | null;
}

interface PaginateResult {
  data: ReviewItem[];
  totalPages: number;
  totalItems: number;
  page: number;
}

export function paginateReviews(reviews: ReviewItem[], page: number, pageSize: number): PaginateResult {
  const totalItems = reviews.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: reviews.slice(start, end), totalPages, totalItems, page };
}
