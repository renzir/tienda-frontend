import { Link, useNavigate } from 'react-router-dom'
import { useCartReducer } from '../reducer/CartReducer'
import type { Product } from '../types'
import { Mas, Menos } from './icons'

export function Cart() {
  const { cart, totalItems, totalPrice, addToCart, removeFromCart, clearCart } = useCartReducer()
  const navigate = useNavigate()

  const handleMas = (product: Product) => {
    addToCart(product)
  }
  const handleMenos = (product: Product) => {
    removeFromCart(product)
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 border-b border-slate-100 pb-6 mb-6">
        Tu Carrito <span className="text-emerald-600">({totalItems})</span>
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg mb-6">Tu carrito está vacío actualmente.</p>
          <Link
            to="/"
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer"
            >
              Vaciar Carrito
            </button>
          )}
          <ul className="divide-y divide-slate-100">
            {cart.map((product: Product) => (
              <li key={product.id} className="flex items-center py-6 gap-4 group">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-24 h-24 object-cover rounded-2xl shadow-sm"
                />

                <div className="flex flex-col grow">
                  <h3 className="font-bold text-slate-900 text-lg">{product.nombre}</h3>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleMenos(product)}
                      className="size-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Menos className="size-4" />
                    </button>

                    <span className="font-bold text-slate-800 w-6 text-center">
                      {product.cantidad}
                    </span>

                    <button
                      onClick={() => handleMas(product)}
                      className="size-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                    >
                      <Mas className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">
                    ${(Number(product.precio) * (product.cantidad || 1)).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">${product.precio} c/u</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-end mb-8">
              <Link
                to="/"
                className="text-slate-400 font-semibold hover:text-emerald-600 transition-colors"
              >
                ← Continuar comprando
              </Link>
              <div className="text-right">
                <p className="text-slate-500 text-sm font-medium">Total de la orden:</p>
                <p className="text-4xl font-black text-slate-900">${totalPrice.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 hover:scale-[1.02] transition-all shadow-lg shadow-emerald-100 active:scale-95 cursor-pointer"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  )
}
