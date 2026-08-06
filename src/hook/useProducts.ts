import { useEffect, useState } from 'react'
import { productService } from '../api/productService'
import type { ApiResponse, Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response: ApiResponse<Product[]> = await productService.getProducts()

        console.log(response)
        if (response.success) {
          setProducts(response.data)
        } else {
          console.error('Error al obtener productos:', response)
          setProducts([])
        }
      } catch (error) {
        console.error('Error de red:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, isLoading }
}
