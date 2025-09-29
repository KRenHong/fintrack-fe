export const fmtMoney = (v: string | number) =>
  Number(v).toLocaleString(undefined, { style: "currency", currency: "MYR" });
