import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Budget } from "@/types/domain";

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async () => (await api.get("/budgets/")).data as Budget[],
  });
}
