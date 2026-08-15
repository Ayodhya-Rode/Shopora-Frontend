import axiosInstance from "./axiosInstance";

export const addToCart = async (
  productId: string,
  quantity: number,
  size?: string,
  color?: string,
) => {
  const res = await axiosInstance.post("/cart/add-to-cart", {
    productId,
    quantity,
    size,
    color,
  });
  return res.data.data;
};

export const getCart = async () => {
  const res = await axiosInstance.get("/cart/get-cart");
  return res.data.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const res = await axiosInstance.put("/cart/update-cart-item", {
    itemId,
    quantity,
  });
  return res.data.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await axiosInstance.delete("/cart/remove-cart-item", {
    data: { itemId },
  });
  return res.data.data;
};

export const clearCart = async () => {
  const res = await axiosInstance.delete("/cart/clear-cart");
  return res.data.data;
};