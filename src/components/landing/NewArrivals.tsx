import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../api/productApi";
import { getFinalPrice } from "../../utils/pricing";


interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category?: { _id: string; name: string } | string | null;
  images?: { url: string }[];
  createdAt?: string;
}

const isRecent = (createdAt?: string) => {
  if (!createdAt) return false;
  const days =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days <= 14;
};

function NewArrivals() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(Array.isArray(data) ? data.slice(0, 10) : []);
      } catch (err) {
        console.log("Error fetching new arrivals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-text-primary md:text-3xl">
          New Arrivals
        </h2>
        <Link
          to="/shop"
          className="text-sm font-medium text-text-primary underline underline-offset-4 transition hover:text-accent"
        >
          View All
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 md:gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-44 shrink-0 animate-pulse overflow-hidden rounded-xl border border-border-default bg-surface-card sm:w-52"
              >
                <div className="aspect-square w-full bg-surface-muted" />
                <div className="space-y-2 p-3">
                  <div className="h-3 w-14 rounded bg-surface-muted" />
                  <div className="h-4 w-24 rounded bg-surface-muted" />
                </div>
              </div>
            ))
          : products.map((product) => {
              const categoryName =
                typeof product.category === "object" && product.category
                  ? product.category.name
                  : "";

              return (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="group w-44 shrink-0 overflow-hidden rounded-xl border border-border-default bg-surface-card transition hover:shadow-md sm:w-52"
                >
                  <div className="relative">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={product.name}
                      className="aspect-square w-full bg-border-default object-cover transition duration-300 group-hover:scale-105"
                    />
                    {isRecent(product.createdAt) && (
                      <span className="absolute left-2 top-2 rounded-full bg-btn-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-btn-primary-text">
                        New
                      </span>
                    )}
                  </div>

                  <div className="p-3">
                    {categoryName && (
                      <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">
                        {categoryName}
                      </p>
                    )}
                    <h3 className="mb-1 line-clamp-2 text-sm font-medium text-text-primary">
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
              );
            })}
      </div>
    </section>
  );
}

export default NewArrivals;