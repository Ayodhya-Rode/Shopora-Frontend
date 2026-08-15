import axiosInstance from "./axiosInstance";

export const getCategories = async () => {
  const res = await axiosInstance.get("/category/categories");
  return res.data.data;
};

export interface CategoryPayload {
  name: string;
  slug: string;
  parentCategory?: string | null;
  image?: string | null;
  isActive?: boolean;
}

export const createCategory = async (data: CategoryPayload) => {
  const res = await axiosInstance.post("/category/create-category", data);
  return res.data.data;
};

export const updateCategory = async (id: string, data: CategoryPayload) => {
  const res = await axiosInstance.put(`/category/update-category/${id}`, data);
  return res.data.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axiosInstance.delete(`/category/delete-category/${id}`);
  return res.data.data;
};