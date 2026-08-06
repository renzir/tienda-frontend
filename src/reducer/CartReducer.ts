import { useReducer } from 'react'
import type { Product } from '../types'

type CartState = Product[]

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: Product }
  | { type: 'CLEAR_CART' }

const initialState: CartState = []

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const productIndex = state.findIndex((item) => item.id === action.payload.id)
      let newCart
      if (productIndex >= 0) {
        newCart = [...state]
        const item = newCart[productIndex]
        newCart[productIndex] = {
          ...item,
          cantidad: (item.cantidad || 1) + 1,
        }
      } else {
        newCart = [...state, { ...action.payload, cantidad: 1 }]
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    }

    case 'REMOVE_FROM_CART': {
      const productIndex = state.findIndex((item) => item.id === action.payload.id)

      if (productIndex === -1) return state

      let newCart
      const item = state[productIndex]

      if ((item.cantidad || 1) > 1) {
        newCart = [...state]
        newCart[productIndex] = {
          ...item,
          cantidad: (item.cantidad || 1) - 1,
        }
      } else {
        newCart = state.filter((item) => item.id !== action.payload.id)
      }

      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    }
    case 'CLEAR_CART':
      localStorage.setItem('cart', JSON.stringify([]))
      return initialState

    default:
      return state
  }
}
export const useCartReducer = () => {
  const initialState: CartState = JSON.parse(localStorage.getItem('cart') || '[]')
  const [state, dispatch] = useReducer(reducer, initialState)

  const totalItems = state.reduce((acc, item) => acc + (item.cantidad || 0), 0)

  const totalPrice = state.reduce(
    (acc, item) => acc + Number(item.precio) * (item.cantidad || 0),
    0
  )

  const addToCart = (product: Product) => dispatch({ type: 'ADD_TO_CART', payload: product })

  const removeFromCart = (product: Product) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: product })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return { cart: state, addToCart, removeFromCart, clearCart, totalItems, totalPrice }
}
