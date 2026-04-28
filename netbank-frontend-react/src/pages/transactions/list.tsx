import { useInvalidate, useList, useNotification } from '@refinedev/core'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { DateField, List, NumberField, useDataGrid } from '@refinedev/mui'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { kyInstance } from '../../providers/data'

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

type SendFormValues = {
  fromAccountId: string
  recipientType: 'contact' | 'manual'
  contactId: string
  toAccountNumber: string
  amount: number
  description: string
}

export const TransactionList = () => {
  const [accountId, setAccountId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const { open: notify } = useNotification()

  const { query: accountsQuery } = useList({ resource: 'accounts' })
  const accounts = accountsQuery.data?.data ?? []

  const { query: contactsQuery } = useList({ resource: 'contacts' })
  const contacts = contactsQuery.data?.data ?? []

  const invalidate = useInvalidate()

  const { dataGridProps } = useDataGrid({
    filters: {
      permanent: accountId
        ? [{ field: 'accountId', operator: 'eq', value: accountId }]
        : [],
    },
    queryOptions: { enabled: !!accountId },
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SendFormValues>({
    defaultValues: {
      fromAccountId: '',
      recipientType: 'contact',
      contactId: '',
      toAccountNumber: '',
      amount: 0,
      description: '',
    },
  })

  const recipientType = watch('recipientType')

  const openDialog = () => {
    reset({
      fromAccountId: accountId,
      recipientType: 'contact',
      contactId: '',
      toAccountNumber: '',
      amount: 0,
      description: '',
    })
    setSendError(null)
    setDialogOpen(true)
  }

  const onSubmit = async (values: SendFormValues) => {
    setSendError(null)
    setSending(true)

    let toAccountNumber = values.toAccountNumber
    if (values.recipientType === 'contact') {
      const contact = contacts.find((c) => c.id === values.contactId)
      if (!contact) {
        setSendError('Please select a contact')
        setSending(false)
        return
      }
      toAccountNumber = contact.partnerAccountNumber as string
    }

    try {
      await kyInstance
        .post('transactions/send', {
          json: {
            fromAccountId: values.fromAccountId,
            toAccountNumber,
            amount: Number(values.amount),
            description: values.description,
          },
        })
        .json()

      setDialogOpen(false)
      invalidate({ resource: 'transactions', invalidates: ['list'] })
      notify?.({
        type: 'success',
        message: 'Transaction sent successfully',
      })
    } catch (err: unknown) {
      const httpErr = err as { response?: Response }
      let message = 'Transaction failed'
      if (httpErr?.response) {
        const text = await httpErr.response.text()
        try {
          const json = JSON.parse(text) as { message?: string }
          message = json.message ?? message
        } catch {
          // keep default message
        }
      }
      setSendError(message)
      notify?.({ type: 'error', message })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <List
        canCreate={false}
        headerButtons={
          accountId ? (
            <Button variant="contained" onClick={openDialog}>
              Send Money
            </Button>
          ) : undefined
        }
      >
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
        {accountId ? (
          <DataGrid {...dataGridProps} columns={columns} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6">Select an account to view transactions</Typography>
            <Typography variant="body2">
              Use the dropdown above to choose one of your accounts.
            </Typography>
          </Box>
        )}
      </List>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Money</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sendError && <Alert severity="error">{sendError}</Alert>}

            <Controller
              name="fromAccountId"
              control={control}
              rules={{ required: 'Source account is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.fromAccountId}>
                  <InputLabel>From Account</InputLabel>
                  <Select {...field} label="From Account">
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.accountNumber} ({account.currency}) — Balance:{' '}
                        {account.balance}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.fromAccountId && (
                    <FormHelperText>{errors.fromAccountId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <ToggleButtonGroup
              value={recipientType}
              exclusive
              onChange={(_, val) => val && setValue('recipientType', val)}
              size="small"
            >
              <ToggleButton value="contact">From Contacts</ToggleButton>
              <ToggleButton value="manual">Manual Account Number</ToggleButton>
            </ToggleButtonGroup>

            {recipientType === 'contact' ? (
              <Controller
                name="contactId"
                control={control}
                rules={{ required: 'Please select a contact' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.contactId}>
                    <InputLabel>Contact</InputLabel>
                    <Select {...field} label="Contact">
                      {contacts.map((contact) => (
                        <MenuItem key={contact.id} value={contact.id}>
                          {contact.partnerName} — {contact.partnerAccountNumber}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.contactId && (
                      <FormHelperText>{errors.contactId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            ) : (
              <Controller
                name="toAccountNumber"
                control={control}
                rules={{ required: 'Account number is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="To Account Number (IBAN)"
                    fullWidth
                    error={!!errors.toAccountNumber}
                    helperText={errors.toAccountNumber?.message}
                  />
                )}
              />
            )}

            <Controller
              name="amount"
              control={control}
              rules={{
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be positive' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  type="number"
                  fullWidth
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  inputProps={{ step: '0.01', min: '0.01' }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={sending}>
              {sending ? 'Sending…' : 'Send'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
