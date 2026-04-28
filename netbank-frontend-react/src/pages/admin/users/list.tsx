import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { DeleteButton, List, useDataGrid } from '@refinedev/mui'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 2, minWidth: 300 },
  { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 140 },
  { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 140 },
  { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
  { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    minWidth: 80,
    display: 'flex',
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => <DeleteButton hideText recordItemId={row.id} />,
  },
]

export const AdminUserList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'users',
    meta: { dataProviderName: 'admin' },
  })
  return (
    <List canCreate={false}>
      <DataGrid {...dataGridProps} columns={columns} disableColumnSorting hideFooter />
    </List>
  )
}
