import { api } from "../../lib/axios";

export const loginUser = async (credentials: any) => {
  const { data } = await api.post("/login", credentials);
  return data;
};

// Tambahkan ini untuk registrasi
export const registerUser = async (userData: any) => {
  const { data } = await api.post("/register", userData);
  return data;
};