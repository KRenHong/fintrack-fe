import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Paper,
  Stack,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Create() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const [form, setForm] = useState({
    kind: "EX",
    amount: "",
    occurred_on: "",
    note: "",
  });

  const m = useMutation({
    mutationFn: async () => (await api.post("/transactions/", form)).data,
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
            onClick={() => m.mutate()}
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
