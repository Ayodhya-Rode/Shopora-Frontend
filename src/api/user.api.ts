import axiosInstance from "./axiosInstance";
import type { UserLoginFormData, UserRegisterFormData } from "../types/user.types";

export const loginUser = async (data: UserLoginFormData) => {
  const res = await axiosInstance.post("/users/user-login", data);
  return res.data;
};

export const registerUser = async (data: UserRegisterFormData) => {
  const res = await axiosInstance.post("/users/user-register", data);
  return res.data;
};

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/users/user-profile");
  return res.data.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/users/user-logout");
  return res.data;
};

export const updateUserProfile = async (data: {
  userName?: string;
  phoneNumber?: string;
}) => {
  const res = await axiosInstance.put("/users/user-profile", data);
  return res.data.data;
};