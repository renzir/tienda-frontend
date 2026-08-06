import { describe, expect, it } from 'vitest'
import { sanitize, validateEmail, validatePassword } from './validation'

describe('sanitize', () => {
  it('debe retornar la misma cadena si no tiene caracteres peligrosos', () => {
    const input = 'Hola Mundo 123'
    expect(sanitize(input)).toBe(input)
  })

  it('debe eliminar caracteres < y >', () => {
    expect(sanitize('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script')
  })

  it('debe eliminar comillas simples y dobles', () => {
    expect(sanitize('it\'s a "test"')).toBe('its a test')
  })

  it('debe eliminar el carácter &', () => {
    expect(sanitize('Tom & Jerry')).toBe('Tom  Jerry')
  })

  it('debe manejar cadena vacía', () => {
    expect(sanitize('')).toBe('')
  })
})

describe('validateEmail', () => {
  it('debe validar emails correctos', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('john.doe@domain.org')).toBe(true)
  })

  it('debe rechazar emails sin @', () => {
    expect(validateEmail('usuarioDominio.com')).toBe(false)
  })

  it('debe rechazar emails sin dominio', () => {
    expect(validateEmail('user@')).toBe(false)
  })

  it('debe rechazar emails con espacios', () => {
    expect(validateEmail('user @example.com')).toBe(false)
  })
})

describe('validatePassword', () => {
  it('debe validar contraseñas de 6 o más caracteres', () => {
    expect(validatePassword('123456')).toBe(true)
    expect(validatePassword('password')).toBe(true)
  })

  it('debe rechazar contraseñas de menos de 6 caracteres', () => {
    expect(validatePassword('')).toBe(false)
    expect(validatePassword('abc')).toBe(false)
  })
})
