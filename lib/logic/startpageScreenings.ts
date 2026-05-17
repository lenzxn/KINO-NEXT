function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface ScreeningItem {
  id: number;
  startsAt: string;
  room: string | null;
  movie: { id: number; title: string; poster: string } | null;
}

interface DayEntry {
  date: string;
  screenings: ScreeningItem[];
}

interface Result {
  days: DayEntry[];
  total: number;
}

export function getUpcomingStartpageScreenings(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cmsJson: any,
  now = new Date(),
  days = 5,
  limit = 10,
): Result {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const rangeEnd = new Date(todayStart);
  rangeEnd.setDate(rangeEnd.getDate() + days);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredSorted = (cmsJson.data ?? []).map((item: any) => {
    const a = item.attributes ?? {};
    const movieData = a.movie?.data;
    const movieAttributes = movieData?.attributes ?? {};
    return {
      id: item.id,
      startsAt: a.start_time,
      startsAtDate: a.start_time ? new Date(a.start_time) : null,
      room: a.room ?? null,
      movie: movieData
        ? { id: movieData.id, title: movieAttributes.title ?? "", poster: movieAttributes.image?.url ?? "" }
        : null,
    };
  })
    .filter((s: { startsAtDate: Date | null }) => s.startsAtDate)
    .filter((s: { startsAtDate: Date }) => s.startsAtDate >= now)
    .filter((s: { startsAtDate: Date }) => s.startsAtDate < rangeEnd)
    .sort((a: { startsAtDate: Date }, b: { startsAtDate: Date }) => a.startsAtDate.getTime() - b.startsAtDate.getTime());

  const groupedByDay: Record<string, ScreeningItem[]> = filteredSorted.reduce(
    (acc: Record<string, ScreeningItem[]>, screening: { startsAtDate: Date; id: number; startsAt: string; room: string | null; movie: { id: number; title: string; poster: string } | null }) => {
      const day = dayKey(screening.startsAtDate);
      if (!acc[day]) acc[day] = [];
      acc[day].push({ id: screening.id, startsAt: screening.startsAt, room: screening.room, movie: screening.movie });
      return acc;
    },
    {}
  );

  const dayList: DayEntry[] = Object.keys(groupedByDay)
    .sort()
    .map((date) => {
      const dayScreenings = groupedByDay[date] ?? [];
      return {
        date,
        screenings: dayScreenings.length > limit ? dayScreenings.slice(0, limit) : dayScreenings,
      };
    });

  return { days: dayList, total: dayList.reduce((s, d) => s + d.screenings.length, 0) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findEarliestScreeningDate(cmsJson: any): Date {
  const dates = (cmsJson.data ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => item.attributes?.start_time)
    .filter(Boolean)
    .map((t: string) => new Date(t))
    .filter((d: Date) => !isNaN(d.getTime()))
    .sort((a: Date, b: Date) => a.getTime() - b.getTime());

  if (!dates.length) return new Date();

  const now = new Date();
  const hasFuture = dates.some((d: Date) => d >= now);
  if (hasFuture) return now;

  const ref = new Date(dates[0]);
  ref.setHours(0, 0, 0, 0);
  return ref;
}
