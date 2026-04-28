import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useGetIdentity, useNotification } from '@refinedev/core'
import { HamburgerMenu, type RefineThemedLayoutHeaderProps } from '@refinedev/mui'
import { useQueryClient } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ColorModeContext } from '../../contexts/color-mode'
import { kyInstance } from '../../providers/data'

type IUser = {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  avatar: string
}

type EditFormValues = {
  firstName: string
  lastName: string
}

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext)
  const { data: user } = useGetIdentity<IUser>()
  const { open: notify } = useNotification()
  const queryClient = useQueryClient()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditFormValues>()

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget)
  }

  const closeMenu = () => setMenuAnchor(null)

  const openEdit = () => {
    closeMenu()
    reset({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' })
    setEditOpen(true)
  }

  const onSubmit = async (values: EditFormValues) => {
    setSaving(true)
    try {
      await kyInstance.patch('users/me', { json: values }).json()
      await queryClient.invalidateQueries({
        queryKey: ['refine', 'getUserIdentity'],
      })
      notify?.({ type: 'success', message: 'Profile updated successfully' })
      setEditOpen(false)
    } catch (err: unknown) {
      const httpErr = err as { response?: Response }
      let message = 'Failed to update profile'
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
      setSaving(false)
    }
  }

  return (
    <>
      <AppBar position={sticky ? 'sticky' : 'relative'}>
        <Toolbar>
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <HamburgerMenu />
            <Stack
              direction="row"
              width="100%"
              justifyContent="flex-end"
              alignItems="center"
            >
              <IconButton
                color="inherit"
                onClick={() => {
                  setMode()
                }}
              >
                {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
              </IconButton>

              {(user?.avatar || user?.name) && (
                <Stack
                  direction="row"
                  gap="16px"
                  alignItems="center"
                  justifyContent="center"
                  onClick={openMenu}
                  sx={{ cursor: 'pointer', ml: 1 }}
                >
                  {user?.name && (
                    <Typography
                      sx={{ display: { xs: 'none', sm: 'inline-block' } }}
                      variant="subtitle2"
                    >
                      {user.name}
                    </Typography>
                  )}
                  <Avatar src={user?.avatar} alt={user?.name} />
                </Stack>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={openEdit}>
          <ListItemIcon>
            <PersonOutlineOutlined fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
      </Menu>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              {...register('firstName', { required: 'First name is required' })}
              label="First Name"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              {...register('lastName', { required: 'Last name is required' })}
              label="Last Name"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
