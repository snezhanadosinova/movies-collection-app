export function getTvCast(credits) {
  return (credits?.cast ?? []).map((person) => ({
    ...person,
    character: [...new Set((person.roles ?? []).map((role) => role.character).filter(Boolean))].join(" / "),
  }));
}

export function getTvRecommendations(series) {
  const seen = new Set([series.id]);
  return (series.recommendations?.results ?? []).filter((item) => {
    if (!item.id || seen.has(item.id) || item.adult) return false;
    seen.add(item.id);
    return true;
  });
}

export function formatTvDate(value) {
  if (!value) return "Not available";
  const date = new Date(value + "T00:00:00Z");
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  }).format(date);
}
