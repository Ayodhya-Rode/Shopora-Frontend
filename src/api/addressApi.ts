import axiosInstance from "./axiosInstance";

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const addAddress = async (data: Omit<Address, "_id" | "isDefault">) => {
  const res = await axiosInstance.post("/address/add-address", data);
  return res.data.data as Address;
};

export const getMyAddresses = async () => {
  const res = await axiosInstance.get("/address/my-addresses");
  return res.data.data as Address[];
};

export const updateAddress = async (
  id: string,
  data: Partial<Omit<Address, "_id" | "isDefault">>,
) => {
  const res = await axiosInstance.put(`/address/update-address/${id}`, data);
  return res.data.data as Address;
};

export const deleteAddress = async (id: string) => {
  const res = await axiosInstance.delete(`/address/delete-address/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id: string) => {
  const res = await axiosInstance.put(`/address/set-default/${id}`);
  return res.data.data as Address;
};