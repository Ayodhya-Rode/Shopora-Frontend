import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  logoutUser,
} from "../../api/user.api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { getMyAddresses, type Address } from "../../api/addressApi";

interface UserAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface UserData {
  _id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  address?: UserAddress[];
  createdAt?: string;
}

function UserProfile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setEditUserName(data.userName || "");
        setEditPhone(data.phoneNumber || "");
      } catch (err) {
        console.log("Error fetching profile", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getMyAddresses();
        setAddresses(data);
      } catch (err) {
        console.log("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAccessToken(null);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      console.log("Logout failed", err);
      toast.error("Logout failed, please try again");
    }
  };

  const startEditing = () => {
    if (!user) return;
    setEditUserName(user.userName || "");
    setEditPhone(user.phoneNumber || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!editUserName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUserProfile({
        userName: editUserName,
        phoneNumber: editPhone,
      });
      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
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

  if (!user) {
    return <p className="p-8">Unable to load profile. Please try again.</p>;
  }

  const initial = user.userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 cursor-pointer flex items-center gap-2 text-sm font-medium text-text-primary transition hover:text-accent"
      >
        <FiArrowLeft size={18} />
        Back
      </button>
      <h1 className="mb-6 text-2xl font-semibold text-text-primary">My Profile</h1>

      {/* Basic info card */}
      <div className="rounded-2xl border border-border-default bg-surface-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-btn-primary text-xl font-semibold text-btn-primary-text">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {user.userName}
              </h2>
              <p className="text-sm text-text-secondary">{user.email}</p>
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
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Name
              </label>
              <input
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
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
                Phone Number
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {user.phoneNumber || "Not added"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                Member Since
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                    })
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Address book */}
      {/* Address book */}
      <div className="mt-6 rounded-2xl border border-border-default bg-surface-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">
            Saved Addresses
          </h3>
          <Link
            to="/addresses"
            className="text-sm font-medium text-text-primary hover:underline"
          >
            Manage
          </Link>
        </div>

        {addresses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="rounded-xl border border-border-default p-4 text-sm text-text-primary"
              >
                {addr.isDefault && (
                  <span className="mb-2 inline-block rounded-full bg-section-tint px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Default
                  </span>
                )}
                <p className="font-medium">
                  {addr.label} — {addr.fullName}
                </p>
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            No saved addresses yet. Add one at checkout or from the address
            book.
          </p>
        )}
      </div>

      {/* Quick links */}
      <div className="mt-6 rounded-2xl border border-border-default bg-surface-card p-6">
        <h3 className="mb-4 text-base font-semibold text-text-primary">
          Quick Links
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="flex-1 rounded-lg border border-text-primary px-4 py-3 text-center text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
          >
            My Orders
          </Link>
          <Link
            to="/addresses"
            className="flex-1 rounded-lg border border-text-primary px-4 py-3 text-center text-sm font-medium text-text-primary transition hover:bg-btn-primary hover:text-btn-primary-text"
          >
            Manage Addresses
          </Link>
        </div>
      </div>

      {/* Logout */}
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

export default UserProfile;
