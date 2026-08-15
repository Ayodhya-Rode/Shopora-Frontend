import axiosInstance from "./axiosInstance";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface RazorpayVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export const placeOrder = async (
  shippingAddress: ShippingAddress,
  paymentMethod: "COD" | "ONLINE",
   razorpayDetails?: RazorpayVerification,
) => {
  const res = await axiosInstance.post("/order/place-order", {
    shippingAddress,
    paymentMethod,
    ...(razorpayDetails && {      // when payment is online only then include resorpay and its fields
      razorpayOrderId: razorpayDetails.razorpayOrderId,
      razorpayPaymentId: razorpayDetails.razorpayPaymentId,
      razorpaySignature: razorpayDetails.razorpaySignature,
    }),
  });
  return res.data.data;
};

export const getMyOrders = async () => {
  const res = await axiosInstance.get("/order/my-orders");
  return res.data.data;
};

export const getOrderById = async (id: string) => {
  const res = await axiosInstance.get(`/order/order/${id}`);
  return res.data.data;
};

export const cancelOrder = async (id: string) => {
  const res = await axiosInstance.put(`/order/cancel-order/${id}`);
  return res.data.data;
};

export const getSellerOrders = async (status?: string, search?: string) => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  if (search) params.search = search;

  const res = await axiosInstance.get("/order/seller-orders", { params });
  return res.data.data;
};

export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  const res = await axiosInstance.put(
    `/order/seller-update-status/${orderId}`,
    { orderStatus },
  );
  return res.data.data;
};

export const createPaymentOrder = async () => {
  const res = await axiosInstance.post("/order/create-payment-order");
  return res.data.data;
};