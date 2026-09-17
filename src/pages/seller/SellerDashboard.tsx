import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSellerProfile } from "../../api/seller.api";
import { getMyProducts, deleteProduct } from "../../api/productApi";
import { getSellerOrders } from "../../api/orderApi";
import toast from "react-hot-toast";
import SellerProductCard from "../../components/seller/SellerProductCard";
import SellerSalesOverview from "../../components/seller/SellerSalesOverview";
import { FiMenu, FiX, FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/useTheme";

function SellerDashboard() {
  const { theme, toggleTheme } = useTheme();
  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, productsData, ordersData] = await Promise.all([
          getSellerProfile(),
          getMyProducts(),
          getSellerOrders(),
        ]);
        setSeller(profileData);
        setProducts(productsData);
        setOrders(ordersData);
      } catch (err) {
        console.log("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-text-primary">
          Delete this product?
        </p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteProduct(id);
                setProducts((prev) => prev.filter((p) => p._id !== id));
                toast.success("Product deleted successfully");
              } catch (err) {
                console.log("Delete failed", err);
                toast.error("Failed to delete product");
              }
            }}
            className="rounded-md bg-status-error px-3 py-1.5 text-xs font-medium text-white hover:opacity-85"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-muted"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-4 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {seller?.shopName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Welcome back, {seller?.sellerName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/seller/add-product"
              className="rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
            >
              + Add Product
            </Link>
            <Link
              to="/seller/orders"
              className="rounded-lg border border-text-primary px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
            >
              View Orders
            </Link>
            <Link
              to="/seller/profile"
              className="rounded-lg border border-text-primary px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
            >
              My Profile
            </Link>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-text-primary"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-text-primary text-text-primary md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-border-default bg-surface-card p-3 md:hidden">
          <Link
            to="/seller/add-product"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg bg-btn-primary px-4 py-2.5 text-center text-sm font-medium text-btn-primary-text"
          >
            + Add Product
          </Link>
          <Link
            to="/seller/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg border border-text-primary px-4 py-2.5 text-center text-sm font-medium text-text-primary"
          >
            View Orders
          </Link>
          <Link
            to="/seller/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg border border-text-primary px-4 py-2.5 text-center text-sm font-medium text-text-primary"
          >
            My Profile
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <p className="text-xs text-text-secondary">Total Products</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {products.length}
          </p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <p className="text-xs text-text-secondary">Total Orders</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {" "}
            {orders.length}
          </p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <p className="text-xs text-text-secondary">Revenue</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            ₹
            {orders
              .filter((o) => o.orderStatus === "DELIVERED")
              .reduce((sum, o) => sum + (o.sellerTotal || 0), 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface-card p-5">
          <p className="text-xs text-text-secondary">Pending Orders</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {
              orders.filter(
                (o) =>
                  o.orderStatus === "PLACED" || o.orderStatus === "CONFIRMED",
              ).length
            }
          </p>
        </div>
      </div>

      <div className="mt-8">
        <SellerSalesOverview />
      </div>

      {/* Product list */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Your Products
        </h2>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-default p-10 text-center text-sm text-text-secondary">
            You haven't added any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <SellerProductCard
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;