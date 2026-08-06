import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { Cart } from './components/cart'
import { Checkout } from './components/checkout'
import { Login } from './components/login'
import { ProductDetails } from './components/productDetails'
import { Products } from './components/productsList'
import { Register } from './components/register'
import { Search } from './components/search'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css'
import { CheckoutProtected } from './router/CheckoutProtected'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Products />} />
            <Route path="products/:productId" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="search" element={<Search />} />
            <Route
              path="checkout"
              element={
                <CheckoutProtected>
                  <Checkout />
                </CheckoutProtected>
              }
            />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
