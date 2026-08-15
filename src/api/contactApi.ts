import axiosInstance from "./axiosInstance";

export const sendContactMessage = (data: {
  name: string;
  email: string;
  message: string;
}) => axiosInstance.post("/contact/send", data);

export const subscribeNewsletter = (email: string) =>
  axiosInstance.post("/newsletter/subscribe", { email });