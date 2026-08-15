import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import SellerLogin from "./pages/seller/SellerLogin";
import SellerRegister from "./pages/seller/SellerRegister";
import AdminLogin from "./pages/admin/AdminLogin";
// import AdminRegister from "./pages/admin/AdminRegister";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import CategoryProducts from "./components/product/CategoryProducts";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProtectedSellerRoute from "./routes/ProtectedSellerRoute";
import AddProduct from "./pages/seller/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import AboutSection from "./components/landing/AboutSection";
import Navbar from "./components/landing/Navbar";
import Footer from "./components/landing/Footer";
import ShopPage from "./pages/ShopPage";
import EditProduct from "./pages/seller/EditProduct";
import UserProfile from "./pages/user/UserProfile";
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ChatWidget from "./components/ChatWidget";
import AddressBookPage from "./pages/AddressBookPage";
import SellerProfile from "./pages/seller/SellerProfile";
import ContactPage from "./pages/ContactPage";
import FAQPage from "./pages/FAQPage";
import ReturnsPage from "./pages/ReturnsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route
          path="/about"
          element={
            <div className="bg-surface">
              <Navbar />
              <AboutSection />
              <Footer />
            </div>
          }
        />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller-register" element={<SellerRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* <Route path="/admin-register" element={<AdminRegister/>} /> */}
        <Route path="/categories/:slug" element={<CategoryProducts />} />

        {/* Protected Route - only for seller  */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedSellerRoute>
              <SellerDashboard />
            </ProtectedSellerRoute>
          }
        />

        {/* Protected route -- only seller can have access */}
        <Route
          path="/seller/add-product"
          element={
            <ProtectedSellerRoute>
              <AddProduct />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/seller/edit-product/:id"
          element={
            <ProtectedSellerRoute>
              <EditProduct />
            </ProtectedSellerRoute>
          }
        />

        <Route
          path="/seller/orders"
          element={
            <ProtectedSellerRoute>
              <SellerOrdersPage />
            </ProtectedSellerRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route
          path="/seller/profile"
          element={
            <ProtectedSellerRoute>
              <SellerProfile />
            </ProtectedSellerRoute>
          }
        />

        {/* Protected route for user */}
        <Route
          path="/user/profile"
          element={
            <ProtectedUserRoute>
              <UserProfile />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedUserRoute>
              <CartPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedUserRoute>
              <CheckoutPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/order-success/:id"
          element={
            <ProtectedUserRoute>
              <OrderSuccessPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedUserRoute>
              <MyOrdersPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedUserRoute>
              <WishlistPage />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/addresses"
          element={
            <ProtectedUserRoute>
              <AddressBookPage />
            </ProtectedUserRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
      </Routes>

      <Toaster />
      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
