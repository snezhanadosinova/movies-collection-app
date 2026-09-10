import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

export const usePersonDetails = (id) => {
  const isValidId = /^[1-9]\d*$/.test(String(id ?? ""));

  const query = useQuery({
    queryKey: ["person", id],
    enabled: isValidId,
    queryFn: async ({ signal }) => {
      const { data } = await api.get(`/person/${id}`, {
        params: {
          language: "en-US",
          append_to_response: "combined_credits,external_ids,images",
        },
        signal,
      });

      return data;
    },
    staleTime: 1000 * 60 * 15,
    retry: (failureCount, error) => {
      const status = error?.response?.status;

      if (status >= 400 && status < 500 && status !== 429) {
        return false;
      }

      return failureCount < 1;
    },
  });

  return {
    ...query,
    isInvalidId: !isValidId,
  };
};