import { httpOrder } from '../api/httpOrder'
import type { CreateOrderDTO, Order, Product } from '../types'

export const orderService = {
  createOrder: (order: CreateOrderDTO) => httpOrder.post('/order/createOrder', order),

  addProductsToOrder: (
    orderid: Order['id'],
    productid: Product['id'],
    cantidad: Product['cantidad']
  ) => httpOrder.addProductsToOrder(`/order/${orderid}/product/${productid}`, cantidad),

  confirmPayment: (orderId: Order['id']) => httpOrder.confirmPayment(`/order/${orderId}/confirm`),
  cancelOrder: (orderId: Order['id']) => httpOrder.cancelOrder(`/order/${orderId}/cancel`),
  
  processOrderItems: async (orderId: number, cart: any[]) => {
    for (const product of cart) {
      await orderService.addProductsToOrder(orderId, product.id, product.cantidad)
    }
  },
}
