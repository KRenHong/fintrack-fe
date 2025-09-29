import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, asArray } from "@/lib/api";
import {
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Category } from "@/types/domain";

export default function Create() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [form, setForm] = useState({
    kind: "EX",
    amount: "",
    occurred_on: "",
    note: "",
    category: "" as number | "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories/");
      return asArray(data) as Category[];
    },
  });

  const m = useMutation({
    mutationFn: async (data: typeof form) =>
      (await api.post("/transactions/", data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      nav("/transactions");
    },
  });

  return (
    <Paper sx={{ p: 3, maxWidth: 560 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Add transaction
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
          type="number"
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
            onClick={() =>
              m.mutate({
                ...form,
                amount: form.amount
                  ? parseFloat(form.amount).toFixed(2)
                  : "0.00",
              })
            }
            disabled={m.isPending}
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
