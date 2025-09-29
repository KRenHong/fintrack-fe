import { Stack, Chip, Typography } from "@mui/material";

const COLOR_OPTIONS = [
  "#EF4444", // red
  "#F97316", // orange
  "#EAB308", // yellow
  "#22C55E", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#64748b", // gray
];

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <Stack gap={1}>
      <Typography variant="body2" fontWeight={600}>
        Pick a color
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {COLOR_OPTIONS.map((c) => (
          <Chip
            key={c}
            onClick={() => onChange(c)}
            sx={{
              bgcolor: c,
              color: "#fff",
              cursor: "pointer",
              border: value === c ? "2px solid black" : "none",
              width: 40,
              height: 40,
              "& .MuiChip-label": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              },
            }}
            label={value === c ? "✓" : ""}
          />
        ))}
      </Stack>
    </Stack>
  );
}
