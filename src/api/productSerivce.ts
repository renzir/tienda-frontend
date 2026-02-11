import type { Product, ApiResponse } from '../types'
import { fetchProducts } from './httpProduct'


export const productService = {
  getProducts: () => fetchProducts.get<ApiResponse>('/products/getProducts'),

  
  getProductById: (id: Product['id']) =>
    fetchProducts.get<Product>(`/products/getProductById/${id}`),
}
