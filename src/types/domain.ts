export type Transaction = {
  id: number;
  kind: "IN" | "EX";
  amount: string;
  occurred_on: string;
  note?: string;
  category?: number | null;
};

export type Category = { id: number; name: string; color: string };

export type Budget = {
  id: number;
  category: number;
  month: string;
  limit: string;
};

export type BudgetProgress = {
  limit: string;
  spent: string;
  ratio: string;
  state: "ok" | "warn" | "over";
} | null;
