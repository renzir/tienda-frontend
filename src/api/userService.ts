import { AUTH_KEYS } from '../config/auth'
import type { RegisterUserDTO, User } from '../types'
import { fetchUser } from './httpUser'

export const userService = {
  /**
   * Realiza el login. El token se gestiona vía cookies por el backend.
   */
  login: async (email: string, password: string) => {
    const response = await fetchUser.login({ email, password })

    return response
  },

  /**
   * Cierra sesión en el backend y limpia local storage.
   */
  logout: async () => {
    try {
      await fetchUser.logout()
    } finally {
      localStorage.removeItem(AUTH_KEYS.USER)
    }
  },

  /**
   * Obtiene el usuario actual.
   */
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(AUTH_KEYS.USER)
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  /**
   * Registra un nuevo usuario.
   */
  register: async (data: RegisterUserDTO) => {
    return await fetchUser.register(data)
  },

  /**
   * Obtiene el usuario actual desde el backend.
   */
  me: async () => {
    return await fetchUser.me()
  },
}
