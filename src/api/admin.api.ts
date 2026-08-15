import axiosInstance from "./axiosInstance";
import type { AdminLoginFormData, AdminRegisterFormData } from "../types/admin.types";

export const loginAdmin = async (data: AdminLoginFormData) => {
  const res = await axiosInstance.post("/admin/admin-login", data);
  return res.data;
};

export const registerAdmin = async (data: AdminRegisterFormData) => {
  const res = await axiosInstance.post("/admin/admin-register", data);
  return res.data;
};

export const getAdminProfile = async () => {
  const res = await axiosInstance.get("/admin/admin-profile");
  return res.data.data;
};

export const logoutAdmin = async () => {
  const res = await axiosInstance.post("/admin/admin-logout");
  return res.data;
};

export const getAllSellers = async () => {
  const res = await axiosInstance.get("/admin/sellers");
  return res.data.data;
};

export const blockSeller = async (id: string) => {
  const res = await axiosInstance.put(`/admin/block-seller/${id}`);
  return res.data.data;
};

export const unblockSeller = async (id: string) => {
  const res = await axiosInstance.put(`/admin/unblock-seller/${id}`);
  return res.data.data;
};