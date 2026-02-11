import { useEffect, useState } from 'react'
import { productService } from '../api/productSerivce'
import type { Product } from '../types'

export function useProductsByID(id: Product['id']) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    productService.getProductById(id).then((response: any) => {
      if (response.success) {
        setProduct(response.data)
      }
      setIsLoading(false)
    })
  }, [])

  return { product, isLoading }
}
