import axiosInstance from "./axiosInstance";

export const addToWishlist = async (productId: string) => {
  const res = await axiosInstance.post("/wishlist/add-to-wishlist", {
    productId,
  });
  return res.data.data;
};

export const removeFromWishlist = async (productId: string) => {
  const res = await axiosInstance.delete(
    `/wishlist/remove-from-wishlist/${productId}`,
  );
  return res.data.data;
};

export const getWishlist = async () => {
  const res = await axiosInstance.get("/wishlist/get-wishlist");
  return res.data.data;
};