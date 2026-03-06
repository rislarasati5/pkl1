import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
// Import postOrder dari service
import { getPostsPaginated, postOrder } from "../features/posts/postService"; 
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Search, Utensils, ShoppingCart, Plus, Minus, Send, ChevronLeft, ChevronRight } from "lucide-react";

export default function PostUserPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 6;

  // --- STATE PEMESANAN ---
  const [namaPemesan, setNamaPemesan] = useState("");
  const [nomorMeja, setNomorMeja] = useState<number | "">("");
  const [cart, setCart] = useState<any[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: () => getPostsPaginated(page, limit, search),
    placeholderData: (previousData) => previousData,
  });

  const menus = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  // --- LOGIKA KERANJANG ---
  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === itemId ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalHarga = cart.reduce((acc, item) => {
    const harga = parseInt(item.isi.replace(/\D/g, ""));
    return acc + harga * item.qty;
  }, 0);

  // --- MUTATION KE BACKEND ---
  const mutation = useMutation({
    mutationFn: postOrder, // Menggunakan fungsi dari postService.ts
    onSuccess: () => {
      alert("Pesanan Berhasil Terkirim ke Dapur!");
      setCart([]);
      setNamaPemesan("");
      setNomorMeja("");
    },
    onError: (err: any) => {
      alert("Gagal: " + err.message);
    },
  });

  const handleCheckout = () => {
    if (!namaPemesan || !nomorMeja || cart.length === 0) {
      alert("Mohon isi Nama, Nomor Meja, dan pilih Menu.");
      return;
    }
    
    // Payload yang dikirim ke backend
    mutation.mutate({
      nama_pemesan: namaPemesan,
      nomor_meja: Number(nomorMeja),
      total_harga: totalHarga,
      items: cart.map(item => ({
        id: item.id,
        judul: item.judul,
        isi: item.isi,
        qty: item.qty
      })),
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 bg-white min-h-screen text-left flex flex-col lg:flex-row gap-10">
      
      {/* BAGIAN KIRI: DAFTAR MENU & PAGINATION */}
      <div className="flex-grow space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center lg:text-left">Daftar Menu</h1>
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari menu favorit..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-400 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {(isLoading || isFetching) && menus.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {menus.map((item: any) => {
              const inCart = cart.find((i) => i.id === item.id);
              return (
                <Card key={item.id} className="group rounded-[2rem] overflow-hidden bg-slate-50 border-none shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative h-44 w-full">
                    <img src={item.gambar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.judul} />
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold rounded-full shadow-sm uppercase tracking-widest">
                        <Utensils size={10} /> {item.category_name || "Menu"}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="h-14">
                      <h2 className="font-bold text-lg text-slate-800 leading-tight">{item.judul}</h2>
                      <p className="text-orange-500 font-black">{item.isi}</p>
                    </div>
                    
                    <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-inner border border-slate-100">
                      {inCart ? (
                        <>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 bg-slate-50 rounded-xl hover:bg-orange-100 text-orange-600 transition-colors"><Minus size={16} /></button>
                          <span className="font-bold text-slate-800">{inCart.qty}</span>
                          <button onClick={() => addToCart(item)} className="p-2 bg-slate-50 rounded-xl hover:bg-orange-100 text-orange-600 transition-colors"><Plus size={16} /></button>
                        </>
                      ) : (
                        <button onClick={() => addToCart(item)} className="w-full py-2 flex items-center justify-center gap-2 font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-all"><Plus size={18} /> Tambah</button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-3 rounded-xl bg-slate-100 disabled:opacity-30 hover:bg-slate-200 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">{page}</span>
              <span className="text-slate-400">/ {totalPages}</span>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-3 rounded-xl bg-slate-100 disabled:opacity-30 hover:bg-slate-200 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* BAGIAN KANAN: SIDEBAR KERANJANG */}
      <div className="w-full lg:w-96 bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl h-fit sticky top-6 overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-500 rounded-2xl"><ShoppingCart size={24} /></div>
          <h2 className="text-2xl font-black">Pesanan</h2>
        </div>

        <div className="space-y-3 mb-8">
          <input 
            type="text" placeholder="Nama Anda" 
            value={namaPemesan} onChange={(e) => setNamaPemesan(e.target.value)}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
          <input 
            type="number" placeholder="Nomor Meja" 
            value={nomorMeja} onChange={(e) => setNomorMeja(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
        </div>

        <div className="space-y-4 max-h-64 overflow-y-auto mb-8 pr-2 custom-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200">{item.judul}</span>
                <span className="text-xs text-slate-500">{item.qty} porsi</span>
              </div>
              <span className="text-sm font-black text-orange-400">
                Rp {(parseInt(item.isi.replace(/\D/g, "")) * item.qty).toLocaleString()}
              </span>
            </div>
          ))}
          {cart.length === 0 && <p className="text-slate-500 italic text-center py-6 text-sm">Keranjang masih kosong...</p>}
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-6">
          <div className="flex justify-between items-end">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Bayar</span>
            <span className="text-3xl font-black text-orange-500">Rp {totalHarga.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={mutation.isPending || cart.length === 0}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <><Send size={20} /> KIRIM PESANAN</>}
          </button>
        </div>
      </div>
    </div>
  );
}