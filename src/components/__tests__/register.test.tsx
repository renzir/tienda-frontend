import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as AuthContextModule from '../../context/AuthContext'
import { Register } from '../register'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('<Register />', () => {
  const mockRegister = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: mockRegister,
    })
  })

  it('debe renderizar los campos del formulario de registro', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: /Crear cuenta/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument()
  })

  it('debe validar que todos los campos son obligatorios', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }))

    expect(await screen.findByText('Todos los campos son obligatorios')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('debe sanitizar el nombre y llamar a register correctamente', async () => {
    mockRegister.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan <script>' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nombre: 'Juan script',
        email: 'juan@example.com',
        password: '123456',
      })
      expect(screen.getByText('¡Registro exitoso!')).toBeInTheDocument()
    })
  })
})
