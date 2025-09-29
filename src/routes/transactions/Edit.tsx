import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, asArray } from "@/lib/api";
import {
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Category } from "@/types/domain";

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => (await api.get(`/transactions/${id}/`)).data,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/");
      return asArray(data) as Category[];
    },
  });

  const [form, setForm] = useState({
    kind: "EX",
    amount: "",
    occurred_on: "",
    note: "",
    category: "" as number | "",
  });

  useEffect(() => {
    if (data)
      setForm({
        kind: data.kind,
        amount: data.amount,
        occurred_on: data.occurred_on,
        note: data.note ?? "",
        category: (data.category ?? "") as any,
      });
  }, [data]);

  const save = useMutation({
    mutationFn: async () =>
      (await api.patch(`/transactions/${id}/`, form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      nav("/transactions");
    },
  });

  return (
    <Paper sx={{ p: 3, maxWidth: 560 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Edit transaction
      </Typography>
      <Stack gap={2}>
        <TextField
          select
          label="Kind"
          value={form.kind}
          onChange={(e) => setForm({ ...form, kind: e.target.value })}
        >
          <MenuItem value="EX">Expense</MenuItem>
          <MenuItem value="IN">Income</MenuItem>
        </TextField>
        <TextField
          select
          label="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: Number(e.target.value) })
          }
        >
          <MenuItem value="">None</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <TextField
          type="date"
          label="Date"
          InputLabelProps={{ shrink: true }}
          value={form.occurred_on}
          onChange={(e) => setForm({ ...form, occurred_on: e.target.value })}
        />
        <TextField
          label="Note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            onClick={() => save.mutate()}
            disabled={save.isPending}
          >
            Save
          </Button>
          <Button variant="text" onClick={() => nav(-1)}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
