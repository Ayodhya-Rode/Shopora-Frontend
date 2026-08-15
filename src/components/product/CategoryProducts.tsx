import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../../api/productApi";
import ProductCard from "./ProductCard";

function CategoryProducts() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(slug as string);
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="sticky top-4 z-10 mb-6 flex items-center gap-1 rounded-full border border-border-default bg-surface-card px-4 py-2 text-sm font-medium text-text-primary shadow-sm hover:shadow-md"
      >
        ← Back
      </button>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products found in this category.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProducts;
