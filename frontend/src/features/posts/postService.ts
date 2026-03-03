import { api } from "@/lib/axios";

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data.data;
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