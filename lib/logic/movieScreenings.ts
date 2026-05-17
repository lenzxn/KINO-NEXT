interface Screening {
  id: number;
  start_time: string;
  room: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getUpcomingMovieScreenings(cmsJson: any, now = new Date()): Screening[] {
  if (!cmsJson?.data) return [];
  return cmsJson.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any) => ({
      id: item.id,
      start_time: item.attributes.start_time,
      room: item.attributes.room,
    }))
    .filter((s: Screening) => new Date(s.start_time) > now)
    .sort((a: Screening, b: Screening) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}
