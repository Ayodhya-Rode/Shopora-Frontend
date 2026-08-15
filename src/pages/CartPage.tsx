import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem } from "../api/cartApi";
import toast from "react-hot-toast";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useCart } from "../context/CartContext";

interface CartProduct {
  _id: string;
  name: string;
  images?: { url: string }[];
  price: number;
  discountPrice?: number;
  stock: number;
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setItems(cart.items || []);
        refreshCartCount();
      } catch (err) {
        console.log("Error fetching cart", err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuantityChange = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    if (item.product?.stock && newQuantity > item.product.stock) {
      toast.error(`Only ${item.product.stock} in stock`);
      return;
    }

    try {
      setUpdatingId(item._id);
      const updatedCart = await updateCartItem(item._id, newQuantity);
      setItems(updatedCart.items || []);
      refreshCartCount();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update quantity";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      setUpdatingId(itemId);
      const updatedCart = await removeCartItem(itemId);
      setItems(updatedCart.items || []);
      refreshCartCount();
      toast.success("Item removed from cart");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to remove item";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (loading) return <p className="p-8">Loading cart...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        My Cart {items.length > 0 && `(${items.length})`}
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
          <p className="text-sm text-text-secondary">Your cart is empty.</p>
          <Link
            to="/shop"
            className="mt-4 inline-block rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text hover:opacity-85"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items list */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              return (
                <div
                  key={item._id}
                  className="flex gap-4 rounded-xl border border-border-default bg-surface-card p-4"
                >
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=200&q=80"
                    }
                    alt={product.name}
                    className="h-24 w-24 shrink-0 rounded-lg object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-text-primary">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-text-secondary">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " · "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-border-default">
                        <button
                          type="button"
                          disabled={updatingId === item._id}
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          className="px-3 py-1.5 text-sm text-text-primary hover:bg-surface-muted disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={updatingId === item._id}
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          className="px-3 py-1.5 text-sm text-text-primary hover:bg-surface-muted disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={updatingId === item._id}
                        onClick={() => handleRemove(item._id)}
                        className="flex items-center gap-1 text-xs font-medium text-status-error hover:underline disabled:opacity-50"
                      >
                        <FiTrash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-2xl border border-border-default bg-surface-card p-6">
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              Order Summary
            </h2>

            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-text-secondary">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4 text-base font-semibold text-text-primary">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
