import { LinearProgress, Box, Typography } from "@mui/material";

export default function ProgressBar({
  ratio,
  color,
  showPercent = true,
}: {
  ratio: number; // 0..1
  color?: string; // hex or CSS color
  showPercent?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(ratio * 100)));
  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 10,
          borderRadius: 6,
          "& .MuiLinearProgress-bar": color ? { backgroundColor: color } : {},
        }}
      />
      {showPercent && (
        <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
          {pct}%
        </Typography>
      )}
    </Box>
  );
}
