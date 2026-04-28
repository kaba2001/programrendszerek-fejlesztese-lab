import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
  CreateButton,
  DeleteButton,
  List,
  ShowButton,
  useDataGrid,
} from '@refinedev/mui'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 2, minWidth: 300 },
  { field: 'partnerName', headerName: 'Name', flex: 2, minWidth: 200 },
  {
    field: 'partnerAccountNumber',
    headerName: 'Account Number',
    flex: 2,
    minWidth: 220,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    sortable: false,
    minWidth: 120,
    display: 'flex',
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <>
        <ShowButton hideText recordItemId={row.id} />
        <DeleteButton hideText recordItemId={row.id} />
      </>
    ),
  },
]

export const ContactList = () => {
  const { dataGridProps } = useDataGrid({})
  return (
    <List headerButtons={<CreateButton />}>
      <DataGrid {...dataGridProps} columns={columns} disableColumnSorting hideFooter />
    </List>
  )
}
