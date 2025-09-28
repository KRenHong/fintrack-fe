import { Transaction } from "@/types/domain";
import {
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function Table({ rows }: { rows: Transaction[] }) {
  return (
    <MuiTable size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Kind</TableCell>
          <TableCell align="right">Amount</TableCell>
          <TableCell>Note</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} hover>
            <TableCell>{r.occurred_on}</TableCell>
            <TableCell>{r.kind === "EX" ? "Expense" : "Income"}</TableCell>
            <TableCell align="right">{r.amount}</TableCell>
            <TableCell>{r.note}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  );
}
