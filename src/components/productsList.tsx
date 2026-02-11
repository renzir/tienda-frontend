import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useProducts } from '../hook/useProducts'
import type { Product } from '../types'

export function Products() {
  const { products, isLoading } = useProducts()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  if (isLoading) {
    return <div>Cargando productos...</div>
  }

  const handleVerDetalle = (id: Product['id']) => {
    navigate(`/products/${id}`)
  }

  return (
    <main className="p-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col"
          >
            <div
              className="relative overflow-hidden cursor-pointer"
              onClick={() => handleVerDetalle(product.id)}
            >
              <img
                src={product.imagen}
                alt={product.nombre}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.cantidad_disponible < 5 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Últimas unidades
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col grow">
              <button
                onClick={() => handleVerDetalle(product.id)}
                className="text-left mb-2 cursor-pointer"
              >
                <h2 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {product.nombre}
                </h2>
              </button>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Precio</span>
                  <p className="text-2xl font-black text-slate-900">${product.precio}</p>
                </div>

                <button
                  onClick={() => addToCart(product)} // Usando la función del context
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 shadow-md shadow-orange-200 cursor-pointer font-bold"
                >
                  Añadir
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
