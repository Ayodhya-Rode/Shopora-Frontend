import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../../context/WishlistContext";
import { getFinalPrice } from "../../utils/pricing";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images?: { url: string; fileId: string }[];
    brand?: string;
  };
}

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "/placeholder.png";
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative overflow-hidden rounded-xl border border-border-default bg-surface-card transition hover:shadow-md"
    >
      <button
        type="button"
        onClick={handleWishlistClick}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-card/90 shadow-sm transition hover:bg-surface-card"
      >
        <FiHeart
          size={17}
          className={
            wishlisted ? "fill-status-error text-status-error" : "text-text-primary"
          }
        />
      </button>

      <img
        src={imageUrl}
        alt={product.name}
        className="aspect-square w-full bg-border-default object-cover transition duration-300 group-hover:scale-105"
      />

      <div className="p-3">
        {product.brand && (
          <p className="text-xs text-gray-500">{product.brand}</p>
        )}

        <h3 className="truncate text-sm font-medium text-text-primary md:text-base">
          {product.name}
        </h3>

        <div className="mt-1 flex items-center gap-2">
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
}

export default ProductCard;
