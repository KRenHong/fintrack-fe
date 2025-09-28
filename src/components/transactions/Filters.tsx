import { Stack, TextField, MenuItem } from "@mui/material";

export type Filters = {
  q: string;
  kind: "" | "IN" | "EX";
  min?: string;
  max?: string;
};
export default function Filters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (f: Filters) => void;
}) {
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
        onChange={(e) => onChange({ ...value, kind: e.target.value as any })}
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
    </Stack>
  );
}
