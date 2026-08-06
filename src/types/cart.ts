import type { Product } from './product'

export interface CartItem extends Product {
  cantidad: number
}

export interface CartContextType {
  cart: Product[]
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}
