import axiosInstance from "./axiosInstance";

export const createReview = async (
  productId: string,
  orderId: string,
  rating: number,
  comment?: string,
) => {
  const res = await axiosInstance.post("/review/create-review", {
    productId,
    orderId,
    rating,
    comment,
  });
  return res.data.data;
};

export const getProductReviews = async (productId: string) => {
  const res = await axiosInstance.get(`/review/product/${productId}`);
  return res.data.data;
};

export const updateReview = async (
  reviewId: string,
  rating?: number,
  comment?: string,
) => {
  const res = await axiosInstance.put(`/review/update-review/${reviewId}`, {
    rating,
    comment,
  });
  return res.data.data;
};

export const deleteReview = async (reviewId: string) => {
  const res = await axiosInstance.delete(`/review/delete-review/${reviewId}`);
  return res.data.data;
};