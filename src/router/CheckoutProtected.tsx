import { Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { ReactNode } from "react";

interface ProtectedProps {
  children: ReactNode;
}

export function CheckoutProtected({ children }: ProtectedProps) {
  const { cart } = useCart();

  if (cart.length === 0) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
