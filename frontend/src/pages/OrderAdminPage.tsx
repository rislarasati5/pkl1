import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllOrders, deleteOrder } from "../features/posts/postService";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Monitor, CheckCircle2 } from "lucide-react";

export default function OrderAdminPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    refetchInterval: 10000,
  });

  const orders = data ?? [];

  // mutation untuk delete / selesai order
  const mutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      alert("Pesanan telah diselesaikan!");
    },
    onError: () => {
      alert("Gagal menyelesaikan pesanan.");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Monitoring Pesanan
          </h1>
          <p className="text-slate-500">
            Kelola dan pantau pesanan pelanggan secara real-time.
          </p>
        </div>

        <Button onClick={() => refetch()} disabled={isFetching} className="gap-2">
          <RefreshCw className={isFetching ? "animate-spin" : ""} size={16} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border rounded-3xl shadow-sm"
            >
              <div className="bg-slate-50 p-5 border-b flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{order.nama_pemesan}</h3>
                  <p className="text-xs text-slate-500">
                    Meja #{order.nomor_meja}
                  </p>
                </div>

                <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-600 rounded-full">
                  Baru
                </span>
              </div>

              <div className="p-5 space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.qty}x {item.judul}
                    </span>
                    <span>{item.isi}</span>
                  </div>
                ))}

                <div className="flex justify-between pt-3 font-bold">
                  <span>Total</span>
                  <span>Rp {order.total_harga?.toLocaleString()}</span>
                </div>

                <Button
                  className="w-full mt-3 bg-green-500 hover:bg-green-600"
                  onClick={() => mutation.mutate(order.id)}
                >
                  <CheckCircle2 size={16} className="mr-2" />
                  Selesaikan Pesanan
                </Button>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed text-center">
              <Monitor className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-medium">
                Belum ada pesanan yang masuk.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}