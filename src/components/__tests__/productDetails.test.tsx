import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { productService } from '../../api/productService'
import { CartProvider, useCart } from '../../context/CartContext'
import type { Product } from '../../types'
import { ProductDetails } from '../productDetails'

vi.mock('../../api/productService', () => ({
  productService: {
    getProductById: vi.fn(),
  },
}))

const mockProduct: Product = {
  id: 1,
  nombre: 'Teclado Mecánico RGB',
  precio: 120,
  imagen: 'teclado.jpg',
  cantidad_disponible: 8,
}

function TestCartConsumer() {
  const { cart } = useCart()
  return <div data-testid="cart-count">{cart.length}</div>
}

describe('<ProductDetails />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('debe mostrar "Cargando producto..." inicialmente', () => {
    vi.mocked(productService.getProductById).mockReturnValue(new Promise(() => {}))

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <CartProvider>
          <Routes>
            <Route path="/products/:productId" element={<ProductDetails />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando producto...')).toBeInTheDocument()
  })

  it('debe obtener y mostrar la información del producto', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue({
      success: true,
      data: mockProduct,
    } as any)

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <CartProvider>
          <Routes>
            <Route path="/products/:productId" element={<ProductDetails />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Teclado Mecánico RGB')).toBeInTheDocument()
      expect(screen.getByText('$120')).toBeInTheDocument()
      expect(screen.getByText('Disponibles: 8')).toBeInTheDocument()
    })
  })

  it('debe añadir el producto al carrito al hacer clic en "Añadir al carrito"', async () => {
    vi.mocked(productService.getProductById).mockResolvedValue({
      success: true,
      data: mockProduct,
    } as any)

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <CartProvider>
          <TestCartConsumer />
          <Routes>
            <Route path="/products/:productId" element={<ProductDetails />} />
          </Routes>
        </CartProvider>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Teclado Mecánico RGB')).toBeInTheDocument()
    })

    const btn = screen.getByRole('button', { name: /Añadir al carrito/i })
    fireEvent.click(btn)

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
  })
})
