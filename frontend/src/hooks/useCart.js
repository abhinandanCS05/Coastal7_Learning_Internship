import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useCart(enabled = true) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    enabled,
    staleTime: 30 * 1000,
  });
}
