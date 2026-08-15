
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SellerAuthProvider } from "./context/SellerAuthContext.tsx";
import { AdminAuthProvider } from "./context/AdminAuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <SellerAuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </SellerAuthProvider>
    </AuthProvider>
);
