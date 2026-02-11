import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { IconCart } from './components/icons'
import { useCart } from './context/CartContext'
import { useDebounce } from './utils/debounce'

function App() {
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const [text, setText] = useState('')
  const value = useDebounce(text, 500)

  useEffect(() => {
    if (value) {
      navigate(`/search?q=${value}`)
    }
  }, [value])

  return (
    <div className="bg-slate-50 min-h-dvh flex flex-col">
      <nav className="flex p-4 items-center justify-between w-full bg-slate-200 pb-7 sticky top-0 z-50">
        <h1
          onClick={() => navigate('/')}
          className="text-3xl font-black tracking-tighter text-slate-900 cursor-pointer select-none"
        >
          TIENDA<span className="text-orange-500">.</span>
        </h1>

        <input
          className="h-12 bg-slate-100 px-5 w-full max-w-md rounded-full text-lg focus:outline-orange-500 transition-all"
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar productos..."
        />

        <button
          onClick={() => navigate('/cart')}
          className="relative p-2 hover:bg-slate-300/50 rounded-full transition-colors cursor-pointer"
        >
          <IconCart className="size-7 text-slate-800" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 size-5 bg-orange-500 rounded-full text-[11px] text-white flex items-center justify-center font-bold animate-in zoom-in duration-300">
              {totalItems}
            </span>
          )}
        </button>
      </nav>

      <main className="grow p-4 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default App
