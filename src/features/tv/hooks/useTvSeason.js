import { useQuery } from "@tanstack/react-query";
import { getTvSeason } from "../api/tvApi";

export function useTvSeason(id, seasonNumber) {
  const isInvalidParams =
    !/^[1-9]\d*$/.test(String(id ?? "")) ||
    !/^(0|[1-9]\d*)$/.test(String(seasonNumber ?? ""));

  const query = useQuery({
    queryKey: ["tv", "season", id, seasonNumber],
    enabled: !isInvalidParams,
    queryFn: ({ signal }) => getTvSeason(id, seasonNumber, signal),
    staleTime: 1000 * 60 * 5,
    retry: (count, error) => {
      const status = error?.response?.status;
      if (status >= 400 && status < 500 && status !== 429) return false;
      return count < 1;
    },
  });

  return { ...query, isInvalidParams };
}
