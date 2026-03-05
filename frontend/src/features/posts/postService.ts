import { api } from "@/lib/axios";

export const getPosts = async () => {
  const res = await fetch("http://localhost:3000/api/posts");

  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }

  const data = await res.json();

  return data.data; // ambil array post nya
};

export const getPostsPaginated = async (page: number, limit: number) => {
  const res = await fetch(
    `http://localhost:3000/api/posts?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }

  return res.json();
};

export const createPost = async (formData: FormData) => {
  const response = await api.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updatePost = async (
  id: number,
  formData: FormData
) => {
  const response = await api.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};