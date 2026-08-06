export interface User {
  id?: number
  nombre: string
  email: string
}

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterUserDTO {
  nombre: string
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  register: (data: RegisterUserDTO) => Promise<unknown>
  login: (data: LoginDTO) => Promise<void>
  logout: () => void
}
