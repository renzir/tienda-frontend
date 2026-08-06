import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCartReducer } from './CartReducer'
import type { Product } from '../types'

const mockProduct: Product = {
  id: 1,
  nombre: 'Producto 1',
  precio: 100,
  imagen: 'image.jpg',
  cantidad_disponible: 10,
}

describe('useCartReducer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe iniciar con un carrito vacío', () => {
    const { result } = renderHook(() => useCartReducer())
    expect(result.current.cart).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('debe añadir un producto al carrito', () => {
    const { result } = renderHook(() => useCartReducer())

    act(() => {
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toEqual({ ...mockProduct, cantidad: 1 })
    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(100)
  })

  it('debe incrementar la cantidad si el producto ya existe', () => {
    const { result } = renderHook(() => useCartReducer())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].cantidad).toBe(2)
    expect(result.current.totalItems).toBe(2)
    expect(result.current.totalPrice).toBe(200)
  })

  it('debe decrementar la cantidad al remover un producto con más de 1 unidad', () => {
    const { result } = renderHook(() => useCartReducer())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart(mockProduct)
      result.current.removeFromCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].cantidad).toBe(1)
  })

  it('debe eliminar el producto cuando la cantidad llega a 0', () => {
    const { result } = renderHook(() => useCartReducer())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.removeFromCart(mockProduct)
    })

    expect(result.current.cart).toHaveLength(0)
  })

  it('debe limpiar todo el carrito', () => {
    const { result } = renderHook(() => useCartReducer())

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.clearCart()
    })

    expect(result.current.cart).toEqual([])
    expect(result.current.totalItems).toBe(0)
  })
})