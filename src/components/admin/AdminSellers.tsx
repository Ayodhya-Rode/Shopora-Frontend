import { useEffect, useState } from "react";
import { getAllSellers, blockSeller, unblockSeller } from "../../api/admin.api";
import toast from "react-hot-toast";

interface Seller {
  _id: string;
  sellerName: string;
  shopName: string;
  email: string;
  phoneNumber: string;
  isBlocked: boolean;
  createdAt: string;
}

function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getAllSellers();
      setSellers(data || []);
    } catch (err) {
      console.log("Error fetching sellers", err);
      toast.error("Failed to load sellers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleToggleBlock = async (seller: Seller) => {
    try {
      setUpdatingId(seller._id);
      if (seller.isBlocked) {
        await unblockSeller(seller._id);
        toast.success(`${seller.shopName} unblocked`);
      } else {
        await blockSeller(seller._id);
        toast.success(`${seller.shopName} blocked`);
      }
      fetchSellers();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to update seller";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return <p className="text-sm text-text-secondary">Loading sellers...</p>;

  if (sellers.length === 0) {
    return (
      <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
        <p className="text-sm text-text-secondary">No sellers registered yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-default bg-surface-card">
      <table className="w-full min-w-160 text-left text-sm">
        <thead className="border-b border-border-default bg-surface-muted text-xs uppercase text-text-secondary">
          <tr>
            <th className="px-4 py-3">Shop</th>
            <th className="px-4 py-3">Seller</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr
              key={seller._id}
              className="border-b border-border-default last:border-0"
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                {seller.shopName}
              </td>
              <td className="px-4 py-3 text-text-secondary">{seller.sellerName}</td>
              <td className="px-4 py-3 text-text-secondary">{seller.email}</td>
              <td className="px-4 py-3 text-text-secondary">{seller.phoneNumber}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    seller.isBlocked
                      ? "bg-status-error-bg text-status-error"
                      : "bg-status-success-bg text-status-success"
                  }`}
                >
                  {seller.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={updatingId === seller._id}
                  onClick={() => handleToggleBlock(seller)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    seller.isBlocked
                      ? "border-status-success text-status-success hover:bg-status-success hover:text-white"
                      : "border-status-error text-status-error hover:bg-status-error hover:text-white"
                  }`}
                >
                  {updatingId === seller._id
                    ? "Updating..."
                    : seller.isBlocked
                      ? "Unblock"
                      : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminSellers;
