

const BASE_URL = '/api'

export const fetchProducts = {
  get: async <T>(url: string): Promise<T> => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Falló la petición`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error 
    }
  },
}
