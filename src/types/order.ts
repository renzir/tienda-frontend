export interface Order {
  id: number
  fecha: string
  datos_usuario: string
  direccion: string
  estado: 'pendiente' | 'confirmado' | 'cancelado'
}

export interface CreateOrderDTO {
  dato_usuario: string
  direccion: string
}

export interface CreateOrderResponse {
  success: boolean
  message?: string
  orderId: number
}
