import { describe, expect, it, vi, beforeEach } from 'vitest'
import { orderService } from '../orderService'
import { httpOrder } from '../httpOrder'
import type { Product } from '../../types'

vi.mock('../httpOrder', () => ({
  httpOrder: {
    post: vi.fn(),
    addProductsToOrder: vi.fn(),
    confirmPayment: vi.fn(),
    cancelOrder: vi.fn(),
  },
}))

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe enviar la petición de creación de orden a /order/createOrder', async () => {
    const dto = { dato_usuario: 'Juan', direccion: 'Calle 123' }
    vi.mocked(httpOrder.post).mockResolvedValueOnce({ success: true, orderId: 5 })

    const res = await orderService.createOrder(dto)

    expect(httpOrder.post).toHaveBeenCalledWith('/order/createOrder', dto)
    expect(res).toEqual({ success: true, orderId: 5 })
  })

  it('debe procesar recursivamente los productos del carrito con processOrderItems', async () => {
    const mockCart: Product[] = [
      { id: 1, nombre: 'P1', precio: 10, imagen: 'img1.jpg', cantidad_disponible: 5, cantidad: 2 },
      { id: 2, nombre: 'P2', precio: 20, imagen: 'img2.jpg', cantidad_disponible: 5, cantidad: 1 },
    ]

    vi.mocked(httpOrder.addProductsToOrder).mockResolvedValue(undefined as any)

    await orderService.processOrderItems(10, mockCart)

    expect(httpOrder.addProductsToOrder).toHaveBeenCalledTimes(2)
    expect(httpOrder.addProductsToOrder).toHaveBeenNthCalledWith(1, '/order/10/product/1', 2)
    expect(httpOrder.addProductsToOrder).toHaveBeenNthCalledWith(2, '/order/10/product/2', 1)
  })

  it('debe invocar confirmPayment correctamente', async () => {
    vi.mocked(httpOrder.confirmPayment).mockResolvedValueOnce({ success: true } as any)

    await orderService.confirmPayment(10)

    expect(httpOrder.confirmPayment).toHaveBeenCalledWith('/order/10/confirm')
  })

  it('debe invocar cancelOrder correctamente', async () => {
    vi.mocked(httpOrder.cancelOrder).mockResolvedValueOnce({ success: true } as any)

    await orderService.cancelOrder(10)

    expect(httpOrder.cancelOrder).toHaveBeenCalledWith('/order/10/cancel')
  })
})
