import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Budget } from "@/types/domain";
import {
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  Link as MuiLink,
  Divider,
  useTheme,
} from "@mui/material";
import MonthPicker from "@/components/budgets/MonthPicker";
import ProgressBar from "@/components/budgets/ProgressBar";
import { fmtMoney } from "@/lib/format";
import { useState, useMemo } from "react";
import { useBudgetAlert } from "@/hooks/useBudgetAlert";
import { Link } from "react-router-dom";
import { useCategories } from "@/lib/categories";

// DRF pagination → array
const asArray = <T,>(data: any): T[] =>
  Array.isArray(data) ? data : data?.results ?? [];

export default function BudgetDashboard() {
  const qc = useQueryClient();
  const theme = useTheme();

  // Categories (fast hook with cache/hydration)
  const { list: categories } = useCategories();
  const catName = (id: number) =>
    categories.find((c) => c.id === id)?.name || `#${id}`;
  const catColor = (id: number) =>
    categories.find((c) => c.id === id)?.color || undefined;

  // Builder state (left)
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [limit, setLimit] = useState("");

  // Filters (right)
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM

  // Selected (category, month) progress
  const progress = useBudgetAlert(
    typeof categoryId === "number" ? categoryId : undefined,
    month
  );

  // Progress bar color
  const stateColor =
    progress?.state === "over"
      ? theme.palette.error.main
      : progress?.state === "warn"
      ? theme.palette.warning.main
      : (categoryId &&
          typeof categoryId === "number" &&
          catColor(categoryId)) ||
        theme.palette.primary.main;

  // Create/Update budget
  const save = useMutation({
    mutationFn: async () =>
      (
        await api.post("/budgets/", {
          category: categoryId,
          month: month + "-01",
          limit,
        })
      ).data as Budget,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
      qc.invalidateQueries({ queryKey: ["budget-progress"] });
    },
  });

  // Budgets list
  const { data: budgetsData } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => asArray<Budget>((await api.get("/budgets/")).data),
    staleTime: 10_000,
    retry: 1,
  });
  const budgets: Budget[] = Array.isArray(budgetsData) ? budgetsData : [];
  const budgetsForMonth = useMemo(
    () => budgets.filter((b) => (b.month || "").slice(0, 7) === month),
    [budgets, month]
  );

  // Per-row live progress
  const progressQueries = useQueries({
    queries: budgetsForMonth.map((b) => ({
      queryKey: ["budget-progress", b.category, b.month],
      queryFn: async () =>
        (
          await api.get("/budgets/progress/", {
            params: { category: b.category, month: b.month },
          })
        ).data as {
          limit: string;
          spent: string;
          ratio: string;
          state: "ok" | "warn" | "over";
        } | null,
      staleTime: 15_000,
      refetchInterval: 15_000,
    })),
  });

  return (
    <Stack gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Budgets
      </Typography>

      {/* ---------- Top row: Left = Create/Update, Right = Filters ---------- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* LEFT: Create/Update */}
        <Paper sx={{ p: 2, height: "100%" }}>
          <Stack gap={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              gap={2}
              alignItems={{ sm: "center" }}
            >
              <TextField
                select
                label="Category"
                sx={{ minWidth: 220 }}
                value={categoryId}
                onChange={(e) => {
                  const v = e.target.value;
                  setCategoryId(v === "" ? "" : Number(v));
                }}
              >
                <MenuItem value="" disabled>
                  Select a category
                </MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* Link to manage categories */}
              <MuiLink component={Link} to="/categories" underline="hover">
                Manage categories
              </MuiLink>

              <TextField
                label="Monthly limit (MYR)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                sx={{ minWidth: 220 }}
              />

              <Button
                variant="contained"
                onClick={() => save.mutate()}
                disabled={save.isPending || !categoryId || !limit}
              >
                Save budget
              </Button>
            </Stack>

            {/* Preview for selected pair */}
            <Divider />
            <Stack gap={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Progress (selected)
              </Typography>
              {progress ? (
                <Stack direction="row" alignItems="center" gap={2}>
                  <Chip
                    size="small"
                    label={catName(categoryId as number) || "—"}
                    sx={{
                      bgcolor: catColor(categoryId as number) || "#e5e7eb",
                      color: "#fff",
                    }}
                  />
                  <Box flex={1}>
                    <ProgressBar
                      ratio={Number(progress.ratio)}
                      color={stateColor}
                      showPercent
                    />
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2">
                  No budget configured for this category & month.
                </Typography>
              )}
            </Stack>
          </Stack>
        </Paper>

        {/* RIGHT: Filters */}
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Filters
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems={{ sm: "center" }}
          >
            <MonthPicker value={month} onChange={setMonth} />
          </Stack>
        </Paper>
      </Box>

      {/* ---------- Budgets list for the selected month ---------- */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Budgets for {month}
          </Typography>
          <Box />
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Limit</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgetsForMonth.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2">
                    No budgets set for this month.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              budgetsForMonth.map((b, i) => {
                const p = progressQueries[i]?.data; // {limit, spent, ratio, state} | null
                const barColor =
                  p?.state === "over"
                    ? theme.palette.error.main
                    : p?.state === "warn"
                    ? theme.palette.warning.main
                    : catColor(b.category) || theme.palette.primary.main;

                return (
                  <TableRow key={b.id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Chip
                          size="small"
                          sx={{
                            bgcolor: catColor(b.category) || "#e5e7eb",
                            color: "#fff",
                          }}
                          label=" "
                        />
                        {catName(b.category)}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {p ? fmtMoney(p.limit) : fmtMoney(b.limit)}
                    </TableCell>
                    <TableCell>{p ? fmtMoney(p.spent) : "—"}</TableCell>
                    <TableCell>
                      {p ? (
                        <ProgressBar
                          ratio={Number(p.ratio)}
                          color={barColor}
                          showPercent
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {p ? (
                        <Chip
                          size="small"
                          label={
                            p.state === "over"
                              ? "Over"
                              : p.state === "warn"
                              ? "Warning"
                              : "OK"
                          }
                          color={
                            p.state === "over"
                              ? "error"
                              : p.state === "warn"
                              ? "warning"
                              : "success"
                          }
                        />
                      ) : (
                        <Chip size="small" label="No data" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
