import { Link } from "react-router-dom";
import { getFinalPrice } from "../../utils/pricing";

interface SellerProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    images: { url: string; fileId: string }[];
    stock: number;
  };
  onDelete: (id: string) => void;
}

function SellerProductCard({ product, onDelete }: SellerProductCardProps) {
  const imageUrl = product.images?.[0]?.url || "/placeholder.png";

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card">
      <img
        src={imageUrl}
        alt={product.name}
        className="aspect-square w-full object-cover"
      />

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-text-primary">{product.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">₹{getFinalPrice(product)}</p>
        <p className="text-xs text-text-secondary">Stock: {product.stock}</p>

        <div className="mt-3 flex gap-2">
          <Link
            to={`/seller/edit-product/${product._id}`}
            className="flex-1 rounded-lg border border-text-primary py-1.5 text-center text-xs font-medium text-text-primary hover:bg-btn-primary hover:text-btn-primary-text"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product._id)}
            className="flex-1 rounded-lg border border-status-error py-1.5 text-xs font-medium text-status-error hover:bg-status-error hover:text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerProductCard;