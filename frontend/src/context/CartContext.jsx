import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/add", { product_id: productId, quantity });
    setCart(data);
  }, []);

  const updateCart = useCallback(async (productId, quantity) => {
    const { data } = await api.put("/cart/update", { product_id: productId, quantity });
    setCart(data);
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const { data } = await api.delete("/cart/remove", { data: { product_id: productId } });
    setCart(data);
  }, []);

  const value = useMemo(
    () => ({ cart, loading, fetchCart, addToCart, updateCart, removeFromCart, count: cart.items.reduce((sum, item) => sum + item.quantity, 0) }),
    [cart, loading, fetchCart, addToCart, updateCart, removeFromCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
