import axiosInstance from "./axiosInstance";

export const getAllProducts = async (search?: string) => {
  const params = search ? { search } : {};
  const res = await axiosInstance.get("/product/all-product", { params });
  return res.data.data;
};

export const getProductsByCategory = async (slug: string) => {
  const res = await axiosInstance.get(`/product/products-by-category/${slug}`);
  return res.data.data;
};

// To get all products of logged in seller
export const getMyProducts = async () => {
  const res = await axiosInstance.get("/product/my-products");
  return res.data.data;
};

//Create product ----- Sends product data as FormData(img)
export const createProduct = async (formData: FormData) => {
  const res = await axiosInstance.post("/product/create-product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

//Get product by ID
export const getProductById = async (id: string) => {
  const res = await axiosInstance.get(`/product/get-product/${id}`);
  return res.data.data;
};

export const updateProduct = async (id: string, formData: FormData) => {
  const res = await axiosInstance.put(`/product/update-product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axiosInstance.delete(`/product/delete-product/${id}`);
  return res.data;
};

export const getRecommendedProducts = async (productId: string) => {
  const res = await axiosInstance.get(`/product/recommendations/${productId}`);
  return res.data.data;
};