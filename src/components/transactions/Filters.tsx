// src/components/transactions/Filters.tsx
import { useQuery } from "@tanstack/react-query";
import { api, asArray } from "@/lib/api";
import { Category } from "@/types/domain";
import { Stack, TextField, MenuItem } from "@mui/material";

export type Filters = {
  q: string;
  kind: "" | "IN" | "EX";
  min?: string;
  max?: string;
  category?: number | "";
};

export default function Filters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/");
      return asArray<Category>(data);
    },
    retry: 1,
    staleTime: 15_000,
  });

  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData
    : [];

  return (
    <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
      <TextField
        label="Search note"
        value={value.q}
        onChange={(e) => onChange({ ...value, q: e.target.value })}
      />
      <TextField
        select
        label="Kind"
        value={value.kind}
        onChange={(e) =>
          onChange({ ...value, kind: e.target.value as Filters["kind"] })
        }
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="EX">Expense</MenuItem>
        <MenuItem value="IN">Income</MenuItem>
      </TextField>
      <TextField
        type="date"
        label="From"
        InputLabelProps={{ shrink: true }}
        value={value.min || ""}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
      />
      <TextField
        type="date"
        label="To"
        InputLabelProps={{ shrink: true }}
        value={value.max || ""}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
      />
      <TextField
        select
        label="Category"
        value={value.category ?? ""}
        onChange={(e) =>
          onChange({
            ...value,
            category: e.target.value ? Number(e.target.value) : "",
          })
        }
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All</MenuItem>
        {categories.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
