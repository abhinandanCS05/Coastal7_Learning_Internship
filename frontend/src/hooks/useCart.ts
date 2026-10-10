import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import type { Cart } from "../types/api";

export function useCart(enabled = true) {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<Cart>("/cart");
      return data;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}
