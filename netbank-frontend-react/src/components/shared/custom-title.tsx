import { Typography } from '@mui/material'
import { Link } from 'react-router'

export const CustomTitle = ({ collapsed }: { collapsed: boolean }) => (
  <Link to="/" style={{ textDecoration: 'none' }}>
    {collapsed ? (
      <Typography variant="h6" color="primary">
        KB
      </Typography>
    ) : (
      <Typography variant="h6" color="primary">
        Kaba Bank
      </Typography>
    )}
  </Link>
)
