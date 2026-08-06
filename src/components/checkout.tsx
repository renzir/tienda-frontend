import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../api/orderService'
import Pago from '../assets/pago.png'
import { useCartReducer } from '../reducer/CartReducer'

export function Checkout() {
  const { cart, clearCart, totalPrice } = useCartReducer()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('name') as HTMLInputElement).value
    const address = (form.elements.namedItem('address') as HTMLInputElement).value

    if (!name.trim() || !address.trim()) {
      setError('Por favor completa todos los campos')
      setLoading(false)
      return
    }

    let orderId: number | null = null

    try {
      const res = await orderService.createOrder({ dato_usuario: name, direccion: address })
      if (!res.success) throw new Error(res.message || 'Error al crear pedido')
      orderId = res.orderId

      if (orderId !== null) {
        await orderService.processOrderItems(orderId, cart)
      } else {
        throw new Error('No se pudo obtener el ID de la orden')
      }

      if (window.confirm('¿Confirmar la orden?')) {
        await orderService.confirmPayment(orderId)
        form.reset()
        clearCart()
        setSuccess(true)
      } else {
        throw new Error('ORDEN_CANCELADA_USUARIO')
      }
    } catch (err: any) {
      const msg = err.message === 'ORDEN_CANCELADA_USUARIO' ? 'Orden cancelada' : err.message
      setError(msg)

      if (orderId) {
        await orderService
          .cancelOrder(orderId)
          .catch((e) => console.error('Error crítico Rollback', e))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100 my-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Finalizar Compra</h1>
        <p className="text-slate-500 mt-2">Completa tus datos para procesar el pedido.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium text-center">
          {error}
          <Link
            to="/"
            className="text-slate-400 font-semibold hover:text-emerald-600 transition-colors block mt-2"
          >
            ← Volver al Carrito
          </Link>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium text-center">
          ¡Pedido realizado con éxito! Gracias por tu compra.
        </div>
      )}

      <div className="bg-emerald-50 p-6 rounded-2xl mb-10 flex justify-between items-center border border-emerald-100">
        <span className="text-emerald-900 font-semibold">Total a pagar:</span>
        <span className="text-3xl font-black text-emerald-600">${totalPrice.toFixed(2)}</span>
      </div>

      <form className="space-y-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
          <input
            type="text"
            name="name"
            placeholder="Juan Pérez"
            required
            disabled={loading}
            className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Dirección de Envío</label>
          <input
            type="text"
            name="address"
            placeholder="Calle Ejemplo 123, Ciudad"
            required
            disabled={loading}
            className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl mt-4
            ${
              loading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02] active:scale-95 cursor-pointer'
            }`}
        >
          {loading ? 'Procesando...' : 'Confirmar y Pagar'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
        <img src={Pago} alt="Pago Seguro" className="w-48 grayscale opacity-70" />
      </div>
    </div>
  )
}
