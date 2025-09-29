// components/transactions/Table.tsx
import {
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Transaction } from "@/types/domain";

type Row = Transaction & { category_name?: string };

export default function Table({ rows }: { rows: Row[] }) {
  return (
    <MuiTable size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Kind</TableCell>
          <TableCell>Category</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Note</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} hover>
            <TableCell>{r.occurred_on}</TableCell>
            <TableCell>{r.kind === "EX" ? "Expense" : "Income"}</TableCell>
            <TableCell>{r.category_name || "—"}</TableCell>
            <TableCell align="right">{r.amount}</TableCell>
            <TableCell>{r.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  );
}
