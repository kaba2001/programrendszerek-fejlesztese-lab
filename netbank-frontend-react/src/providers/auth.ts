import type { AuthProvider } from '@refinedev/core'
import { API_URL, ROLE_KEY, TOKEN_KEY } from './constants'

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return {
          success: false,
          error: {
            name: 'LoginError',
            message: 'Invalid email or password',
          },
        }
      }

      const data = await response.json()
      localStorage.setItem(TOKEN_KEY, data.token)

      return { success: true, redirectTo: '/' }
    } catch {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: 'An error occurred during login',
        },
      }
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
    return { success: true, redirectTo: '/login' }
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      return { authenticated: true }
    }
    return { authenticated: false, redirectTo: '/login' }
  },

  getPermissions: async () => localStorage.getItem(ROLE_KEY),

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return null

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) return null

      const user = await response.json()
      localStorage.setItem(ROLE_KEY, user.role)
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`,
      }
    } catch {
      return null
    }
  },

  onError: async (error) => {
    if (error?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      return { logout: true, redirectTo: '/login' }
    }
    return { error }
  },
}
