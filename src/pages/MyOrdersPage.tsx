import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../api/orderApi";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import { createReview } from "../api/reviewApi";

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  orderStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
}

const CANCELLABLE_STATUSES = ["PLACED", "CONFIRMED"];

const statusColors: Record<string, string> = {
  PLACED: "bg-status-info-bg text-status-info",
  CONFIRMED: "bg-status-info-bg text-status-info",
  SHIPPED: "bg-status-warning-bg text-status-warning",
  DELIVERED: "bg-status-success-bg text-status-success",
  CANCELLED: "bg-status-error-bg text-status-error",
};

function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [reviewingItem, setReviewingItem] = useState<{
    orderId: string;
    productId: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedKeys, setReviewedKeys] = useState<string[]>([]);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.log("Error fetching orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to cancel order";
      toast.error(message);
    } finally {
      setCancellingId(null);
    }
  };

  // to add review
  const handleSubmitReview = async (orderId: string, productId: string) => {
    if (reviewRating < 1) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmittingReview(true);
      await createReview(productId, orderId, reviewRating, reviewComment);
      toast.success("Review submitted!");
      setReviewedKeys((prev) => [...prev, `${orderId}-${productId}`]);
      setReviewingItem(null);
      setReviewRating(0);
      setReviewComment("");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to submit review";
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <p className="p-8">Loading your orders...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
          <FiPackage size={40} className="mx-auto text-text-secondary" />
          <p className="mt-4 text-sm text-text-secondary">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text hover:opacity-85"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-border-default bg-surface-card p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-text-secondary">
                    Order ID: {order._id}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    statusColors[order.orderStatus] ||
                    "bg-surface-muted text-text-secondary"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-border-default pt-4">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {item.name} × {item.quantity}
                        {item.size &&
                          ` (${item.size}${item.color ? `, ${item.color}` : ""})`}
                      </span>
                      <span className="text-text-primary">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>

                    {order.orderStatus === "DELIVERED" &&
                      !reviewedKeys.includes(`${order._id}-${item.product}`) && (
                        <div className="mt-1">
                          {reviewingItem?.orderId === order._id &&
                          reviewingItem?.productId === item.product ? (
                            <div className="mt-2 rounded-lg border border-border-default bg-surface-muted p-3">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className={`text-lg ${
                                      star <= reviewRating
                                        ? "text-status-warning"
                                        : "text-border-default"
                                    }`}
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                              <textarea
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Share your experience (optional)"
                                className="mt-2 w-full rounded-lg border border-border-default p-2 text-sm"
                                rows={2}
                              />
                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  disabled={submittingReview}
                                  onClick={() =>
                                    handleSubmitReview(order._id, item.product)
                                  }
                                  className="rounded-lg bg-btn-primary px-3 py-1.5 text-xs font-medium text-btn-primary-text disabled:opacity-50"
                                >
                                  {submittingReview
                                    ? "Submitting..."
                                    : "Submit Review"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewingItem(null);
                                    setReviewRating(0);
                                    setReviewComment("");
                                  }}
                                  className="rounded-lg border border-border-default px-3 py-1.5 text-xs font-medium text-text-primary"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setReviewingItem({
                                  orderId: order._id,
                                  productId: item.product,
                                })
                              }
                              className="text-xs font-medium text-text-primary underline hover:opacity-70"
                            >
                              Write a review
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                <div className="text-sm">
                  <span className="text-text-secondary">Payment: </span>
                  <span className="font-medium text-text-primary">
                    {order.paymentMethod}
                  </span>
                  <span className="mx-2 text-text-secondary">·</span>
                  <span className="font-semibold text-text-primary">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {CANCELLABLE_STATUSES.includes(order.orderStatus) && (
                  <button
                    type="button"
                    disabled={cancellingId === order._id}
                    onClick={() => handleCancel(order._id)}
                    className="rounded-lg border border-status-error px-4 py-2 text-xs font-medium text-status-error transition hover:bg-status-error hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancellingId === order._id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;