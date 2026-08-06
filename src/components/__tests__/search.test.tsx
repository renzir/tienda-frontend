import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as useProductsHook from '../../hook/useProducts'
import type { Product } from '../../types'
import { Search } from '../search'

const mockProducts: Product[] = [
  {
    id: 1,
    nombre: 'iPhone 15 Pro',
    precio: 999,
    imagen: 'iphone.jpg',
    cantidad_disponible: 10,
  },
  {
    id: 2,
    nombre: 'Samsung Galaxy S24',
    precio: 899,
    imagen: 'samsung.jpg',
    cantidad_disponible: 5,
  },
]

describe('<Search />', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe mostrar mensaje de carga cuando isLoading es true', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: [],
      isLoading: true,
    })

    render(
      <MemoryRouter initialEntries={['/search?q=phone']}>
        <Search />
      </MemoryRouter>
    )

    expect(screen.getByText('Cargando resultados de búsqueda...')).toBeInTheDocument()
  })

  it('debe filtrar productos según el parámetro de búsqueda `q`', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: mockProducts,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/search?q=iPhone']}>
        <Search />
      </MemoryRouter>
    )

    expect(screen.getByText('Resultados de búsqueda para: "iphone"')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
    expect(screen.getByText('$999')).toBeInTheDocument()
    expect(screen.queryByText('Samsung Galaxy S24')).not.toBeInTheDocument()
  })

  it('debe mostrar mensaje cuando no hay coincidencias', () => {
    vi.spyOn(useProductsHook, 'useProducts').mockReturnValue({
      products: mockProducts,
      isLoading: false,
    })

    render(
      <MemoryRouter initialEntries={['/search?q=laptop']}>
        <Search />
      </MemoryRouter>
    )

    expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
  })
})
