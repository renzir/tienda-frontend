import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import { Cart } from './components/cart.tsx'
import { ProductDetails } from './components/prodcuctDetails.tsx'
import { Products } from './components/productsList.tsx'
import { CartProvider } from './context/CartContext.tsx'
import './index.css'
import { Search } from './components/search.tsx'
import { CheckoutProtected } from './router/CheckoutProtected.tsx'
import { Checkout } from './components/checkout.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Products />} />
          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path='search' element={<Search />} />
          <Route
            path="checkout"
            element={
              <CheckoutProtected>
                <Checkout />
              </CheckoutProtected>
            }
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </CartProvider>
  </BrowserRouter>
)
