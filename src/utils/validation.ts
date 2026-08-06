/**
 * Utilidades de validación y sanitización para el frontend
 */

// Sanitiza una cadena eliminando caracteres potencialmente peligrosos para evitar XSS básico
export const sanitize = (input: string): string => {
  return input.replace(/[<>'"&]/g, '')
}

// Valida formato de email simple
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Valida longitud mínima de contraseña
export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}
