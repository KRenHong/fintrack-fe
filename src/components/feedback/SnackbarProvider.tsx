import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

type Ctx = {
  notify: (
    msg: string,
    severity?: "success" | "info" | "warning" | "error"
  ) => void;
};
const Ctx = createContext<Ctx>({ notify: () => {} });

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [sev, setSev] = useState<"success" | "info" | "warning" | "error">(
    "info"
  );
  const notify: Ctx["notify"] = (m, s = "info") => {
    setMsg(m);
    setSev(s);
    setOpen(true);
  };
  return (
    <Ctx.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <Alert variant="filled" severity={sev} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
    </Ctx.Provider>
  );
}
export const useSnackbar = () => useContext(Ctx);
