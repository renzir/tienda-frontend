import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useCartReducer } from '../reducer/CartReducer'
import type { CartContextType } from '../types'

export const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice } = useCartReducer()

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
