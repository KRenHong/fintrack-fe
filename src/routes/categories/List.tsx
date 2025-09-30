import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Category } from "@/types/domain";
import { useState } from "react";
import {
  Paper,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import ColorPicker from "@/components/common/ColorPicker";

export default function Categories() {
  const qc = useQueryClient();
  const { notify } = useSnackbar();
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get("/categories/")).data,
  });

  const categories: Category[] = Array.isArray(data)
    ? data
    : data?.results ?? [];

  console.log("Fetched data:", data);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [form, setForm] = useState({ name: "", color: "#64748b" });

  const save = useMutation({
    mutationFn: async () =>
      editing
        ? (await api.patch(`/categories/${editing.id}/`, form)).data
        : (await api.post("/categories/", form)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
      setEditing(undefined);
      notify("Saved", "success");
    },
  });
  const del = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`/categories/${id}/`)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      notify("Deleted", "success");
    },
  });

  return (
    <Stack gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Categories
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Your categories
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setForm({ name: "", color: "#64748b" });
              setEditing(undefined);
              setOpen(true);
            }}
          >
            New
          </Button>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  <Chip
                    label={c.color}
                    sx={{ bgcolor: c.color, color: "#fff" }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setEditing(c);
                      setForm({ name: c.name, color: c.color });
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => del.mutate(c.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack gap={2}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
              fullWidth
            />
            <ColorPicker
              value={form.color}
              onChange={(c) => setForm({ ...form, color: c })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => save.mutate()}
            disabled={save.isPending}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
