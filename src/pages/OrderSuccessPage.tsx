import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/orderApi";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

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
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
}

function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id as string);
        setOrder(data);
      } catch (err) {
        console.log("Error fetching order", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-8">Loading order details...</p>;

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-sm text-text-secondary">Order not found.</p>
        <Link
          to="/shop"
          className="mt-4 inline-block rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text hover:opacity-85"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-border-default bg-surface-card p-8 text-center">
        <FiCheckCircle size={48} className="mx-auto text-status-success" />

        <h1 className="mt-4 text-2xl font-semibold text-text-primary">
          Order Placed Successfully!
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Order ID: <span className="font-medium text-text-primary">{order._id}</span>
        </p>

        <div className="mt-6 rounded-xl border border-border-default p-4 text-left">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">
            Order Summary
          </h2>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  {item.name} × {item.quantity}
                  {item.size && ` (${item.size}${item.color ? `, ${item.color}` : ""})`}
                </span>
                <span className="text-text-primary">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-between border-t border-border-default pt-3 text-sm font-semibold text-text-primary">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-border-default p-4 text-left text-sm text-text-secondary">
          <p>
            <span className="font-medium text-text-primary">Shipping to:</span>{" "}
            {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="mt-1">
            <span className="font-medium text-text-primary">Payment:</span>{" "}
            {order.paymentMethod}
          </p>
          <p className="mt-1">
            <span className="font-medium text-text-primary">Status:</span>{" "}
            {order.orderStatus}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85"
          >
            View My Orders
          </button>
          <Link
            to="/shop"
            className="rounded-lg border border-text-primary px-5 py-3 text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;