import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Checkout } from '../checkout'
import { orderService } from '../../api/orderService'
import type { Product } from '../../types'

vi.mock('../../api/orderService', () => ({
  orderService: {
    createOrder: vi.fn(),
    processOrderItems: vi.fn(),
    confirmPayment: vi.fn(),
    cancelOrder: vi.fn(),
  },
}))

const mockCartProduct: Product = {
  id: 1,
  nombre: 'Mouse Inalámbrico',
  precio: 25,
  imagen: 'mouse.jpg',
  cantidad_disponible: 15,
  cantidad: 2,
}

describe('<Checkout />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('debe renderizar el formulario de checkout y el total a pagar', () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    )

    expect(screen.getByRole('heading', { name: /Finalizar Compra/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Juan Pérez/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Calle Ejemplo 123, Ciudad/i)).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('debe procesar el pedido con éxito cuando el usuario confirma', async () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    vi.mocked(orderService.createOrder).mockResolvedValueOnce({
      success: true,
      orderId: 100,
    } as any)
    vi.mocked(orderService.processOrderItems).mockResolvedValueOnce(undefined)
    vi.mocked(orderService.confirmPayment).mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), {
      target: { value: 'Maria Lopez' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Calle Ejemplo 123, Ciudad/i), {
      target: { value: 'Av. Principal 456' },
    })

    const submitBtn = screen.getByRole('button', { name: /Confirmar y Pagar/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith({
        dato_usuario: 'Maria Lopez',
        direccion: 'Av. Principal 456',
      })
      expect(orderService.processOrderItems).toHaveBeenCalledWith(100, [mockCartProduct])
      expect(orderService.confirmPayment).toHaveBeenCalledWith(100)
      expect(screen.getByText('¡Pedido realizado con éxito! Gracias por tu compra.')).toBeInTheDocument()
    })
  })

  it('debe cancelar la orden si el usuario no confirma el cuadro de diálogo', async () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    vi.mocked(orderService.createOrder).mockResolvedValueOnce({
      success: true,
      orderId: 101,
    } as any)
    vi.mocked(orderService.processOrderItems).mockResolvedValueOnce(undefined)
    vi.mocked(orderService.cancelOrder).mockResolvedValueOnce(undefined)

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), {
      target: { value: 'Maria Lopez' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Calle Ejemplo 123, Ciudad/i), {
      target: { value: 'Av. Principal 456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Confirmar y Pagar/i }))

    await waitFor(() => {
      expect(orderService.cancelOrder).toHaveBeenCalledWith(101)
      expect(screen.getByText('Orden cancelada')).toBeInTheDocument()
    })
  })
})
