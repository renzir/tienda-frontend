import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as AuthContextModule from '../../context/AuthContext'
import { Login } from '../login'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('<Login />', () => {
  const mockAuthLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: mockAuthLogin,
      logout: vi.fn(),
      register: vi.fn(),
    })
  })

  it('debe renderizar el formulario de inicio de sesión correctamente', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: /Iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument()
  })

  it('debe mostrar error si se intenta enviar el formulario con campos vacíos', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i })
    fireEvent.click(submitButton)

    expect(await screen.findByText('Email y contraseña son obligatorios')).toBeInTheDocument()
    expect(mockAuthLogin).not.toHaveBeenCalled()
  })

  it('debe mostrar error si el email no es válido', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email-invalido' } })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } })

    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i })
    fireEvent.submit(submitButton.closest('form')!)

    expect(await screen.findByText('Formato de email inválido')).toBeInTheDocument()
    expect(mockAuthLogin).not.toHaveBeenCalled()
  })

  it('debe iniciar sesión exitosamente y navegar al inicio', async () => {
    mockAuthLogin.mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }))

    await waitFor(() => {
      expect(mockAuthLogin).toHaveBeenCalledWith({
        email: 'juan@example.com',
        password: '123456',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('debe mostrar el mensaje de error cuando authLogin falla', async () => {
    mockAuthLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'))

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'juan@example.com' } })
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }))

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument()
  })
})
