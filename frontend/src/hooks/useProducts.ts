import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { ProductFilters, ProductPage } from "../types/api";

export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery<ProductPage>({
    queryKey: ["products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<ProductPage>("/products", {
        params: {
          ...filters,
          page: pageParam,
          page_size: 20,
        },
      });

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}
