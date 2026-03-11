import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, completeOrder, getPosts } from "../features/posts/postService";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, CheckCircle2, Timer } from "lucide-react";

export default function OrderAdminPage() {
  const queryClient = useQueryClient();

  // ================= AMBIL DATA ORDER =================
  const { data: orders, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    refetchInterval: 5000,
  });

  // ================= AMBIL DATA MENU DARI DASHBOARD =================
  const { data: menu } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const activeOrders = orders
    ? orders
        .filter((order: any) => order.status !== "selesai")
        .sort((a: any, b: any) => a.id - b.id)
    : [];

  // ================= MUTATION SELESAIKAN ORDER =================
  const mutation = useMutation({
    mutationFn: completeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      alert("Pesanan Selesai!");
    },
    onError: () => {
      alert("Gagal memproses pesanan.");
    }
  });

  // ================= AMBIL HARGA DARI MENU =================
  const getHargaMenu = (judul: string) => {
    if (!menu) return 0;

    const found = menu.find((m: any) => m.judul === judul);

    if (!found) return 0;

    return Number(
      found.isi
        ?.replace("Rp.", "")
        ?.replace("Rp", "")
        ?.replace(/\./g, "")
        ?.trim()
    ) || 0;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-left">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Antrean Dapur</h1>
          <p className="text-slate-500 text-sm">
            Menampilkan {activeOrders.length} pesanan aktif
          </p>
        </div>

        <Button
          onClick={() => refetch()}
          variant="outline"
          className="gap-2"
          disabled={isFetching}
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Sync Data
        </Button>
      </div>

      {/* GRID ORDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {activeOrders.map((order: any, index: number) => (
          <div
            key={order.id}
            className={`border-t-8 bg-white rounded-xl shadow-md overflow-hidden flex flex-col ${
              index === 0
                ? "border-orange-500 ring-2 ring-orange-100"
                : "border-slate-300"
            }`}
          >

            {/* HEADER ORDER */}
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <span className="text-[10px] text-orange-600 uppercase tracking-widest">
                  {index === 0 ? "🔥 PRIORITAS" : `ANTREAN #${index + 1}`}
                </span>

                <h3 className="text-lg text-slate-800 truncate">
                  {order.nama_pemesan}
                </h3>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase">Meja</p>
                <p className="text-3xl text-blue-600">{order.nomor_meja}</p>
              </div>
            </div>

            {/* ITEM ORDER */}
            <div className="p-4 space-y-3 flex-grow min-h-[160px]">

              {order.items?.map((item: any, idx: number) => {

                const hargaSatuan = getHargaMenu(item.judul);
                const qty = item.qty || 1;
                const subtotal = hargaSatuan * qty;

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-slate-100 pb-2"
                  >
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-center">
                        <span className="text-orange-600 text-sm">
                          {qty}x
                        </span>

                        <span className="text-slate-700 text-sm capitalize">
                          {item.judul}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 ml-6">
                        @Rp {hargaSatuan.toLocaleString()}
                      </span>
                    </div>

                    <span className="text-xs text-slate-600">
                      Rp {subtotal.toLocaleString()}
                    </span>
                  </div>
                );
              })}

            </div>

            {/* TOTAL */}
            <div className="p-4 bg-slate-50 border-t mt-auto">

              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400 uppercase">
                  Total Bill
                </span>

                <span className="text-xl text-slate-900">
                  Rp {Number(order.total_harga || 0).toLocaleString()}
                </span>
              </div>

              <Button
                className={`w-full py-6 rounded-xl gap-2 text-white ${
                  index === 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-slate-800 hover:bg-black"
                }`}
                onClick={() => mutation.mutate(order.id)}
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? <Loader2 className="animate-spin" />
                  : <CheckCircle2 size={20} />
                }

                SELESAIKAN MASAKAN
              </Button>

            </div>

          </div>
        ))}
      </div>

      {/* KOSONG */}
      {activeOrders.length === 0 && (
        <div className="text-center py-32 opacity-40">
          <Timer size={80} className="mx-auto mb-4 text-slate-300" />
          <p className="text-xl text-slate-500">
            Dapur Kosong
          </p>
        </div>
      )}
    </div>
  );
}