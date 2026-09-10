import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { uniqueMovies } from "@/utils/uniqueMovies";
import { getTvGenres, getTvPage } from "../api/tvApi";

export const TV_SEARCH_PAGE_LIMIT = 5;

export function useTvCatalog() {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const genre = params.get("genre") ?? "";
  const debouncedSearch = useDebounce(search.trim());
  const isSearching = debouncedSearch.length >= 2;
  const queryText = isSearching ? debouncedSearch : "";

  const updateParam = (key, value) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, {
      replace: key === "q",
      flushSync: true,
      preventScrollReset: true,
    });
  };

  const genresQuery = useQuery({
    queryKey: ["tv", "genres"],
    queryFn: getTvGenres,
    staleTime: Infinity,
  });

  const query = useInfiniteQuery({
    queryKey: ["tv", "catalog", isSearching ? "search" : "browse", queryText || genre],
    queryFn: ({ pageParam, signal }) => getTvPage({
      search: queryText,
      genre: isSearching ? "" : genre,
      page: pageParam,
      signal,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (
        lastPage.page >= Math.min(lastPage.total_pages, 500) ||
        (isSearching && pages.length >= TV_SEARCH_PAGE_LIMIT)
      ) return undefined;
      return lastPage.page + 1;
    },
  });

  const { hasNextPage, isFetching, isError, fetchStatus, fetchNextPage } = query;
  const pages = query.data?.pages;
  const pageCount = pages?.length ?? 0;

  useEffect(() => {
    if (isSearching && hasNextPage && !isFetching && !isError && fetchStatus !== "paused") {
      void fetchNextPage({ cancelRefetch: false });
    }
  }, [isSearching, queryText, pageCount, hasNextPage, isFetching, isError, fetchStatus, fetchNextPage]);

  const results = uniqueMovies(pages?.flatMap((page) => page.results) ?? []);
  const series = isSearching && genre
    ? results.filter((item) => item.genre_ids?.includes(Number(genre)))
    : results;

  const lastPage = pages?.at(-1);
  const limitReached = Boolean(isSearching && pageCount >= TV_SEARCH_PAGE_LIMIT &&
    lastPage && lastPage.page < lastPage.total_pages);
  const searchingMore = Boolean(isSearching && pageCount > 0 && !isError &&
    (hasNextPage || query.isFetchingNextPage));
  const genreName = genresQuery.data?.find((item) => String(item.id) === genre)?.name;

  return {
    search,
    genre,
    setSearch: (value) => updateParam("q", value),
    setGenre: (value) => updateParam("genre", value),
    series,
    genresQuery,
    query,
    isSearching,
    searchingMore,
    limitReached,
    title: isSearching ? "Search Results" : genre
      ? genreName ? `${genreName} TV Series` : "Filtered TV Series"
      : "Popular TV Series",
  };
}
