import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Paper, Stack, Typography, TextField, Button } from "@mui/material";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";

export default function Settings() {
  const { notify } = useSnackbar();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/auth/users/me/")).data,
  });

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (me) {
      setDisplayName(me.display_name || "");
      setEmail(me.email || "");
    }
  }, [me]);

  const saveProfile = async () => {
    try {
      await api.patch("/profile/", { display_name: displayName });
      notify("Profile updated", "success");
    } catch {
      notify("Failed to update profile", "error");
    }
  };

  const changeEmail = async () => {
    try {
      await api.post("/auth/users/set_username/", {
        current_password: "",
        new_username: email,
      });
      notify("Email/username change requested", "info");
    } catch {
      notify("Failed to change email/username", "error");
    }
  };

  const changePassword = async (current: string, newp: string) => {
    try {
      await api.post("/auth/users/set_password/", {
        current_password: current,
        new_password: newp,
      });
      notify("Password changed", "success");
    } catch {
      notify("Failed to change password", "error");
    }
  };

  // very simple local state for password form
  const [pw, setPw] = useState({ current: "", newp: "" });

  return (
    <Stack gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Profile
      </Typography>

      <Paper sx={{ p: 2, maxWidth: 560 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Basic info
        </Typography>
        <Stack gap={2}>
          <TextField
            label="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button variant="contained" onClick={saveProfile}>
            Save profile
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, maxWidth: 560 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Email / Username
        </Typography>
        <Stack gap={2}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="outlined" onClick={changeEmail}>
            Change email
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, maxWidth: 560 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Password
        </Typography>
        <Stack gap={2}>
          <TextField
            label="Current password"
            type="password"
            value={pw.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
          />
          <TextField
            label="New password"
            type="password"
            value={pw.newp}
            onChange={(e) => setPw({ ...pw, newp: e.target.value })}
          />
          <Button
            variant="outlined"
            onClick={() => changePassword(pw.current, pw.newp)}
          >
            Change password
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
