import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hook/useProducts'

export function Search() {
  const { products, isLoading } = useProducts()
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q')?.toLowerCase() || ''

  const filteredProducts = useMemo(() => {
    if (!q) return products
    return products.filter((product) => product.nombre.toLowerCase().includes(q))
  }, [products, q])

  if (isLoading) {
    return <div>Cargando resultados de búsqueda...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resultados de búsqueda para: "{q}"</h2>

      {filteredProducts.length === 0 ? (
        <p className="text-slate-600">No se encontraron productos.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id} className="p-4 border border-slate-200 rounded-lg shadow-sm mb-4">
            <h3 className="text-lg font-semibold">{product.nombre}</h3>
            <p className="text-slate-600">${product.precio}</p>
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-48 h-48 object-cover mt-2 rounded-lg"
            />
          </div>
        ))
      )}
    </div>
  )
}
