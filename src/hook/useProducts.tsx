import { useEffect, useState } from 'react'
import { productService } from '../api/productSerivce'
import type { Product, ApiResponse } from '../types'


export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response: ApiResponse = await productService.getProducts()

        console.log(response)
        if (response.success) {
          // setProducts(response); //  <-  ESTO ESTABA MAL
          setProducts(response.data) // <-  CORRECTO: Asignar solo el array de productos
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
