import type { ApiResponse, Product } from '../types'
import { fetchProducts } from './httpProduct'

export const productService = {
  getProducts: () => fetchProducts.get<ApiResponse<Product[]>>('/products/getProducts'),

  getProductById: (id: Product['id']) =>
    fetchProducts.get<Product>(`/products/getProductById/${id}`),
}
