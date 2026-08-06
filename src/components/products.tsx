import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../api/productService'
import type { Product } from '../types'

export function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    productService.getProducts().then((response: any) => {
      if (response.success) {
        setProducts(response.data)
      }
    })
  }, [])

  const handleAddToCart = (id: number) => {
    navigate(`/products/${id}`)
  }
  return (
    <main className="p-4  ">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="cursor-pointer w-full h-full text-left"
            >
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-64 object-cover rounded-lg mb-4 hover:scale-105 transition-transform"
              />
              <h2 className="text-lg font-semibold mb-2">{product.nombre}</h2>
              <p className="text-gray-600">${product.precio}</p>
              <p className="text-gray-500">{product.cantidad_disponible}</p>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
