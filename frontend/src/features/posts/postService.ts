import { api } from "@/lib/axios";

// postService.ts

export const getPosts = async () => {
  const res = await fetch("http://localhost:3000/api/posts?limit=1000");

  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }

  const data = await res.json();
  // Pastikan struktur return datanya benar
  // Jika backend return { data: [...] } maka pakai data.data
  // Jika backend return langsung [...] maka pakai data
  return data.data || data; 
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

// Fungsi untuk menandai pesanan SELESAI (bukan menghapus permanen)
// features/posts/postService.ts

export const completeOrder = async (id: number) => {
  // Ganti .patch menjadi .put agar sesuai dengan backend
  const response = await api.put(`/orders/${id}`, { status: "selesai" });
  return response.data;
};

// Ambil semua data (nantinya kita filter di masing-masing halaman)
export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error saat getAllOrders:", error);
    throw new Error("Gagal mengambil data pesanan");
  }
};