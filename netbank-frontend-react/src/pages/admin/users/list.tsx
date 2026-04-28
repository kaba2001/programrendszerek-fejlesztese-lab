import { useNotification } from '@refinedev/core'
import { useQueryClient } from '@tanstack/react-query'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { List, useDataGrid } from '@refinedev/mui'
import { RefreshDeleteButton } from '../../../components/shared/delete-button'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ManageAccountsOutlined from '@mui/icons-material/ManageAccountsOutlined'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import CheckIcon from '@mui/icons-material/Check'
import { useState } from 'react'
import { kyInstance } from '../../../providers/data'

type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'

const ALL_STATUSES: UserStatus[] = ['PENDING', 'ACTIVE', 'SUSPENDED']

const StatusChangeButton = ({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: UserStatus
}) => {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  const [loading, setLoading] = useState(false)
  const { open: notify } = useNotification()
  const queryClient = useQueryClient()

  const changeStatus = async (status: UserStatus) => {
    setAnchor(null)
    if (status === currentStatus) return
    setLoading(true)
    try {
      await kyInstance
        .patch(`admin/users/${id}/status`, { json: { status } })
        .json()
      notify?.({ type: 'success', message: `User status changed to ${status}` })
      await queryClient.invalidateQueries()
    } catch (err: unknown) {
      const httpErr = err as { response?: Response }
      let message = 'Failed to update user status'
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
    <>
      <IconButton
        size="small"
        disabled={loading}
        title="Change Status"
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <ManageAccountsOutlined fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {ALL_STATUSES.map((status) => (
          <MenuItem
            key={status}
            onClick={() => changeStatus(status)}
            selected={status === currentStatus}
          >
            {status === currentStatus && (
              <ListItemIcon>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
            {status}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

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
    minWidth: 120,
    display: 'flex',
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) => (
      <>
        <StatusChangeButton id={row.id} currentStatus={row.status} />
        <RefreshDeleteButton hideText recordItemId={row.id} />
      </>
    ),
  },
]

export const AdminUserList = () => {
  const { dataGridProps } = useDataGrid({
    resource: 'users',
    meta: { dataProviderName: 'admin' },
  })
  return (
    <List canCreate={false}>
      <DataGrid
        {...dataGridProps}
        columns={columns}
        disableColumnSorting
        hideFooter
      />
    </List>
  )
}
