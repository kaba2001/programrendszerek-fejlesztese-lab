import { useList } from '@refinedev/core'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { DateField, List, NumberField, useDataGrid } from '@refinedev/mui'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useState } from 'react'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 2, minWidth: 300 },
  {
    field: 'amount',
    headerName: 'Amount',
    flex: 1,
    minWidth: 120,
    renderCell: ({ value }) => <NumberField value={value ?? ''} />,
  },
  { field: 'description', headerName: 'Description', flex: 2, minWidth: 200 },
  { field: 'fromAccountId', headerName: 'From', flex: 2, minWidth: 300 },
  { field: 'toAccountNumber', headerName: 'To', flex: 2, minWidth: 220 },
  {
    field: 'createdAt',
    headerName: 'Date',
    flex: 1,
    minWidth: 160,
    renderCell: ({ value }) => (value ? <DateField value={value} /> : '-'),
  },
]

export const TransactionList = () => {
  const [accountId, setAccountId] = useState('')

  const { query: accountsQuery } = useList({ resource: 'accounts' })
  const accounts = accountsQuery.data?.data ?? []

  const { dataGridProps } = useDataGrid({
    filters: {
      permanent: accountId
        ? [{ field: 'accountId', operator: 'eq', value: accountId }]
        : [],
    },
    queryOptions: { enabled: !!accountId },
  })

  return (
    <List canCreate={false}>
      <FormControl sx={{ mb: 2, minWidth: 300 }}>
        <InputLabel>Account</InputLabel>
        <Select
          value={accountId}
          label="Account"
          onChange={(e) => setAccountId(e.target.value)}
        >
          {accounts.map((account) => (
            <MenuItem key={account.id} value={account.id}>
              {account.accountNumber} ({account.currency})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DataGrid {...dataGridProps} columns={columns} />
    </List>
  )
}
