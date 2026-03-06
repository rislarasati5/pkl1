import { api } from "@/lib/axios";

export const getPosts = async () => {
  const res = await fetch("http://localhost:3000/api/posts");

  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }

  const data = await res.json();

  return data.data; // ambil array post nya
};

export const getPostsPaginated = async (page = 1, limit = 8, search = "") => {
  const res = await fetch(
    `http://localhost:3000/api/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
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

export const postOrder = async (orderPayload: any) => {
  const res = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });

  if (!res.ok) throw new Error("Gagal mengirim pesanan");
  return res.json();
};

// features/posts/postService.ts
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");

    console.log("Response orders:", response.data);

    // Jika backend return {data: [...]}
    if (response.data.data) {
      return response.data.data;
    }

    // Jika backend return langsung array
    return response.data;

  } catch (error) {
    console.error("Error saat getAllOrders:", error);
    throw new Error("Gagal mengambil data pesanan");
  }
};

// Fungsi untuk menghapus pesanan yang sudah selesai
export const deleteOrder = async (id: number) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};