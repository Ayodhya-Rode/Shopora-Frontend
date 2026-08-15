import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSellerOrders, updateOrderStatus } from "../../api/orderApi";
import toast from "react-hot-toast";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

interface OrderUser {
  userName: string;
  email: string;
  phoneNumber?: string;
}

interface SellerOrder {
  _id: string;
  user: OrderUser;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  items: OrderItem[];
  sellerTotal: number;
  createdAt: string;
}

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const STATUS_FLOW = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

const statusColors: Record<string, string> = {
  PLACED: "bg-status-info-bg text-status-info",
  CONFIRMED: "bg-status-info-bg text-status-info",
  SHIPPED: "bg-status-warning-bg text-status-warning",
  DELIVERED: "bg-status-success-bg text-status-success",
  CANCELLED: "bg-status-error-bg text-status-error",
};

function nextStatus(current: string): string | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getSellerOrders(statusFilter || undefined, search || undefined);
      setOrders(data || []);
    } catch (err) {
      console.log("Error fetching seller orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleAdvance = async (order: SellerOrder) => {
    const next = nextStatus(order.orderStatus);
    if (!next) return;

    try {
      setUpdatingId(order._id);
      await updateOrderStatus(order._id, next);
      toast.success(`Order marked as ${next}`);
      fetchOrders();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update status";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Orders</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-border-default bg-surface-card px-3 py-2.5">
            <FiSearch size={16} className="text-text-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, product, or customer"
              className="w-full text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-btn-primary px-4 py-2.5 text-sm font-medium text-btn-primary-text hover:opacity-85"
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
          <p className="text-sm text-text-secondary">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const next = nextStatus(order.orderStatus);
            const isTerminal = order.orderStatus === "CANCELLED" || order.orderStatus === "DELIVERED";

            return (
              <div key={order._id} className="rounded-2xl border border-border-default bg-surface-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-text-secondary">Order ID: {order._id}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {order.user?.userName} · {order.user?.email}
                      {order.user?.phoneNumber && ` · ${order.user.phoneNumber}`}
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
                      statusColors[order.orderStatus] || "bg-surface-muted text-text-secondary"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-border-default pt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {item.name} × {item.quantity}
                        {item.size && ` (${item.size}${item.color ? `, ${item.color}` : ""})`}
                      </span>
                      <span className="text-text-primary">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                  <div className="text-sm">
                    <span className="text-text-secondary">Your total: </span>
                    <span className="font-semibold text-text-primary">₹{order.sellerTotal}</span>
                    <span className="mx-2 text-text-secondary">·</span>
                    <span className="text-text-secondary">{order.paymentMethod}</span>
                  </div>

                  {!isTerminal && next && (
                    <button
                      type="button"
                      disabled={updatingId === order._id}
                      onClick={() => handleAdvance(order)}
                      className="rounded-lg bg-btn-primary px-4 py-2 text-xs font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === order._id ? "Updating..." : `Mark as ${next}`}
                    </button>
                  )}
                </div>

                <div className="mt-3 text-xs text-text-secondary">
                  Shipping to: {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SellerOrdersPage;