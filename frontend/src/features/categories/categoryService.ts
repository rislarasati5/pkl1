// src/features/categories/categoryService.ts
import { api } from "@/lib/axios";

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  // Mengambil array dari dalam wrapper response.success backend
  return response.data.data; 
};

export const createCategory = async (name: string) => {
  const response = await api.post("/categories", { name });
  return response.data;
};

export const updateCategory = async ({ id, name }: { id: number; name: string }) => {
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};