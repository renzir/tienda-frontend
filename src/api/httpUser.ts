const BASE_URL = import.meta.env.VITE_API_URL
import type { RegisterUserDTO } from '../types'

export const fetchUser = {
  register: async (data: RegisterUserDTO) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 400) throw new Error('Faltan campos obligatorios')
      if (response.status === 409) throw new Error('El email ya está registrado')
      throw new Error('Error al registrar usuario')
    }

    return response.json()
  },

  me: async () => {
    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('No autorizado')
    }

    return await response.json()
  },

  logout: async () => {
    await fetch(`${BASE_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      if (response.status === 401) throw new Error('Credenciales inválidas')
      throw new Error('Error al iniciar sesión')
    }

    return await response.json() 
  },
}
