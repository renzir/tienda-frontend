import type { CreateOrderDTO, Product } from '../types'
const BASE_URL = '/api'

export const httpOrder = {
  post: async (url: string, order: CreateOrderDTO) => {
    if (!url || !order) {
      throw new Error('URL y orden son requeridas')
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return data
    } catch (error) {
      console.error('Error al crear la orden:', error)
      throw error
    }
  },

  addProductsToOrder: async <T>(url: string, cantidad: Product['cantidad']): Promise<T> => {
    if (!url || cantidad === undefined || cantidad === null) {
      throw new Error('URL y cantidad son requeridas')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0')
    }

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return data as T
    } catch (error) {
      console.error('Error al añadir productos a la orden:', error)
      throw error
    }
  },
  confirmPayment: async <T>(url: string): Promise<T> => {
 
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return data as T
    } catch (error) {
      console.error('Error al confirmar la orden:', error)
      throw error
    }
  },

  cancelOrder: async <T>(url: string): Promise<T> => {

    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return data as T
    } catch (error) {
      console.error('Error al cancelar la orden:', error)
      throw error
    }
  },
}
