import axiosInstance from "./axiosInstance";

export interface ChatProduct {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string | null;
}

export const sendChatMessage = async (message: string) => {
  const res = await axiosInstance.post("/chatbot/message", { message });
  return res.data.data as { reply: string; products?: ChatProduct[] };
};