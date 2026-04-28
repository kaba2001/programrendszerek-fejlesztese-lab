import { useNotification } from '@refinedev/core'
import { useQueryClient } from '@tanstack/react-query'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { CreateButton, List, useDataGrid } from '@refinedev/mui'
import { RefreshDeleteButton } from '../../../components/shared/delete-button'
import IconButton from '@mui/material/IconButton'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useState } from 'react'
import { kyInstance } from '../../../providers/data'

const LockToggleButton = ({
  id,
  isLocked,
}: {
  id: string
  isLocked: boolean
}) => {
  const [loading, setLoading] = useState(false)
  const { open: notify } = useNotification()
  const queryClient = useQueryClient()

  const toggle = async () => {
    setLoading(true)
    try {
      await kyInstance
        .patch(`admin/cards/${id}/status`, { json: { isLocked: !isLocked } })
        .json()
      notify?.({
        type: 'success',
        message: `Card ${!isLocked ? 'locked' : 'unlocked'} successfully`,
      })
      await queryClient.invalidateQueries()
    } catch (err: unknown) {
      const httpErr = err as { response?: Response }
      let message = 'Failed to update card status'
      if (httpErr?.response) {
        const text = await httpErr.response.text()
        try {
          const json = JSON.parse(text) as { message?: string }
          message = json.message ?? message
        } catch {
          // keep default message
        }
      }
      notify?.({ type: 'error', message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <IconButton
      onClick={toggle}
      disabled={loading}
      size="small"
      title={isLocked ? 'Unlock Card' : 'Lock Card'}
    >
      {isLocked ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
    </IconButton>
  )
}

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
    minWidth: 120,
    display: 'flex',
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <>
        <LockToggleButton id={row.id} isLocked={row.isLocked} />
        <RefreshDeleteButton hideText recordItemId={row.id} />
      </>
    ),
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
