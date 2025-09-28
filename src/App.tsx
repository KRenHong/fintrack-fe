import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/routes/auth/Login";
import Register from "@/routes/auth/Register";
import List from "@/routes/transactions/List";
import Create from "@/routes/transactions/Create";
import Edit from "@/routes/transactions/Edit";
import AppShell from "@/components/layout/AppShell";
import PrivateRoute from "@/components/layout/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <PrivateRoute>
            <AppShell />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/transactions" replace />} />
        <Route path="/transactions" element={<List />} />
        <Route path="/transactions/new" element={<Create />} />
        <Route path="/transactions/:id" element={<Edit />} />
      </Route>
    </Routes>
  );
}
