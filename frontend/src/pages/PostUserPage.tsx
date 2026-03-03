import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../features/posts/postService"; // Service yang sama dengan Admin
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PostUserPage() {
  // 1. Port 9000 adalah port API MinIO. Pastikan bucket 'pkl-image' sudah PUBLIC.
  const MINIO_BASE_URL = "http://localhost:9000/pkl-image"; 

  // 2. Mengambil data menggunakan query key yang sama ["posts"] agar sinkron
  const { data: menus, isLoading } = useQuery({ 
    queryKey: ["posts"], 
    queryFn: getPosts 
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 bg-white min-h-screen text-left">
      {/* Header Clean */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Daftar Menu</h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">Dibuat dengan bahan pilihan dan bumbu rahasia dari dapur kami.</p>
        <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {menus?.map((item: any) => (
          <Card key={item.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-slate-50">
            {/* Foto Makanan */}
            <div className="relative h-60 w-full overflow-hidden">
              <img 
                src={item.gambar} 
                alt={item.judul}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x400?text=Cek+URL+Database";
                }}
              />
              {/* Badge Kategori */}
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

      {/* Jika Data Kosong */}
      {(!menus || menus.length === 0) && (
        <div className="text-center py-20 text-slate-400">
          <p>Belum ada menu yang tersedia saat ini.</p>
        </div>
      )}
    </div>
  );
}