import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/users/", {
        username,
        email,
        password,
        re_password: password,
      });
      nav("/login");
    } catch (err: any) {
      setError("Registration failed");
    }
  };

  return (
    <Box display="grid" sx={{ placeItems: "center", minHeight: "80vh" }}>
      <Paper sx={{ p: 4, width: 420 }} elevation={2}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Create account
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
            required
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
          <TextField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          <Button variant="contained" type="submit" size="large">
            Register
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
