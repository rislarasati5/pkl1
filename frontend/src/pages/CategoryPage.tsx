import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Pastikan path ini benar sesuai folder kamu
import { getCategories, createCategory, deleteCategory, updateCategory } from "../features/categories/categoryService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const queryClient = useQueryClient();

  // READ: Ambil Data
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // CREATE: Tambah Data
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryName("");
    },
    onError: (error: any) => alert(error.response?.data?.message || "Gagal menambah data"),
  });

  // UPDATE: Edit Data
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
    },
  });

  // DELETE: Hapus Data
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    createMutation.mutate(categoryName);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Manajemen Kategori
          </h1>
          <p className="text-slate-500">
            Kelola kategori produk atau konten Anda di sini.
          </p>
        </div>

        <div className="bg-white shadow-sm px-4 py-2 rounded-xl border text-sm font-semibold text-slate-600">
          Total: {Array.isArray(categories) ? categories.length : 0} Item
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* KOLOM KIRI - FORM */}
        <Card className="lg:col-span-1 rounded-2xl shadow-lg border-0 bg-white h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700">
              Tambah Kategori Baru
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Nama Kategori</Label>
                <Input
                  id="category"
                  placeholder="Contoh: Elektronik, Pakaian..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="h-11 rounded-lg focus-visible:ring-emerald-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Kategori"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* KOLOM KANAN - TABLE */}
        <Card className="lg:col-span-2 rounded-2xl shadow-lg border-0 bg-white overflow-hidden">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-lg font-semibold text-slate-700">
              Daftar Kategori
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-[80px] text-center">No</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
                      <p className="mt-3 text-slate-500">
                        Memuat data kategori...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <TableRow
                      key={cat.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <TableCell className="text-center text-slate-400 font-mono">
                        {index + 1}
                      </TableCell>

                      <TableCell className="font-medium text-slate-700">
                        {editingId === cat.id ? (
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-9 rounded-lg focus-visible:ring-emerald-500"
                            autoFocus
                          />
                        ) : (
                          cat.name
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {editingId === cat.id ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                              onClick={() =>
                                updateMutation.mutate({
                                  id: cat.id,
                                  name: editValue,
                                })
                              }
                            >
                              <Check className="h-4 w-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-slate-400 hover:bg-slate-100"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                              onClick={() => {
                                setEditingId(cat.id);
                                setEditValue(cat.name);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:bg-red-50"
                              onClick={() => {
                                if (confirm(`Hapus "${cat.name}"?`))
                                  deleteMutation.mutate(cat.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-20 text-slate-400 italic"
                    >
                      Belum ada data kategori.
                    </TableCell>
                  </TableRow>
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