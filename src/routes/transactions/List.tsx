import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Transaction } from "@/types/domain";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import Filters, { Filters as F } from "@/components/transactions/Filters";
import Table from "@/components/transactions/Table";

export default function List() {
  const [filters, setFilters] = useState<F>({ q: "", kind: "" });

  const params = useMemo(() => {
    const p: any = { ordering: "-occurred_on" };
    if (filters.q) p.search = filters.q;
    if (filters.kind) p.kind = filters.kind;
    if (filters.min) p.min_date = filters.min;
    if (filters.max) p.max_date = filters.max;
    return p;
  }, [filters]);

  const { data } = useQuery({
    queryKey: ["transactions", params],
    queryFn: async () =>
      (await api.get("/transactions/", { params })).data as {
        results: Transaction[];
      },
  });

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
          <Button
            href={
              (import.meta as any).env.VITE_API_URL + "/transactions/export/"
            }
          >
            Export CSV
          </Button>
        </Box>
        <Table rows={data?.results ?? []} />
      </Paper>
    </Stack>
  );
}
