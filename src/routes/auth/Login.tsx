import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { setTokens } from "@/lib/auth";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/jwt/create/", {
        username,
        password,
      });
      setTokens(data.access, data.refresh);
      nav(loc.state?.from?.pathname || "/transactions");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <Box display="grid" sx={{ placeItems: "center", minHeight: "80vh" }}>
      <Paper sx={{ p: 4, width: 380 }} elevation={2}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Welcome back
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack component="form" gap={2} onSubmit={onSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" type="submit" size="large">
            Sign in
          </Button>
          <Typography variant="body2">
            No account? <Link to="/register">Create one</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
