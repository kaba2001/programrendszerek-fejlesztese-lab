import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
  CreateButton,
  List,
  ShowButton,
  useDataGrid,
} from '@refinedev/mui'
import { RefreshDeleteButton } from '../../components/shared/delete-button'

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
        <RefreshDeleteButton hideText recordItemId={row.id} />
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
