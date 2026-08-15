import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminProfile, logoutAdmin } from "../../api/admin.api";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminSellers from "../../components/admin/AdminSellers"
import AdminCategories from "../../components/admin/AdminCategories"
import toast from "react-hot-toast";

type Tab = "sellers" | "categories";

function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("sellers");
  const navigate = useNavigate();
  const { setAdminAccessToken } = useAdminAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getAdminProfile();
        setAdmin(data);
      } catch (err) {
        console.log("Error fetching admin profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setAdminAccessToken(null);
      toast.success("Logged out successfully");
      navigate("/admin-login");
    } catch (err) {
      console.log("Logout failed", err);
      toast.error("Logout failed, please try again");
    }
  };

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Welcome, {admin?.adminName}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-text-primary px-5 py-2.5 text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 flex gap-2 border-b border-border-default">
        <button
          type="button"
          onClick={() => setActiveTab("sellers")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "sellers"
              ? "border-text-primary text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Sellers
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "categories"
              ? "border-text-primary text-text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Categories
        </button>
      </div>

      {activeTab === "sellers" ? <AdminSellers /> : <AdminCategories />}
    </div>
  );
}

export default AdminDashboard;