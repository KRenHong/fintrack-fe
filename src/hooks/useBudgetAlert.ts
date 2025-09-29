import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BudgetProgress } from "@/types/domain";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";

export function useBudgetAlert(categoryId?: number, monthISO?: string) {
  const { notify } = useSnackbar();
  const { data } = useQuery({
    queryKey: ["budget-progress", categoryId, monthISO],
    queryFn: async () => {
      if (!categoryId || !monthISO) return null;
      const { data } = await api.get("/budgets/progress/", {
        params: { category: categoryId, month: monthISO + "-01" },
      });
      return data as BudgetProgress;
    },
    enabled: Boolean(categoryId && monthISO),
    refetchInterval: 15000, // 15s for "real-time" feel
  });

  useEffect(() => {
    if (!data) return;
    if (data.state === "over")
      notify("Budget breached for this month!", "error");
    else if (data.state === "warn")
      notify("You are over 80% of your budget", "warning");
  }, [data]);

  return data;
}
