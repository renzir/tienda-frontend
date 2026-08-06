import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Product } from '../../types'
import { Cart } from '../cart'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockCartProduct: Product = {
  id: 1,
  nombre: 'Teclado Gamer',
  precio: 50,
  imagen: 'teclado.jpg',
  cantidad_disponible: 10,
  cantidad: 2,
}

describe('<Cart />', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('debe mostrar mensaje de carrito vacío cuando no hay elementos', () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    )

    expect(screen.getByText('Tu carrito está vacío actualmente.')).toBeInTheDocument()
    expect(screen.getByText('Ir a la tienda')).toBeInTheDocument()
  })

  it('debe renderizar los productos del carrito si existen en localStorage', () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    )

    expect(screen.getByText('Teclado Gamer')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('$100.00')).toHaveLength(2)
    expect(screen.getByText('$50 c/u')).toBeInTheDocument()
  })

  it('debe vaciar el carrito al hacer clic en "Vaciar Carrito"', () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    )

    const vaciarBtn = screen.getByText('Vaciar Carrito')
    fireEvent.click(vaciarBtn)

    expect(screen.getByText('Tu carrito está vacío actualmente.')).toBeInTheDocument()
    expect(localStorage.getItem('cart')).toBe(JSON.stringify([]))
  })

  it('debe navegar a /checkout al hacer clic en "Finalizar Compra"', () => {
    localStorage.setItem('cart', JSON.stringify([mockCartProduct]))

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    )

    const checkoutBtn = screen.getByRole('button', { name: /Finalizar Compra/i })
    fireEvent.click(checkoutBtn)

    expect(mockNavigate).toHaveBeenCalledWith('/checkout')
  })
})
