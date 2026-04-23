import { Stack, Typography } from '@mui/material'
import { useShow } from '@refinedev/core'
import { Show, TextFieldComponent as TextField } from '@refinedev/mui'

export const ContactShow = () => {
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
          Partner Name
        </Typography>
        <TextField value={record?.partnerName} />
        <Typography variant="body2" fontWeight="bold">
          Partner Account Number
        </Typography>
        <TextField value={record?.partnerAccountNumber} />
      </Stack>
    </Show>
  )
}
