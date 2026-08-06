import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productService } from '../api/productService'
import { useCart } from '../context/CartContext'
import type { Product } from '../types'

export function ProductDetails() {
  const { productId } = useParams<{ productId: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    if (!productId) return

    productService.getProductById(Number(productId)).then((response: any) => {
      if (response.success) {
        setProduct(response.data)
      }
    })
  }, [productId])

  return (
    <div className="p-6">
      {product ? (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
          <h2 className="text-3xl font-black mb-4">{product.nombre}</h2>
          <img
            className="mx-auto w-full max-w-sm aspect-square object-cover rounded-2xl mb-6 shadow-md"
            src={product.imagen}
            alt={product.nombre}
          />
          <p className="text-2xl font-bold text-emerald-600">${product.precio}</p>
          <p className="text-slate-500 mt-2">Disponibles: {product.cantidad_disponible}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-colors font-semibold shadow-sm mt-3"
          >
            Añadir al carrito
          </button>
          <Link to="/" className="text-blue-500 underline mt-4 block">
            Volver a productos
          </Link>
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-slate-400 animate-pulse">Cargando producto...</p>
        </div>
      )}
    </div>
  )
}
