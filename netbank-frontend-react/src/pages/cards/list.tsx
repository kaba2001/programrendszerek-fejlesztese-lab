import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { List, ShowButton, useDataGrid } from "@refinedev/mui";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 2, minWidth: 300 },
  { field: "cardType", headerName: "Type", flex: 1, minWidth: 120 },
  {
    field: "isLocked",
    headerName: "Locked",
    flex: 1,
    minWidth: 100,
    renderCell: ({ value }) => (value ? "Yes" : "No"),
  },
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

export const CardList = () => {
  const { dataGridProps } = useDataGrid({});
  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  );
};
