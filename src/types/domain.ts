export type Transaction = {
  id: number;
  kind: "IN" | "EX";
  amount: string;
  occurred_on: string; // ISO date
  note?: string;
};
