import { authFetch } from './authFetch'

export const fetchProducts = {
  get: async <T>(url: string): Promise<T> => {
    return authFetch<T>(url)
  },
}
