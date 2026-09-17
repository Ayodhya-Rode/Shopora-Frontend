import axios from "axios";
import {
  getUserToken,
  getSellerToken,
  getAdminToken,
  setUserToken,
  setSellerToken,
  setAdminToken,
  getUserTokenSetter,
  getSellerTokenSetter,
  getAdminTokenSetter,
} from "./tokenStore";

const SELLER_ONLY_PATHS = [
  "/product/my-products",
  "/product/create-product",
  "/product/update-product",
  "/product/delete-product",
  "/order/seller-orders",
  "/order/seller-update-status",
  "/order/seller/sales-analytics",
];

const ADMIN_ONLY_PATHS = [
  "/category/create-category",
  "/category/update-category",
  "/category/delete-category",
];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const isSellerRoute = (url?: string) =>
  url?.startsWith("/seller") ||
  SELLER_ONLY_PATHS.some((path) => url?.startsWith(path));

const isAdminRoute = (url?: string) =>
  url?.startsWith("/admin") ||
  ADMIN_ONLY_PATHS.some((path) => url?.startsWith(path));

// attach correct token before every request
axiosInstance.interceptors.request.use((config) => {
  if (isAdminRoute(config.url)) {
    const token = getAdminToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else if (isSellerRoute(config.url)) {
    const token = getSellerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } else {
    const token = getUserToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// catch expired token errors and silently refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refreshToken") &&
      !originalRequest.url?.includes("login") &&
      !originalRequest.url?.includes("register")
    ) {
      originalRequest._retry = true;

      try {
        if (isAdminRoute(originalRequest.url)) {
          const res = await axiosInstance.post("/admin/admin-refreshToken");
          const newToken = res.data.data.accessToken;

          setAdminToken(newToken);
          getAdminTokenSetter()?.(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        } else if (isSellerRoute(originalRequest.url)) {
          const res = await axiosInstance.post("/seller/seller-refreshToken");
          const newToken = res.data.data.accessToken;

          setSellerToken(newToken);
          getSellerTokenSetter()?.(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        } else {
          const res = await axiosInstance.post("/users/user-refreshToken");
          const newToken = res.data.data.accessToken;

          setUserToken(newToken);
          getUserTokenSetter()?.(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        if (isAdminRoute(originalRequest.url)) {
          setAdminToken(null);
          getAdminTokenSetter()?.(null);
          window.location.href = "/admin-login";
        } else if (isSellerRoute(originalRequest.url)) {
          setSellerToken(null);
          getSellerTokenSetter()?.(null);
          window.location.href = "/seller-login";
        } else {
          setUserToken(null);
          getUserTokenSetter()?.(null);
          window.location.href = "/user-login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;