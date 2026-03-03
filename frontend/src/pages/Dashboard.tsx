import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, deletePost, updatePost } from "../features/posts/postService";
import { getCategories } from "../features/categories/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, FileText, Layers, Loader2, Pencil, Check, X } from "lucide-react";

export default function Dashboard() {
  const queryClient = useQueryClient();

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editJudul, setEditJudul] = useState("");
  const [editIsi, setEditIsi] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  const { data: posts, isLoading: postLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setJudul("");
      setIsi("");
      setCategoryId("");
      setFile(null);
      alert("Konten berhasil dipublish!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: any) =>
      updatePost(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setEditingId(null);
      setEditFile(null);
      alert("Berhasil diupdate!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Data berhasil dihapus!");
    },
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!judul || !isi || !categoryId || !file) {
      return alert("Mohon lengkapi semua data!");
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    formData.append("gambar", file);

    createMutation.mutate(formData);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm">
          Kelola konten dan kategori dengan mudah
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ================= FORM TAMBAH ================= */}
        <Card className="shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-blue-600" />
              Tambah Produk Baru
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePost} className="space-y-4">

              <Input
                placeholder="Judul Konten"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
              />

              <select
                className="w-full p-2 border rounded-lg bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <Textarea
                placeholder="Isi Konten"
                className="min-h-[120px]"
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
              />

              <Input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

              <Button
                className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Publish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ================= TABLE ================= */}
        <Card className="xl:col-span-2 shadow-xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-600" />
              Daftar Produk
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Konten</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {postLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      <Loader2 className="animate-spin mx-auto h-6 w-6" />
                    </TableCell>
                  </TableRow>
                ) : (
                  posts?.map((post: any) => (
                    <TableRow key={post.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex gap-4 items-start">

                          <img
                            src={
                              post.gambar ||
                              "https://placehold.co/100x100"
                            }
                            className="w-20 h-20 object-cover rounded-xl border shadow-sm"
                          />

                          <div className="flex-1 space-y-2">

                            {editingId === post.id ? (
                              <>
                                <Input
                                  value={editJudul}
                                  onChange={(e) =>
                                    setEditJudul(e.target.value)
                                  }
                                />

                                <Textarea
                                  value={editIsi}
                                  onChange={(e) =>
                                    setEditIsi(e.target.value)
                                  }
                                />

                                <select
                                  className="w-full p-2 border rounded-lg"
                                  value={editCategoryId}
                                  onChange={(e) =>
                                    setEditCategoryId(e.target.value)
                                  }
                                >
                                  {categories?.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>

                                <Input
                                  type="file"
                                  onChange={(e) =>
                                    setEditFile(
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <p className="font-semibold text-slate-800">
                                  {post.judul}
                                </p>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                  {post.isi}
                                </p>
                              </>
                            )}

                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium text-slate-600">
                        {post.category_name}
                      </TableCell>

                      <TableCell className="text-right">
                        {editingId === post.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-green-100"
                              onClick={() => {
                                const formData = new FormData();
                                formData.append("judul", editJudul);
                                formData.append("isi", editIsi);
                                formData.append(
                                  "category_id",
                                  editCategoryId
                                );

                                if (editFile) {
                                  formData.append(
                                    "gambar",
                                    editFile
                                  );
                                }

                                updateMutation.mutate({
                                  id: post.id,
                                  formData,
                                });
                              }}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-gray-100"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-blue-100"
                              onClick={() => {
                                setEditingId(post.id);
                                setEditJudul(post.judul);
                                setEditIsi(post.isi || "");
                                setEditCategoryId(
                                  String(post.category_id)
                                );
                              }}
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-red-100"
                              onClick={() =>
                                deleteMutation.mutate(post.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  </div>
);
}