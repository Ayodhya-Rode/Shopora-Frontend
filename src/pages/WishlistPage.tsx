import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist } from "../api/wishlistApi";
import ProductCard from "../components/product/ProductCard";
import { FiArrowLeft, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";

interface ProductItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  brand?: string;
  images?: { url: string; fileId: string }[];
}

function WishlistPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        setProducts(data || []);
      } catch (err) {
        console.log("Error fetching wishlist", err);
        toast.error("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        My Wishlist
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-xl border border-border-default bg-surface-card p-3"
            >
              <div className="h-56 rounded-lg bg-surface-muted" />
              <div className="mt-4 h-4 w-20 rounded bg-surface-muted" />
              <div className="mt-3 h-5 w-32 rounded bg-surface-muted" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
          <FiHeart size={40} className="mx-auto text-text-secondary" />
          <p className="mt-4 text-sm text-text-secondary">
            Your wishlist is empty.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text hover:opacity-85"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;