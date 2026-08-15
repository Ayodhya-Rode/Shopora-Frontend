import axiosInstance from "./axiosInstance";
import type { SellerLoginFormData, SellerRegisterFormData } from "../types/seller.types";

//For login seller
export const loginSeller = async (data: SellerLoginFormData) => {
  const res = await axiosInstance.post("/seller/seller-login", data);
  return res.data;
};

//for register seller
export const registerSeller = async (data: SellerRegisterFormData) => {
  const res = await axiosInstance.post("/seller/seller-register", data);
  return res.data;
};

//for getting ogged-in seller's profile
export const getSellerProfile = async () => {
  const res = await axiosInstance.get("/seller/seller-profile");
  return res.data.data;
};

// For logout seller
export const logoutSeller = async () => {
  const res = await axiosInstance.post("/seller/seller-logout");
  return res.data;
};

// For seller sales analytics
export const getSellerSalesAnalytics = async (
  period: "7days" | "30days" | "3months" | "6months" | "1year" = "30days"
) => {
  const res = await axiosInstance.get("/order/seller/sales-analytics", {
    params: { period },
  });

  return res.data.data; // array of { date, sales, orders, productsSold }
};


export const updateSellerProfile = async (data: {
  sellerName?: string;
  phoneNumber?: string;
  shopName?: string;
  shopLogo?: string;
  gstNumber?: string;
  businessAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}) => {
  const res = await axiosInstance.put("/seller/seller-profile", data);
  return res.data.data;
};