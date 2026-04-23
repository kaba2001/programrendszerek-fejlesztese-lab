import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, ShowButton, useDataGrid } from "@refinedev/mui";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 2, minWidth: 300 },
  {
    field: "accountNumber",
    headerName: "Account Number",
    flex: 2,
    minWidth: 220,
  },
  {
    field: "balance",
    headerName: "Balance",
    type: "number",
    flex: 1,
    minWidth: 120,
  },
  { field: "currency", headerName: "Currency", flex: 1, minWidth: 100 },
  { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    minWidth: 80,
    display: "flex",
    align: "right",
    headerAlign: "right",
    renderCell: ({ row }) => <ShowButton hideText recordItemId={row.id} />,
  },
];

export const AccountList = () => {
  const { dataGridProps } = useDataGrid({});
  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
