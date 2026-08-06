import type { CreateOrderDTO, CreateOrderResponse, Product } from '../types'
import { authFetch } from './authFetch'

export const httpOrder = {
  post: async (url: string, order: CreateOrderDTO): Promise<CreateOrderResponse> => {
    if (!url || !order) {
      throw new Error('URL y orden son requeridas')
    }
    return authFetch<CreateOrderResponse>(url, {
      method: 'POST',
      body: JSON.stringify(order),
    })
  },

  addProductsToOrder: async <T>(url: string, cantidad: Product['cantidad']): Promise<T> => {
    if (!url || cantidad === undefined || cantidad === null) {
      throw new Error('URL y cantidad son requeridas')
    }

    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor de 0')
    }

    return authFetch<T>(url, {
      method: 'POST',
      body: JSON.stringify({ cantidad }),
    })
  },
  confirmPayment: async <T>(url: string): Promise<T> => {
    return authFetch<T>(url, {
      method: 'POST',
    })
  },

  cancelOrder: async <T>(url: string): Promise<T> => {
    return authFetch<T>(url, {
      method: 'POST',
    })
  },
}
