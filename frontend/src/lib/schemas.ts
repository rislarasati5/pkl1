import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 huruf"),
});

export const postSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  categoryId: z.string().min(1, "Pilih kategori"),
  image: z.any() // Untuk file upload
});