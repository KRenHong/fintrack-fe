import { TextField } from "@mui/material";
export default function MonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <TextField
      type="month"
      label="Month"
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
