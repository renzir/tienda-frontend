import { describe, expect, it, vi, beforeEach } from 'vitest'
import { userService } from '../userService'
import { fetchUser } from '../httpUser'
import { AUTH_KEYS } from '../../config/auth'

vi.mock('../httpUser', () => ({
  fetchUser: {
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}))

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('debe hacer login exitosamente mediante fetchUser.login', async () => {
    const mockResponse = { success: true, user: { id: 1, email: 'test@example.com', nombre: 'Test' } }
    vi.mocked(fetchUser.login).mockResolvedValueOnce(mockResponse as any)

    const result = await userService.login('test@example.com', '123456')

    expect(fetchUser.login).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' })
    expect(result).toEqual(mockResponse)
  })

  it('debe registrar un usuario mediante fetchUser.register', async () => {
    const dto = { nombre: 'Test User', email: 'test@example.com', password: 'password123' }
    vi.mocked(fetchUser.register).mockResolvedValueOnce({ success: true } as any)

    const result = await userService.register(dto)

    expect(fetchUser.register).toHaveBeenCalledWith(dto)
    expect(result).toEqual({ success: true })
  })

  it('debe obtener el usuario actual almacenado en localStorage', () => {
    const mockUser = { id: 1, nombre: 'Test', email: 'test@example.com' }
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(mockUser))

    const currentUser = userService.getCurrentUser()
    expect(currentUser).toEqual(mockUser)
  })

  it('debe retornar null si no hay usuario en localStorage', () => {
    expect(userService.getCurrentUser()).toBeNull()
  })

  it('debe cerrar sesión y limpiar localStorage', async () => {
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify({ id: 1 }))
    vi.mocked(fetchUser.logout).mockResolvedValueOnce({ success: true } as any)

    await userService.logout()

    expect(fetchUser.logout).toHaveBeenCalled()
    expect(localStorage.getItem(AUTH_KEYS.USER)).toBeNull()
  })
})
