import { useQuery } from "@tanstack/react-query";
import { getTvDetails } from "../api/tvApi";

export function useTvDetails(id) {
  const isInvalidId = !/^[1-9]\d*$/.test(String(id ?? ""));
  const query = useQuery({
    queryKey: ["tv", "details", id],
    enabled: !isInvalidId,
    queryFn: ({ signal }) => getTvDetails(id, signal),
    staleTime: 1000 * 60 * 5,
    retry: (count, error) => {
      const status = error?.response?.status;
      if (status >= 400 && status < 500 && status !== 429) return false;
      return count < 1;
    },
  });
  return { ...query, isInvalidId };
}
