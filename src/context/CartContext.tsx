import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getCart } from "../api/cartApi";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  setCartCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { accessToken } = useAuth();

  const refreshCartCount = async () => {
    if (!accessToken) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await getCart();
      const items = cart.items || [];
      const totalQty = items.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      );
      setCartCount(totalQty);
    } catch (err) {
      console.log("Error fetching cart count", err);
    }
  };

  useEffect(() => {
    refreshCartCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

