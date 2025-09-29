import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, asArray } from "@/lib/api";
import { Category, Transaction } from "@/types/domain";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import Filters, { Filters as F } from "@/components/transactions/Filters";
import Table from "@/components/transactions/Table";
import { Link } from "react-router-dom";

export default function List() {
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/");
      return asArray<Category>(data);
    },
    staleTime: 15_000,
    retry: 1,
  });

  // ✅ always an array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const nameById = (id?: number | null) =>
    categories.find((c) => c.id === id)?.name ?? "";

  const [filters, setFilters] = useState<F>({ q: "", kind: "" });

  const params = useMemo(() => {
    const p: any = { ordering: "-occurred_on" };
    if (filters.q) p.search = filters.q;
    if (filters.kind) p.kind = filters.kind;
    if (filters.min) p.min_date = filters.min;
    if (filters.max) p.max_date = filters.max;
    if (filters.category) p.category_id = filters.category; // backend filter
    return p;
  }, [filters]);

  // transactions page (could be paginated object)
  const { data: txPage } = useQuery({
    queryKey: ["transactions", params],
    queryFn: async () => (await api.get("/transactions/", { params })).data,
  });

  // normalize to rows + attach category_name
  const rows = useMemo(
    () =>
      asArray<Transaction>(txPage).map((t) => ({
        ...t,
        category_name: nameById(t.category as number),
      })),
    [txPage, categories]
  );

  return (
    <Stack gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Transactions
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Filters value={filters} onChange={setFilters} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Latest
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={Link} to="/transactions/new" variant="contained">
              Add Transaction
            </Button>
            {/* <Button
              href={
                (import.meta as any).env.VITE_API_URL + "/transactions/export/"
              }
            >
              Export CSV
            </Button> */}
          </Stack>
        </Box>

        <Table rows={rows} />
      </Paper>
    </Stack>
  );
}
