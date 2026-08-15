import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { placeOrder, createPaymentOrder } from "../api/orderApi";
import { getMyAddresses, addAddress, type Address } from "../api/addressApi";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

interface CartProduct {
  _id: string;
  name: string;
  images?: { url: string }[];
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
}

function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newLabel, setNewLabel] = useState("Home");
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPincode, setNewPincode] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        const cartItems = cart.items || [];

        if (cartItems.length === 0) {
          toast.error("Your cart is empty");
          navigate("/cart");
          return;
        }

        setItems(cartItems);
      } catch (err) {
        console.log("Error fetching cart", err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getMyAddresses();
        setAddresses(data);

        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowAddForm(true);
        }
      } catch (err) {
        console.log("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const getSelectedAddress = () =>
    addresses.find((a) => a._id === selectedAddressId);

  const handleSaveNewAddress = async () => {
    if (!newFullName || !newPhone || !newStreet || !newCity || !newState || !newPincode) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setSavingAddress(true);
      const created = await addAddress({
        label: newLabel,
        fullName: newFullName,
        phone: newPhone,
        street: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
      });

      setAddresses((prev) => [created, ...prev]);
      setSelectedAddressId(created._id);
      setShowAddForm(false);

      setNewFullName("");
      setNewPhone("");
      setNewStreet("");
      setNewCity("");
      setNewState("");
      setNewPincode("");
      setNewLabel("Home");

      toast.success("Address saved");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to save address";
      toast.error(message);
    } finally {
      setSavingAddress(false);
    }
  };

  const buildShippingAddress = () => {
    const addr = getSelectedAddress();
    if (!addr) return null;
    return {
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    };
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = buildShippingAddress();

    if (!shippingAddress) {
      toast.error("Please select or add a shipping address");
      return;
    }

    if (paymentMethod === "ONLINE") {
      handleOnlinePayment();
      return;
    }

    try {
      setPlacing(true);
      const order = await placeOrder(shippingAddress, paymentMethod);
      refreshCartCount();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${order._id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to place order";
      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  const handleOnlinePayment = async () => {
    const shippingAddress = buildShippingAddress();
    if (!shippingAddress) {
      toast.error("Please select or add a shipping address");
      return;
    }

    try {
      setPlacing(true);
      const paymentData = await createPaymentOrder();

      const options = {
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Shopora",
        description: "Order Payment",
        order_id: paymentData.razorpayOrderId,
        handler: async (response: any) => {
          try {
            const order = await placeOrder(shippingAddress, "ONLINE", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            refreshCartCount();
            toast.success("Payment successful! Order placed.");
            navigate(`/order-success/${order._id}`);
          } catch (err: any) {
            const message =
              err?.response?.data?.message || "Payment verification failed";
            toast.error(message);
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            toast.error("Payment cancelled");
          },
        },
        theme: {
          color: "#111111",
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.on("payment.failed", () => {
        setPlacing(false);
        toast.error("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err: any) {
      setPlacing(false);
      const message =
        err?.response?.data?.message || "Failed to initiate payment";
      toast.error(message);
    }
  };

  if (loading) return <p className="p-8">Loading checkout...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <FiArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-semibold text-text-primary">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Address + Payment */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border-default bg-surface-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">
                Shipping Address
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="flex items-center gap-1 text-xs font-medium text-text-primary hover:underline"
              >
                <FiPlus size={14} />
                Add new address
              </button>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                      selectedAddressId === addr._id
                        ? "border-text-primary"
                        : "border-border-default"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-text-primary">
                        {addr.label} — {addr.fullName}
                        {addr.isDefault && (
                          <span className="ml-2 rounded bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="text-text-secondary">
                        {addr.street}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                      <p className="text-text-secondary">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {showAddForm && (
              <div className="mt-4 space-y-4 rounded-lg border border-border-default bg-surface-muted p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Label
                    </label>
                    <input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Home / Office"
                      className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      Full Name
                    </label>
                    <input
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Phone
                  </label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Street
                  </label>
                  <input
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      City
                    </label>
                    <input
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      State
                    </label>
                    <input
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    Pincode
                  </label>
                  <input
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-border-default px-4 py-3 text-sm outline-none focus:border-text-primary"
                  />
                </div>

                <button
                  type="button"
                  disabled={savingAddress}
                  onClick={handleSaveNewAddress}
                  className="rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-btn-primary-text disabled:opacity-50"
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border-default bg-surface-card p-6">
            <h2 className="mb-4 text-base font-semibold text-text-primary">
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-border-default p-3 text-sm text-text-primary">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-border-default p-3 text-sm text-text-primary">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                Online Payment
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="h-fit rounded-2xl border border-border-default bg-surface-card p-6">
          <h2 className="mb-4 text-base font-semibold text-text-primary">
            Order Summary
          </h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  {item.product?.name} × {item.quantity}
                </span>
                <span className="text-text-primary">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border-default pt-4 text-base font-semibold text-text-primary">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            type="button"
            disabled={placing}
            onClick={handlePlaceOrder}
            className="mt-6 w-full rounded-lg bg-btn-primary px-5 py-3 text-sm font-medium text-btn-primary-text transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>

          <Link
            to="/cart"
            className="mt-3 block text-center text-xs font-medium text-text-secondary hover:text-text-primary"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;