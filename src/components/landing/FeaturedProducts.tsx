import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import { addToCart } from "../../api/cartApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getFinalPrice } from "../../utils/pricing";


interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category?: { _id: string; name: string } | string | null;
  images?: { url: string }[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
}

function FeaturedProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (err) {
        console.log("Error fetching trending products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (
    e: React.MouseEvent,
    product: ApiProduct,
  ) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error("Please login to add items to cart");
      navigate("/user-login");
      return;
    }

    if (
      (product.sizes && product.sizes.length > 0) ||
      (product.colors && product.colors.length > 0)
    ) {
      navigate(`/product/${product._id}`);
      return;
    }

    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      toast.success("Added to cart!");
      refreshCartCount();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to add to cart. Try again.";
      toast.error(message);
    } finally {
      setAddingId(null);
    }
  };

  if (!loading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
          Trending Now
        </h2>
        <Link
          to="/shop"
          className="text-sm font-medium text-text-primary underline underline-offset-4 transition hover:text-accent"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl border border-border-default bg-surface-card"
              >
                <div className="aspect-square w-full bg-surface-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-16 rounded bg-surface-muted" />
                  <div className="h-4 w-32 rounded bg-surface-muted" />
                  <div className="h-4 w-20 rounded bg-surface-muted" />
                </div>
              </div>
            ))
          : products.map((product) => {
              const categoryName =
                typeof product.category === "object" && product.category
                  ? product.category.name
                  : "";

              return (
                <div
                  key={product._id}
                  className="group overflow-hidden rounded-xl border border-border-default bg-surface-card transition hover:shadow-md"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={product.name}
                      className="aspect-square w-full bg-border-default object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="p-4">
                      {categoryName && (
                        <p className="mb-1 text-xs uppercase tracking-wide text-text-secondary">
                          {categoryName}
                        </p>
                      )}
                      <h3 className="mb-2 line-clamp-2 text-sm font-medium text-text-primary">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-sm font-semibold text-text-primary">
                              ₹{getFinalPrice(product)}
                            </span>
                            <span className="text-xs text-text-secondary line-through">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-text-primary">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    disabled={addingId === product._id}
                    onClick={(e) => handleAddToCart(e, product)}
                    className="min-h-11 w-full border-t border-border-default bg-btn-primary px-4 py-2.5 text-xs font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addingId === product._id ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              );
            })}
      </div>
    </section>
  );
}

export default FeaturedProducts;