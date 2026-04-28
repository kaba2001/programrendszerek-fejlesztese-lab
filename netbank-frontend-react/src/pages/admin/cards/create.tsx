import { Box, MenuItem, TextField } from '@mui/material'
import { Create } from '@refinedev/mui'
import { useForm } from '@refinedev/react-hook-form'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { kyInstance } from '../../../providers/data'

export const AdminCardCreate = () => {
  const {
    saveButtonProps,
    control,
    formState: { errors },
  } = useForm()

  const [accounts, setAccounts] = useState<any[]>([])
  useEffect(() => {
    kyInstance.get('admin/accounts').json<any[]>().then(setAccounts).catch(() => {})
  }, [])

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Controller
          name="accountId"
          control={control}
          rules={{ required: 'Account is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Account"
              error={!!errors.accountId}
              helperText={errors.accountId?.message as string}
              fullWidth
            >
              {accounts.map((account) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.accountNumber} ({account.currency})
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="cardType"
          control={control}
          rules={{ required: 'Card type is required' }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Card Type"
              error={!!errors.cardType}
              helperText={errors.cardType?.message as string}
              fullWidth
            >
              <MenuItem value="VIRTUAL">Virtual</MenuItem>
              <MenuItem value="PHYSICAL">Physical</MenuItem>
            </TextField>
          )}
        />
      </Box>
    </Create>
  )
}
