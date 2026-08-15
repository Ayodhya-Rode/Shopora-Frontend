import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
} from "../api/addressApi";

interface AddressFormState {
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

const emptyForm: AddressFormState = {
  label: "Home",
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

function AddressBookPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getMyAddresses();
      setAddresses(data);
    } catch (err) {
      console.log("Error fetching addresses", err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (addr: Address) => {
    setEditingId(addr._id);
    setForm({
      label: addr.label,
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    const { fullName, phone, street, city, state, pincode } = form;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const updated = await updateAddress(editingId, form);
        setAddresses((prev) =>
          prev.map((a) => (a._id === editingId ? updated : a)),
        );
        toast.success("Address updated");
      } else {
        const created = await addAddress(form);
        setAddresses((prev) => [created, ...prev]);
        toast.success("Address added");
      }

      closeForm();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to save address";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAddress(id);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete address";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setSettingDefaultId(id);
      await setDefaultAddress(id);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to set default address";
      toast.error(message);
    } finally {
      setSettingDefaultId(null);
    }
  };

  if (loading) return <p className="p-8">Loading addresses...</p>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">My Addresses</h1>
        <button
          type="button"
          onClick={openAddForm}
          className="flex items-center gap-1 rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-btn-primary-text hover:opacity-85"
        >
          <FiPlus size={16} />
          Add Address
        </button>
      </div>

      {addresses.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-border-default bg-surface-card p-10 text-center">
          <FiMapPin size={40} className="mx-auto text-text-secondary" />
          <p className="mt-4 text-sm text-text-secondary">
            You haven't saved any addresses yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="rounded-2xl border border-border-default bg-surface-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-medium text-text-primary">
                    {addr.label} — {addr.fullName}
                    {addr.isDefault && (
                      <span className="rounded bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-sm text-text-secondary">{addr.phone}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openEditForm(addr)}
                    className="text-text-secondary hover:text-text-primary"
                    aria-label="Edit address"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === addr._id}
                    onClick={() => handleDelete(addr._id)}
                    className="text-status-error hover:opacity-70 disabled:opacity-40"
                    aria-label="Delete address"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {!addr.isDefault && (
                <button
                  type="button"
                  disabled={settingDefaultId === addr._id}
                  onClick={() => handleSetDefault(addr._id)}
                  className="mt-3 text-xs font-medium text-text-primary underline hover:opacity-70 disabled:opacity-50"
                >
                  {settingDefaultId === addr._id
                    ? "Setting..."
                    : "Set as default"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="mt-6 space-y-4 rounded-2xl border border-border-default bg-surface-card p-6">
          <h2 className="text-base font-semibold text-text-primary">
            {editingId ? "Edit Address" : "New Address"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Label
              </label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Home / Office"
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Full Name
              </label>
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Street
            </label>
            <input
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                City
              </label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                State
              </label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Pincode
            </label>
            <input
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="w-full max-w-xs rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="rounded-lg bg-btn-primary px-5 py-2.5 text-sm font-medium text-btn-primary-text disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-border-default px-5 py-2.5 text-sm font-medium text-text-primary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressBookPage;