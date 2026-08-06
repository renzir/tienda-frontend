import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  IconCart,
  IconChevronDown,
  IconClose,
  IconLogout,
  IconMenu,
  IconPackage,
  IconSearch,
  IconUser,
} from './components/icons'
import { useAuth } from './context/AuthContext'
import { useCart } from './context/CartContext'
import { useDebounce } from './utils/debounce'

function App() {
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, loading: authLoading, logout } = useAuth()

  const [text, setText] = useState('')
  const value = useDebounce(text, 500)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      navigate(`/search?q=${value}`)
    }
  }, [value, navigate])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-[10vh] flex items-center justify-center">
        <span className="text-slate-400 text-sm">Cargando...</span>
      </div>
    )
  }

  const isLoggedIn = !!user

  const handleLogout = async () => {
    setUserDropdownOpen(false)
    setDrawerOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <div className="bg-slate-50 min-h-dvh flex flex-col">
      {/* ══════════ NAVBAR Emerald Tech ══════════ */}
      <header className="sticky top-0 z-50 bg-emerald-950 text-white shadow-lg border-b border-emerald-900/50">
        {/* Fila principal de navegación */}
        <div className="flex items-center justify-between px-4 py-3 gap-3 max-w-7xl mx-auto">
          {/* Móvil: Botón Menú Hamburguesa */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-emerald-900/60 transition-colors text-emerald-100"
            aria-label="Abrir menú"
          >
            <IconMenu className="size-7" />
          </button>

          {/* Logo / Home */}
          <h1
            onClick={() => navigate('/')}
            className="text-2xl sm:text-3xl font-black tracking-tighter cursor-pointer select-none shrink-0 text-white"
          >
            TIENDA<span className="text-emerald-400">.</span>
          </h1>

          {/* ── Desktop: buscador visible en el centro ── */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-6">
            <div className="relative w-full">
              <input
                className="w-full h-10 bg-emerald-900/50 text-white placeholder-emerald-200/60 px-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all border border-emerald-800/80"
                type="search"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Buscar productos..."
              />
              <IconSearch className="absolute right-3 top-2.5 size-5 text-emerald-300 pointer-events-none" />
            </div>
          </div>

          {/* ── Desktop: Zona de acciones (Cuenta + Carrito) ── */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Menú Usuario Desktop con Dropdown */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors text-left group cursor-pointer"
              >
                <IconUser className="size-6 text-emerald-200 group-hover:text-white" />
                <div className="text-xs">
                  <span className="block text-emerald-200/80 text-[11px] leading-none">
                    {isLoggedIn ? `Hola, ${user?.nombre.split(' ')[0]}` : 'Hola, identifícate'}
                  </span>
                  <span className="font-semibold text-emerald-100 group-hover:text-white flex items-center gap-0.5 mt-0.5">
                    Cuenta y Accesos
                    <IconChevronDown className="size-3 text-emerald-300" />
                  </span>
                </div>
              </button>

              {/* Dropdown flotante Desktop */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Sesión iniciada como</p>
                        <p className="text-sm font-semibold truncate text-slate-900">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        <IconUser className="size-4" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <IconLogout className="size-4" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors mb-2 shadow-sm"
                      >
                        Iniciar Sesión
                      </Link>
                      <p className="text-xs text-slate-500">
                        ¿Cliente nuevo?{' '}
                        <Link
                          to="/register"
                          onClick={() => setUserDropdownOpen(false)}
                          className="text-emerald-600 hover:underline font-medium"
                        >
                          Empieza aquí.
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Carrito (Desktop y Móvil) */}
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-emerald-900/60 transition-colors cursor-pointer text-emerald-100 hover:text-white"
              aria-label="Carrito de compras"
            >
              <div className="relative">
                <IconCart className="size-7" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-emerald-500 text-slate-950 rounded-full text-[11px] flex items-center justify-center font-black shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold">Carrito</span>
            </button>
          </div>
        </div>

        {/* Móvil: Segunda fila con la barra de búsqueda siempre accesible */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <input
              className="w-full h-10 bg-emerald-900/50 text-white placeholder-emerald-200/60 px-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all border border-emerald-800/80"
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Buscar productos..."
            />
            <IconSearch className="absolute right-3 top-2.5 size-5 text-emerald-300 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* ══════════ DRAWER MÓVIL (Menú Lateral Deslizante) ══════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay oscuro de fondo */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Panel lateral deslizable */}
          <aside className="relative w-4/5 max-w-xs bg-white h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {/* Header del drawer */}
            <div className="bg-emerald-950 text-white p-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-900 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <IconUser className="size-6" />
                </div>
                <div>
                  <p className="text-xs text-emerald-200/80">Hola,</p>
                  <p className="text-base font-bold leading-tight">
                    {isLoggedIn ? user.nombre.split(' ')[0] : 'Identifícate'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-emerald-300 hover:text-white transition-colors"
                aria-label="Cerrar menú"
              >
                <IconClose className="size-6" />
              </button>
            </div>

            {/* Contenido / Enlaces del menú */}
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
              {!isLoggedIn && (
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-2 mb-4">
                  <Link
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold py-2 rounded-lg text-sm transition-colors shadow-xs"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDrawerOpen(false)}
                    className="block w-full bg-white hover:bg-emerald-50 text-emerald-900 text-center font-semibold py-2 border border-emerald-300 rounded-lg text-sm transition-colors"
                  >
                    Crear Cuenta
                  </Link>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Navegación
                </p>
                <Link
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors"
                >
                  <IconPackage className="size-5 text-emerald-600" />
                  Inicio / Productos
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors justify-between"
                >
                  <div className="flex items-center gap-3">
                    <IconCart className="size-5 text-emerald-600" />
                    Mi Carrito
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {isLoggedIn && (
                <div className="pt-4 border-t border-slate-200 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                    Mi Cuenta
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors"
                  >
                    <IconUser className="size-5 text-emerald-600" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors cursor-pointer"
                  >
                    <IconLogout className="size-5" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </nav>
          </aside>
        </div>
      )}

      <main className="grow p-4 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default App
