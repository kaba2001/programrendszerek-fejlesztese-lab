import { Stack, Typography } from '@mui/material'
import { useShow } from '@refinedev/core'
import {
  BooleanField,
  Show,
  TextFieldComponent as TextField,
} from '@refinedev/mui'

export const CardShow = () => {
  const { query } = useShow()
  const { data, isLoading } = query
  const record = data?.data

  return (
    <Show isLoading={isLoading}>
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
