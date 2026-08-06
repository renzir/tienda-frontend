import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from '../../context/CartContext'
import * as useProductsHook from '../../hook/useProducts'
import type { Product } from '../../types'
import { Products } from '../productsList'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockProductsList: Product[] = [
  {
    id: 1,
    nombre: 'Laptop Gamer',
    precio: 1200,
    imagen: 'laptop.jpg',
    cantidad_disponible: 10,
  },
  {
    id: 2,
    nombre: 'Teclado Mecánico',
    precio: 80,
    imagen: 'teclado.jpg',
    cantidad_disponible: 3, 
  },
]

describe('<Products />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('debe mostrar el mensaje de carga cuando isLoading es verdadero', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: [],
      isLoading: true,
    })

    render(
      <BrowserRouter>
        <CartProvider>
          <Products />
        </CartProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
  })

  it('debe renderizar la lista de productos correctamente', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: mockProductsList,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <CartProvider>
          <Products />
        </CartProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Laptop Gamer')).toBeInTheDocument()
    expect(screen.getByText('$1200')).toBeInTheDocument()
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument()
    expect(screen.getByText('$80')).toBeInTheDocument()
  })

  it('debe mostrar la insignia "Últimas unidades" si la cantidad_disponible es menor a 5', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: mockProductsList,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <CartProvider>
          <Products />
        </CartProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Últimas unidades')).toBeInTheDocument()
  })

  it('debe navegar al detalle del producto al hacer clic en un producto', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: mockProductsList,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <CartProvider>
          <Products />
        </CartProvider>
      </BrowserRouter>
    )

    const titleButton = screen.getByText('Laptop Gamer')
    fireEvent.click(titleButton)

    expect(mockNavigate).toHaveBeenCalledWith('/products/1')
  })
})
