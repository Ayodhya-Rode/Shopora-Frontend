import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerProfile,
  updateSellerProfile,
  logoutSeller,
} from "../../api/seller.api";
import { useSellerAuth } from "../../context/SellerAuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

interface BusinessAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface SellerData {
  _id: string;
  sellerName: string;
  email: string;
  phoneNumber?: string;
  shopName: string;
  shopLogo?: string;
  gstNumber?: string;
  businessAddress?: BusinessAddress;
  createdAt?: string;
}

function SellerProfile() {
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSellerAccessToken } = useSellerAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editSellerName, setEditSellerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editShopName, setEditShopName] = useState("");
  const [editGstNumber, setEditGstNumber] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await getSellerProfile();
      setSeller(data);
      setEditSellerName(data.sellerName || "");
      setEditPhone(data.phoneNumber || "");
      setEditShopName(data.shopName || "");
      setEditGstNumber(data.gstNumber || "");
      setEditStreet(data.businessAddress?.street || "");
      setEditCity(data.businessAddress?.city || "");
      setEditState(data.businessAddress?.state || "");
      setEditPincode(data.businessAddress?.pincode || "");
    } catch (err) {
      console.log("Error fetching seller profile", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutSeller();
      setSellerAccessToken(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.log("Logout failed", err);
      toast.error("Logout failed, please try again");
    }
  };

  const startEditing = () => {
    if (!seller) return;
    setEditSellerName(seller.sellerName || "");
    setEditPhone(seller.phoneNumber || "");
    setEditShopName(seller.shopName || "");
    setEditGstNumber(seller.gstNumber || "");
    setEditStreet(seller.businessAddress?.street || "");
    setEditCity(seller.businessAddress?.city || "");
    setEditState(seller.businessAddress?.state || "");
    setEditPincode(seller.businessAddress?.pincode || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editSellerName.trim() || !editPhone.trim() || !editShopName.trim()) {
      toast.error("Name, phone, and shop name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateSellerProfile({
        sellerName: editSellerName,
        phoneNumber: editPhone,
        shopName: editShopName,
        gstNumber: editGstNumber,
        businessAddress: {
          street: editStreet,
          city: editCity,
          state: editState,
          pincode: editPincode,
        },
      });
      setSeller((prev) => (prev ? { ...prev, ...updated } : prev));
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8">Loading profile...</p>;

  if (!seller) {
    return <p className="p-8">Unable to load profile. Please try again.</p>;
  }

  const initial = seller.shopName?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-text-primary transition hover:text-accent"
      >
        <FiArrowLeft size={18} />
        Back
      </button>
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">
        Seller Profile
      </h1>

      <div className="rounded-2xl border border-border-default bg-surface-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-btn-primary text-xl font-semibold text-btn-primary-text">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {seller.shopName}
              </h2>
              <p className="text-sm text-text-secondary">{seller.email}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="flex items-center gap-1 text-sm font-medium text-text-primary hover:underline"
            >
              <FiEdit2 size={14} />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Seller Name
                </label>
                <input
                  value={editSellerName}
                  onChange={(e) => setEditSellerName(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Phone Number
                </label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Shop Name
              </label>
              <input
                value={editShopName}
                onChange={(e) => setEditShopName(e.target.value)}
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                GST Number (optional)
              </label>
              <input
                value={editGstNumber}
                onChange={(e) => setEditGstNumber(e.target.value)}
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Business Address (optional)
              </p>
              <div className="space-y-3">
                <input
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  placeholder="Street"
                  className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="City"
                    className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                  />
                  <input
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    placeholder="State"
                    className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                  />
                </div>
                <input
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  placeholder="Pincode"
                  className="w-full max-w-xs rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={handleSaveProfile}
                className="rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-lg border border-border-default px-5 py-2.5 text-sm font-medium text-text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Seller Name
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {seller.sellerName}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Phone Number
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {seller.phoneNumber || "Not added"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                GST Number
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {seller.gstNumber || "Not added"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Member Since
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {seller.createdAt
                  ? new Date(seller.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                    })
                  : "-"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Business Address
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {seller.businessAddress?.street
                  ? `${seller.businessAddress.street}, ${seller.businessAddress.city}, ${seller.businessAddress.state} - ${seller.businessAddress.pincode}`
                  : "Not added"}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 w-full rounded-lg border border-status-error px-5 py-3 text-sm font-medium text-status-error transition hover:bg-status-error hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}

export default SellerProfile;