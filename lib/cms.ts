const CMS_BASE = "https://plankton-app-xhkom.ondigitalocean.app/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getReviewsByMovieId(movieId: string | number): Promise<any[]> {
  const url = `${CMS_BASE}/reviews?filters[movie]=${movieId}&pagination[pageSize]=100`;
  const res = await fetch(url, { cache: "no-store" });
  const result = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (result.data ?? []).filter((r: any) => r.attributes.verified === true);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getScreenings(): Promise<any> {
  const url = `${CMS_BASE}/screenings?populate=movie&pagination[pageSize]=200`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`CMS error: ${res.status}`);
  return res.json();
}
