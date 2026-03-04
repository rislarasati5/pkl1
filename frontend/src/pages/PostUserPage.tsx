import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../features/posts/postService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PostUserPage() {
  const [page, setPage] = useState(1);
  const limit = 8; // jumlah item per halaman

  const { data: menus, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  // LOGIC PAGINATION FRONTEND
  const totalItems = menus?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentData = menus?.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 bg-white min-h-screen text-left">
      
      {/* HEADER */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          Daftar Menu
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">
          Dibuat dengan bahan pilihan dan bumbu rahasia dari dapur kami.
        </p>
        <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* GRID MENU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentData?.map((item: any) => (
          <Card
            key={item.id}
            className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-slate-50"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <img
                src={item.gambar}
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/400x400?text=Cek+URL+Database";
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold rounded-xl shadow-sm uppercase tracking-wider">
                  {item.category_name || "Menu"}
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-3">
              <h2 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                {item.judul}
              </h2>
              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                {item.isi || "Deskripsi menu ini belum ditambahkan."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>


    {/* PAGINATION BUTTON */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-10">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-slate-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold text-slate-600">
            Halaman {page} dari {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* DATA KOSONG */}
      {(!menus || menus.length === 0) && (
        <div className="text-center py-20 text-slate-400">
          <p>Belum ada menu yang tersedia saat ini.</p>
        </div>
      )}
    </div>
  );
}