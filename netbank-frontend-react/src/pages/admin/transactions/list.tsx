import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { DateField, List, NumberField, useDataGrid } from '@refinedev/mui'
import { useEffect, useState } from 'react'
import { kyInstance } from '../../../providers/data'

export const AdminTransactionList = () => {
  const [accounts, setAccounts] = useState<any[]>([])

  useEffect(() => {
    kyInstance.get('admin/accounts').json<any[]>().then(setAccounts).catch(() => {})
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 2, minWidth: 300 },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      minWidth: 120,
      renderCell: ({ value }) => <NumberField value={value ?? ''} />,
    },
    { field: 'transactionType', headerName: 'Type', flex: 1, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
    {
      field: 'accountId',
      headerName: 'Account',
      flex: 2,
      minWidth: 200,
      renderCell: ({ value }) => {
        const account = accounts.find((a) => a.id === value)
        return account?.accountNumber ?? value
      },
    },
    { field: 'partnerAccountNumber', headerName: 'Partner', flex: 2, minWidth: 220 },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 200 },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 1,
      minWidth: 160,
      renderCell: ({ value }) => (value ? <DateField value={value} /> : '-'),
    },
  ]

  const { dataGridProps } = useDataGrid({
    resource: 'admin/transactions',
    meta: { dataProviderName: 'admin' },
  })

  return (
    <List canCreate={false}>
      <DataGrid {...dataGridProps} columns={columns} disableColumnSorting hideFooter />
    </List>
  )
}
