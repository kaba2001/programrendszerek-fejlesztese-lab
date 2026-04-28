import { Stack, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import { useNotification, useShow } from '@refinedev/core'
import {
  BooleanField,
  Show,
  TextFieldComponent as TextField,
} from '@refinedev/mui'
import { useState } from 'react'
import { kyInstance } from '../../providers/data'

export const CardShow = () => {
  const { query } = useShow()
  const { data, isLoading } = query
  const record = data?.data
  const [toggling, setToggling] = useState(false)
  const { open: notify } = useNotification()

  const toggleLock = async () => {
    if (!record) return
    setToggling(true)
    try {
      await kyInstance
        .patch(`cards/${record.id}/status`, {
          json: { isLocked: !record.isLocked },
        })
        .json()
      await query.refetch()
      notify?.({
        type: 'success',
        message: `Card ${!record.isLocked ? 'locked' : 'unlocked'} successfully`,
      })
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
      setToggling(false)
    }
  }

  return (
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button
            variant="outlined"
            onClick={toggleLock}
            disabled={toggling || !record}
          >
            {record?.isLocked ? 'Unlock Card' : 'Lock Card'}
          </Button>
        </>
      )}
    >
      <Stack gap={2}>
        <Typography variant="body2" fontWeight="bold">
          ID
        </Typography>
        <TextField value={record?.id} />
        <Typography variant="body2" fontWeight="bold">
          Card Type
        </Typography>
        <TextField value={record?.cardType} />
        <Typography variant="body2" fontWeight="bold">
          Locked
        </Typography>
        <BooleanField value={record?.isLocked} />
        <Typography variant="body2" fontWeight="bold">
          Account ID
        </Typography>
        <TextField value={record?.accountId} />
      </Stack>
    </Show>
  )
}
