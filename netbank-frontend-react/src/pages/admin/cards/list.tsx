import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { CreateButton, DeleteButton, List, useDataGrid } from '@refinedev/mui'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 2, minWidth: 300 },
  { field: 'cardType', headerName: 'Type', flex: 1, minWidth: 120 },
  {
    field: 'isLocked',
    headerName: 'Locked',
    flex: 1,
    minWidth: 100,
    renderCell: ({ value }) => (value ? 'Yes' : 'No'),
  },
  { field: 'accountId', headerName: 'Account ID', flex: 2, minWidth: 300 },
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

export const AdminCardList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'admin/cards',
    meta: { dataProviderName: 'admin' },
  })
  return (
    <List headerButtons={<CreateButton />}>
      <DataGrid {...dataGridProps} columns={columns} disableColumnSorting hideFooter />
    </List>
  )
}
