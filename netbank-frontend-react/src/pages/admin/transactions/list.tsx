import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { DateField, List, NumberField, useDataGrid } from "@refinedev/mui";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 2, minWidth: 300 },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    minWidth: 120,
    renderCell: ({ value }) => <NumberField value={value ?? ""} />,
  },
  { field: "description", headerName: "Description", flex: 2, minWidth: 200 },
  { field: "fromAccountId", headerName: "From", flex: 2, minWidth: 300 },
  { field: "toAccountNumber", headerName: "To", flex: 2, minWidth: 220 },
  {
    field: "createdAt",
    headerName: "Date",
    flex: 1,
    minWidth: 160,
    renderCell: ({ value }) => value ? <DateField value={value} /> : "-",
  },
];

export const AdminTransactionList = () => {
  const { dataGridProps } = useDataGrid({ resource: "transactions", meta: { dataProviderName: "admin" } });
  return (
    <List canCreate={false}>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
